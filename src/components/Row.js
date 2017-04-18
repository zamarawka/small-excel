var Cell = require('./Cell');

var Row = function(table) {
	this.table = table;
	this.cells = [];

	this.elem = this.table.insertRow();
};

Row.prototype.addCell = function(cell) {
	if (cell instanceof Cell)
		this.cells.push(cell);
};

Row.prototype.insertCell = function() {
	return this.elem.insertCell(-1);
};

module.exports = Row;