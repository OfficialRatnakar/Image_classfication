document.addEventListener('DOMContentLoaded', function() {
    const dropzone = document.getElementById('dropzone');
    const fileInput = document.getElementById('fileInput');
    const uploadForm = document.getElementById('uploadForm');
    const loadingElement = document.getElementById('loading');
    const resultContainer = document.getElementById('resultContainer');
    const resultImage = document.getElementById('resultImage');
    const resultLabel = document.getElementById('resultLabel');
    const resultDate = document.getElementById('resultDate');

    // Handle drag and drop events
    ['dragenter', 'dragover', 'dragleave', 'drop'].forEach(eventName => {
        dropzone.addEventListener(eventName, preventDefaults, false);
    });

    function preventDefaults(e) {
        e.preventDefault();
        e.stopPropagation();
    }

    ['dragenter', 'dragover'].forEach(eventName => {
        dropzone.addEventListener(eventName, highlight, false);
    });

    ['dragleave', 'drop'].forEach(eventName => {
        dropzone.addEventListener(eventName, unhighlight, false);
    });

    function highlight() {
        dropzone.classList.add('border-primary');
    }

    function unhighlight() {
        dropzone.classList.remove('border-primary');
    }

    // Handle file drop
    dropzone.addEventListener('drop', handleDrop, false);

    function handleDrop(e) {
        const dt = e.dataTransfer;
        const files = dt.files;
        if (files.length) {
            fileInput.files = files;
            handleFiles(files);
        }
    }

    // Handle file selection via the file input
    fileInput.addEventListener('change', function() {
        handleFiles(this.files);
    });

    // Click on dropzone to trigger file input
    dropzone.addEventListener('click', function() {
        fileInput.click();
    });

    function handleFiles(files) {
        if (files.length) {
            uploadFile(files[0]);
        }
    }

    function uploadFile(file) {
        // Display loading spinner
        loadingElement.classList.remove('hidden');
        resultContainer.style.display = 'none';
        
        const formData = new FormData();
        formData.append('file', file);

        fetch('/api/classifier/', {
            method: 'POST',
            body: formData
        })
        .then(response => {
            if (!response.ok) {
                throw new Error('Network response was not ok');
            }
            return response.json();
        })
        .then(data => {
            // Hide loading spinner
            loadingElement.classList.add('hidden');
            
            // Display results
            resultContainer.style.display = 'block';
            resultImage.src = URL.createObjectURL(file);
            resultLabel.textContent = data.result;
            resultDate.textContent = `Classified on: ${data.date_classified}`;
        })
        .catch(error => {
            console.error('Error:', error);
            loadingElement.classList.add('hidden');
            alert('Error processing image. Please try again.');
        });
    }

    // Form submission
    uploadForm.addEventListener('submit', function(e) {
        e.preventDefault();
        if (fileInput.files.length) {
            uploadFile(fileInput.files[0]);
        } else {
            alert('Please select an image first.');
        }
    });
}); 