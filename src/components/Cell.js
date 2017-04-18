var Cell = function(row, value) {
	this.value = value;
	this.row = row;

	this.elem = this.row.insertCell();
	this.render();
};

Cell.prototype.clearCell = function() {
	if (this.elem.childNodes.length > 0) {
		[].forEach.call(this.elem.childNodes, (child) => {
			this.elem.removeChild(child);
		});
	}
};

Cell.prototype.render = function() {
	var text = document.createTextNode(this.value);

	this.clearCell();

	this.elem.appendChild(text);

	return text;
};

module.exports = Cell;