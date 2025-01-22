if ('serviceWorker' in navigator) {
  navigator.serviceWorker.register('/service-worker.js')
    .then(() => console.log('Service Worker registered'))
    .catch(error => console.error('Service Worker registration failed:', error));
}





const uploadBtn = document.getElementById("upload-btn");
      const retrieveBtn = document.getElementById("retrieve-btn");
      const uploadModal = document.getElementById("upload-modal");
      const retrieveModal = document.getElementById("retrieve-modal");
      const closeUploadModal = document.getElementById("close-upload-modal");
      const closeRetrieveModal = document.getElementById(
        "close-retrieve-modal"
      );
      const fileInput = document.getElementById("file-input");
      const convertToBase64Btn = document.getElementById(
        "convert-to-base64-btn"
      );
      const base64Output = document.getElementById("base64-output");
      const copyBase64Btn = document.getElementById("copy-base64-btn");
      const base64Input = document.getElementById("base64-input");
      const pasteBase64Btn = document.getElementById("paste-base64-btn");
      const convertToFileBtn = document.getElementById("convert-to-file-btn");
      const downloadFileBtn = document.getElementById("download-file-btn");

      const loading = document.getElementById("loading");

      uploadBtn.addEventListener("click", () =>
        uploadModal.classList.add("active")
      );
      retrieveBtn.addEventListener("click", () =>
        retrieveModal.classList.add("active")
      );
      closeUploadModal.addEventListener("click", () =>
        uploadModal.classList.remove("active")
      );
      closeRetrieveModal.addEventListener("click", () =>
        retrieveModal.classList.remove("active")
      );

      // Convert file to Base64
      convertToBase64Btn.addEventListener("click", () => {
        const file = fileInput.files[0];
        if (!file) {
          alert("Please select a file to upload.");
          return;
        }
        loading.classList.add("active"); // Show loader

        const reader = new FileReader();
        reader.onload = () => {
          const base64 = reader.result.split(",")[1];
          base64Output.value = `${file.type}::${base64}`;
          loading.classList.remove("active"); // Hide loader
        };
        reader.readAsDataURL(file);
      });

      copyBase64Btn.addEventListener("click", () => {
        const base64Text = base64Output.value;
        navigator.clipboard
          .writeText(base64Text)
          .then(() => alert("Base64 copied to clipboard!"))
          .catch(() => alert("Failed to copy Base64."));
      });

      pasteBase64Btn.addEventListener("click", async () => {
        try {
          const text = await navigator.clipboard.readText();
          base64Input.value = text;
          alert("Pasted from clipboard!");
        } catch {
          alert("Failed to paste. Ensure you have something in the clipboard.");
        }
      });
      //

      closeUploadModal.addEventListener("click", () => {
        uploadModal.classList.remove("active");
        location.reload(); // Refresh the page
      });

      closeRetrieveModal.addEventListener("click", () => {
        retrieveModal.classList.remove("active");
        location.reload(); // Refresh the page
      });

      // Convert Base64 back to file
      convertToFileBtn.addEventListener("click", () => {
        const base64Text = base64Input.value.trim();
        if (!base64Text) {
          alert("Please paste Base64 string first!");
          return;
        }

        const [mimeType, base64Data] = base64Text.split("::");
        if (!mimeType || !base64Data) {
          alert(
            "Invalid Base64 format! Please ensure you paste correctly formatted data."
          );
          return;
        }

        const byteString = atob(base64Data);
        const byteArray = new Uint8Array(byteString.length).map((_, i) =>
          byteString.charCodeAt(i)
        );
        const blob = new Blob([byteArray], { type: mimeType });
        const url = URL.createObjectURL(blob);

        downloadFileBtn.href = url;
        downloadFileBtn.download = `restored_file.${mimeType.split("/")[1]}`;
        downloadFileBtn.classList.remove("hidden");
      });
