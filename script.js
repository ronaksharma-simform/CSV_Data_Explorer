let fileInput = document.getElementById("dataset");
let submitBtn = document.getElementById("submitBtn");
let showDataDiv = document.getElementById("showData");
let rawCSVData = "";
let parseJsonData = [];
submitBtn.addEventListener("click", (event) => {
	let curFileInput = fileInput.files[0];
	console.log(curFileInput);
	if (!curFileInput) {
		throw new Error("File doesnt exist");
	}
	const reader = new FileReader();
	reader.onload = () => {
		// showDataDiv.textContent = reader.result;
		rawCSVData = reader.result;
		parseCSVData();
	};
	reader.onerror = () => {
		throw new Error("Error reading file please try again");
	};
	reader.readAsText(curFileInput);
});
function parseCSVData() {
	try {
		let rowsOfData = rawCSVData.split("\n"); // splitting content on new line
		let column_names = rowsOfData[0].split(","); // splitting the column names from the first row
		console.log(column_names);
		// parsing data into json
		for (let i = 1; i < rowsOfData.length - 1; i++) {
			let curRowData = {};
			let curColumnsData = rowsOfData[i].split(",");
			for (let i = 0; i < column_names.length; i++) {
				let currentColumnEntry = curColumnsData[i];
				// current column data is Date
				if (currentColumnEntry.match(/\d+-\d+-\d+/)) {
					currentColumnEntry = parseDate(currentColumnEntry);
				}
				// current column Data is Number
				else if (currentColumnEntry.match(/\d+.?\d+/)) {
					currentColumnEntry = parseFloat(currentColumnEntry);
				}
				curRowData[column_names[i]] = currentColumnEntry;
			}
			parseJsonData.push(curRowData);
		}
		JSON.stringify(parseJsonData);
		console.log(parseJsonData);
	} catch (error) {
		console.log(error.message);
	}
}
function parseDate(dataString) {
	// finding the character that is splitting year month and day from - , / , .;
	let splitingCharacter = "";
	const formats = ["-", "/", ".", " "];
	for (let sep of formats) {
		if (dataString.includes(sep)) {
			let parts = dataString.split(sep);
			if (parts.length == 3) {
				// try to detect whether date follow YYYY-MM-DD or DD-MM-YYYY
				if (parts[0].length === 4) {
					return new Date(parts[0], parts[1] - 1, parts[2]);
				} else {
					return new Date(parts[2], parts[1] - 1, parts[0]);
				}
			}
		}
	}

	throw new Error("Invalid Date Format");
}
