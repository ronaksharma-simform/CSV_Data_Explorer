let fileInput = document.getElementById("dataset");
let submitBtn = document.getElementById("submitBtn");
let showDataTable = document.getElementById("showData");
let rawCSVData = "";
let parseJsonData = [];
let previousPageBtn=document.getElementById("previous")
let nextPageBtn=document.getElementById("next")
let column_names=[]
let startRowCount=0;
let rowsPerPage=document.getElementById("rowsCount")
console.log(parseInt(rowsCount.value))
rowsCount.addEventListener("change",(event)=>{
	renderData()
})
function renderData() {
    showDataTable.innerHTML = "";
    renderingTableHeading();

    let rowsPerPage = parseInt(rowsCount.value);
    let endRowCount = Math.min(
        startRowCount + rowsPerPage,
        parseJsonData.length
    );

    renderRowsData(startRowCount, endRowCount);
}
previousPageBtn.addEventListener("click", () => {
    let rowsPerPage = parseInt(rowsCount.value);

    if (startRowCount === 0) {
        return; // already at first page
    }

    startRowCount -= rowsPerPage;

    if (startRowCount < 0) {
        startRowCount = 0;
    }

    renderData();
});
nextPageBtn.addEventListener("click", () => {
    let rowsPerPage = parseInt(rowsCount.value);

    if (startRowCount + rowsPerPage >= parseJsonData.length) {
        return; // already at last page
    }

    startRowCount += rowsPerPage;
    renderData();
});
function renderRowsData(startIdx,endIdx){
	for (let idx=startIdx;idx<endIdx;idx++) {
		let data=parseJsonData[idx]
		let currentRowElement = document.createElement("tr");
		for (let key in data) {
			let currentColumnElement = document.createElement("td");
			if (data[key] instanceof Date) {
				currentColumnElement.textContent = dateFormatString(data[key]);
				currentRowElement.appendChild(currentColumnElement);
				continue;
			}
			currentColumnElement.textContent = data[key];
			currentRowElement.appendChild(currentColumnElement);
		}
		showDataTable.appendChild(currentRowElement);
	}
}
function renderingTableHeading(){
	let currentRowElement=document.createElement("tr")
	column_names.forEach((data)=>{
		let currentColumnElement=document.createElement("th")
		currentColumnElement.textContent=data
		currentRowElement.appendChild(currentColumnElement);
	})
	showDataTable.appendChild(currentRowElement);
}
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
		column_names = rowsOfData[0].split(","); // splitting the column names from the first row
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
				else if (currentColumnEntry.match(/^\d+(\.\d+)?$/)) {
					currentColumnEntry = parseFloat(currentColumnEntry);
				}
				curRowData[column_names[i]] = currentColumnEntry;
			}
			parseJsonData.push(curRowData);
		}
		// JSON.stringify(parseJsonData);
		// console.log(parseJsonData);
		renderData();
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
function dateFormatString(dateObject) {
	let formattedString = `${dateObject.getDate()}-${dateObject.getMonth() + 1}-${dateObject.getFullYear()}`;
	return formattedString;
}
