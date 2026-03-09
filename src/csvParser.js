import { dateFormatString } from "./tableRender.js";
export default function parseCSVData(rawCSVData) {
	const parseJsonData = [];
	const rowsOfData = rawCSVData.split("\n"); // splitting content on new line
	const column_names = rowsOfData[0].split(","); // splitting the column names from the first row
	// parsing data into json
	for (let i = 1; i < rowsOfData.length - 1; i++) {
		const curRowData = {};
		const curColumnsData = rowsOfData[i].split(",");
		for (let i = 0; i < column_names.length; i++) {
			let currentColumnEntry = curColumnsData[i];
			// current column data is Date
			if (currentColumnEntry.match(/\d+-\d+-\d+/)) {
				currentColumnEntry = dateFormatString(parseDate(currentColumnEntry));
			}
			// current column Data is Number
			else if (currentColumnEntry.match(/^\d+(\.\d+)?$/)) {
				currentColumnEntry = parseFloat(currentColumnEntry);
			}
			curRowData[column_names[i]] = currentColumnEntry;
		}
		parseJsonData.push(curRowData);
	}
	return { column_names, parseJsonData };
}
export const parseDate=(dataString) =>{
	// finding the character that is splitting year month and day from - , / , .;
	const splitingCharacter = "";
	const formats = ["-", "/", ".", " "];
	for (let sep of formats) {
		if (dataString.includes(sep)) {
			const parts = dataString.split(sep);
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
