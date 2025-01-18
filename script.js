const uploadBtn = document.getElementById("upload-btn");
const retrieveBtn = document.getElementById("retrieve-btn");
const uploadModal = document.getElementById("upload-modal");
const retrieveModal = document.getElementById("retrieve-modal");
const closeUploadModal = document.getElementById("close-upload-modal");
const closeRetrieveModal = document.getElementById("close-retrieve-modal");
const fileInput = document.getElementById("file-input");
const convertToBinaryBtn = document.getElementById("convert-to-binary-btn");
const binaryOutput = document.getElementById("binary-output");
const copyBinaryBtn = document.getElementById("copy-binary-btn");
const binaryInput = document.getElementById("binary-input");
const pasteBinaryBtn = document.getElementById("paste-binary-btn");
const convertToFileBtn = document.getElementById("convert-to-file-btn");
const downloadFileBtn = document.getElementById("download-file-btn");
const loading = document.getElementById("loading");

uploadBtn.addEventListener("click", () => uploadModal.classList.add("active"));
retrieveBtn.addEventListener("click", () =>
  retrieveModal.classList.add("active")
);
closeUploadModal.addEventListener("click", () =>
  uploadModal.classList.remove("active")
);
closeRetrieveModal.addEventListener("click", () =>
  retrieveModal.classList.remove("active")
);

// Convert file to binary
convertToBinaryBtn.addEventListener("click", () => {
  const file = fileInput.files[0];
  if (!file) {
    alert("Please select a file to upload.");
    return;
  }
  loading.classList.add("active"); // Show loader
  const reader = new FileReader();
  reader.onload = () => {
    const arrayBuffer = reader.result;
    const binary = Array.from(new Uint8Array(arrayBuffer))
      .map((byte) => byte.toString(2).padStart(8, "0"))
      .join(" ");
    binaryOutput.value = `${file.type}::${binary}`;
    loading.classList.remove("active"); // Hide loader
  };
  reader.readAsArrayBuffer(file);
});

copyBinaryBtn.addEventListener("click", () => {
  const binaryText = binaryOutput.value;
  navigator.clipboard
    .writeText(binaryText)
    .then(() => alert("Binary copied to clipboard!"))
    .catch(() => alert("Failed to copy binary."));
});

pasteBinaryBtn.addEventListener("click", async () => {
  try {
    const text = await navigator.clipboard.readText();
    binaryInput.value = text;
    alert("Pasted from clipboard!");
  } catch {
    alert("Failed to paste. Ensure you have something in the clipboard.");
  }
});

closeUploadModal.addEventListener("click", () => {
  uploadModal.classList.remove("active");
  location.reload(); // Refresh the page
});

closeRetrieveModal.addEventListener("click", () => {
  retrieveModal.classList.remove("active");
  location.reload(); // Refresh the page
});

// Convert binary back to file
convertToFileBtn.addEventListener("click", () => {
  const binaryText = binaryInput.value.trim();
  if (!binaryText) {
    alert("Please paste binary digits first!");
    return;
  }

  const [mimeType, binaryData] = binaryText.split("::");
  if (!mimeType || !binaryData) {
    alert(
      "Invalid binary format! Please ensure you paste correctly formatted data."
    );
    return;
  }

  const byteArray = binaryData.split(" ").map((b) => parseInt(b, 2));
  const blob = new Blob([new Uint8Array(byteArray)], { type: mimeType });
  const url = URL.createObjectURL(blob);

  downloadFileBtn.href = url;
  downloadFileBtn.download = `restored_file.${mimeType.split("/")[1]}`;
  downloadFileBtn.classList.remove("hidden");
});
