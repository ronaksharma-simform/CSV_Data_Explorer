export const exportDataAsJSON = (data) => {
	// Convert to Json
	const json = JSON.stringify(data, null, 2);
	// trigger download
	const blob = new Blob([json], { type: "application/json" });
	const url = URL.createObjectURL(blob);

	const a = document.createElement("a");
	a.href = url;
	a.download = "data.json";
	a.click();
	URL.revokeObjectURL(url);
};
export const exportDataAsCSV = (columns, data) => {
	let csv = [];
    // adding column names
	csv.push(columns.join(","));

	// Add data rows
	data.forEach((row) => {
		const rowData = columns.map((header) => {
			let cell = row[header] ?? ""; // Use empty string if key doesn't exist
			cell = cell.toString();
			// Escape double quotes and commas
			if (cell.includes(",") || cell.includes('"')) {
				cell = `"${cell.replace(/"/g, '""')}"`;
			}
			return cell;
		});
		csv.push(rowData.join(","));
	});

	// Create CSV Blob and download
	const csvContent = csv.join("\n");
	const blob = new Blob([csvContent], { type: "text/csv" });
	const url = URL.createObjectURL(blob);

	const a = document.createElement("a");
	a.href = url;
	a.download = "data.csv";
	a.click();

	URL.revokeObjectURL(url);
};
