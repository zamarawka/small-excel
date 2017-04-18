var Row = require('./Row');
var HeadingCell = require('./HeadingCell');
var DataCell = require('./DataCell');
var CellSelector = require('./CellSelector');

var deligate = require('utils').eventDeligate;
var computeMethods = require('computeMethods');

var keys = {
	enter: 13,
	ctrl: 17,
	cmd: 91,
	v: 86,
	c: 67,
	backspace: 8,
	up: 38,
	left: 37,
	right: 39,
	down: 40
}

var directions = {
	38: 'up',
	37: 'left',
	39: 'right',
	40: 'down'
}

var Table = function(rootElemnt, data) {
	this.root = rootElemnt;
	this.data = data;
	this.viewer = [];
	this.max = {
		i: 0,
		j: 0
	}

	this.createTable();

	this.renderHeader();
	this.render();

	this.selector = new CellSelector(this.root);

	this.initEvents();
};

Table.prototype.createTable = function() {
	this.elem = document.createElement('table');
	this.elem.className = 'excel-table';

	this.root.appendChild(this.elem);
};

Table.prototype.unmount = function() {
	this.viewer = [];
	this.elem.remove();
};

Table.prototype.initEvents = function() {
	var pressed;

	this.root.addEventListener('dblclick', (event) => {
		var target = event.target;

		deligate(this.root, target, ['tagName', 'TD'], (elem) => {
			var i = elem.parentNode.rowIndex,
			j = elem.cellIndex;

			this.viewer[i].cells[j].renderInput();
		});
	});

	this.root.addEventListener('mousedown', (event) => {
		var target = event.target;

		deligate(this.root, target, ['tagName', 'TD'], (elem) => {
			this.selector.single(elem);
			pressed = true;
		});
	}, false);

	this.root.addEventListener('mouseover', (event) => {
		var target = event.target;

		deligate(this.root, target, ['tagName', 'TD'], (elem) => {
			if (pressed && elem.classList.contains('data-cell')) {
				this.selector.rectangle(elem);
			}
		});
	}, false);

	this.root.addEventListener('mouseup', (event) => {
		pressed = false;
		this.getSelectedData();
	}, false);

	var modifyer = false,
		clipboard;

	document.addEventListener('keydown', (e) => {
		if (e.keyCode == keys.ctrl || e.keyCode == keys.cmd)
			modifyer = true;

		if (modifyer && (e.keyCode == keys.c)) {
			clipboard = this.getSelectedData();

			return false;
		}

		if (modifyer && (e.keyCode == keys.v)) {
			if (clipboard) {
				this.isertCells(this.selector.getFirstCell(), clipboard);

				return false;
			}
		}

		if (e.keyCode == keys.backspace) {
			var index = this.selector.getFirstCell();
			index.i--;
			index.j--;

			this.updateValue(index, '');
		}

		if (e.keyCode == keys.enter) {
			var index = this.selector.getFirstCell();

			this.viewer[index.i].cells[index.j].renderInput();
		}

		if (e.keyCode == keys.up || e.keyCode == keys.down || e.keyCode == keys.left || e.keyCode == keys.right) {
			this.selector.move(directions[e.keyCode]);
		}
	});

	document.addEventListener('keyup', (e) => {
		if (e.keyCode == keys.ctrl || e.keyCode == keys.cmd)
			modifyer = false;
	});

};

Table.prototype.getSelectedData = function() {
	var result = [];

	this.viewer.forEach((row) => {
		var selectedRow = [];

		row.cells.forEach((cell) => {
			if (this.selector.hasSelected(cell.elem)) {
				selectedRow.push(cell);
			}
		});

		if (selectedRow.length > 0) {
			result.push(selectedRow);
		}
	});

	return result;
};

Table.prototype.toJson = function(pretify) {
	var result = this.data.map((row, i) =>
		row.map((cell, j) =>
			this.computeValue(cell, i, j)
		)
	);

	return JSON.stringify(result, null, pretify && '\t');
};

