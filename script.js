document.addEventListener('DOMContentLoaded', function() {
    // --- 1. ОПРЕДЕЛЕНИЕ ТИПА УСТРОЙСТВА ---
    const isMobile = /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent) || window.innerWidth <= 768;

    // --- 2. УСТАНОВКА FAVICON ---
    let favicon = document.querySelector('link[rel="icon"]') || document.querySelector('link[rel="shortcut icon"]');
    if (!favicon) {
        favicon = document.createElement('link');
        favicon.rel = 'icon';
        favicon.type = 'image/x-icon';
        document.head.appendChild(favicon);
    }
    favicon.href = 'logo.ico';

    // --- 3. DOM ЭЛЕМЕНТЫ ---
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

    // Запрет системного меню при зажатии фото
    uploadedImage.style.userSelect = 'none';
    uploadedImage.style.webkitUserSelect = 'none';
    uploadedImage.style.webkitTouchCallout = 'none';
    uploadedImage.addEventListener('dragstart', (e) => e.preventDefault());
    uploadedImage.addEventListener('contextmenu', (e) => e.preventDefault());

    // --- 4. СОЗДАНИЕ КНОПОК ФИЛЬТРОВ И ИНСТРУМЕНТОВ ---
    filterButtons.innerHTML = ''; 

    const createFilterBtn = (bgUrl, existingBtn = null) => {
        const btn = existingBtn || document.createElement('button');
        btn.style.backgroundImage = `url("${bgUrl}")`;
        return btn;
    };

    const bwBtn = createFilterBtn('man.png', bwFilterBtn);
    const negBtn = createFilterBtn('negative.png', negativeFilterBtn);
    const addTextBtn = createFilterBtn('text.png');         
    const cropBtn = createFilterBtn('crop.png');             
    const borderRadiusBtn = createFilterBtn('circle.png');  
    const perlinBtn = createFilterBtn('perlin.png');
    const pixelFilterBtn = createFilterBtn('pixel.png');
    const blurBtn = createFilterBtn('blur.png');
    const hdrBtn = createFilterBtn('hdr.png');
    const oldFilmBtn = createFilterBtn('oldfilm.png');
    const glitchBtn = createFilterBtn('glitch.png'); 
    const fogBtn = createFilterBtn('fog.png');
    const oldMoneyBtn = createFilterBtn('oldmoney.png');

    filterButtons.appendChild(bwBtn);
    filterButtons.appendChild(negBtn);
    filterButtons.appendChild(addTextBtn);
    filterButtons.appendChild(cropBtn);
    filterButtons.appendChild(borderRadiusBtn);
    filterButtons.appendChild(perlinBtn);
    filterButtons.appendChild(pixelFilterBtn);
    filterButtons.appendChild(blurBtn);
    filterButtons.appendChild(hdrBtn);
    filterButtons.appendChild(oldFilmBtn);
    filterButtons.appendChild(glitchBtn);
    filterButtons.appendChild(fogBtn);
    filterButtons.appendChild(oldMoneyBtn);

    // --- 5. СОСТОЯНИЯ ФИЛЬТРОВ ---
    let isBW = false;
    let isNegative = false;
    let isPerlin = false; 
    let isPixelated = false;
    let isBlur = false;
    let blurRadius = 5;
    let isHDR = false;
    let isOldFilm = false;
    let isGlitch = false;
    let isFog = false;
    let isOldMoney = false;
    let borderRadiusValue = 0;
    
    let text = 'Text'; 
    let textColor = '#ffffff';
    let textSize = 25; 
    let selectedFont = 'Arial';
    const AVAILABLE_FONTS = ['Arial', 'Verdana', 'Times New Roman', 'Courier New', 'Impact', 'Comic Sans MS'];
    let textX = 50; 
    let textY = 50; 
    let isEditing = false; 
    let isDragging = false; 
    let dragOffsetX, dragOffsetY;

    // --- 6. КНОПКА TELEGRAM ---
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
    tgBtn.addEventListener('click', () => window.open('https://t.me/ONIKNews', '_blank'));
    document.body.appendChild(tgBtn);

    const notificationFrame = document.createElement('div');
    notificationFrame.id = 'tg-notification-frame';
    const notificationText = document.createElement('span');
    notificationText.textContent = 'Мы появились в Telegram!';
    notificationFrame.appendChild(notificationText);
    document.body.appendChild(notificationFrame);

    // --- 7. КОНТЕЙНЕР ДЛЯ ТЕКСТА ---
    const textContainer = document.createElement('div');
    textContainer.id = 'text-container';
    textContainer.style.position = 'absolute';
    textContainer.style.pointerEvents = 'auto';
    textContainer.style.display = 'none'; 
    textContainer.style.zIndex = '10';
    textContainer.style.touchAction = 'none';
    
    imageContainer.style.position = 'relative'; 
    imageContainer.appendChild(textContainer);

    const textElement = document.createElement('div');
    textElement.id = 'text-element';
    textElement.textContent = text;
    textElement.style.fontFamily = selectedFont;
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
    textContainer.appendChild(textElement);

    textContainer.addEventListener('dragstart', (e) => e.preventDefault());
    textContainer.addEventListener('contextmenu', (e) => e.preventDefault());

    // --- 8. ЗАГРУЗКА ИЗОБРАЖЕНИЯ ---
    uploadBtn.addEventListener('click', () => fileInput.click());

    fileInput.addEventListener('change', function(event) {
        const file = event.target.files[0];
        if (file) {
            const reader = new FileReader();
            reader.onload = function(e) {
                uploadedImage.src = e.target.result;
                uploadedImage.onload = function() {
                    mainPage.classList.remove('active');
                    editorPage.classList.add('active');
                    resetEffects();
                };
            };
            reader.readAsDataURL(file);
        }
    });

    // --- 9. ОБРАБОТЧИКИ ЭФФЕКТОВ ---
    bwBtn.addEventListener('click', () => { isBW = !isBW; applyAllEffects(); });
    negBtn.addEventListener('click', () => { isNegative = !isNegative; applyAllEffects(); });
    perlinBtn.addEventListener('click', () => { isPerlin = !isPerlin; applyAllEffects(); });
    pixelFilterBtn.addEventListener('click', () => { isPixelated = !isPixelated; applyAllEffects(); });
    blurBtn.addEventListener('click', () => { isBlur = !isBlur; applyAllEffects(); });
    hdrBtn.addEventListener('click', () => { isHDR = !isHDR; applyAllEffects(); });
    oldFilmBtn.addEventListener('click', () => { isOldFilm = !isOldFilm; applyAllEffects(); });
    glitchBtn.addEventListener('click', () => { isGlitch = !isGlitch; applyAllEffects(); });
    fogBtn.addEventListener('click', () => { isFog = !isFog; applyAllEffects(); });
    oldMoneyBtn.addEventListener('click', () => { isOldMoney = !isOldMoney; applyAllEffects(); });

    borderRadiusBtn.addEventListener('click', showRadiusPicker);

    // --- 10. ИНТЕРАКТИВНОЕ КАДРИРОВАНИЕ (CROP) ---
    cropBtn.addEventListener('click', function() {
        if (document.getElementById('crop-overlay')) return;

        // Внедряем динамические CSS стили для кроппера
        if (!document.getElementById('crop-styles')) {
            const style = document.createElement('style');
            style.id = 'crop-styles';
            style.textContent = `
                #crop-overlay {
                    position: absolute;
                    top: 0; left: 0;
                    width: 100%; height: 100%;
                    z-index: 100;
                    user-select: none;
                    touch-action: none;
                }
                #crop-box {
                    position: absolute;
                    border: 1px solid #ffffff;
                    box-shadow: 0 0 0 9999px rgba(0, 0, 0, 0.55);
                    box-sizing: border-box;
                    cursor: move;
                }
                .crop-handle {
                    position: absolute;
                    width: 12px;
                    height: 12px;
                    background-color: #3b82f6;
                    border: 2px solid #ffffff;
                    border-radius: 50%;
                    z-index: 101;
                    box-sizing: border-box;
                }
                .crop-handle[data-handle="tl"] { top: -6px; left: -6px; cursor: nwse-resize; }
                .crop-handle[data-handle="tr"] { top: -6px; right: -6px; cursor: nesw-resize; }
                .crop-handle[data-handle="bl"] { bottom: -6px; left: -6px; cursor: nesw-resize; }
                .crop-handle[data-handle="br"] { bottom: -6px; right: -6px; cursor: nwse-resize; }
                .crop-handle[data-handle="tc"] { top: -6px; left: calc(50% - 6px); cursor: ns-resize; }
                .crop-handle[data-handle="bc"] { bottom: -6px; left: calc(50% - 6px); cursor: ns-resize; }
                .crop-handle[data-handle="ml"] { top: calc(50% - 6px); left: -6px; cursor: ew-resize; }
                .crop-handle[data-handle="mr"] { top: calc(50% - 6px); right: -6px; cursor: ew-resize; }

                #crop-popup {
                    position: fixed;
                    bottom: 20px;
                    left: 50%;
                    transform: translateX(-50%);
                    width: min(280px, 75vw);
                    background-color: #333333;
                    padding: 10px 18px;
                    border-radius: 35px;
                    box-shadow: 0 10px 25px rgba(0,0,0,0.5);
                    z-index: 1000;
                    display: flex;
                    justify-content: center;
                    align-items: center;
                }
                .btn-crop-apply {
                    padding: 8px 24px;
                    border-radius: 20px;
                    border: none;
                    background: #4CAF50;
                    color: white;
                    font-weight: bold;
                    cursor: pointer;
                    width: 100%;
                    font-size: 14px;
                }
            `;
            document.head.appendChild(style);
        }

        const cropOverlay = document.createElement('div');
        cropOverlay.id = 'crop-overlay';

        const cropBox = document.createElement('div');
        cropBox.id = 'crop-box';

        // 8 синих маркеров
        const handleTypes = ['tl', 'tr', 'bl', 'br', 'ml', 'mr', 'tc', 'bc'];
        handleTypes.forEach(type => {
            const handle = document.createElement('div');
            handle.className = 'crop-handle';
            handle.dataset.handle = type;
            cropBox.appendChild(handle);
        });

        cropOverlay.appendChild(cropBox);
        imageContainer.appendChild(cropOverlay);

        // Попап-меню с кнопкой "Применить"
        const cropPopup = document.createElement('div');
        cropPopup.id = 'crop-popup';

        const applyCropBtn = document.createElement('button');
        applyCropBtn.textContent = 'Применить';
        applyCropBtn.className = 'btn-crop-apply';

        cropPopup.appendChild(applyCropBtn);
        document.body.appendChild(cropPopup);

        const imgW = uploadedImage.offsetWidth;
        const imgH = uploadedImage.offsetHeight;

        let crop = {
            x: imgW * 0.05,
            y: imgH * 0.05,
            w: imgW * 0.9,
            h: imgH * 0.9
        };

        function renderBox() {
            cropBox.style.left = crop.x + 'px';
            cropBox.style.top = crop.y + 'px';
            cropBox.style.width = crop.w + 'px';
            cropBox.style.height = crop.h + 'px';
        }
        renderBox();

        let activeHandle = null;
        let isDragging = false;
        let startX = 0, startY = 0, startCrop = { ...crop };

        function onPointerDown(e) {
            const clientX = e.touches ? e.touches[0].clientX : e.clientX;
            const clientY = e.touches ? e.touches[0].clientY : e.clientY;

            if (e.target.classList.contains('crop-handle')) {
                activeHandle = e.target.dataset.handle;
            } else if (e.target === cropBox) {
                isDragging = true;
            } else {
                return;
            }

            startX = clientX;
            startY = clientY;
            startCrop = { ...crop };
            e.preventDefault();
        }

        function onPointerMove(e) {
            if (!activeHandle && !isDragging) return;

            const clientX = e.touches ? e.touches[0].clientX : e.clientX;
            const clientY = e.touches ? e.touches[0].clientY : e.clientY;

            const dx = clientX - startX;
            const dy = clientY - startY;

            if (isDragging) {
                crop.x = Math.max(0, Math.min(startCrop.x + dx, imgW - crop.w));
                crop.y = Math.max(0, Math.min(startCrop.y + dy, imgH - crop.h));
            } else if (activeHandle) {
                const minSize = 30;

                // Угловые: расширение по двум осям
                if (activeHandle === 'tl') {
                    const newW = Math.max(minSize, Math.min(startCrop.w - dx, startCrop.x + startCrop.w));
                    const newH = Math.max(minSize, Math.min(startCrop.h - dy, startCrop.y + startCrop.h));
                    crop.x = startCrop.x + (startCrop.w - newW);
                    crop.y = startCrop.y + (startCrop.h - newH);
                    crop.w = newW;
                    crop.h = newH;
                } else if (activeHandle === 'tr') {
                    crop.w = Math.max(minSize, Math.min(startCrop.w + dx, imgW - startCrop.x));
                    const newH = Math.max(minSize, Math.min(startCrop.h - dy, startCrop.y + startCrop.h));
                    crop.y = startCrop.y + (startCrop.h - newH);
                    crop.h = newH;
                } else if (activeHandle === 'bl') {
                    const newW = Math.max(minSize, Math.min(startCrop.w - dx, startCrop.x + startCrop.w));
                    crop.x = startCrop.x + (startCrop.w - newW);
                    crop.w = newW;
                    crop.h = Math.max(minSize, Math.min(startCrop.h + dy, imgH - startCrop.y));
                } else if (activeHandle === 'br') {
                    crop.w = Math.max(minSize, Math.min(startCrop.w + dx, imgW - startCrop.x));
                    crop.h = Math.max(minSize, Math.min(startCrop.h + dy, imgH - startCrop.y));
                } 
                // Сторонние: строго вдоль одной оси
                else if (activeHandle === 'ml') { // Левая сторона -> влево-вправо
                    const newW = Math.max(minSize, Math.min(startCrop.w - dx, startCrop.x + startCrop.w));
                    crop.x = startCrop.x + (startCrop.w - newW);
                    crop.w = newW;
                } else if (activeHandle === 'mr') { // Правая сторона -> влево-вправо
                    crop.w = Math.max(minSize, Math.min(startCrop.w + dx, imgW - startCrop.x));
                } else if (activeHandle === 'tc') { // Верхняя сторона -> вверх-вниз
                    const newH = Math.max(minSize, Math.min(startCrop.h - dy, startCrop.y + startCrop.h));
                    crop.y = startCrop.y + (startCrop.h - newH);
                    crop.h = newH;
                } else if (activeHandle === 'bc') { // Нижняя сторона -> вверх-вниз
                    crop.h = Math.max(minSize, Math.min(startCrop.h + dy, imgH - startCrop.y));
                }
            }
            renderBox();
        }

        function onPointerUp() {
            activeHandle = null;
            isDragging = false;
        }

        cropOverlay.addEventListener('mousedown', onPointerDown);
        window.addEventListener('mousemove', onPointerMove);
        window.addEventListener('mouseup', onPointerUp);

        cropOverlay.addEventListener('touchstart', onPointerDown, { passive: false });
        window.addEventListener('touchmove', onPointerMove, { passive: false });
        window.addEventListener('touchend', onPointerUp);

        applyCropBtn.addEventListener('click', () => {
            const scaleX = uploadedImage.naturalWidth / imgW;
            const scaleY = uploadedImage.naturalHeight / imgH;

            const realX = crop.x * scaleX;
            const realY = crop.y * scaleY;
            const realW = crop.w * scaleX;
            const realH = crop.h * scaleY;

            const canvas = document.createElement('canvas');
            canvas.width = realW;
            canvas.height = realH;

            const ctx = canvas.getContext('2d');
            ctx.drawImage(uploadedImage, realX, realY, realW, realH, 0, 0, realW, realH);

            uploadedImage.src = canvas.toDataURL('image/png');
            cropOverlay.remove();
            cropPopup.remove();

            applyAllEffects();
        });
    });

    function applyAllEffects() {
        let filter = '';
        if (isBW) filter += 'grayscale(100%) ';
        if (isNegative) filter += 'invert(100%) ';
        if (isBlur) filter += `blur(${blurRadius}px) `;
        uploadedImage.style.filter = filter.trim();

        let overlay = document.getElementById('perlin-canvas-overlay');
        
        if (!isPerlin && !isPixelated && !isHDR && !isOldFilm && !isGlitch && !isFog && !isOldMoney) {
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
        
        if (filter.trim()) tempCtx.filter = filter.trim();
        tempCtx.drawImage(uploadedImage, 0, 0, overlay.width, overlay.height);
        
        let currentImgData = tempCtx.getImageData(0, 0, overlay.width, overlay.height);

        if (isPixelated) currentImgData = processPixelation(currentImgData, overlay.width, overlay.height, 16);
        if (isPerlin) currentImgData = processGrainNoise(currentImgData);
        if (isHDR) currentImgData = processHDR(currentImgData);
        if (isOldMoney) currentImgData = processOldMoney(currentImgData);

        ctx.putImageData(currentImgData, 0, 0);

        if (isOldFilm) applyOldFilmCanvas(ctx, overlay.width, overlay.height);
        if (isGlitch) applyGlitchCanvas(ctx, overlay.width, overlay.height);
        if (isFog) applyFogCanvas(ctx, overlay.width, overlay.height);

        uploadedImage.style.opacity = (isPixelated || isHDR || isOldFilm || isGlitch || isFog || isOldMoney) ? '0' : '1';
    }

    // --- 11. АЛГОРИТМЫ ЭФФЕКТОВ ---
    function processPixelation(imgData, w, h, blockSize = 16) {
        const data = imgData.data;
        for (let y = 0; y < h; y += blockSize) {
            for (let x = 0; x < w; x += blockSize) {
                const centerIdx = (Math.min(x + Math.floor(blockSize / 2), w - 1) + Math.min(y + Math.floor(blockSize / 2), h - 1) * w) * 4;
                const r = data[centerIdx], g = data[centerIdx + 1], b = data[centerIdx + 2], a = data[centerIdx + 3];
                for (let dy = 0; dy < blockSize && (y + dy) < h; dy++) {
                    for (let dx = 0; dx < blockSize && (x + dx) < w; dx++) {
                        const idx = ((x + dx) + (y + dy) * w) * 4;
                        data[idx] = r; data[idx + 1] = g; data[idx + 2] = b; data[idx + 3] = a;
                    }
                }
            }
        }
        return imgData;
    }

    function processGrainNoise(imgData) {
        const data = imgData.data;
        for (let i = 0; i < data.length; i += 4) {
            const noise = (Math.random() - 0.5) * 45;
            data[i] = Math.max(0, Math.min(255, data[i] + noise));
            data[i + 1] = Math.max(0, Math.min(255, data[i + 1] + noise));
            data[i + 2] = Math.max(0, Math.min(255, data[i + 2] + noise));
        }
        return imgData;
    }

    function processHDR(imgData) {
        const data = imgData.data;
        const exposure = 1.3; 
        const gamma = 0.8;

        for (let i = 0; i < data.length; i += 4) {
            let r = data[i] / 255;
            let g = data[i + 1] / 255;
            let b = data[i + 2] / 255;

            r *= exposure;
            g *= exposure;
            b *= exposure;

            r = r / (1.0 + r);
            g = g / (1.0 + g);
            b = b / (1.0 + b);

            r = Math.pow(r, gamma);
            g = Math.pow(g, gamma);
            b = Math.pow(b, gamma);

            data[i]     = Math.min(255, Math.max(0, r * 255));
            data[i + 1] = Math.min(255, Math.max(0, g * 255));
            data[i + 2] = Math.min(255, Math.max(0, b * 255));
        }

        return imgData;
    }

    function processOldMoney(imgData) {
        const data = imgData.data;
        for (let i = 0; i < data.length; i += 4) {
            let r = data[i], g = data[i+1], b = data[i+2];
            let nr = (r * 0.393) + (g * 0.769) + (b * 0.189);
            let ng = (r * 0.349) + (g * 0.686) + (b * 0.168);
            let nb = (r * 0.272) + (g * 0.534) + (b * 0.131);
            data[i] = Math.min(255, r * 0.45 + nr * 0.55 + 12);
            data[i+1] = Math.min(255, g * 0.45 + ng * 0.55 + 6);
            data[i+2] = Math.min(255, b * 0.45 + nb * 0.55 - 8);
        }
        return imgData;
    }

    function applyOldFilmCanvas(ctx, w, h) {
        ctx.fillStyle = 'rgba(230, 195, 120, 0.25)';
        ctx.fillRect(0, 0, w, h);

        const outerRadius = Math.sqrt(Math.pow(w / 2, 2) + Math.pow(h / 2, 2));
        const vignette = ctx.createRadialGradient(w / 2, h / 2, outerRadius * 0.4, w / 2, h / 2, outerRadius);
        vignette.addColorStop(0, 'rgba(0,0,0,0)');
        vignette.addColorStop(0.7, 'rgba(60,40,10,0.2)');
        vignette.addColorStop(1, 'rgba(30,15,0,0.65)');
        ctx.fillStyle = vignette;
        ctx.fillRect(0, 0, w, h);

        ctx.fillStyle = 'rgba(255, 245, 220, 0.08)';
        ctx.fillRect(0, 0, w, h);
    }

    function applyGlitchCanvas(ctx, w, h) {
        for (let i = 0; i < 8; i++) {
            const sliceY = Math.floor(Math.random() * h);
            const sliceH = Math.floor(Math.random() * 15) + 5;
            const offsetX = Math.floor((Math.random() - 0.5) * 20);
            const sliceData = ctx.getImageData(0, sliceY, w, sliceH);
            ctx.putImageData(sliceData, offsetX, sliceY);
        }
    }

    function applyFogCanvas(ctx, w, h) {
        const gradient = ctx.createLinearGradient(0, 0, 0, h);
        gradient.addColorStop(0, 'rgba(255, 255, 255, 0.3)');
        gradient.addColorStop(1, 'rgba(200, 200, 200, 0.1)');
        ctx.fillStyle = gradient;
        ctx.fillRect(0, 0, w, h);
    }

    // --- 12. ПОПАП ЗАКРУГЛЕНИЯ УГЛОВ (circle.png) ---
    function showRadiusPicker() {
        if (document.getElementById('radius-popup')) return;

        const popup = document.createElement('div');
        popup.id = 'radius-popup';
        popup.style.position = 'fixed';
        popup.style.bottom = '20px';
        popup.style.left = '50%';
        popup.style.transform = 'translateX(-50%)';
        popup.style.backgroundColor = '#333';
        popup.style.padding = '15px 20px';
        popup.style.borderRadius = '35px';
        popup.style.boxShadow = '0 0 15px rgba(0,0,0,0.5)';
        popup.style.zIndex = '1000';
        popup.style.display = 'flex';
        popup.style.alignItems = 'center';
        popup.style.gap = '10px';
        popup.style.color = 'white';

        const label = document.createElement('span');
        label.textContent = 'Углы:';

        const input = document.createElement('input');
        input.type = 'range';
        input.min = '0';
        input.max = '160'; 
        input.value = borderRadiusValue;

        input.addEventListener('input', () => {
            borderRadiusValue = parseInt(input.value);
            uploadedImage.style.borderRadius = borderRadiusValue + 'px';
            const overlay = document.getElementById('perlin-canvas-overlay');
            if (overlay) overlay.style.borderRadius = borderRadiusValue + 'px';
        });

        const closeBtn = document.createElement('button');
        closeBtn.textContent = 'ОК';
        closeBtn.style.padding = '5px 15px';
        closeBtn.style.borderRadius = '15px';
        closeBtn.style.border = 'none';
        closeBtn.style.background = '#4CAF50';
        closeBtn.style.color = 'white';
        closeBtn.addEventListener('click', () => popup.remove());

        popup.appendChild(label);
        popup.appendChild(input);
        popup.appendChild(closeBtn);
        document.body.appendChild(popup);
    }

    // --- 13. ТЕКСТ И НАСТРОЙКА ТЕКСТА (text.png) ---
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
        isEditing = false;
        updateTextStyle();
    }

    textElement.addEventListener('click', () => {
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
    textElement.addEventListener('keydown', (e) => { if (e.key === 'Enter') { e.preventDefault(); textElement.blur(); } });

    function startDrag(clientX, clientY) {
        if (!isEditing) {
            isDragging = true;
            const rect = textContainer.getBoundingClientRect();
            dragOffsetX = clientX - rect.left;
            dragOffsetY = clientY - rect.top;
        }
    }

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

    textElement.addEventListener('mousedown', (e) => { e.preventDefault(); startDrag(e.clientX, e.clientY); });
    document.addEventListener('mousemove', (e) => moveDrag(e.clientX, e.clientY));
    document.addEventListener('mouseup', () => { isDragging = false; });

    textElement.addEventListener('touchstart', (e) => {
        if (!isEditing) startDrag(e.touches[0].clientX, e.touches[0].clientY);
    }, { passive: true });

    document.addEventListener('touchmove', (e) => {
        if (isDragging) moveDrag(e.touches[0].clientX, e.touches[0].clientY);
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
        textElement.style.fontFamily = selectedFont;
    }

    function showColorPicker() {
        if (document.getElementById('color-popup')) return;

        const colorPopup = document.createElement('div');
        colorPopup.id = 'color-popup';
        colorPopup.style.position = 'fixed';
        colorPopup.style.bottom = '20px';
        colorPopup.style.left = '50%';
        colorPopup.style.transform = 'translateX(-50%)';
        colorPopup.style.backgroundColor = '#333333';
        colorPopup.style.padding = '12px 24px';
        colorPopup.style.borderRadius = '35px';
        colorPopup.style.boxShadow = '0 10px 25px rgba(0,0,0,0.5)';
        colorPopup.style.zIndex = '1000';
        colorPopup.style.display = 'flex';
        colorPopup.style.alignItems = 'center';
        colorPopup.style.gap = '15px';
        colorPopup.style.color = 'white';
        colorPopup.style.fontFamily = 'Arial, sans-serif';
        colorPopup.style.fontSize = '14px';

        const colorLabel = document.createElement('span');
        colorLabel.textContent = 'Цвет:';

        const colorInput = document.createElement('input');
        colorInput.type = 'color';
        colorInput.value = textColor;
        colorInput.style.border = 'none';
        colorInput.style.width = '32px';
        colorInput.style.height = '32px';
        colorInput.style.borderRadius = '50%';
        colorInput.style.cursor = 'pointer';
        colorInput.style.backgroundColor = 'transparent';

        colorInput.addEventListener('input', () => {
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
        sizeInput.style.cursor = 'pointer';
        sizeInput.style.accentColor = '#007bff';

        const sizeValue = document.createElement('span');
        sizeValue.textContent = textSize + '%';

        sizeInput.addEventListener('input', () => {
            textSize = parseInt(sizeInput.value);
            sizeValue.textContent = textSize + '%';
            updateTextStyle();
        });

        const fontSelect = document.createElement('select');
        fontSelect.style.padding = '6px 10px';
        fontSelect.style.borderRadius = '12px';
        fontSelect.style.border = '1px solid rgba(255,255,255,0.2)';
        fontSelect.style.backgroundColor = '#222';
        fontSelect.style.color = '#fff';
        fontSelect.style.outline = 'none';
        fontSelect.style.cursor = 'pointer';

        AVAILABLE_FONTS.forEach(font => {
            const opt = document.createElement('option');
            opt.value = font;
            opt.textContent = font;
            if (font === selectedFont) opt.selected = true;
            fontSelect.appendChild(opt);
        });

        fontSelect.addEventListener('change', () => {
            selectedFont = fontSelect.value;
            updateTextStyle();
        });

        const applyBtn = document.createElement('button');
        applyBtn.textContent = 'Применить';
        applyBtn.style.padding = '8px 20px';
        applyBtn.style.borderRadius = '20px';
        applyBtn.style.border = 'none';
        applyBtn.style.background = '#4CAF50';
        applyBtn.style.color = 'white';
        applyBtn.style.fontWeight = 'bold';
        applyBtn.style.cursor = 'pointer';

        colorPopup.appendChild(colorLabel);
        colorPopup.appendChild(colorInput);
        colorPopup.appendChild(sizeLabel);
        colorPopup.appendChild(sizeInput);
        colorPopup.appendChild(sizeValue);
        colorPopup.appendChild(fontSelect);
        colorPopup.appendChild(applyBtn);

        document.body.appendChild(colorPopup);

        applyBtn.addEventListener('click', () => colorPopup.remove());
    }

    // --- 14. СКАЧИВАНИЕ ИЗОБРАЖЕНИЯ ---
    downloadBtn.addEventListener('click', function() {
        let canvas = document.createElement('canvas');
        let ctx = canvas.getContext('2d');
        canvas.width = uploadedImage.naturalWidth;
        canvas.height = uploadedImage.naturalHeight;

        const scaleFactor = canvas.width / uploadedImage.offsetWidth;

        if (borderRadiusValue > 0) {
            const r = borderRadiusValue * scaleFactor;
            ctx.beginPath();
            ctx.moveTo(r, 0);
            ctx.lineTo(canvas.width - r, 0);
            ctx.quadraticCurveTo(canvas.width, 0, canvas.width, r);
            ctx.lineTo(canvas.width, canvas.height - r);
            ctx.quadraticCurveTo(canvas.width, canvas.height, canvas.width - r, canvas.height);
            ctx.lineTo(r, canvas.height);
            ctx.quadraticCurveTo(0, canvas.height, 0, canvas.height - r);
            ctx.lineTo(0, r);
            ctx.quadraticCurveTo(0, 0, r, 0);
            ctx.closePath();
            ctx.clip();
        }

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

        if (isPixelated) exportImgData = processPixelation(exportImgData, canvas.width, canvas.height, 16);
        if (isPerlin) exportImgData = processGrainNoise(exportImgData);
        if (isHDR) exportImgData = processHDR(exportImgData);
        if (isOldMoney) exportImgData = processOldMoney(exportImgData);

        ctx.putImageData(exportImgData, 0, 0);

        if (isOldFilm) applyOldFilmCanvas(ctx, canvas.width, canvas.height);
        if (isGlitch) applyGlitchCanvas(ctx, canvas.width, canvas.height);
        if (isFog) applyFogCanvas(ctx, canvas.width, canvas.height);

        if (textContainer.style.display !== 'none' && text.trim()) {
            const fontSize = (textSize / 100) * 40 * scaleFactor; 
            
            ctx.font = `bold ${fontSize}px ${selectedFont}`;
            ctx.fillStyle = textColor;
            ctx.textAlign = 'left';
            ctx.textBaseline = 'top';

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

    // --- 15. СБРОС ЭФФЕКТОВ И ВОЗВРАТ ---
    function resetEffects() {
        const overlay = document.getElementById('perlin-canvas-overlay');
        if (overlay) overlay.remove();
        isPerlin = isPixelated = isBlur = isHDR = isOldFilm = isGlitch = isFog = isOldMoney = false;
        borderRadiusValue = 0;
        uploadedImage.style.borderRadius = '0px';
        uploadedImage.style.opacity = '1';
        uploadedImage.style.filter = 'none';
    }

    backBtn.addEventListener('click', function() {
        editorPage.classList.remove('active');
        mainPage.classList.add('active');
        fileInput.value = ''; 
        uploadedImage.src = '';
        resetEffects();
        textContainer.style.display = 'none';
    });
});
