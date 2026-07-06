document.addEventListener('DOMContentLoaded', function() {
    const mainPage = document.getElementById('main-page');
    const editorPage = document.getElementById('editor-page');
    const uploadBtn = document.getElementById('upload-btn');
    const fileInput = document.getElementById('file-input');
    const uploadedImage = document.getElementById('uploaded-image');
    const bwFilterBtn = document.getElementById('bw-filter-btn');
    const negativeFilterBtn = document.getElementById('negative-filter-btn');
    const downloadBtn = document.getElementById('download-btn');
    const backBtn = document.getElementById('back-btn');

    let isBW = false;
    let isNegative = false;

    // Trigger file input on upload button click
    uploadBtn.addEventListener('click', function() {
        fileInput.click();
    });

    // Handle file selection
    fileInput.addEventListener('change', function(event) {
        const file = event.target.files[0];
        if (file) {
            const reader = new FileReader();
            reader.onload = function(e) {
                uploadedImage.src = e.target.result;
                uploadedImage.onload = function() {
                    // Scale small images up to a minimum size
                    const minWidth = 300;
                    const minHeight = 200;
                    if (uploadedImage.naturalWidth < minWidth || uploadedImage.naturalHeight < minHeight) {
                        const scale = Math.max(minWidth / uploadedImage.naturalWidth, minHeight / uploadedImage.naturalHeight);
                        uploadedImage.style.width = (uploadedImage.naturalWidth * scale) + 'px';
                        uploadedImage.style.height = (uploadedImage.naturalHeight * scale) + 'px';
                    }
                    // Switch to editor page
                    mainPage.classList.remove('active');
                    editorPage.classList.add('active');
                };
            };
            reader.readAsDataURL(file);
        }
    });

    // Apply black and white filter
    bwFilterBtn.addEventListener('click', function() {
        isBW = !isBW;
        applyFilters();
    });

    // Apply negative filter
    negativeFilterBtn.addEventListener('click', function() {
        isNegative = !isNegative;
        applyFilters();
    });

    // Function to apply filters
    function applyFilters() {
        let filter = '';
        if (isBW) filter += 'grayscale(100%) ';
        if (isNegative) filter += 'invert(100%) ';
        uploadedImage.style.filter = filter.trim();
    }

    // Download image
    downloadBtn.addEventListener('click', function() {
        const canvas = document.createElement('canvas');
        const ctx = canvas.getContext('2d');
        canvas.width = uploadedImage.naturalWidth;
        canvas.height = uploadedImage.naturalHeight;
        ctx.filter = uploadedImage.style.filter;
        ctx.drawImage(uploadedImage, 0, 0);
        canvas.toBlob(function(blob) {
            const url = URL.createObjectURL(blob);
            const a = document.createElement('a');
            a.href = url;
            a.download = 'edited-image.png';
            document.body.appendChild(a);
            a.click();
            document.body.removeChild(a);
            URL.revokeObjectURL(url);
        });
    });

    // Go back to main page
    backBtn.addEventListener('click', function() {
        editorPage.classList.remove('active');
        mainPage.classList.add('active');
        uploadedImage.src = '';
        uploadedImage.style.filter = 'none';
        isBW = false;
        isNegative = false;
    });
});