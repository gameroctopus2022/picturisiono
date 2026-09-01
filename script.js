document.addEventListener('DOMContentLoaded', function() {
    const isMobile = /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent) || window.innerWidth <= 768;

    const mainPage = document.getElementById('main-page');
    const editorPage = document.getElementById('editor-page');
    const uploadBtn = document.getElementById('upload-btn');
    const fileInput = document.getElementById('file-input');
    const uploadedImage = document.getElementById('uploaded-image');
    const downloadBtn = document.getElementById('download-btn');
    const backBtn = document.getElementById('back-btn');

    let imageWrapper = document.getElementById('image-wrapper');
    if (!imageWrapper && uploadedImage) {
        imageWrapper = document.createElement('div');
        imageWrapper.id = 'image-wrapper';
        uploadedImage.parentNode.insertBefore(imageWrapper, uploadedImage);
        imageWrapper.appendChild(uploadedImage);
    }

    if (imageWrapper) {
        imageWrapper.style.position = 'relative';
        imageWrapper.style.display = 'inline-block';
    }

    if (uploadedImage) {
        uploadedImage.style.userSelect = 'none';
        uploadedImage.addEventListener('dragstart', (e) => e.preventDefault());
        uploadedImage.addEventListener('contextmenu', (e) => e.preventDefault());
    }

    // --- КНОПКА TELEGRAM ---
    const tgBtn = document.createElement('button');
    tgBtn.id = 'telegram-link-btn';
    tgBtn.style.position = 'fixed';
    tgBtn.style.top = '17px';
    tgBtn.style.right = '20px';
    tgBtn.style.width = '42px';  
    tgBtn.style.height = '42px';
    tgBtn.style.borderRadius = '50%'; 
    tgBtn.style.backgroundImage = 'url("telegram.png")';
    tgBtn.style.backgroundSize = 'cover';
    tgBtn.style.backgroundPosition = 'center';
    tgBtn.style.border = 'none';
    tgBtn.style.cursor = 'pointer';
    tgBtn.style.zIndex = '2000'; 
    tgBtn.style.boxShadow = '0 2px 8px rgba(0, 0, 0, 0.4)';
    tgBtn.addEventListener('click', () => window.open('https://t.me/ONIKNews', '_blank'));
    document.body.appendChild(tgBtn);

    // --- ИНФОРМАЦИОННАЯ ПЛАШКА TELEGRAM ---
    const notificationFrame = document.createElement('div');
    notificationFrame.id = 'tg-notification-frame';
    const notificationText = document.createElement('span');
    notificationText.textContent = 'Мы появились в Telegram!';
    notificationFrame.appendChild(notificationText);
    document.body.appendChild(notificationFrame);

    // --- БОКОВАЯ ПАНЕЛЬ ИНСТРУМЕНТОВ ---
    const sidebar = document.createElement('div');
    sidebar.id = 'sidebar-tools';

    const subPanel = document.createElement('div');
    subPanel.id = 'sub-panel';

    editorPage.appendChild(sidebar);
    editorPage.appendChild(subPanel);

    const mainTools = [
        { id: 'btn-circle', label: 'Закруглить', icon: 'circle.png' },
        { id: 'btn-crop', label: 'Обрезать', icon: 'crop.png' },
        { id: 'btn-text', label: 'Текст', icon: 'text.png' },
        { id: 'btn-effects', label: 'Эффекты', icon: 'effects.png' }
    ];

    const sidebarButtons = {};

    mainTools.forEach(tool => {
        const btn = document.createElement('button');
        btn.className = 'sidebar-btn';
        btn.id = tool.id;

        const icon = document.createElement('div');
        icon.className = 'sidebar-btn-icon';
        icon.style.backgroundImage = `url("${tool.icon}")`;

        const text = document.createElement('span');
        text.className = 'sidebar-btn-text';
        text.textContent = tool.label;

        btn.appendChild(icon);
        btn.appendChild(text);
        sidebar.appendChild(btn);

        sidebarButtons[tool.id] = btn;
    });

    function setActiveSidebarButton(activeId) {
        Object.keys(sidebarButtons).forEach(id => {
            if (id === activeId) {
                sidebarButtons[id].classList.add('active');
            } else {
                sidebarButtons[id].classList.remove('active');
            }
        });
    }

    const filterButtonsContainer = document.createElement('div');
    filterButtonsContainer.style.display = 'grid';
    filterButtonsContainer.style.gridTemplateColumns = isMobile ? 'repeat(4, 1fr)' : 'repeat(2, 1fr)';
    filterButtonsContainer.style.gap = '12px';
    filterButtonsContainer.style.width = '100%';
    subPanel.appendChild(filterButtonsContainer);

    const filterList = [
        { id: 'none', icon: 'not_ef.png' },
        { id: 'bw', icon: 'man.png' },
        { id: 'negative', icon: 'negative.png' },
        { id: 'perlin', icon: 'perlin.png' },
        { id: 'pixel', icon: 'pixel.png' },
        { id: 'blur', icon: 'blur.png' },
        { id: 'hdr', icon: 'hdr.png' },
        { id: 'oldfilm', icon: 'oldfilm.png' },
        { id: 'glitch', icon: 'glitch.png' },
        { id: 'fog', icon: 'fog.png' },
        { id: 'oldmoney', icon: 'oldmoney.png' },
        { id: 'radioactive', icon: 'radioactive.png' }
    ];

    let activeEffect = 'none';
    let effectIntensity = 100;
    let borderRadiusValue = 0;

    const effectButtons = {};

    filterList.forEach(item => {
        const btn = document.createElement('button');
        btn.className = 'effect-card';
        btn.style.position = 'relative';
        btn.style.width = '100%';
        btn.style.aspectRatio = '4 / 5';
        btn.style.backgroundImage = `url("${item.icon}")`;
        btn.style.backgroundSize = 'cover';
        btn.style.backgroundRepeat = 'no-repeat';
        btn.style.backgroundPosition = 'center';
        btn.style.border = '2px solid transparent';
        btn.style.borderRadius = '10px';
        btn.style.boxSizing = 'border-box';
        btn.style.cursor = 'pointer';
        btn.style.overflow = 'hidden';
        btn.style.backgroundColor = '#222';

        const overlayIcon = document.createElement('div');
        overlayIcon.className = 'edit-overlay-icon';
        overlayIcon.style.position = 'absolute';
        overlayIcon.style.top = '0';
        overlayIcon.style.left = '0';
        overlayIcon.style.width = '100%';
        overlayIcon.style.height = '100%';
        overlayIcon.style.backgroundImage = 'url("edit_ef.png")';
        overlayIcon.style.backgroundSize = 'contain';
        overlayIcon.style.backgroundRepeat = 'no-repeat';
        overlayIcon.style.backgroundPosition = 'center';
        overlayIcon.style.opacity = '0.5';
        overlayIcon.style.display = 'none';
        overlayIcon.style.pointerEvents = 'none';

        btn.appendChild(overlayIcon);
        filterButtonsContainer.appendChild(btn);
        effectButtons[item.id] = { button: btn, overlay: overlayIcon };

        btn.addEventListener('click', () => handleEffectClick(item.id));
    });

    function handleEffectClick(id) {
        if (id === 'none') {
            activeEffect = 'none';
            effectIntensity = 100;
            removeIntensityPopup();
            updateEffectUI();
            applyAllEffects();
            return;
        }

        if (activeEffect === id) {
            showIntensityPicker();
        } else {
            activeEffect = id;
            effectIntensity = 100;
            removeIntensityPopup();
            updateEffectUI();
            applyAllEffects();
        }
    }

    function updateEffectUI() {
        Object.keys(effectButtons).forEach(key => {
            const { button, overlay } = effectButtons[key];
            if (key === activeEffect && key !== 'none') {
                button.style.border = '4px solid #3b82f6';
                overlay.style.display = 'block';
            } else {
                button.style.border = '2px solid transparent';
                overlay.style.display = 'none';
            }
        });
    }

    function removeIntensityPopup() {
        const popup = document.getElementById('intensity-popup');
        if (popup) popup.remove();
    }

    function showIntensityPicker() {
        removeIntensityPopup();

        const popup = document.createElement('div');
        popup.id = 'intensity-popup';
        popup.style.position = 'fixed';
        popup.style.bottom = isMobile ? '85px' : '20px';
        popup.style.left = '50%';
        popup.style.transform = 'translateX(-50%)';
        popup.style.backgroundColor = '#333333';
        popup.style.padding = '12px 24px';
        popup.style.borderRadius = '35px';
        popup.style.boxShadow = '0 10px 25px rgba(0,0,0,0.5)';
        popup.style.zIndex = '1000';
        popup.style.display = 'flex';
        popup.style.alignItems = 'center';
        popup.style.gap = '15px';
        popup.style.color = 'white';

        const slider = document.createElement('input');
        slider.type = 'range';
        slider.min = '0';
        slider.max = '100';
        slider.value = effectIntensity;

        const label = document.createElement('span');
        label.textContent = `${effectIntensity}%`;
        label.style.minWidth = '45px';
        label.style.textAlign = 'center';
        label.style.fontWeight = 'bold';

        slider.addEventListener('input', () => {
            effectIntensity = parseInt(slider.value, 10);
            label.textContent = `${effectIntensity}%`;
            applyAllEffects();
        });

        const applyBtn = document.createElement('button');
        applyBtn.textContent = 'Применить';
        applyBtn.style.padding = '8px 20px';
        applyBtn.style.borderRadius = '20px';
        applyBtn.style.border = 'none';
        applyBtn.style.background = '#3b82f6';
        applyBtn.style.color = 'white';
        applyBtn.style.cursor = 'pointer';
        applyBtn.style.fontWeight = 'bold';
        applyBtn.addEventListener('click', () => removeIntensityPopup());

        popup.appendChild(slider);
        popup.appendChild(label);
        popup.appendChild(applyBtn);
        document.body.appendChild(popup);
    }

    // --- НАСТРОЙКИ ТЕКСТА ---
    let text = 'Text';
    let textColor = '#ffffff';
    let textSize = 25;
    let selectedFont = 'Arial';
    const AVAILABLE_FONTS = ['Arial', 'Verdana', 'Times New Roman', 'Courier New', 'Impact', 'Comic Sans MS'];
    let textX = 50, textY = 50;
    let isEditing = false, isDragging = false;
    let dragOffsetX, dragOffsetY;

    const textContainer = document.createElement('div');
    textContainer.id = 'text-container';
    textContainer.style.position = 'absolute';
    textContainer.style.pointerEvents = 'auto';
    textContainer.style.display = 'none';
    textContainer.style.zIndex = '10';
    textContainer.style.touchAction = 'none';
    imageWrapper.appendChild(textContainer);

    const textElement = document.createElement('div');
    textElement.id = 'text-element';
    textElement.textContent = text;
    textElement.style.fontFamily = selectedFont;
    textElement.style.fontWeight = 'bold';
    textElement.style.color = textColor;
    textElement.style.textAlign = 'center';
    textElement.style.userSelect = 'none';
    textElement.style.cursor = 'pointer';
    textElement.style.display = 'inline-block';
    textElement.style.padding = '5px';
    textElement.style.border = '1px solid blue';
    textElement.style.borderRadius = '5px';
    textElement.style.backgroundColor = 'rgba(255, 255, 255, 0.1)';
    textContainer.appendChild(textElement);

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

    sidebarButtons['btn-circle'].addEventListener('click', () => {
        setActiveSidebarButton('btn-circle');
        subPanel.classList.remove('active');
        showRadiusPicker();
    });

    sidebarButtons['btn-text'].addEventListener('click', () => {
        setActiveSidebarButton('btn-text');
        subPanel.classList.remove('active');
        
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
        colorPopup.style.bottom = isMobile ? '85px' : '20px';
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

        const colorInput = document.createElement('input');
        colorInput.type = 'color';
        colorInput.value = textColor;
        colorInput.style.border = 'none';
        colorInput.style.width = '32px';
        colorInput.style.height = '32px';
        colorInput.style.borderRadius = '50%';
        colorInput.style.cursor = 'pointer';

        colorInput.addEventListener('input', () => {
            textColor = colorInput.value;
            updateTextStyle();
        });

        const sizeInput = document.createElement('input');
        sizeInput.type = 'range';
        sizeInput.min = '10';
        sizeInput.max = '100';
        sizeInput.value = textSize;

        sizeInput.addEventListener('input', () => {
            textSize = parseInt(sizeInput.value, 10);
            updateTextStyle();
        });

        const fontSelect = document.createElement('select');
        fontSelect.style.padding = '6px 10px';
        fontSelect.style.borderRadius = '12px';
        fontSelect.style.backgroundColor = '#222';
        fontSelect.style.color = '#fff';

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
        applyBtn.style.background = '#3b82f6';
        applyBtn.style.color = 'white';
        applyBtn.style.cursor = 'pointer';
        applyBtn.style.fontWeight = 'bold';

        colorPopup.appendChild(colorInput);
        colorPopup.appendChild(sizeInput);
        colorPopup.appendChild(fontSelect);
        colorPopup.appendChild(applyBtn);

        document.body.appendChild(colorPopup);
        applyBtn.addEventListener('click', () => colorPopup.remove());
    }

    // --- CROP ---
    sidebarButtons['btn-crop'].addEventListener('click', () => {
        setActiveSidebarButton('btn-crop');
        subPanel.classList.remove('active');
        initInteractiveCrop();
    });

    function initInteractiveCrop() {
        if (document.getElementById('crop-overlay')) return;

        if (!document.getElementById('crop-styles')) {
            const style = document.createElement('style');
            style.id = 'crop-styles';
            style.textContent = `
                #crop-overlay { position: absolute; top: 0; left: 0; width: 100%; height: 100%; z-index: 100; touch-action: none; }
                #crop-box { position: absolute; border: 1px solid #ffffff; box-shadow: 0 0 0 9999px rgba(0, 0, 0, 0.55); box-sizing: border-box; cursor: move; }
                .crop-handle { position: absolute; width: 12px; height: 12px; background-color: #3b82f6; border: 2px solid #ffffff; border-radius: 50%; z-index: 101; box-sizing: border-box; }
                .crop-handle[data-handle="tl"] { top: -6px; left: -6px; cursor: nwse-resize; }
                .crop-handle[data-handle="tr"] { top: -6px; right: -6px; cursor: nesw-resize; }
                .crop-handle[data-handle="bl"] { bottom: -6px; left: -6px; cursor: nesw-resize; }
                .crop-handle[data-handle="br"] { bottom: -6px; right: -6px; cursor: nwse-resize; }
                .crop-handle[data-handle="tc"] { top: -6px; left: calc(50% - 6px); cursor: ns-resize; }
                .crop-handle[data-handle="bc"] { bottom: -6px; left: calc(50% - 6px); cursor: ns-resize; }
                .crop-handle[data-handle="ml"] { top: calc(50% - 6px); left: -6px; cursor: ew-resize; }
                .crop-handle[data-handle="mr"] { top: calc(50% - 6px); right: -6px; cursor: ew-resize; }
                #crop-popup { position: fixed; bottom: 20px; left: 50%; transform: translateX(-50%); background-color: #333333; padding: 10px 18px; border-radius: 35px; z-index: 1000; }
                .btn-crop-apply { padding: 8px 24px; border-radius: 20px; border: none; background: #3b82f6; color: white; font-weight: bold; cursor: pointer; }
            `;
            document.head.appendChild(style);
        }

        const cropOverlay = document.createElement('div');
        cropOverlay.id = 'crop-overlay';

        const cropBox = document.createElement('div');
        cropBox.id = 'crop-box';

        ['tl', 'tr', 'bl', 'br', 'ml', 'mr', 'tc', 'bc'].forEach(type => {
            const handle = document.createElement('div');
            handle.className = 'crop-handle';
            handle.dataset.handle = type;
            cropBox.appendChild(handle);
        });

        cropOverlay.appendChild(cropBox);
        imageWrapper.appendChild(cropOverlay);

        const cropPopup = document.createElement('div');
        cropPopup.id = 'crop-popup';
        const applyCropBtn = document.createElement('button');
        applyCropBtn.textContent = 'Применить';
        applyCropBtn.className = 'btn-crop-apply';
        cropPopup.appendChild(applyCropBtn);
        document.body.appendChild(cropPopup);

        const imgW = uploadedImage.offsetWidth;
        const imgH = uploadedImage.offsetHeight;

        let crop = { x: imgW * 0.05, y: imgH * 0.05, w: imgW * 0.9, h: imgH * 0.9 };

        function renderBox() {
            cropBox.style.left = crop.x + 'px';
            cropBox.style.top = crop.y + 'px';
            cropBox.style.width = crop.w + 'px';
            cropBox.style.height = crop.h + 'px';
        }
        renderBox();

        let activeHandle = null;
        let isDraggingBox = false;
        let startX = 0, startY = 0, startCrop = { ...crop };

        function onPointerDown(e) {
            const clientX = e.touches ? e.touches[0].clientX : e.clientX;
            const clientY = e.touches ? e.touches[0].clientY : e.clientY;

            if (e.target.classList.contains('crop-handle')) {
                activeHandle = e.target.dataset.handle;
            } else if (e.target === cropBox) {
                isDraggingBox = true;
            } else return;

            startX = clientX;
            startY = clientY;
            startCrop = { ...crop };
            e.preventDefault();
        }

        function onPointerMove(e) {
            if (!activeHandle && !isDraggingBox) return;

            const clientX = e.touches ? e.touches[0].clientX : e.clientX;
            const clientY = e.touches ? e.touches[0].clientY : e.clientY;
            const dx = clientX - startX;
            const dy = clientY - startY;

            if (isDraggingBox) {
                crop.x = Math.max(0, Math.min(startCrop.x + dx, imgW - crop.w));
                crop.y = Math.max(0, Math.min(startCrop.y + dy, imgH - crop.h));
            } else if (activeHandle) {
                const minSize = 30;
                if (activeHandle === 'tl') {
                    const newW = Math.max(minSize, Math.min(startCrop.w - dx, startCrop.x + startCrop.w));
                    const newH = Math.max(minSize, Math.min(startCrop.h - dy, startCrop.y + startCrop.h));
                    crop.x = startCrop.x + (startCrop.w - newW);
                    crop.y = startCrop.y + (startCrop.h - newH);
                    crop.w = newW; crop.h = newH;
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
                } else if (activeHandle === 'ml') {
                    const newW = Math.max(minSize, Math.min(startCrop.w - dx, startCrop.x + startCrop.w));
                    crop.x = startCrop.x + (startCrop.w - newW);
                    crop.w = newW;
                } else if (activeHandle === 'mr') {
                    crop.w = Math.max(minSize, Math.min(startCrop.w + dx, imgW - startCrop.x));
                } else if (activeHandle === 'tc') {
                    const newH = Math.max(minSize, Math.min(startCrop.h - dy, startCrop.y + startCrop.h));
                    crop.y = startCrop.y + (startCrop.h - newH);
                    crop.h = newH;
                } else if (activeHandle === 'bc') {
                    crop.h = Math.max(minSize, Math.min(startCrop.h + dy, imgH - startCrop.y));
                }
            }
            renderBox();
        }

        function onPointerUp() { activeHandle = null; isDraggingBox = false; }

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

            uploadedImage.onload = () => {
                cropOverlay.remove();
                cropPopup.remove();
                applyAllEffects();
                
                if (textContainer.style.display !== 'none') {
                    const newX = (textX / 100) * uploadedImage.offsetWidth;
                    const newY = (textY / 100) * uploadedImage.offsetHeight;
                    textContainer.style.left = newX + 'px';
                    textContainer.style.top = newY + 'px';
                }
            };

            uploadedImage.src = canvas.toDataURL('image/png');
        });
    }

    sidebarButtons['btn-effects'].addEventListener('click', () => {
        setActiveSidebarButton('btn-effects');
        subPanel.classList.toggle('active');
    });

    function applyAllEffects() {
        let filter = '';
        const intensityFactor = effectIntensity / 100;

        if (activeEffect === 'bw') {
            filter = `grayscale(${100 * intensityFactor}%)`;
        } else if (activeEffect === 'negative') {
            filter = `invert(${100 * intensityFactor}%)`;
        } else if (activeEffect === 'blur') {
            filter = `blur(${8 * intensityFactor}px)`;
        }

        uploadedImage.style.filter = filter;

        let overlay = document.getElementById('perlin-canvas-overlay');
        const canvasEffects = ['perlin', 'pixel', 'hdr', 'oldfilm', 'glitch', 'fog', 'oldmoney', 'radioactive'];

        if (!canvasEffects.includes(activeEffect) || intensityFactor === 0) {
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
            overlay.style.pointerEvents = 'none';
            imageWrapper.appendChild(overlay);
        }

        const renderWidth = uploadedImage.clientWidth;
        const renderHeight = uploadedImage.clientHeight;

        overlay.width = renderWidth;
        overlay.height = renderHeight;
        overlay.style.width = renderWidth + 'px';
        overlay.style.height = renderHeight + 'px';

        const ctx = overlay.getContext('2d');
        const tempCanvas = document.createElement('canvas');
        tempCanvas.width = renderWidth;
        tempCanvas.height = renderHeight;
        const tempCtx = tempCanvas.getContext('2d');
        
        tempCtx.drawImage(uploadedImage, 0, 0, renderWidth, renderHeight);
        let currentImgData = tempCtx.getImageData(0, 0, renderWidth, renderHeight);

        if (activeEffect === 'pixel') {
            const blockSize = Math.max(1, Math.floor(24 * intensityFactor));
            currentImgData = processPixelation(currentImgData, renderWidth, renderHeight, blockSize);
        } else if (activeEffect === 'perlin') {
            currentImgData = processGrainNoise(currentImgData, intensityFactor);
        } else if (activeEffect === 'hdr') {
            currentImgData = processHDR(currentImgData, intensityFactor);
        } else if (activeEffect === 'oldmoney') {
            currentImgData = processOldMoney(currentImgData, intensityFactor);
        } else if (activeEffect === 'radioactive') {
            currentImgData = processRadioactive(currentImgData, renderWidth, renderHeight, intensityFactor);
        }

        ctx.putImageData(currentImgData, 0, 0);

        if (activeEffect === 'oldfilm') applyOldFilmCanvas(ctx, renderWidth, renderHeight, intensityFactor);
        if (activeEffect === 'glitch') applyGlitchCanvas(ctx, renderWidth, renderHeight, intensityFactor);
        if (activeEffect === 'fog') applyFogCanvas(ctx, renderWidth, renderHeight, intensityFactor);

        uploadedImage.style.opacity = '0';
    }

    function processPixelation(imgData, w, h, blockSize) {
        if (blockSize <= 1) return imgData;
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

    function processGrainNoise(imgData, factor) {
        const data = imgData.data;
        const maxNoise = 50 * factor;
        for (let i = 0; i < data.length; i += 4) {
            const noise = (Math.random() - 0.5) * maxNoise;
            data[i] = Math.max(0, Math.min(255, data[i] + noise));
            data[i + 1] = Math.max(0, Math.min(255, data[i + 1] + noise));
            data[i + 2] = Math.max(0, Math.min(255, data[i + 2] + noise));
        }
        return imgData;
    }

    function processHDR(imgData, factor) {
        const data = imgData.data;
        for (let i = 0; i < data.length; i += 4) {
            let r = data[i] / 255, g = data[i + 1] / 255, b = data[i + 2] / 255;
            let hr = Math.pow(r * 1.3 / (1.0 + r * 1.3), 0.8);
            let hg = Math.pow(g * 1.3 / (1.0 + g * 1.3), 0.8);
            let hb = Math.pow(b * 1.3 / (1.0 + b * 1.3), 0.8);

            data[i] = (r + (hr - r) * factor) * 255;
            data[i + 1] = (g + (hg - g) * factor) * 255;
            data[i + 2] = (b + (hb - b) * factor) * 255;
        }
        return imgData;
    }

    function processOldMoney(imgData, factor) {
        const data = imgData.data;
        for (let i = 0; i < data.length; i += 4) {
            let r = data[i], g = data[i+1], b = data[i+2];
            let nr = (r * 0.393) + (g * 0.769) + (b * 0.189);
            let ng = (r * 0.349) + (g * 0.686) + (b * 0.168);
            let nb = (r * 0.272) + (g * 0.534) + (b * 0.131);
            
            let tr = Math.min(255, r * 0.45 + nr * 0.55 + 12);
            let tg = Math.min(255, g * 0.45 + ng * 0.55 + 6);
            let tb = Math.min(255, b * 0.45 + nb * 0.55 - 8);

            data[i] = r + (tr - r) * factor;
            data[i+1] = g + (tg - g) * factor;
            data[i+2] = b + (tb - b) * factor;
        }
        return imgData;
    }

    function processRadioactive(imgData, w, h, factor) {
        const srcData = new Uint8ClampedArray(imgData.data);
        const dstData = imgData.data;

        for (let y = 0; y < h; y++) {
            const offsetX = Math.floor((Math.sin(y / 8) * 6 + (Math.random() - 0.5) * 3) * factor);
            for (let x = 0; x < w; x++) {
                const targetX = Math.max(0, Math.min(w - 1, x + offsetX));
                const srcIdx = (y * w + targetX) * 4;
                const dstIdx = (y * w + x) * 4;

                let r = srcData[srcIdx], g = srcData[srcIdx + 1], b = srcData[srcIdx + 2];
                let gray = (r + g + b) / 3;

                let radR = Math.min(255, gray * 0.2);
                let radG = Math.min(255, gray * 1.8 + 40);
                let radB = Math.min(255, gray * 0.1);

                dstData[dstIdx] = r + (radR - r) * factor;
                dstData[dstIdx + 1] = g + (radG - g) * factor;
                dstData[dstIdx + 2] = b + (radB - b) * factor;
                dstData[dstIdx + 3] = srcData[srcIdx + 3];
            }
        }
        return imgData;
    }

    function applyOldFilmCanvas(ctx, w, h, factor) {
        ctx.fillStyle = `rgba(230, 195, 120, ${0.35 * factor})`;
        ctx.fillRect(0, 0, w, h);
    }

    function applyGlitchCanvas(ctx, w, h, factor) {
        const count = Math.floor(10 * factor);
        for (let i = 0; i < count; i++) {
            const sliceY = Math.floor(Math.random() * h);
            const sliceH = Math.floor(Math.random() * 15) + 5;
            const offsetX = Math.floor((Math.random() - 0.5) * 30 * factor);
            const sliceData = ctx.getImageData(0, sliceY, w, sliceH);
            ctx.putImageData(sliceData, offsetX, sliceY);
        }
    }

    function applyFogCanvas(ctx, w, h, factor) {
        const gradient = ctx.createLinearGradient(0, 0, 0, h);
        gradient.addColorStop(0, `rgba(255, 255, 255, ${0.4 * factor})`);
        gradient.addColorStop(1, `rgba(200, 200, 200, ${0.15 * factor})`);
        ctx.fillStyle = gradient;
        ctx.fillRect(0, 0, w, h);
    }

    function showRadiusPicker() {
        if (document.getElementById('radius-popup')) return;

        const popup = document.createElement('div');
        popup.id = 'radius-popup';
        popup.style.position = 'fixed';
        popup.style.bottom = isMobile ? '85px' : '20px';
        popup.style.left = '50%';
        popup.style.transform = 'translateX(-50%)';
        popup.style.backgroundColor = '#333';
        popup.style.padding = '15px 20px';
        popup.style.borderRadius = '35px';
        popup.style.zIndex = '1000';
        popup.style.display = 'flex';
        popup.style.alignItems = 'center';
        popup.style.gap = '10px';

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
        closeBtn.textContent = 'Применить';
        closeBtn.style.padding = '5px 15px';
        closeBtn.style.borderRadius = '15px';
        closeBtn.style.border = 'none';
        closeBtn.style.background = '#3b82f6';
        closeBtn.style.color = 'white';
        closeBtn.style.fontWeight = 'bold';
        closeBtn.addEventListener('click', () => popup.remove());

        popup.appendChild(input);
        popup.appendChild(closeBtn);
        document.body.appendChild(popup);
    }

    // --- СКАЧИВАНИЕ ИЗОБРАЖЕНИЯ ---
    downloadBtn.addEventListener('click', function() {
        if (!uploadedImage.src) return;
        
        const exportCanvas = document.createElement('canvas');
        const exportCtx = exportCanvas.getContext('2d');

        exportCanvas.width = uploadedImage.naturalWidth;
        exportCanvas.height = uploadedImage.naturalHeight;

        let filter = '';
        const intensityFactor = effectIntensity / 100;

        if (activeEffect === 'bw') {
            filter = `grayscale(${100 * intensityFactor}%)`;
        } else if (activeEffect === 'negative') {
            filter = `invert(${100 * intensityFactor}%)`;
        } else if (activeEffect === 'blur') {
            filter = `blur(${8 * intensityFactor}px)`;
        }

        if (filter) exportCtx.filter = filter;

        exportCtx.drawImage(uploadedImage, 0, 0);

        const canvasEffects = ['perlin', 'pixel', 'hdr', 'oldfilm', 'glitch', 'fog', 'oldmoney', 'radioactive'];

        if (canvasEffects.includes(activeEffect) && intensityFactor > 0) {
            let imgData = exportCtx.getImageData(0, 0, exportCanvas.width, exportCanvas.height);
            
            if (activeEffect === 'pixel') {
                const blockSize = Math.max(1, Math.floor(24 * intensityFactor));
                imgData = processPixelation(imgData, exportCanvas.width, exportCanvas.height, blockSize);
            } else if (activeEffect === 'perlin') {
                imgData = processGrainNoise(imgData, intensityFactor);
            } else if (activeEffect === 'hdr') {
                imgData = processHDR(imgData, intensityFactor);
            } else if (activeEffect === 'oldmoney') {
                imgData = processOldMoney(imgData, intensityFactor);
            } else if (activeEffect === 'radioactive') {
                imgData = processRadioactive(imgData, exportCanvas.width, exportCanvas.height, intensityFactor);
            }

            exportCtx.putImageData(imgData, 0, 0);

            if (activeEffect === 'oldfilm') applyOldFilmCanvas(exportCtx, exportCanvas.width, exportCanvas.height, intensityFactor);
            if (activeEffect === 'glitch') applyGlitchCanvas(exportCtx, exportCanvas.width, exportCanvas.height, intensityFactor);
            if (activeEffect === 'fog') applyFogCanvas(exportCtx, exportCanvas.width, exportCanvas.height, intensityFactor);
        }

        if (textContainer.style.display !== 'none' && text.trim()) {
            const scaleFactor = exportCanvas.width / uploadedImage.offsetWidth;
            const fontSize = (textSize / 100) * 40 * scaleFactor;

            exportCtx.font = `bold ${fontSize}px ${selectedFont}`;
            exportCtx.fillStyle = textColor;
            exportCtx.textAlign = 'left';
            exportCtx.textBaseline = 'top';

            const htmlPadding = 5 * scaleFactor;
            const x = ((textX / 100) * exportCanvas.width) + htmlPadding;
            const y = ((textY / 100) * exportCanvas.height) + htmlPadding;

            exportCtx.fillText(text, x, y);
        }

        const link = document.createElement('a');
        link.download = 'edited-image.png';
        link.href = exportCanvas.toDataURL('image/png');
        link.click();
    });

    function resetEffects() {
        const overlay = document.getElementById('perlin-canvas-overlay');
        if (overlay) overlay.remove();

        removeIntensityPopup();
        const colorPopup = document.getElementById('color-popup');
        if (colorPopup) colorPopup.remove();

        activeEffect = 'none';
        effectIntensity = 100;
        borderRadiusValue = 0;

        uploadedImage.style.borderRadius = '0px';
        uploadedImage.style.opacity = '1';
        uploadedImage.style.filter = 'none';
        subPanel.classList.remove('active');
        textContainer.style.display = 'none';
        
        updateEffectUI();
        setActiveSidebarButton(null);
    }

    backBtn.addEventListener('click', function() {
        editorPage.classList.remove('active');
        mainPage.classList.add('active');
        fileInput.value = ''; 
        uploadedImage.src = '';
        resetEffects();
    });
});
