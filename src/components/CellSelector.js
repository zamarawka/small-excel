var CellSelector = function(root) {
	this.root = root;
	this.className = 'chosen';

	this.from = null;
};

CellSelector.prototype.clearSelections = function() {
	[].forEach.call(this.root.querySelectorAll('td.data-cell'), (el) => {
		el.classList.remove(this.className);
	});
};

CellSelector.prototype.single = function(el) {
	this.clearSelections();

	if (!el.classList.contains('data-cell')) {
		this.from.classList.add(this.className);
		return;
	}

	el.classList.add(this.className);

	this.from = el;
};

CellSelector.prototype.rectangle = function(el) {
	if (this.from === null)
		return;

	this.clearSelections();

	var x1 = this.from.cellIndex,
	x2 = el.cellIndex,
	y1 = this.from.parentNode.rowIndex,
	y2 = el.parentNode.rowIndex;

	if (x1 > x2) {
		x2 = [x1, x1 = x2][0];
	}

	if (y1 > y2) {
		y2 = [y1, y1 = y2][0];
	}

	x1--;
	y2++;

	[].slice.call(this.root.querySelectorAll('tr'), y1, y2).forEach((tr) => {
		[].slice.call(tr.querySelectorAll('td.data-cell'), x1, x2).forEach((td) => {
			td.classList.add(this.className);
		})
	});
};

CellSelector.prototype.hasSelected = function(el) {
	if (!el.classList)
		throw new Error('This is no DOM element');

	return el.classList.contains(this.className);
};

CellSelector.prototype.getFirstCell = function() {
	var elem;

	if (this.from && this.from.classList.contains(this.className))
		elem = this.from;

	return {
		i: elem.parentNode.rowIndex,
		j: elem.cellIndex
	};
};

CellSelector.prototype.move = function(direction) {
	var table = this.from.parentNode.parentNode,
	index = this.getFirstCell(),
	el = this.from;

	switch(direction) {
		case 'up':
			el = table.rows[index.i - 1] != undefined ? table.rows[index.i - 1].cells[index.j] : false;
		break;
		case 'down':
			el = table.rows[index.i + 1] != undefined ? table.rows[index.i + 1].cells[index.j] : false;
		break;
		case 'left':
			el = table.rows[index.i].cells[index.j - 1] != undefined ? table.rows[index.i].cells[index.j - 1] : false;
		break;
		case 'right':
			el = table.rows[index.i].cells[index.j + 1] != undefined ? table.rows[index.i].cells[index.j + 1] : false;
		break;
	}

	el && this.single(el);

};

module.exports = CellSelector;