const fileInput = document.getElementById("file-input");
const dropArea = document.getElementById("drop-area");
const previewContainer = document.getElementById("preview-container");
const previewImage = document.getElementById("preview-image");
const downloadBtn = document.getElementById("download-btn");
const removeWatermarkBtn = document.getElementById("remove-watermark-btn");
const loadingDiv = document.getElementById("loading");

const API_KEY = "sandbox_0e2c7948eac086e1477030fa2f37a5f661bec954"; // Replace with your actual API key

// Function to handle image upload
async function handleImageUpload(file) {
    if (!file) return;

    const formData = new FormData();
    formData.append("image_file", file);

    // Show loading animation
    loadingDiv.style.display = "block";
    previewContainer.style.display = "none";
    downloadBtn.style.display = "none";
    removeWatermarkBtn.style.display = "none";
    downloadBtn.disabled = true;
    removeWatermarkBtn.disabled = true;

    try {
        const response = await fetch("https://sdk.photoroom.com/v1/segment", {
            method: "POST",
            headers: { "x-api-key": API_KEY },
            body: formData
        });

        if (!response.ok) throw new Error("Failed to process image.");

        const blob = await response.blob();
        const imgUrl = URL.createObjectURL(blob);

        // Show preview image
        previewImage.src = imgUrl;
        previewContainer.style.display = "block";

        // Enable buttons
        downloadBtn.style.display = "block";
        removeWatermarkBtn.style.display = "block";
        downloadBtn.disabled = false;
        removeWatermarkBtn.disabled = false;

        // Hide loading animation smoothly
        setTimeout(() => {
            loadingDiv.style.opacity = "0";
            setTimeout(() => {
                loadingDiv.style.display = "none";
                loadingDiv.style.opacity = "1"; // Reset opacity for next time
            }, 300);
        }, 500); // Short delay for smooth transition

        // Download functionality
        downloadBtn.onclick = function () {
            const link = document.createElement("a");
            link.download = "background_removed.png";
            link.href = imgUrl;
            link.click();
        };

        // Remove watermark functionality
        removeWatermarkBtn.onclick = function () {
            window.open("https://www.watermarkremover.io/", "_blank");
            alert("Please upload the processed image manually to remove the watermark.");
        };

    } catch (error) {
        console.error("Error:", error);
        alert("Background removal failed. Please try again.");
        loadingDiv.style.display = "none"; // Hide loading animation on error
    }
}

// File input event listener
fileInput.addEventListener("change", function (event) {
    handleImageUpload(event.target.files[0]);
});

// Drag & Drop Functionality
dropArea.addEventListener("dragover", function (event) {
    event.preventDefault();
    dropArea.style.backgroundColor = "#d6eaf8";
});

dropArea.addEventListener("dragleave", function () {
    dropArea.style.backgroundColor = "#ecf0f1";
});

dropArea.addEventListener("drop", function (event) {
    event.preventDefault();
    dropArea.style.backgroundColor = "#ecf0f1";
    const file = event.dataTransfer.files[0];
    handleImageUpload(file);
});
