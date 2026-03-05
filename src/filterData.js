const filterData = (query, mainData, excludeColumns) => {
	if (!query || !query.trim()) {
		return mainData;
	}

	let filteredData = [];

	const escapedQuery = query.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
	let Regex = new RegExp(escapedQuery, "i");

	mainData.forEach((curRowData) => {
		for (let key in curRowData) {
			if (!excludeColumns.includes(key)) {
				let value = curRowData[key];

				if (value !== null && value !== undefined) {
					if (Regex.test(value.toString())) {
						filteredData.push(curRowData);
						break;
					}
				}
			}
		}
	});
	// console.log(filteredData);

	return filteredData;
};
export default filterData;
