var newEl = require('utils').newEl;

module.exports = function(app) {
	var div = newEl('div');
	div.className = 'header';

	var button = newEl('button');
	button.className = 'data-model';

	button.appendChild(document.createTextNode('Сохранить файл'));

	var file = newEl('input');
	file.type = 'file';

	file.style.display = 'none';

	var fileButton = newEl('button');
	fileButton.className = 'file-button';

	fileButton.appendChild(document.createTextNode('Открыть файл'));

	fileButton.onclick = (event) => {
		file.click();
	};

	var header = newEl('h1');

	header.innerHTML = 'Small excel';

	div.appendChild(header);

	div.appendChild(button);
	div.appendChild(file);
	div.appendChild(fileButton);

	app.appendChild(div);

	return {
		title: header,
		saveButton: button,
		fileInput: file,
		fileButton: fileButton
	}
};