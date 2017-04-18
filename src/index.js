var Table = require('components/Table');
var header = require('components/Header');
var download = require('utils').download;
var newEl = require('utils').newEl;

var app = document.getElementById('app');

var headingElements = header(app);

var tableWrapper = newEl('div');
tableWrapper.className = 'tabel-wrapper';

app.appendChild(tableWrapper);

var table = new Table(
	tableWrapper,
	[
		[7265, 7022, 7345, 7265, 7022, 7345],
		[91, 92, 93, 7265, 7022, 7345],
		[621, 622, 623, 7265, 7022, 7345],
		['=A1 + A3', '', '', 7265, 7022, 7345],
		['=A1+A3', '', '', 7265, 7022, 7345],
		['=A1+A3', '', '', 7265, 7022, 7345],
		['=SUM(A1, A3)+A3', '=A4+B3', '', 7265, 7022, 7345]
	]
);

headingElements.saveButton.onclick = function(event) {
	download('table.json', table.toJson(true));
};

headingElements.fileInput.onchange = function(event) {
	var files = event.target.files;

	if (files.length === 0)
		return;

	var file = files[0];

	var reader = new FileReader;
	reader.readAsText(file);

	reader.onloadend = () => {
		try {
			var newTableData = JSON.parse(reader.result);

			table.setData(newTableData);

			headingElements.title.innerHTML = 'Small excel';
		} catch (e) {
			if (e === 'format') {
				headingElements.title.innerHTML = 'Неверный формат данных';
			} else {
				headingElements.title.innerHTML = 'Файл поврежден';
			}
		}

	}
};