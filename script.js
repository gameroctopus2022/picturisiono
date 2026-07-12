document.addEventListener('DOMContentLoaded', function() {
    const mainPage = document.getElementById('main-page');
    const editorPage = document.getElementById('editor-page');
    const uploadBtn = document.getElementById('upload-btn');
    const fileInput = document.getElementById('file-input');
    const uploadedImage = document.getElementById('uploaded-image');
    const imageContainer = document.getElementById('image-container'); 
    const bwFilterBtn = document.getElementById('bw-filter-btn');
    const negativeFilterBtn = document.getElementById('negative-filter-btn');
    const downloadBtn = document.getElementById('download-btn');
    const backBtn = document.getElementById('back-btn');
    const filterButtons = document.getElementById('filter-buttons');

    let isBW = false;
    let isNegative = false;
    let text = 'Text'; 
    let textColor = '#ffffff';
    let textSize = 25; 
    let textX = 50; 
    let textY = 50; 
    let isEditing = false; 
    let isDragging = false; 
    let dragOffsetX, dragOffsetY;

    const textContainer = document.createElement('div');
    textContainer.id = 'text-container';
    textContainer.style.position = 'absolute';
    textContainer.style.pointerEvents = 'auto';
    textContainer.style.display = 'none'; 
    textContainer.style.zIndex = '10';
    
    imageContainer.style.position = 'relative'; 
    imageContainer.appendChild(textContainer);

    const textElement = document.createElement('div');
    textElement.id = 'text-element';
    textElement.textContent = text;
    textElement.style.fontFamily = 'Arial';
    textElement.style.fontWeight = 'bold';
    textElement.style.color = textColor;
    textElement.style.textAlign = 'center';
    textElement.style.userSelect = 'none';
    textElement.style.webkitUserSelect = 'none';
    textElement.style.cursor = 'pointer';
    textElement.style.display = 'inline-block';
    textElement.style.padding = '5px';
    textElement.style.border = '1px solid blue'; 
    textElement.style.borderRadius = '5px';
    textElement.style.backgroundColor = 'rgba(255, 255, 255, 0.1)';
    textElement.style.boxShadow = '0 0 5px rgba(0, 0, 0, 0.5)';
    textContainer.appendChild(textElement);

    // Блокируем системный Drag and Drop и выделение текста синим цветом
    textContainer.addEventListener('dragstart', (e) => e.preventDefault());
    textContainer.addEventListener('selectstart', (e) => {
        if (!isEditing) e.preventDefault();
    });

    const addTextBtn = document.createElement('button');
    addTextBtn.style.backgroundImage = 'url("text.jpg")';
    addTextBtn.style.backgroundSize = 'cover';
    addTextBtn.style.backgroundPosition = 'center';
    addTextBtn.style.width = '100px';
    addTextBtn.style.height = '100px';
    addTextBtn.style.borderRadius = '15px';
    addTextBtn.style.border = '2px solid #fff';
    addTextBtn.style.cursor = 'pointer';
    addTextBtn.style.transition = 'transform 0.2s';
    addTextBtn.style.boxShadow = '0 4px 10px rgba(0, 0, 0, 0.3)';

    filterButtons.appendChild(addTextBtn);

    uploadBtn.addEventListener('click', function() {
        fileInput.click();
    });

    fileInput.addEventListener('change', function(event) {
        const file = event.target.files[0];
        if (file) {
            const reader = new FileReader();
            reader.onload = function(e) {
                uploadedImage.src = e.target.result;
                uploadedImage.onload = function() {
                    const minWidth = 300;
                    const minHeight = 200;
                    if (uploadedImage.naturalWidth < minWidth || uploadedImage.naturalHeight < minHeight) {
                        const scale = Math.max(minWidth / uploadedImage.naturalWidth, minHeight / uploadedImage.naturalHeight);
                        uploadedImage.style.width = (uploadedImage.naturalWidth * scale) + 'px';
                        uploadedImage.style.height = (uploadedImage.naturalHeight * scale) + 'px';
                    } else {
                        uploadedImage.style.width = '';
                        uploadedImage.style.height = '';
                    }
                    
                    mainPage.classList.remove('active');
                    editorPage.classList.add('active');
                };
            };
            reader.readAsDataURL(file);
        }
    });

    bwFilterBtn.addEventListener('click', function() {
        isBW = !isBW;
        applyFilters();
    });

    negativeFilterBtn.addEventListener('click', function() {
        isNegative = !isNegative;
        applyFilters();
    });

    function applyFilters() {
        let filter = '';
        if (isBW) filter += 'grayscale(100%) ';
        if (isNegative) filter += 'invert(100%) ';
        uploadedImage.style.filter = filter.trim();
    }

    addTextBtn.addEventListener('click', function() {
        textContainer.style.display = 'block';
        updateTextStyle(); 
        setTimeout(updateTextPosition, 50); 
        showColorPicker(); 
    });

    // Функция завершения редактирования (чтобы не дублировать код)
    function disableEditing() {
        text = textElement.textContent.trim() || 'Text';
        textElement.contentEditable = 'false';
        textElement.style.backgroundColor = 'rgba(255, 255, 255, 0.1)';
        textElement.style.cursor = 'pointer';
        isEditing = false;
        updateTextStyle();
    }

    textElement.addEventListener('click', function(e) {
        if (!isDragging) {
            if (isEditing) {
                disableEditing();
            } else {
                isEditing = true;
                textElement.contentEditable = 'true';
                textElement.style.backgroundColor = 'rgba(0, 100, 255, 0.3)'; 
                textElement.style.cursor = 'text';
                textElement.focus();
            }
        }
    });

    // Когда фокус уходит с текста — принудительно отключаем режим редактирования
    textElement.addEventListener('blur', function() {
        disableEditing();
    });

    textElement.addEventListener('keydown', function(e) {
        if (e.key === 'Enter') {
            e.preventDefault();
            textElement.blur(); // Триггерит событие 'blur' и само сохраняет текст
        }
    });

    textElement.addEventListener('mousedown', function(e) {
        if (!isEditing) {
            e.preventDefault(); 
            isDragging = true;
            
            const rect = textContainer.getBoundingClientRect();
            dragOffsetX = e.clientX - rect.left;
            dragOffsetY = e.clientY - rect.top;
            
            textElement.style.cursor = 'grabbing';
        }
    });

    document.addEventListener('mousemove', function(e) {
        if (isDragging) {
            const rect = uploadedImage.getBoundingClientRect(); 
            
            let newX = e.clientX - dragOffsetX - rect.left;
            let newY = e.clientY - dragOffsetY - rect.top;
            
            const maxX = uploadedImage.offsetWidth - textContainer.offsetWidth;
            const maxY = uploadedImage.offsetHeight - textContainer.offsetHeight;
            
            newX = Math.max(0, Math.min(newX, maxX)); 
            newY = Math.max(0, Math.min(newY, maxY));
            
            textContainer.style.left = newX + 'px';
            textContainer.style.top = newY + 'px';
            
            textX = (newX / uploadedImage.offsetWidth) * 100;
            textY = (newY / uploadedImage.offsetHeight) * 100;
        }
    });

    document.addEventListener('mouseup', function() {
        if (isDragging) {
            isDragging = false;
            textElement.style.cursor = 'pointer';
        }
    });

    function updateTextPosition() {
        if (uploadedImage.offsetWidth && uploadedImage.offsetHeight) {
            const centerX = (uploadedImage.offsetWidth - textContainer.offsetWidth) / 2;
            const centerY = (uploadedImage.offsetHeight - textContainer.offsetHeight) / 2;
            textContainer.style.left = centerX + 'px';
            textContainer.style.top = centerY + 'px';
            
            textX = (centerX / uploadedImage.offsetWidth) * 100;
            textY = (centerY / uploadedImage.offsetHeight) * 100;
        }
    }

    function updateTextStyle() {
        const fontSize = (textSize / 100) * 40; 
        textElement.style.fontSize = fontSize + 'px';
        textElement.style.color = textColor;
        const borderThickness = Math.max(1, textSize / 10); 
        textElement.style.borderWidth = borderThickness + 'px';
    }

    function showColorPicker() {
        if (document.getElementById('color-popup')) return;

        const colorPopup = document.createElement('div');
        colorPopup.id = 'color-popup';
        colorPopup.style.position = 'fixed';
        colorPopup.style.bottom = '20px';
        colorPopup.style.left = '50%';
        colorPopup.style.transform = 'translateX(-50%)';
        colorPopup.style.backgroundColor = '#333';
        colorPopup.style.padding = '15px 20px';
        colorPopup.style.borderRadius = '35px';
        colorPopup.style.boxShadow = '0 0 15px rgba(0,0,0,0.5)';
        colorPopup.style.zIndex = '1000';
        colorPopup.style.display = 'flex';
        colorPopup.style.alignItems = 'center';
        colorPopup.style.gap = '10px';
        colorPopup.style.color = 'white';
        colorPopup.style.animation = 'popupAppear 0.3s ease'; 

        const colorLabel = document.createElement('span');
        colorLabel.textContent = 'Цвет:';

        const colorInput = document.createElement('input');
        colorInput.type = 'color';
        colorInput.value = textColor;
        colorInput.style.width = '40px';
        colorInput.style.height = '40px';
        colorInput.style.border = '2px solid #fff';
        colorInput.style.borderRadius = '50%';
        colorInput.style.cursor = 'pointer';

        const sizeLabel = document.createElement('span');
        sizeLabel.textContent = 'Размер:';

        const sizeInput = document.createElement('input');
        sizeInput.type = 'range';
        sizeInput.min = '10';
        sizeInput.max = '100';
        sizeInput.value = textSize;
        sizeInput.style.width = '100px';

        const sizeValue = document.createElement('span');
        sizeValue.textContent = textSize + '%';
        sizeInput.addEventListener('input', function() {
            sizeValue.textContent = sizeInput.value + '%';
        });

        const applyBtn = document.createElement('button');
        applyBtn.textContent = 'Применить';
        applyBtn.style.padding = '8px 15px';
        applyBtn.style.borderRadius = '20px';
        applyBtn.style.border = 'none';
        applyBtn.style.background = '#4CAF50';
        applyBtn.style.color = 'white';
        applyBtn.style.cursor = 'pointer';
        applyBtn.style.fontWeight = 'bold';

        colorPopup.appendChild(colorLabel);
        colorPopup.appendChild(colorInput);
        colorPopup.appendChild(sizeLabel);
        colorPopup.appendChild(sizeInput);
        colorPopup.appendChild(sizeValue);
        colorPopup.appendChild(applyBtn);
        document.body.appendChild(colorPopup);

        applyBtn.addEventListener('click', function() {
            textColor = colorInput.value;
            textSize = parseInt(sizeInput.value);
            textElement.blur(); // Убираем фокус с текста, переводя его обратно в режим Drag
            updateTextStyle();
            colorPopup.remove();
        });

        setTimeout(() => {
            document.addEventListener('click', function closePopup(e) {
                if (!colorPopup.contains(e.target) && e.target !== textElement && e.target !== addTextBtn) {
                    colorPopup.remove();
                    document.removeEventListener('click', closePopup);
                }
            });
        }, 100);
    }

    downloadBtn.addEventListener('click', function() {
        const canvas = document.createElement('canvas');
        const ctx = canvas.getContext('2d');
        canvas.width = uploadedImage.naturalWidth;
        canvas.height = uploadedImage.naturalHeight;

        ctx.drawImage(uploadedImage, 0, 0);

        if (isBW || isNegative) {
            let imageData = ctx.getImageData(0, 0, canvas.width, canvas.height);
            let data = imageData.data;
            for (let i = 0; i < data.length; i += 4) {
                if (isBW) {
                    let gray = (data[i] + data[i + 1] + data[i + 2]) / 3;
                    data[i] = data[i + 1] = data[i + 2] = gray;
                }
                if (isNegative) {
                    data[i] = 255 - data[i];
                    data[i + 1] = 255 - data[i + 1];
                    data[i + 2] = 255 - data[i + 2];
                }
            }
            ctx.putImageData(imageData, 0, 0);
        }

        if (textContainer.style.display !== 'none' && text.trim()) {
            const scaleFactor = canvas.width / uploadedImage.offsetWidth;
            const fontSize = (textSize / 100) * 40 * scaleFactor; 
            
            ctx.font = `bold ${fontSize}px Arial`;
            ctx.fillStyle = textColor;
            ctx.textAlign = 'left';
            ctx.textBaseline = 'top';
            
            ctx.shadowColor = 'rgba(0, 0, 0, 0.6)';
            ctx.shadowBlur = 4 * scaleFactor;
            ctx.shadowOffsetX = 2 * scaleFactor;
            ctx.shadowOffsetY = 2 * scaleFactor;

            const htmlPadding = 5 * scaleFactor; 
            const x = ((textX / 100) * canvas.width) + htmlPadding;
            const y = ((textY / 100) * canvas.height) + htmlPadding;
            
            ctx.fillText(text, x, y);
        }

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

    backBtn.addEventListener('click', function() {
        editorPage.classList.remove('active');
        mainPage.classList.add('active');
        fileInput.value = ''; 
        uploadedImage.src = '';
        uploadedImage.style.filter = 'none';
        isBW = false;
        isNegative = false;
        text = 'Text';
        textElement.textContent = text;
        textColor = '#ffffff';
        textSize = 25;
        textX = 50;
        textY = 50;
        textContainer.style.display = 'none';
    });
});

const style = document.createElement('style');
style.textContent = `
@keyframes popupAppear {
    from {
        transform: translateX(-50%) translateY(20px);
        opacity: 0;
    }
    to {
        transform: translateX(-50%) translateY(0);
        opacity: 1;
    }
}
`;
document.head.appendChild(style);
