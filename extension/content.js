console.log("Email Writer - Smart Dynamic Buttons");

function getEmailContent() {
    const selectors = [
        '.h7',
        '.a3s.aiL',
        '.gmail_quote',
        '[role="presentation"]'
    ];
    for (const selector of selectors) {
        const content = document.querySelector(selector);
        if (content) {
            return content.innerText.trim();
        }
    }
    return '';
}

function getComposeBoxContent() {
    const composeBox = document.querySelector('[role="textbox"][g_editable="true"]');
    if (composeBox) {
        return composeBox.innerText.trim();
    }
    return '';
}

function findComposeToolbar() {
    const selectors = ['.btC', '.aDh', '[role="toolbar"]', '.gU.Up'];
    for (const selector of selectors) {
        const toolbar = document.querySelector(selector);
        if (toolbar) {
            return toolbar;
        }
    }
    return null;
}

let selectedTone = 'professional';
let selectedImprovement = 'general';
let improveSplitButtonInstance = null; // Store reference to improve button

// Create AI Reply Split Button (Main button + Tone dropdown)
function createAIReplySplitButton() {
    const container = document.createElement('div');
    container.style.cssText = `
        display: inline-flex;
        align-items: center;
        position: relative;
        margin-right: 8px;
    `;

    // Main Button
    const mainButton = document.createElement('button');
    mainButton.style.cssText = `
        height: 36px;
        padding: 0 16px 0 20px;
        border-radius: 18px 0 0 18px;
        border: none;
        border-right: 1px solid rgba(255, 255, 255, 0.2);
        font-size: 13px;
        font-family: 'Google Sans', Roboto, Arial, sans-serif;
        font-weight: 500;
        background: linear-gradient(135deg, #1a73e8 0%, #1557b0 100%);
        color: #ffffff;
        cursor: pointer;
        outline: none;
        box-shadow: 0 1px 2px 0 rgba(60, 64, 67, 0.3), 0 1px 3px 1px rgba(60, 64, 67, 0.15);
        transition: all 0.2s cubic-bezier(0.4, 0, 0.2, 1);
        display: inline-flex;
        align-items: center;
        justify-content: center;
        gap: 6px;
        white-space: nowrap;
    `;
    
    mainButton.innerHTML = `
        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" style="flex-shrink: 0;">
            <path d="M12 2L15.09 8.26L22 9.27L17 14.14L18.18 21.02L12 17.77L5.82 21.02L7 14.14L2 9.27L8.91 8.26L12 2Z" 
                  fill="currentColor" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"/>
        </svg>
        <span>AI Reply</span>
        <span style="font-size: 10px; opacity: 0.8; margin-left: 2px;">(${selectedTone})</span>
    `;

    // Dropdown Arrow Button
    const dropdownButton = document.createElement('button');
    dropdownButton.style.cssText = `
        height: 36px;
        width: 32px;
        padding: 0;
        border-radius: 0 18px 18px 0;
        border: none;
        font-size: 13px;
        font-family: 'Google Sans', Roboto, Arial, sans-serif;
        font-weight: 500;
        background: linear-gradient(135deg, #1a73e8 0%, #1557b0 100%);
        color: #ffffff;
        cursor: pointer;
        outline: none;
        box-shadow: 0 1px 2px 0 rgba(60, 64, 67, 0.3), 0 1px 3px 1px rgba(60, 64, 67, 0.15);
        transition: all 0.2s cubic-bezier(0.4, 0, 0.2, 1);
        display: inline-flex;
        align-items: center;
        justify-content: center;
    `;
    
    dropdownButton.innerHTML = `
        <svg width="12" height="12" viewBox="0 0 12 12" fill="none" xmlns="http://www.w3.org/2000/svg">
            <path d="M6 9L1 4h10z" fill="currentColor"/>
        </svg>
    `;

    // Dropdown Menu
    const dropdownMenu = document.createElement('div');
    dropdownMenu.style.cssText = `
        position: absolute;
        top: 42px;
        left: 0;
        background: white;
        border-radius: 8px;
        box-shadow: 0 2px 10px rgba(0, 0, 0, 0.2);
        padding: 4px 0;
        min-width: 160px;
        z-index: 10000;
        display: none;
        font-family: 'Google Sans', Roboto, Arial, sans-serif;
    `;

    const tones = [
        { value: 'professional', label: '💼 Professional', icon: '💼' },
        { value: 'casual', label: '😎 Casual', icon: '😎' },
        { value: 'friendly', label: '😊 Friendly', icon: '😊' },
        { value: 'short', label: '⚡ Short & Direct', icon: '⚡' }
    ];

    tones.forEach(tone => {
        const option = document.createElement('div');
        option.style.cssText = `
            padding: 10px 16px;
            cursor: pointer;
            font-size: 13px;
            color: #3c4043;
            transition: background 0.15s;
            display: flex;
            align-items: center;
            gap: 8px;
        `;
        option.innerHTML = `<span>${tone.icon}</span><span>${tone.label.replace(tone.icon + ' ', '')}</span>`;
        
        if (tone.value === selectedTone) {
            option.style.backgroundColor = '#e8f0fe';
            option.style.fontWeight = '500';
        }

        option.addEventListener('mouseenter', () => {
            option.style.backgroundColor = '#f1f3f4';
        });
        
        option.addEventListener('mouseleave', () => {
            option.style.backgroundColor = tone.value === selectedTone ? '#e8f0fe' : 'transparent';
        });

        option.addEventListener('click', () => {
            selectedTone = tone.value;
            const toneLabel = mainButton.querySelector('span:last-child');
            toneLabel.textContent = `(${tone.value})`;
            dropdownMenu.style.display = 'none';
            
            // Update selected state
            dropdownMenu.querySelectorAll('div').forEach(opt => {
                opt.style.backgroundColor = 'transparent';
                opt.style.fontWeight = 'normal';
            });
            option.style.backgroundColor = '#e8f0fe';
            option.style.fontWeight = '500';
        });

        dropdownMenu.appendChild(option);
    });

    // Toggle dropdown
    dropdownButton.addEventListener('click', (e) => {
        e.stopPropagation();
        const isVisible = dropdownMenu.style.display === 'block';
        dropdownMenu.style.display = isVisible ? 'none' : 'block';
    });

    // Close dropdown when clicking outside
    document.addEventListener('click', () => {
        dropdownMenu.style.display = 'none';
    });

    // Hover effects for main button
    mainButton.addEventListener('mouseenter', () => {
        mainButton.style.background = 'linear-gradient(135deg, #1557b0 0%, #0d47a1 100%)';
        mainButton.style.transform = 'translateY(-1px)';
        dropdownButton.style.background = 'linear-gradient(135deg, #1557b0 0%, #0d47a1 100%)';
        dropdownButton.style.transform = 'translateY(-1px)';
    });
    
    mainButton.addEventListener('mouseleave', () => {
        mainButton.style.background = 'linear-gradient(135deg, #1a73e8 0%, #1557b0 100%)';
        mainButton.style.transform = 'translateY(0)';
        dropdownButton.style.background = 'linear-gradient(135deg, #1a73e8 0%, #1557b0 100%)';
        dropdownButton.style.transform = 'translateY(0)';
    });

    dropdownButton.addEventListener('mouseenter', () => {
        mainButton.style.background = 'linear-gradient(135deg, #1557b0 0%, #0d47a1 100%)';
        dropdownButton.style.background = 'linear-gradient(135deg, #1557b0 0%, #0d47a1 100%)';
    });
    
    dropdownButton.addEventListener('mouseleave', () => {
        mainButton.style.background = 'linear-gradient(135deg, #1a73e8 0%, #1557b0 100%)';
        dropdownButton.style.background = 'linear-gradient(135deg, #1a73e8 0%, #1557b0 100%)';
    });

    // Main button click handler - Generate AI Reply
    mainButton.addEventListener('click', async () => {
        try {
            const textSpan = mainButton.querySelector('span:first-of-type');
            const originalText = textSpan.textContent;
            
            textSpan.textContent = 'Generating...';
            mainButton.style.opacity = '0.7';
            mainButton.style.cursor = 'wait';
            mainButton.disabled = true;
            dropdownButton.disabled = true;

            const emailContent = getEmailContent();

            const response = await fetch('http://localhost:8080/api/email/generate', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({
                    emailContent: emailContent,
                    tone: selectedTone
                }),
            });

            if (!response.ok) {
                throw new Error('API Request Failed');
            }

            const generatedReply = await response.text();

            const composeBox = document.querySelector('[role="textbox"][g_editable="true"]');
            if (composeBox) {
                composeBox.focus();
                document.execCommand('selectAll', false, null);
                document.execCommand('insertText', false, generatedReply);
            }
        } catch (error) {
            console.error('Error generating AI reply:', error);
            alert('Failed to generate AI reply. Please try again.');
        } finally {
            const textSpan = mainButton.querySelector('span:first-of-type');
            textSpan.textContent = 'AI Reply';
            mainButton.style.opacity = '1';
            mainButton.style.cursor = 'pointer';
            mainButton.disabled = false;
            dropdownButton.disabled = false;
        }
    });

    container.appendChild(mainButton);
    container.appendChild(dropdownButton);
    container.appendChild(dropdownMenu);

    return container;
}

