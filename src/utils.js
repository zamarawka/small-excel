var eventDeligate = (root, target, found, callback) => {
	if (!Array.isArray(found)) {
		throw new Error('Event deligate error: found (3rd argument) is not Array');
	}

	if (found.length < 2) {
		throw new Error('Event deligate error: found (3rd argument) has not correct configure');
	}

	while (target != root) {
		if (target[found[0]] === found[1]) {
			callback(target);
			return;
		}
		target = target.parentNode;
	}
};

var download = (filename, text) => {
	var elem = document.createElement('a');

	elem.setAttribute('download', filename);
	elem.setAttribute('href', 'data:text/plain;charset=utf-8,' + encodeURIComponent(text));

	elem.style.display = 'none';
	document.body.appendChild(elem);

	elem.click();

	document.body.removeChild(elem);
};

module.exports = {
	eventDeligate: eventDeligate,
	download: download,
	newEl: function(tag) {
		return document.createElement(tag);
	}
}