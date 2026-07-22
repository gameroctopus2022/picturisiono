document.addEventListener('DOMContentLoaded', function() {
    // --- ОПРЕДЕЛЕНИЕ ТИПА УСТРОЙСТВА (МОБИЛА ИЛИ ПК) ---
    const isMobile = /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent) || window.innerWidth <= 768;

    // --- УСТАНОВКА ИКОНКИ ВКЛАДКИ (FAVICON) ---
    let favicon = document.querySelector('link[rel="icon"]') || document.querySelector('link[rel="shortcut icon"]');
    if (!favicon) {
        favicon = document.createElement('link');
        favicon.rel = 'icon';
        favicon.type = 'image/x-icon';
        document.head.appendChild(favicon);
    }
    favicon.href = 'logo.ico';

    // --- ОСТАЛЬНЫЕ ЭЛЕМЕНТЫ СТРАНИЦЫ ---
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

    // ФИКС ОШИБКИ 2: Запрещаем зажимание и перетаскивание картинки на мобилках
    uploadedImage.style.userSelect = 'none';
    uploadedImage.style.webkitUserSelect = 'none';
    uploadedImage.style.webkitTouchCallout = 'none'; // Отключает всплывающее меню "Скачать изображение" на iOS/Android
    uploadedImage.addEventListener('dragstart', (e) => e.preventDefault());
    uploadedImage.addEventListener('contextmenu', (e) => e.preventDefault());

    // ФИКС ОШИБКИ 1: Запрещаем кнопкам Ч/Б и Негатива сплющиваться
    [bwFilterBtn, negativeFilterBtn].forEach(btn => {
        if (btn) {
            btn.style.flexShrink = '0';
            btn.style.minWidth = isMobile ? '80px' : '100px';
        }
    });

    let isBW = false;
    let isNegative = false;
    let isPerlin = false; 
    let isPixelated = false; 
    let text = 'Text'; 
    let textColor = '#ffffff';
    let textSize = 25; 
    let textX = 50; 
    let textY = 50; 
    let isEditing = false; 
    let isDragging = false; 
    let dragOffsetX, dragOffsetY;

    // --- КНОПКА TELEGRAM ---
    const tgBtn = document.createElement('button');
    tgBtn.id = 'telegram-link-btn';
    tgBtn.style.position = 'fixed';
    tgBtn.style.top = isMobile ? '15px' : '20px';
    tgBtn.style.right = isMobile ? '15px' : '20px';
    tgBtn.style.width = isMobile ? '45px' : '60px';  
    tgBtn.style.height = isMobile ? '45px' : '60px';
    tgBtn.style.borderRadius = '50%'; 
    tgBtn.style.backgroundImage = 'url("telegram.png")';
    tgBtn.style.backgroundSize = 'cover';
    tgBtn.style.backgroundPosition = 'center';
    tgBtn.style.border = '2px solid #fff';
    tgBtn.style.cursor = 'pointer';
    tgBtn.style.zIndex = '2000'; 
    tgBtn.style.boxShadow = '0 4px 12px rgba(0, 0, 0, 0.4)';
    tgBtn.style.transition = 'transform 0.2s, box-shadow 0.2s';

    tgBtn.addEventListener('click', function() {
        window.open('https://t.me/ONIKNews', '_blank');
    });

    document.body.appendChild(tgBtn);

    // --- Dynamic Island АНИМАЦИЯ УВЕДОМЛЕНИЯ ---
    const notificationFrame = document.createElement('div');
    notificationFrame.id = 'tg-notification-frame';
    
    const notificationText = document.createElement('span');
    notificationText.textContent = 'Мы появились в Telegram!';
    notificationFrame.appendChild(notificationText);
    
    document.body.appendChild(notificationFrame);

    const styleSheet = document.createElement('style');
    styleSheet.textContent = `
        #filter-buttons {
            display: flex;
            gap: 10px;
            overflow-x: auto;
            padding: 10px 0;
            -webkit-overflow-scrolling: touch;
        }

        #tg-notification-frame {
            position: fixed;
            top: ${isMobile ? '15px' : '20px'};
            right: ${isMobile ? '15px' : '20px'};
            height: ${isMobile ? '45px' : '60px'};
            width: ${isMobile ? '45px' : '60px'};
            background-color: #000000;
            color: #ffffff;
            border-radius: ${isMobile ? '22.5px' : '30px'};
            z-index: 1999; 
            box-shadow: 0 10px 30px rgba(0,0,0,0.5);
            display: flex;
            align-items: center;
            justify-content: center;
            overflow: hidden;
            pointer-events: none;
            font-family: 'Arial', sans-serif;
            font-weight: bold;
            font-size: ${isMobile ? '13px' : '16px'};
            white-space: nowrap;
            box-sizing: border-box;
            border: 1px solid rgba(255,255,255,0.1);
            animation: iphoneNotification 3.2s cubic-bezier(0.25, 1, 0.5, 1) forwards;
        }

        #tg-notification-frame span {
            opacity: 0;
            transform: scale(0.9);
            animation: fadeInText 3.2s ease-in-out forwards;
        }

        @keyframes iphoneNotification {
            0% {
                width: ${isMobile ? '45px' : '60px'};
                height: ${isMobile ? '45px' : '60px'};
                border-radius: ${isMobile ? '22.5px' : '30px'};
                transform: translateX(0);
            }
            18% {
                width: ${isMobile ? '230px' : '280px'};
                height: ${isMobile ? '45px' : '60px'};
                border-radius: ${isMobile ? '15px' : '20px'};
                transform: translateX(${isMobile ? '-20px' : '-40px'});
            }
            82% {
                width: ${isMobile ? '230px' : '280px'};
                height: ${isMobile ? '45px' : '60px'};
                border-radius: ${isMobile ? '15px' : '20px'};
                transform: translateX(${isMobile ? '-20px' : '-40px'});
                opacity: 1;
            }
            100% {
                width: ${isMobile ? '45px' : '60px'};
                height: ${isMobile ? '45px' : '60px'};
                border-radius: ${isMobile ? '22.5px' : '30px'};
                transform: translateX(0);
                opacity: 0;
            }
        }

        @keyframes fadeInText {
            0% { opacity: 0; transform: scale(0.9); }
            15% { opacity: 0; }
            20% { opacity: 1; transform: scale(1); } 
            80% { opacity: 1; transform: scale(1); }
            85% { opacity: 0; transform: scale(0.9); } 
            100% { opacity: 0; }
        }

        @keyframes popupAppear {
            from { transform: translateX(-50%) translateY(20px); opacity: 0; }
            to { transform: translateX(-50%) translateY(0); opacity: 1; }
        }
    `;
    document.head.appendChild(styleSheet);

    // --- КОНТЕЙНЕР ДЛЯ ТЕКСТА НА КАРТИНКЕ ---
    const textContainer = document.createElement('div');
    textContainer.id = 'text-container';
    textContainer.style.position = 'absolute';
    textContainer.style.pointerEvents = 'auto';
    textContainer.style.display = 'none'; 
    textContainer.style.zIndex = '10';
    textContainer.style.touchAction = 'none'; // Отключает стандартный скролл страницы при перетаскивании текста
    
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
    textElement.style.webkitTouchCallout = 'none';
    textElement.style.cursor = 'pointer';
    textElement.style.display = 'inline-block';
    textElement.style.padding = '5px';
    textElement.style.border = '1px solid blue'; 
    textElement.style.borderRadius = '5px';
    textElement.style.backgroundColor = 'rgba(255, 255, 255, 0.1)';
    textElement.style.boxShadow = '0 0 5px rgba(0, 0, 0, 0.5)';
    textContainer.appendChild(textElement);

    textContainer.addEventListener('dragstart', (e) => e.preventDefault());
    textContainer.addEventListener('contextmenu', (e) => e.preventDefault());

    // --- ДИНАМИЧЕСКИЕ КНОПКИ ФИЛЬТРОВ С ФИКСИРОВАННЫМ РАЗМЕРОМ ---
    const createFilterBtn = (bgUrl) => {
        const btn = document.createElement('button');
        btn.style.backgroundImage = `url("${bgUrl}")`;
        btn.style.backgroundSize = 'cover';
        btn.style.backgroundPosition = 'center';
        btn.style.width = isMobile ? '80px' : '100px';
        btn.style.height = isMobile ? '80px' : '100px';
        btn.style.flexShrink = '0'; // Запрет сплющивания
        btn.style.borderRadius = '15px';
        btn.style.border = '2px solid #fff';
        btn.style.cursor = 'pointer';
        btn.style.boxShadow = '0 4px 10px rgba(0, 0, 0, 0.3)';
        return btn;
    };

    const addTextBtn = createFilterBtn('text.jpg');
    const perlinBtn = createFilterBtn('perlin.png');
    const pixelFilterBtn = createFilterBtn('pixel.png');

    filterButtons.appendChild(addTextBtn);
    filterButtons.appendChild(perlinBtn);
    filterButtons.appendChild(pixelFilterBtn);

    // --- ЛОГИКА ЗАГРУЗКИ И ОБРАБОТКИ ---
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
                    resetEffects();
                };
            };
            reader.readAsDataURL(file);
        }
    });

    bwFilterBtn.addEventListener('click', function() {
        isBW = !isBW;
        applyAllEffects();
    });

    negativeFilterBtn.addEventListener('click', function() {
        isNegative = !isNegative;
        applyAllEffects();
    });

    perlinBtn.addEventListener('click', function() {
        isPerlin = !isPerlin;
        applyAllEffects();
    });

    pixelFilterBtn.addEventListener('click', function() {
        isPixelated = !isPixelated;
        applyAllEffects();
    });

    function applyAllEffects() {
        let filter = '';
        if (isBW) filter += 'grayscale(100%) ';
        if (isNegative) filter += 'invert(100%) ';
        uploadedImage.style.filter = filter.trim();

        let overlay = document.getElementById('perlin-canvas-overlay');
        
        if (!isPerlin && !isPixelated) {
            if (overlay) overlay.remove();
            uploadedImage.style.opacity = '1';
            return;
        }

        if (!overlay) {
            overlay = document.createElement('canvas');
            overlay.id = 'perlin-canvas-overlay';
            overlay.style.position = 'absolute';
            overlay.style.top = '0';
            overlay.style.left = '0';
            overlay.style.width = '100%';
            overlay.style.height = '100%';
            overlay.style.pointerEvents = 'none';
            imageContainer.appendChild(overlay);
        }

        overlay.width = uploadedImage.offsetWidth;
        overlay.height = uploadedImage.offsetHeight;
        const ctx = overlay.getContext('2d');

        const tempCanvas = document.createElement('canvas');
        tempCanvas.width = overlay.width;
        tempCanvas.height = overlay.height;
        const tempCtx = tempCanvas.getContext('2d');
        
        if (isBW || isNegative) {
            tempCtx.filter = filter.trim();
        }
        tempCtx.drawImage(uploadedImage, 0, 0, overlay.width, overlay.height);
        
        let currentImgData = tempCtx.getImageData(0, 0, overlay.width, overlay.height);

        if (isPixelated) {
            currentImgData = processPixelation(currentImgData, overlay.width, overlay.height, 16);
        }

        if (isPerlin) {
            currentImgData = processGrainNoise(currentImgData);
        }

        ctx.putImageData(currentImgData, 0, 0);
        uploadedImage.style.opacity = isPixelated ? '0' : '1';
    }

    function processPixelation(imgData, w, h, blockSize = 16) {
        const data = imgData.data;

        for (let y = 0; y < h; y += blockSize) {
            for (let x = 0; x < w; x += blockSize) {
                const centerX = Math.min(x + Math.floor(blockSize / 2), w - 1);
                const centerY = Math.min(y + Math.floor(blockSize / 2), h - 1);
                const centerIdx = (centerX + centerY * w) * 4;
                
                const r = data[centerIdx];
                const g = data[centerIdx + 1];
                const b = data[centerIdx + 2];
                const a = data[centerIdx + 3];

                for (let dy = 0; dy < blockSize && (y + dy) < h; dy++) {
                    for (let dx = 0; dx < blockSize && (x + dx) < w; dx++) {
                        const idx = ((x + dx) + (y + dy) * w) * 4;
                        data[idx] = r;
                        data[idx + 1] = g;
                        data[idx + 2] = b;
                        data[idx + 3] = a;
                    }
                }
            }
        }
        return imgData;
    }

    function processGrainNoise(imgData) {
        const data = imgData.data;
        const noiseIntensity = 45; 
        for (let i = 0; i < data.length; i += 4) {
            const noise = (Math.random() - 0.5) * noiseIntensity;
            data[i]     = Math.max(0, Math.min(255, data[i] + noise));
            data[i + 1] = Math.max(0, Math.min(255, data[i + 1] + noise));
            data[i + 2] = Math.max(0, Math.min(255, data[i + 2] + noise));
        }
        return imgData;
    }

    function resetEffects() {
        const overlay = document.getElementById('perlin-canvas-overlay');
        if (overlay) overlay.remove();
        isPerlin = false;
        isPixelated = false;
        uploadedImage.style.opacity = '1';
        uploadedImage.style.filter = 'none';
    }

    // --- УПРАВЛЕНИЕ ТЕКСТОМ И ТАЧ-СОБЫТИЯ (ФИКС ДЛЯ МОБИЛОК) ---
    addTextBtn.addEventListener('click', function() {
        textContainer.style.display = 'block';
        updateTextStyle(); 
        setTimeout(updateTextPosition, 50); 
        showColorPicker(); 
    });

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
                textElement.focus();
            }
        }
    });

    textElement.addEventListener('blur', disableEditing);
    textElement.addEventListener('keydown', (e) => {
        if (e.key === 'Enter') { e.preventDefault(); textElement.blur(); }
    });

    // Функция начала тача/клика
    function startDrag(clientX, clientY) {
        if (!isEditing) {
            isDragging = true;
            const rect = textContainer.getBoundingClientRect();
            dragOffsetX = clientX - rect.left;
            dragOffsetY = clientY - rect.top;
        }
    }

    // Функция перетаскивания
    function moveDrag(clientX, clientY) {
        if (isDragging) {
            const rect = uploadedImage.getBoundingClientRect(); 
            let newX = clientX - dragOffsetX - rect.left;
            let newY = clientY - dragOffsetY - rect.top;
            
            const maxX = uploadedImage.offsetWidth - textContainer.offsetWidth;
            const maxY = uploadedImage.offsetHeight - textContainer.offsetHeight;
            
            newX = Math.max(0, Math.min(newX, maxX)); 
            newY = Math.max(0, Math.min(newY, maxY));
            
            textContainer.style.left = newX + 'px';
            textContainer.style.top = newY + 'px';
            
            textX = (newX / uploadedImage.offsetWidth) * 100;
            textY = (newY / uploadedImage.offsetHeight) * 100;
        }
    }

    // События для мыши (ПК)
    textElement.addEventListener('mousedown', (e) => { e.preventDefault(); startDrag(e.clientX, e.clientY); });
    document.addEventListener('mousemove', (e) => moveDrag(e.clientX, e.clientY));
    document.addEventListener('mouseup', () => { isDragging = false; });

    // События для сенсорного экрана (Мобилки)
    textElement.addEventListener('touchstart', (e) => {
        if (!isEditing) {
            const touch = e.touches[0];
            startDrag(touch.clientX, touch.clientY);
        }
    }, { passive: true });

    document.addEventListener('touchmove', (e) => {
        if (isDragging) {
            const touch = e.touches[0];
            moveDrag(touch.clientX, touch.clientY);
        }
    }, { passive: true });

    document.addEventListener('touchend', () => { isDragging = false; });

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

        colorInput.addEventListener('input', function() {
            textColor = colorInput.value;
            updateTextStyle();
        });

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
            textSize = parseInt(sizeInput.value);
            sizeValue.textContent = textSize + '%';
            updateTextStyle();
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
            textElement.blur(); 
            updateTextStyle();
            colorPopup.remove();
        });

        setTimeout(() => {
            document.addEventListener('click', function closePopup(e) {
                if (!colorPopup.contains(e.target) && e.target !== textElement && e.target !== addTextBtn && e.target !== perlinBtn && e.target !== pixelFilterBtn) {
                    colorPopup.remove();
                    document.removeEventListener('click', closePopup);
                }
            });
        }, 100);
    }

    // --- ЭКСПОРТ КАРТИНКИ С ЭФФЕКТАМИ ---
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

        let exportImgData = ctx.getImageData(0, 0, canvas.width, canvas.height);

        if (isPixelated) {
            const scaleFactor = canvas.width / uploadedImage.offsetWidth;
            const targetSampleSize = Math.max(4, Math.round(16 * scaleFactor)); 
            exportImgData = processPixelation(exportImgData, canvas.width, canvas.height, targetSampleSize);
        }

        if (isPerlin) {
            exportImgData = processGrainNoise(exportImgData);
        }

        ctx.putImageData(exportImgData, 0, 0);

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
        resetEffects();
        text = 'Text';
        textElement.textContent = text;
        textColor = '#ffffff';
        textSize = 25;
        textX = 50;
        textY = 50;
        textContainer.style.display = 'none';
    });
});