//Creating Improve Reply Split Button (Main button + Improvement dropdown)
function createImproveSplitButton() {
    const container = document.createElement('div');
    container.className = 'improve-split-button-container';
    container.style.cssText = `
        display: inline-flex;
        align-items: center;
        position: relative;
        margin-left: 8px;
        opacity: 0;
        transform: translateX(-10px);
        transition: opacity 0.3s ease, transform 0.3s ease;
        pointer-events: none;
    `;

    // Main Button
    const mainButton = document.createElement('button');
    mainButton.style.cssText = `
        height: 36px;
        padding: 0 16px 0 20px;
        border-radius: 18px 0 0 18px;
        border: none;
        border-right: 1px solid rgba(255, 255, 255, 0.2);
        font-size: 13px;
        font-family: 'Google Sans', Roboto, Arial, sans-serif;
        font-weight: 500;
        background: linear-gradient(135deg, #34a853 0%, #2d8e47 100%);
        color: #ffffff;
        cursor: pointer;
        outline: none;
        box-shadow: 0 1px 2px 0 rgba(60, 64, 67, 0.3), 0 1px 3px 1px rgba(60, 64, 67, 0.15);
        transition: all 0.2s cubic-bezier(0.4, 0, 0.2, 1);
        display: inline-flex;
        align-items: center;
        justify-content: center;
        gap: 6px;
        white-space: nowrap;
    `;
    
    mainButton.innerHTML = `
        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" style="flex-shrink: 0;">
            <path d="M12 20h9M16.5 3.5a2.121 2.121 0 0 1 3 3L7 19l-4 1 1-4L16.5 3.5z" 
                  stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
        </svg>
        <span>Improve</span>
        <span style="font-size: 10px; opacity: 0.8; margin-left: 2px;">(${selectedImprovement})</span>
    `;

    // Dropdown Arrow Button
    const dropdownButton = document.createElement('button');
    dropdownButton.style.cssText = `
        height: 36px;
        width: 32px;
        padding: 0;
        border-radius: 0 18px 18px 0;
        border: none;
        font-size: 13px;
        font-family: 'Google Sans', Roboto, Arial, sans-serif;
        font-weight: 500;
        background: linear-gradient(135deg, #34a853 0%, #2d8e47 100%);
        color: #ffffff;
        cursor: pointer;
        outline: none;
        box-shadow: 0 1px 2px 0 rgba(60, 64, 67, 0.3), 0 1px 3px 1px rgba(60, 64, 67, 0.15);
        transition: all 0.2s cubic-bezier(0.4, 0, 0.2, 1);
        display: inline-flex;
        align-items: center;
        justify-content: center;
    `;
    
    dropdownButton.innerHTML = `
        <svg width="12" height="12" viewBox="0 0 12 12" fill="none" xmlns="http://www.w3.org/2000/svg">
            <path d="M6 9L1 4h10z" fill="currentColor"/>
        </svg>
    `;

    // Dropdown Menu
    const dropdownMenu = document.createElement('div');
    dropdownMenu.style.cssText = `
        position: absolute;
        top: 42px;
        right: 0;
        background: white;
        border-radius: 8px;
        box-shadow: 0 2px 10px rgba(0, 0, 0, 0.2);
        padding: 4px 0;
        min-width: 180px;
        z-index: 10000;
        display: none;
        font-family: 'Google Sans', Roboto, Arial, sans-serif;
    `;

    const improvements = [
        { value: 'general', label: '✨ General', icon: '✨' },
        { value: 'grammar', label: '📝 Grammar', icon: '📝' },
        { value: 'professional', label: '💼 Professional', icon: '💼' },
        { value: 'concise', label: '⚡ Concise', icon: '⚡' },
        { value: 'friendly', label: '😊 Friendly', icon: '😊' },
        { value: 'clarity', label: '🔍 Clarity', icon: '🔍' }
    ];

    improvements.forEach(improvement => {
        const option = document.createElement('div');
        option.style.cssText = `
            padding: 10px 16px;
            cursor: pointer;
            font-size: 13px;
            color: #3c4043;
            transition: background 0.15s;
            display: flex;
            align-items: center;
            gap: 8px;
        `;
        option.innerHTML = `<span>${improvement.icon}</span><span>${improvement.label.replace(improvement.icon + ' ', '')}</span>`;
        
        if (improvement.value === selectedImprovement) {
            option.style.backgroundColor = '#e6f4ea';
            option.style.fontWeight = '500';
        }

        option.addEventListener('mouseenter', () => {
            option.style.backgroundColor = '#f1f3f4';
        });
        
        option.addEventListener('mouseleave', () => {
            option.style.backgroundColor = improvement.value === selectedImprovement ? '#e6f4ea' : 'transparent';
        });

        option.addEventListener('click', () => {
            selectedImprovement = improvement.value;
            const improvementLabel = mainButton.querySelector('span:last-child');
            improvementLabel.textContent = `(${improvement.value})`;
            dropdownMenu.style.display = 'none';
            
            // Update selected state
            dropdownMenu.querySelectorAll('div').forEach(opt => {
                opt.style.backgroundColor = 'transparent';
                opt.style.fontWeight = 'normal';
            });
            option.style.backgroundColor = '#e6f4ea';
            option.style.fontWeight = '500';
        });

        dropdownMenu.appendChild(option);
    });

    // Toggle dropdown
    dropdownButton.addEventListener('click', (e) => {
        e.stopPropagation();
        const isVisible = dropdownMenu.style.display === 'block';
        dropdownMenu.style.display = isVisible ? 'none' : 'block';
    });

    // Close dropdown when clicking outside
    document.addEventListener('click', () => {
        dropdownMenu.style.display = 'none';
    });

    // Hover effects
    mainButton.addEventListener('mouseenter', () => {
        mainButton.style.background = 'linear-gradient(135deg, #2d8e47 0%, #1e7e34 100%)';
        mainButton.style.transform = 'translateY(-1px)';
        dropdownButton.style.background = 'linear-gradient(135deg, #2d8e47 0%, #1e7e34 100%)';
        dropdownButton.style.transform = 'translateY(-1px)';
    });
    
    mainButton.addEventListener('mouseleave', () => {
        mainButton.style.background = 'linear-gradient(135deg, #34a853 0%, #2d8e47 100%)';
        mainButton.style.transform = 'translateY(0)';
        dropdownButton.style.background = 'linear-gradient(135deg, #34a853 0%, #2d8e47 100%)';
        dropdownButton.style.transform = 'translateY(0)';
    });

    dropdownButton.addEventListener('mouseenter', () => {
        mainButton.style.background = 'linear-gradient(135deg, #2d8e47 0%, #1e7e34 100%)';
        dropdownButton.style.background = 'linear-gradient(135deg, #2d8e47 0%, #1e7e34 100%)';
    });
    
    dropdownButton.addEventListener('mouseleave', () => {
        mainButton.style.background = 'linear-gradient(135deg, #34a853 0%, #2d8e47 100%)';
        dropdownButton.style.background = 'linear-gradient(135deg, #34a853 0%, #2d8e47 100%)';
    });

    // Main button click handler - Improve Reply
    mainButton.addEventListener('click', async () => {
        try {
            const textSpan = mainButton.querySelector('span:first-of-type');
            const originalText = textSpan.textContent;
            
            textSpan.textContent = 'Improving...';
            mainButton.style.opacity = '0.7';
            mainButton.style.cursor = 'wait';
            mainButton.disabled = true;
            dropdownButton.disabled = true;

            const currentReply = getComposeBoxContent();
            
            if (!currentReply || currentReply.trim() === '') {
                alert('Please write or generate a reply first before improving it.');
                return;
            }

            const response = await fetch('http://localhost:8080/api/email/improve', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({
                    originalReply: currentReply,
                    improvementType: selectedImprovement
                }),
            });

            if (!response.ok) {
                throw new Error('API Request Failed');
            }

            const improvedReply = await response.text();

            const composeBox = document.querySelector('[role="textbox"][g_editable="true"]');
            if (composeBox) {
                composeBox.focus();
                document.execCommand('selectAll', false, null);
                document.execCommand('insertText', false, improvedReply);
            }
        } catch (error) {
            console.error('Error improving reply:', error);
            alert('Failed to improve reply. Please try again.');
        } finally {
            const textSpan = mainButton.querySelector('span:first-of-type');
            textSpan.textContent = 'Improve';
            mainButton.style.opacity = '1';
            mainButton.style.cursor = 'pointer';
            mainButton.disabled = false;
            dropdownButton.disabled = false;
        }
    });

    container.appendChild(mainButton);
    container.appendChild(dropdownButton);
    container.appendChild(dropdownMenu);

    return container;
}

