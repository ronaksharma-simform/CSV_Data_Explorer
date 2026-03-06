import { dateFormatString } from "./tableRender.js";

const showDataModal = (data) => {
	const modal = document.getElementById("dataModal");
	const modalBody = document.getElementById("modalBody");

	modalBody.innerHTML = "";
	const heading = document.createElement("h2");
	heading.textContent = "Record Details";
	modalBody.appendChild(heading);
	Object.entries(data).forEach(([key, value]) => {
		const row = document.createElement("div");

		row.style.marginBottom = "8px";
		if (value instanceof Date) {
			value = dateFormatString(value);
		}
		row.innerHTML = `
      <strong>${key.toLocaleUpperCase()}</strong> : ${value}
    `;

		modalBody.appendChild(row);
	});

	modal.style.display = "block";
};
export default showDataModal;
