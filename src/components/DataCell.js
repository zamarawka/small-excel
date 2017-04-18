var Cell = require('./Cell');

var DataCell = function(row, value, updateValue) {
	this.baseValue = value.baseValue;
	this.updateValue = updateValue;

	Cell.call(this, row, value.value);
	this.elem.classList.add('data-cell');
};

DataCell.prototype = Object.create(Cell.prototype);
DataCell.prototype.constructor = DataCell;

DataCell.prototype.render = function(props) {
	if (props) {
		this.value = props.value;
		this.baseValue = props.baseValue;
	}

	var text = Cell.prototype.render.apply(this, arguments);
};

DataCell.prototype.atOneLine = function(cell) {
	return this.row.cells.indexOf(cell) != -1;
};

DataCell.prototype.renderInput = function() {
	this.clearCell();

	var input = document.createElement('input');
	input.type = 'text';
	input.value = this.baseValue;

	input.onblur = (event) => {
		this.baseValue = input.value;
		this.updateValue(this.baseValue);
	};

	input.onkeyup = e => e.stopPropagation();

	input.onkeydown = (event) => {
		event.stopPropagation();

		switch(event.keyCode) {
			case 13:
				input.blur();

			case 27:
				input.value = this.baseValue;
				input.blur();
		}
	};

	this.elem.appendChild(input);

	input.focus();
};

module.exports = DataCell;