//Toggle Improve Button Visibility Based on Compose Box Content
function toggleImproveButton() {
    if (!improveSplitButtonInstance) return;

    const content = getComposeBoxContent();
    const hasContent = content && content.length > 0;

    if (hasContent) {
        // Show with animation
        improveSplitButtonInstance.style.opacity = '1';
        improveSplitButtonInstance.style.transform = 'translateX(0)';
        improveSplitButtonInstance.style.pointerEvents = 'auto';
    } else {
        // Hide with animation
        improveSplitButtonInstance.style.opacity = '0';
        improveSplitButtonInstance.style.transform = 'translateX(-10px)';
        improveSplitButtonInstance.style.pointerEvents = 'none';
    }
}

//Watch Compose Box for Changes
function watchComposeBox() {
    const composeBox = document.querySelector('[role="textbox"][g_editable="true"]');
    
    if (!composeBox) {
        setTimeout(watchComposeBox, 500);
        return;
    }

    // Initial check
    toggleImproveButton();

    // Watch for input events
    composeBox.addEventListener('input', toggleImproveButton);
    composeBox.addEventListener('blur', toggleImproveButton);
    composeBox.addEventListener('focus', toggleImproveButton);

    // Also use MutationObserver for content changes
    const composeObserver = new MutationObserver(toggleImproveButton);
    composeObserver.observe(composeBox, {
        childList: true,
        subtree: true,
        characterData: true
    });

    console.log("Compose box watcher initialized");
}