Table.prototype.setData = function(data) {
	if (Array.isArray(data)) {
		data.forEach(row => {
			if (!Array.isArray(row))
				throw 'format';
		});

		this.unmount();
		this.createTable();

		this.data = data;

		this.renderHeader();
		this.render();
	} else {
		throw 'format';
	}
};

Table.prototype.isertCells = function(index, cells) {
	this.data[index.i-1][index.j-1] = cells[0][0].baseValue;

	cells.forEach((row, i) => {
		row.forEach((cell, j) => {
			if (!this.data[index.i-1 + i]) {
				this.data[index.i-1 + i] = [];
			}

			this.data[index.i-1 + i][index.j-1 + j] = cell.baseValue;
		});
	});

	this.renderHeader();
	this.render();
};

Table.prototype.insertRow = function() {
	return this.elem.insertRow(-1);
};

Table.prototype.updateValue = function(index, newVal) {
	this.data[index.i][index.j] = newVal;

	this.render();
};

Table.prototype.resolveLink = function(link) {
	var j = link.toUpperCase().charCodeAt(0) - 65,
		i = parseInt(link.replace(/[A-z]/g, '')) - 1;

	return {
		i: i,
		j: j
	}
};

Table.prototype.computeValue = function(value, sourceI, sourceJ) {
	if (typeof value != 'string' || value.charAt(0) != '=')
		return value;

	var resultCode = value.replace(/=|\s/g, ''),
	sourceCode = resultCode;

	var reg = /(([A-z]+)(\([^\)]+\)))|([A-z]+[0-9]+)/g;
	var results;

	while(results = reg.exec(sourceCode)) {
		// For custom functions
		if (results[1]) {
			var pattern = results[1],
			method = results[2].toUpperCase(),
			args = results[3].match(/([A-z]+[0-9]+)/g).map((pattern) => {
				return this.resolveLink(pattern);
			});

			try {
				resultCode = resultCode.replace(pattern, computeMethods[method].apply(this, args));
			} catch(e) {
				return value;
			}
		}

		// For resolve links
		if (results[4]) {
			var pattern = results[4],
			link = this.resolveLink(pattern),
			i = link.i,
			j = link.j;

			if ((sourceI === i && sourceJ === j) || this.data[i][j] === undefined)
				return value;

			try {
				resultCode = resultCode.replace(pattern, this.computeValue(this.data[i][j], i, j));
			} catch(e) {
				return value;
			}
		}
	}

	try {
		return eval(resultCode);
	} catch(e) {
		return value;
	}
};

Table.prototype.computeMax = function() {
	var maxI = this.data.length, maxJ = 0;

	this.data.forEach(row => {
		if (row.length > maxJ)
			maxJ = row.length;
	});

	this.max = {
		i: maxI,
		j: maxJ
	};
};

/****
* Renders
*****/

Table.prototype.renderHeader = function() {
	this.computeMax();

	for (var i = 0; i < this.max.i + 1; i++) {
		var row = this.viewer[i] || new Row(this);

		for (var j = 0; j < this.max.j + 1; j++) {
			var letter = String.fromCharCode("A".charCodeAt(0) + j - 1);

			if (row.cells[j]) {
				continue;
			}

			if (i === 0 && j === 0)
				row.addCell(
					new HeadingCell(row, '')
				);

			if (i === 0 && j != 0)
				row.addCell(
					new HeadingCell(row, letter)
				);

			if (j === 0 && i != 0)
				row.addCell(
					new HeadingCell(row, i)
				);
		};

		!this.viewer[i] && this.viewer.push(row);
	};
};

Table.prototype.render = function() {
	for (var i = 0; i < this.max.i; i++) {
		var row = this.viewer[i+1];

		for (var j = 0; j < this.max.j; j++) {
			if (this.data[i][j] === undefined) {
				this.data[i][j] = '';
			}

			var value = this.data[i][j];

			var props = {
				value: this.computeValue(value, i, j),
				baseValue: value
			};

			try {
				var cell = row.cells[j+1];

				cell.render(props);
			} catch(e) {

				var dataCell = new DataCell(row, props, this.updateValue.bind(this, { i: i, j: j }));

				row.addCell(dataCell);

			}
		};
	};
};

module.exports = Table;