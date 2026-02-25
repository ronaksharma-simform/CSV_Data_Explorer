let fileInput = document.getElementById("dataset");
let submitBtn = document.getElementById("submitBtn");
let showDataDiv = document.getElementById("showData");
submitBtn.addEventListener("click", (event) => {
	let curFileInput = fileInput.files[0];
	console.log(curFileInput);
	if (!curFileInput) {
		throw new Error("File doesnt exist");
	}
	const reader = new FileReader();
	reader.onload = () => {
		showDataDiv.textContent = reader.result;
	};
	reader.onerror = () => {
        throw new Error("Error reading file please try again")
    };
    reader.readAsText(curFileInput)
});
