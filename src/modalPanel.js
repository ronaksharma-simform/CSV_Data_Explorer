import { dateFormatString } from "./tableRender.js";

const showDataModal = (data) => {
	const modalElement = document.getElementById("dataModal");
	const modalBody = document.getElementById("modalBody");

	modalBody.innerHTML = "";

	if (!data || typeof data !== "object") {
		modalBody.innerHTML = `<div class="text-muted">No record details available.</div>`;
	} else {
		const list = document.createElement("dl");
		list.className = "row detail-list gx-3";

		Object.entries(data).forEach(([key, value]) => {
			if (value instanceof Date) {
				value = dateFormatString(value);
			}
			const term = document.createElement("dt");
			term.className = "col-4";
			term.textContent = key.toLocaleUpperCase();

			const description = document.createElement("dd");
			description.className = "col-8";
			description.textContent = value ?? "";

			list.appendChild(term);
			list.appendChild(description);
		});

		modalBody.appendChild(list);
	}

	const modal = bootstrap.Modal.getOrCreateInstance(modalElement);
	modal.show();
};

export default showDataModal;
