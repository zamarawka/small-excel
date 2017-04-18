var Cell = require('./Cell');

var HeadingCell = function(row, value) {
	Cell.apply(this, arguments);
};

HeadingCell.prototype = Object.create(Cell.prototype);
HeadingCell.prototype.constructor = HeadingCell;

module.exports = HeadingCell;