const filterData = (query, mainData, excludeColumns) => {
	if (!query || !query.trim()) {
		return mainData;
	}

	const filteredData = [];

	const escapedQuery = query.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
	const Regex = new RegExp(escapedQuery, "ig");

	mainData.forEach((curRowData) => {
		for (let key in curRowData) {
			if (!excludeColumns.includes(key)) {
				const value = curRowData[key];

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