function injectButton() {
    const existingContainer = document.querySelector('.ai-email-container');
    if (existingContainer) {
        existingContainer.remove();
    }

    const toolbar = findComposeToolbar();
    if (!toolbar) {
        console.log("Toolbar not found");
        return;
    }
    console.log("Toolbar found");

    const aiReplyButton = createAIReplySplitButton();
    const improveButton = createImproveSplitButton();
    
    // Store reference to improve button
    improveSplitButtonInstance = improveButton;

    const container = document.createElement('div');
    container.className = 'ai-email-container';
    container.style.cssText = `
        display: flex;
        align-items: center;
        margin-left: 8px;
        margin-right: 12px;
        gap: 0;
    `;

    container.appendChild(aiReplyButton);
    container.appendChild(improveButton);

    toolbar.insertBefore(container, toolbar.firstChild);

    // Start watching compose box for content changes
    setTimeout(watchComposeBox, 300);
}

const observer = new MutationObserver((mutations) => {
    for (const mutation of mutations) {
        const addedNodes = Array.from(mutation.addedNodes);
        const hasComposeElement = addedNodes.some(node =>
            node.nodeType === Node.ELEMENT_NODE &&
            (node.matches('.aDh, .btC, [role="dialog"]')
                || node.querySelector?.('.aDh, .btC, [role="dialog"]'))
        );
        if (hasComposeElement) {
            console.log("Compose window detected");
            setTimeout(injectButton, 500);
        }
    }
});

observer.observe(document.body, { childList: true, subtree: true });