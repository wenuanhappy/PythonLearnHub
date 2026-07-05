/**
 * Python学习平台 - 主JavaScript文件
 * 包含全局功能和通用工具函数
 */

// 全局配置
window.PythonLearningPlatform = {
    config: {
        apiTimeout: 30000,
        codeExecutionTimeout: 15000,
        maxCodeLength: 10000,
        animationDuration: 300
    },

    // 执行历史
    executionHistory: [],

    // 当前主题
    currentTheme: 'light',

    // AI聊天历史
    chatHistory: [],

    // 语音识别相关
    speechRecognition: null,
    isListening: false
};

// Markdown-it 渲染器（与 Prism 集成）
let mdRenderer = null;

/**
 * 文档加载完成后的初始化
 */
document.addEventListener('DOMContentLoaded', function () {
    initializeApp();
    initializeMarkdownRenderer();
});

/**
 * 初始化应用
 */
function initializeApp() {
    console.log('🐍 Python学习平台初始化中...');

    // 初始化代码高亮
    initializeCodeHighlighting();

    // 初始化工具提示
    initializeTooltips();

    // 初始化平滑滚动
    initializeSmoothScrolling();

    // 初始化键盘快捷键
    initializeKeyboardShortcuts();

    // 初始化页面动画
    initializePageAnimations();

    // 初始化代码执行功能
    initializeCodeExecution();

    // 初始化AI助手
    initializeAIAssistant();

    // 初始化语音识别
    initializeSpeechRecognition();

    // 初始化登出功能
    initializeLogout();

    console.log('✅ Python学习平台初始化完成');
}

// 初始化 Markdown 渲染器
function initializeMarkdownRenderer() {
    if (typeof window.markdownit === 'undefined') {
        console.warn('markdown-it 未加载，将回退到纯文本显示');
        return;
    }

    mdRenderer = window.markdownit({
        html: false,
        linkify: true,
        breaks: true,
        highlight: function (code, lang) {
            try {
                if (typeof Prism !== 'undefined' && lang && Prism.languages[lang]) {
                    return `<pre class="code-block"><code class="language-${lang}">` +
                        Prism.highlight(code, Prism.languages[lang], lang) +
                        '</code></pre>';
                }
            } catch (e) {
                console.warn('代码高亮失败，回退为转义文本', e);
            }
            // 回退：不指定语言，避免 XSS
            const div = document.createElement('div');
            div.textContent = code;
            return `<pre class="code-block"><code>` + div.innerHTML + '</code></pre>';
        }
    });
}

/**
 * 初始化代码高亮
 */
function initializeCodeHighlighting() {
    // Prism.js 会自动处理代码高亮
    if (typeof Prism !== 'undefined') {
        Prism.highlightAll();
        console.log('📝 代码高亮已启用');
    }
}

/**
 * 初始化工具提示
 */
function initializeTooltips() {
    // 初始化 Bootstrap tooltips
    const tooltipTriggerList = [].slice.call(document.querySelectorAll('[data-bs-toggle="tooltip"]'));
    tooltipTriggerList.map(function (tooltipTriggerEl) {
        return new bootstrap.Tooltip(tooltipTriggerEl);
    });

    // 为代码块添加复制按钮和工具提示
    addCopyButtonsToCodeBlocks();
}

/**
 * 为代码块添加复制按钮
 */
function addCopyButtonsToCodeBlocks() {
    const codeBlocks = document.querySelectorAll('pre code');

    codeBlocks.forEach(function (codeBlock) {
        const pre = codeBlock.parentElement;

        // 避免重复添加
        if (pre.querySelector('.copy-btn')) return;

        // 创建复制按钮
        const copyBtn = document.createElement('button');
        copyBtn.className = 'btn btn-sm btn-outline-secondary copy-btn position-absolute';
        copyBtn.style.cssText = 'top: 0.5rem; right: 0.5rem; z-index: 10;';
        copyBtn.innerHTML = '<i class="fas fa-copy"></i>';
        copyBtn.title = '复制代码';

        // 设置相对定位
        pre.style.position = 'relative';

        // 添加点击事件
        copyBtn.addEventListener('click', function () {
            copyToClipboard(codeBlock.textContent, copyBtn);
        });

        pre.appendChild(copyBtn);
    });
}

/**
 * 复制文本到剪贴板
 */
function copyToClipboard(text, button) {
    if (navigator.clipboard) {
        navigator.clipboard.writeText(text).then(function () {
            showCopySuccess(button);
        }, function (err) {
            console.error('复制失败:', err);
            fallbackCopyTextToClipboard(text, button);
        });
    } else {
        fallbackCopyTextToClipboard(text, button);
    }
}

/**
 * 备用复制方法
 */
function fallbackCopyTextToClipboard(text, button) {
    const textArea = document.createElement("textarea");
    textArea.value = text;
    textArea.style.position = "fixed";
    textArea.style.left = "-999999px";
    textArea.style.top = "-999999px";
    document.body.appendChild(textArea);
    textArea.focus();
    textArea.select();

    try {
        const successful = document.execCommand('copy');
        if (successful) {
            showCopySuccess(button);
        } else {
            showCopyError(button);
        }
    } catch (err) {
        console.error('备用复制方法失败:', err);
        showCopyError(button);
    }

    document.body.removeChild(textArea);
}

/**
 * 显示复制成功
 */
function showCopySuccess(button) {
    const originalHTML = button.innerHTML;
    button.innerHTML = '<i class="fas fa-check text-success"></i>';
    button.classList.add('btn-success');
    button.classList.remove('btn-outline-secondary');

    setTimeout(function () {
        button.innerHTML = originalHTML;
        button.classList.remove('btn-success');
        button.classList.add('btn-outline-secondary');
    }, 2000);
}

/**
 * 显示复制错误
 */
function showCopyError(button) {
    const originalHTML = button.innerHTML;
    button.innerHTML = '<i class="fas fa-times text-danger"></i>';

    setTimeout(function () {
        button.innerHTML = originalHTML;
    }, 2000);
}

/**
 * 初始化平滑滚动
 */
function initializeSmoothScrolling() {
    // 为锚点链接添加平滑滚动
    document.querySelectorAll('a[href^="#"]').forEach(function (anchor) {
        anchor.addEventListener('click', function (e) {
            const href = this.getAttribute('href');
            if (href === '#') return;

            const target = document.querySelector(href);
            if (target) {
                e.preventDefault();
                target.scrollIntoView({
                    behavior: 'smooth',
                    block: 'start'
                });
            }
        });
    });
}

/**
 * 初始化键盘快捷键
 */
function initializeKeyboardShortcuts() {
    document.addEventListener('keydown', function (e) {
        // Ctrl + / 显示快捷键帮助
        if (e.ctrlKey && e.key === '/') {
            e.preventDefault();
            showKeyboardShortcuts();
        }

        // Ctrl + K 聚焦搜索框
        if (e.ctrlKey && e.key === 'k') {
            e.preventDefault();
            const searchInput = document.querySelector('input[name="q"]');
            if (searchInput) {
                searchInput.focus();
                searchInput.select();
            }
        }

        // ESC 键关闭模态框
        if (e.key === 'Escape') {
            const openModals = document.querySelectorAll('.modal.show');
            openModals.forEach(modal => {
                const modalInstance = bootstrap.Modal.getInstance(modal);
                if (modalInstance) {
                    modalInstance.hide();
                }
            });
        }
    });
}

/**
 * 显示键盘快捷键帮助
 */
function showKeyboardShortcuts() {
    const shortcuts = [
        { key: 'Ctrl + /', desc: '显示快捷键帮助' },
        { key: 'Ctrl + K', desc: '聚焦搜索框' },
        { key: 'Ctrl + Enter', desc: '运行代码 (在代码编辑器中)' },
        { key: 'ESC', desc: '关闭模态框' }
    ];

    let shortcutsHTML = '<div class="modal fade" id="shortcutsModal" tabindex="-1">';
    shortcutsHTML += '<div class="modal-dialog"><div class="modal-content">';
    shortcutsHTML += '<div class="modal-header">';
    shortcutsHTML += '<h5 class="modal-title"><i class="fas fa-keyboard"></i> 键盘快捷键</h5>';
    shortcutsHTML += '<button type="button" class="btn-close" data-bs-dismiss="modal"></button>';
    shortcutsHTML += '</div><div class="modal-body">';
    shortcutsHTML += '<div class="row">';

    shortcuts.forEach(shortcut => {
        shortcutsHTML += '<div class="col-12 mb-2">';
        shortcutsHTML += '<div class="d-flex justify-content-between align-items-center">';
        shortcutsHTML += `<span>${shortcut.desc}</span>`;
        shortcutsHTML += `<kbd class="ms-2">${shortcut.key}</kbd>`;
        shortcutsHTML += '</div></div>';
    });

    shortcutsHTML += '</div></div></div></div></div>';

    // 移除已存在的模态框
    const existingModal = document.getElementById('shortcutsModal');
    if (existingModal) {
        existingModal.remove();
    }

    // 添加新模态框
    document.body.insertAdjacentHTML('beforeend', shortcutsHTML);

    // 显示模态框
    const modal = new bootstrap.Modal(document.getElementById('shortcutsModal'));
    modal.show();

    // 模态框隐藏后移除元素
    document.getElementById('shortcutsModal').addEventListener('hidden.bs.modal', function () {
        this.remove();
    });
}

/**
 * 初始化页面动画
 */
function initializePageAnimations() {
    // 创建 Intersection Observer
    const observerOptions = {
        threshold: 0.1,
        rootMargin: '0px 0px -50px 0px'
    };

    const observer = new IntersectionObserver(function (entries) {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('fade-in-up');
                observer.unobserve(entry.target);
            }
        });
    }, observerOptions);

    // 观察需要动画的元素
    const animatedElements = document.querySelectorAll('.card, .example-item, .feature-card');
    animatedElements.forEach(el => {
        observer.observe(el);
    });
}

/**
 * 初始化代码执行功能
 */
function initializeCodeExecution() {
    // 统一处理代码执行按钮
    document.addEventListener('click', function (e) {
        if (e.target.closest('.run-code-btn') || e.target.closest('[data-action="run-code"]')) {
            const button = e.target.closest('button');
            const code = button.getAttribute('data-code') || getCodeFromElement(button);

            if (code) {
                executeCode(code, button);
            }
        }
    });
}

/**
 * 从元素获取代码
 */
function getCodeFromElement(button) {
    // 尝试从同级元素获取代码
    const codeContainer = button.closest('.example-item')?.querySelector('code');
    if (codeContainer) {
        return codeContainer.textContent;
    }

    // 尝试从数据属性获取
    return button.getAttribute('data-code') || '';
}

/**
 * 执行Python代码
 */
function executeCode(code, button, outputElement) {
    if (!code || !code.trim()) {
        showNotification('请输入要执行的代码', 'warning');
        return;
    }

    if (code.length > window.PythonLearningPlatform.config.maxCodeLength) {
        showNotification('代码长度超出限制', 'error');
        return;
    }

    // 更新按钮状态
    const originalHTML = button.innerHTML;
    button.innerHTML = '<span class="loading-spinner"></span> 执行中...';
    button.disabled = true;

    // 确定输出元素
    let output = outputElement;
    if (!output) {
        output = findOrCreateOutputElement(button);
    }

    // 显示执行中状态
    if (output && output.querySelector('.output-content')) {
        output.querySelector('.output-content').textContent = '执行中...';
        output.style.display = 'block';
    }

    const startTime = Date.now();

    // 发送执行请求
    fetch('/api/execute', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify({ code: code }),
        signal: AbortSignal.timeout(window.PythonLearningPlatform.config.codeExecutionTimeout)
    })
        .then(response => {
            if (!response.ok) {
                throw new Error(`HTTP ${response.status}: ${response.statusText}`);
            }
            return response.json();
        })
        .then(data => {
            const executionTime = ((Date.now() - startTime) / 1000).toFixed(3);
            displayExecutionResult(data, output, executionTime);

            // 添加到执行历史
            window.PythonLearningPlatform.executionHistory.push({
                code: code,
                result: data,
                timestamp: new Date().toISOString(),
                executionTime: executionTime
            });

            // 限制历史记录长度
            if (window.PythonLearningPlatform.executionHistory.length > 50) {
                window.PythonLearningPlatform.executionHistory.shift();
            }
        })
        .catch(error => {
            console.error('代码执行错误:', error);
            const errorMessage = error.name === 'AbortError' ? '执行超时' : `网络错误: ${error.message}`;
            displayExecutionError(errorMessage, output);
        })
        .finally(() => {
            // 恢复按钮状态
            button.innerHTML = originalHTML;
            button.disabled = false;
        });
}

/**
 * 查找或创建输出元素
 */
function findOrCreateOutputElement(button) {
    // 尝试在父级容器中找到输出元素
    const container = button.closest('.example-item') || button.closest('.card-body');
    let output = container?.querySelector('.code-output');

    if (!output) {
        // 创建输出元素
        output = document.createElement('div');
        output.className = 'code-output mt-3';
        output.style.display = 'none';
        output.innerHTML = `
            <div class="card border-success">
                <div class="card-header bg-light">
                    <small class="text-muted">
                        <i class="fas fa-terminal"></i> 执行结果
                    </small>
                </div>
                <div class="card-body">
                    <pre class="output-content mb-0"></pre>
                </div>
            </div>
        `;

        // 插入到适当位置
        if (container) {
            container.appendChild(output);
        } else {
            button.parentElement.insertAdjacentElement('afterend', output);
        }
    }

    return output;
}

/**
 * 显示执行结果
 */
function displayExecutionResult(data, outputElement, executionTime) {
    if (!outputElement) return;

    const outputContent = outputElement.querySelector('.output-content');
    const cardHeader = outputElement.querySelector('.card-header');

    if (data.success) {
        outputContent.textContent = data.output || '(无输出)';
        outputContent.className = 'output-content mb-0 text-success';

        if (cardHeader) {
            cardHeader.innerHTML = `
                <small class="text-muted">
                    <i class="fas fa-check text-success"></i> 
                    执行成功 (耗时: ${data.execution_time || executionTime}s)
                </small>
            `;
        }

        // 显示变量信息
        if (data.variables && Object.keys(data.variables).length > 0) {
            const varsInfo = Object.keys(data.variables).join(', ');
            if (cardHeader) {
                cardHeader.innerHTML += `<br><small class="text-info">变量: ${varsInfo}</small>`;
            }
        }

        outputElement.querySelector('.card').className = 'card border-success';
    } else {
        outputContent.textContent = data.error || '执行出错';
        outputContent.className = 'output-content mb-0 text-danger';

        if (cardHeader) {
            cardHeader.innerHTML = `
                <small class="text-muted">
                    <i class="fas fa-times text-danger"></i> 
                    执行失败 (耗时: ${data.execution_time || executionTime}s)
                </small>
            `;
        }

        outputElement.querySelector('.card').className = 'card border-danger';
    }

    outputElement.style.display = 'block';

    // 滚动到结果区域
    outputElement.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
}

/**
 * 显示执行错误
 */
function displayExecutionError(errorMessage, outputElement) {
    if (!outputElement) return;

    const outputContent = outputElement.querySelector('.output-content');
    const cardHeader = outputElement.querySelector('.card-header');

    outputContent.textContent = errorMessage;
    outputContent.className = 'output-content mb-0 text-danger';

    if (cardHeader) {
        cardHeader.innerHTML = `
            <small class="text-muted">
                <i class="fas fa-times text-danger"></i> 执行失败
            </small>
        `;
    }

    outputElement.querySelector('.card').className = 'card border-danger';
    outputElement.style.display = 'block';
}

/**
 * 显示通知消息
 */
function showNotification(message, type = 'info', duration = 3000) {
    const types = {
        'success': { icon: 'check', class: 'alert-success' },
        'error': { icon: 'times', class: 'alert-danger' },
        'warning': { icon: 'exclamation-triangle', class: 'alert-warning' },
        'info': { icon: 'info-circle', class: 'alert-info' }
    };

    const config = types[type] || types.info;

    const notification = document.createElement('div');
    notification.className = `alert ${config.class} alert-dismissible fade show position-fixed`;
    notification.style.cssText = 'top: 100px; right: 20px; z-index: 9999; min-width: 300px;';
    notification.innerHTML = `
        <i class="fas fa-${config.icon} me-2"></i>
        ${message}
        <button type="button" class="btn-close" data-bs-dismiss="alert"></button>
    `;

    document.body.appendChild(notification);

    // 自动移除
    setTimeout(() => {
        if (notification.parentElement) {
            notification.remove();
        }
    }, duration);
}

/**
 * 工具函数：格式化时间
 */
function formatTime(timestamp) {
    const date = new Date(timestamp);
    return date.toLocaleString('zh-CN');
}

/**
 * 工具函数：转义HTML
 */
function escapeHtml(text) {
    const div = document.createElement('div');
    div.textContent = text;
    return div.innerHTML;
}

/**
 * 工具函数：解转义HTML
 */
function unescapeHtml(html) {
    const div = document.createElement('div');
    div.innerHTML = html;
    return div.textContent || div.innerText || '';
}

/**
 * 工具函数：防抖
 */
function debounce(func, wait) {
    let timeout;
    return function executedFunction(...args) {
        const later = () => {
            clearTimeout(timeout);
            func(...args);
        };
        clearTimeout(timeout);
        timeout = setTimeout(later, wait);
    };
}

/**
 * 工具函数：节流
 */
function throttle(func, limit) {
    let inThrottle;
    return function () {
        const args = arguments;
        const context = this;
        if (!inThrottle) {
            func.apply(context, args);
            inThrottle = true;
            setTimeout(() => inThrottle = false, limit);
        }
    };
}

/**
 * 主题切换功能（预留）
 */
function toggleTheme() {
    const currentTheme = window.PythonLearningPlatform.currentTheme;
    const newTheme = currentTheme === 'light' ? 'dark' : 'light';

    document.body.setAttribute('data-theme', newTheme);
    window.PythonLearningPlatform.currentTheme = newTheme;

    // 保存到本地存储
    localStorage.setItem('theme', newTheme);

    console.log(`主题已切换到: ${newTheme}`);
}

/**
 * 页面卸载时的清理
 */
window.addEventListener('beforeunload', function () {
    // 清理定时器、事件监听器等
    console.log('🧹 清理资源...');
});

/**
 * 初始化AI助手
 */
function initializeAIAssistant() {
    console.log('🤖 初始化AI助手...');

    // 加载聊天历史
    loadChatHistory();

    const aiBtn = document.getElementById('aiAssistantBtn');
    const chatModal = document.getElementById('aiChatModal');
    const chatInput = document.getElementById('chatInput');
    const sendButton = document.getElementById('sendButton');
    const voiceButton = document.getElementById('voiceButton');
    const chatMessages = document.getElementById('chatMessages');
    const chatStatus = document.getElementById('chatStatus');

    if (!aiBtn || !chatModal || !chatInput || !sendButton || !chatMessages) {
        console.warn('AI助手元素未找到');
        return;
    }

    // 语音按钮事件监听器
    if (voiceButton) {
        voiceButton.addEventListener('click', toggleVoiceInput);
    }

    // 点击AI按钮打开聊天框
    aiBtn.addEventListener('click', function () {
        const modal = new bootstrap.Modal(chatModal);
        modal.show();

        // 聚焦到输入框
        setTimeout(() => {
            chatInput.focus();
        }, 300);
    });

    // 发送消息
    function sendMessage() {
        const message = chatInput.value.trim();
        if (!message) return;

        // 添加用户消息
        addMessage(message, 'user');

        // 清空输入框
        chatInput.value = '';

        // 显示AI正在输入状态
        showTypingIndicator();

        // 调用AI API
        callAIAPI(message);
    }

    // 发送按钮点击事件
    sendButton.addEventListener('click', sendMessage);

    // 回车发送消息
    chatInput.addEventListener('keydown', function (e) {
        if (e.key === 'Enter' && !e.shiftKey) {
            e.preventDefault();
            sendMessage();
        }
    });

    // 输入框自动调整高度
    chatInput.addEventListener('input', function () {
        this.style.height = 'auto';
        this.style.height = Math.min(this.scrollHeight, 120) + 'px';
    });

    console.log('✅ AI助手初始化完成');
}

/**
 * 添加消息到聊天框
 */
function addMessage(content, sender, isStreaming = false) {
    const chatMessages = document.getElementById('chatMessages');
    if (!chatMessages) return;

    const messageDiv = document.createElement('div');
    messageDiv.className = `message ${sender}-message`;

    const messageContent = document.createElement('div');
    messageContent.className = 'message-content';

    const messageText = document.createElement('div');
    messageText.className = 'message-text';

    if (sender === 'ai') {
        // AI消息需要渲染Markdown
        messageText.innerHTML = renderMarkdown(content);
        if (typeof Prism !== 'undefined') {
            Prism.highlightAllUnder(messageText);
        }
        addCopyButtonsToCodeBlocks();
    } else {
        // 用户消息直接显示
        messageText.textContent = content;
    }

    const messageTime = document.createElement('div');
    messageTime.className = 'message-time';
    messageTime.textContent = formatTime(new Date());

    messageContent.appendChild(messageText);
    messageContent.appendChild(messageTime);
    messageDiv.appendChild(messageContent);

    if (isStreaming) {
        messageDiv.classList.add('streaming');
    }

    chatMessages.appendChild(messageDiv);

    // 滚动到底部
    chatMessages.scrollTop = chatMessages.scrollHeight;

    return messageDiv;
}

/**
 * 显示打字指示器
 */
function showTypingIndicator() {
    const chatStatus = document.getElementById('chatStatus');
    if (!chatStatus) return;

    chatStatus.className = 'chat-status typing';
    chatStatus.innerHTML = `
        <div class="typing-indicator">
            <span>AI正在思考</span>
            <div class="typing-dot"></div>
            <div class="typing-dot"></div>
            <div class="typing-dot"></div>
        </div>
    `;
}

/**
 * 隐藏状态指示器
 */
function hideStatusIndicator() {
    const chatStatus = document.getElementById('chatStatus');
    if (!chatStatus) return;

    chatStatus.className = 'chat-status';
    chatStatus.innerHTML = '';
}

/**
 * 调用AI API
 */
async function callAIAPI(message) {
    try {
        // 构建消息历史
        const messages = [
            {
                role: 'system',
                content: '你是一个专业的Python学习助手，擅长帮助用户学习Python编程。请用中文回答，并提供清晰、准确的解释和示例代码。'
            }
        ];

        // 添加历史对话（最多保留最近10轮对话）
        const recentHistory = window.PythonLearningPlatform.chatHistory.slice(-20); // 保留最近20条消息
        messages.push(...recentHistory);

        // 添加当前用户消息
        messages.push({
            role: 'user',
            content: message
        });

        // 调用本地代理接口（解决CORS问题）
        const response = await fetch('/api/ai/chat', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({ messages: messages })
        });

        if (!response.ok) {
            throw new Error(`API请求失败: ${response.status} ${response.statusText}`);
        }

        // 处理流式响应
        await handleStreamingResponse(response, message);

    } catch (error) {
        console.error('AI API调用错误:', error);
        hideStatusIndicator();

        // 显示更详细的错误信息
        let errorMessage = error.message;
        if (error.message.includes('Failed to fetch') || error.message.includes('NetworkError')) {
            errorMessage = '无法连接到AI服务，请检查网络连接或稍后重试';
        }

        addMessage(`❌ AI服务暂时不可用\n\n原因: ${errorMessage}`, 'ai');

        // 显示错误状态
        const chatStatus = document.getElementById('chatStatus');
        if (chatStatus) {
            chatStatus.className = 'chat-status error';
            chatStatus.textContent = '连接失败';
        }
    }
}
        const chatStatus = document.getElementById('chatStatus');
        if (chatStatus) {
            chatStatus.className = 'chat-status error';
            chatStatus.textContent = '连接失败，请检查网络或API配置';
        }
    }
}

/**
 * 处理流式响应
 */
async function handleStreamingResponse(response, userMessage) {
    const reader = response.body.getReader();
    const decoder = new TextDecoder();
    let buffer = '';
    let fullContent = '';

    // 创建AI消息容器
    const aiMessage = addMessage('', 'ai', true);
    const messageText = aiMessage.querySelector('.message-text');

    hideStatusIndicator();

    // 使用requestAnimationFrame优化更新频率
    let updatePending = false;
    let lastUpdateTime = 0;
    const UPDATE_INTERVAL = 16; // 约60fps (16ms)

    const updateContent = () => {
        if (updatePending) return;
        updatePending = true;

        requestAnimationFrame(() => {
            messageText.innerHTML = renderMarkdown(fullContent);
            if (typeof Prism !== 'undefined') {
                Prism.highlightAllUnder(messageText);
            }
            addCopyButtonsToCodeBlocks();

            // 滚动到底部
            const chatMessages = document.getElementById('chatMessages');
            chatMessages.scrollTop = chatMessages.scrollHeight;

            updatePending = false;
        });
    };

    try {
        while (true) {
            const { done, value } = await reader.read();
            if (done) break;

            buffer += decoder.decode(value, { stream: true });
            const lines = buffer.split('\n');
            buffer = lines.pop(); // 保留不完整的行

            for (const line of lines) {
                const trimmedLine = line.trim();
                if (!trimmedLine || !trimmedLine.startsWith('data: ')) continue;

                const data = trimmedLine.slice(6);
                if (data === '[DONE]') {
                    // 最后一次更新
                    messageText.innerHTML = renderMarkdown(fullContent);
                    if (typeof Prism !== 'undefined') {
                        Prism.highlightAllUnder(messageText);
                    }
                    addCopyButtonsToCodeBlocks();
                    aiMessage.classList.remove('streaming');

                    // 滚动到底部
                    const chatMessages = document.getElementById('chatMessages');
                    chatMessages.scrollTop = chatMessages.scrollHeight;

                    // 保存聊天历史
                    saveChatHistory(userMessage, fullContent);

                    return;
                }

                try {
                    const parsed = JSON.parse(data);

                    // 尝试多种可能的内容字段格式
                    let content = null;

                    // 格式1: OpenAI 风格
                    if (parsed.choices && parsed.choices[0] && parsed.choices[0].delta && parsed.choices[0].delta.content) {
                        content = parsed.choices[0].delta.content;
                    }
                    // 格式2: 直接 content 字段
                    else if (parsed.content) {
                        content = parsed.content;
                    }
                    // 格式3: response 字段
                    else if (parsed.response) {
                        content = parsed.response;
                    }
                    // 格式4: text 字段
                    else if (parsed.text) {
                        content = parsed.text;
                    }
                    // 格式5: choices[0].delta 的任何内容
                    else if (parsed.choices && parsed.choices[0] && parsed.choices[0].delta) {
                        const delta = parsed.choices[0].delta;
                        content = delta.content || delta.text || delta.message?.content;
                    }

                    if (content) {
                        // 累积完整内容
                        fullContent += content;

                        // 节流更新，避免过度渲染
                        const now = Date.now();
                        if (now - lastUpdateTime > UPDATE_INTERVAL) {
                            updateContent();
                            lastUpdateTime = now;
                        }
                    }
                } catch (e) {
                    // 忽略解析错误，尝试下一行
                }
            }
        }

        // 确保最后内容被渲染
        messageText.innerHTML = renderMarkdown(fullContent);
        if (typeof Prism !== 'undefined') {
            Prism.highlightAllUnder(messageText);
        }
        addCopyButtonsToCodeBlocks();
    } catch (error) {
        console.error('流式响应处理错误:', error);
        messageText.innerHTML = `<p class="text-danger">处理响应时出错: ${error.message}</p>`;
    } finally {
        aiMessage.classList.remove('streaming');
        reader.releaseLock();
    }
}

/**
 * 保存聊天历史
 */
function saveChatHistory(userMessage, aiResponse) {
    // 添加用户消息到历史
    window.PythonLearningPlatform.chatHistory.push({
        role: 'user',
        content: userMessage,
        timestamp: new Date().toISOString()
    });

    // 添加AI回复到历史
    window.PythonLearningPlatform.chatHistory.push({
        role: 'assistant',
        content: aiResponse,
        timestamp: new Date().toISOString()
    });

    // 限制历史记录长度（最多保留50条消息）
    if (window.PythonLearningPlatform.chatHistory.length > 50) {
        window.PythonLearningPlatform.chatHistory = window.PythonLearningPlatform.chatHistory.slice(-50);
    }

    // 保存到本地存储
    try {
        sessionStorage.setItem('aiChatHistory', JSON.stringify(window.PythonLearningPlatform.chatHistory));
    } catch (e) {
        console.warn('无法保存聊天历史到本地存储:', e);
    }

    console.log('聊天历史已保存，当前历史条数:', window.PythonLearningPlatform.chatHistory.length);
}

/**
 * 加载聊天历史
 */
function loadChatHistory() {
    try {
        const savedHistory = sessionStorage.getItem('aiChatHistory');
        if (savedHistory) {
            window.PythonLearningPlatform.chatHistory = JSON.parse(savedHistory);
            console.log('聊天历史已加载，历史条数:', window.PythonLearningPlatform.chatHistory.length);
        }
    } catch (e) {
        console.warn('无法加载聊天历史:', e);
        window.PythonLearningPlatform.chatHistory = [];
    }
}

/**
 * 清空聊天历史
 */
function clearChatHistory() {
    window.PythonLearningPlatform.chatHistory = [];
    sessionStorage.removeItem('aiChatHistory');
    console.log('聊天历史已清空');
}

// Markdown 渲染由 markdown-it 提供

/**
 * 增强的Markdown渲染器
 * 使用缓存优化性能
 */
function renderMarkdown(text) {
    if (!text) return '';
    if (!mdRenderer) {
        const div = document.createElement('div');
        div.textContent = text;
        return `<p class="markdown-p">${div.innerHTML}</p>`;
    }
    return mdRenderer.render(text);
}

// 导出到全局作用域
window.PythonLearningPlatform.utils = {
    executeCode,
    showNotification,
    copyToClipboard,
    formatTime,
    escapeHtml,
    unescapeHtml,
    debounce,
    throttle,
    toggleTheme,
    addMessage,
    renderMarkdown,
    saveChatHistory,
    loadChatHistory,
    clearChatHistory,
    toggleVoiceInput,
    updateVoiceButtonState,
    showVoiceStatus,
    hideVoiceStatus
};

/**
 * 初始化语音识别
 */
function initializeSpeechRecognition() {
    console.log('🎤 初始化语音识别...');

    // 检查浏览器是否支持语音识别
    if (!('webkitSpeechRecognition' in window) && !('SpeechRecognition' in window)) {
        console.warn('浏览器不支持语音识别功能');
        return;
    }

    // 创建语音识别实例
    const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
    window.PythonLearningPlatform.speechRecognition = new SpeechRecognition();

    // 配置语音识别
    const recognition = window.PythonLearningPlatform.speechRecognition;
    recognition.continuous = false; // 不连续识别
    recognition.interimResults = true; // 显示中间结果
    recognition.lang = 'zh-CN'; // 设置语言为中文
    recognition.maxAlternatives = 1; // 最大备选结果数

    // 语音识别开始事件
    recognition.onstart = function () {
        console.log('🎤 语音识别开始');
        window.PythonLearningPlatform.isListening = true;
        updateVoiceButtonState(true);
        showVoiceStatus('正在听取...');
    };

    // 语音识别结果事件
    recognition.onresult = function (event) {
        let finalTranscript = '';
        let interimTranscript = '';

        // 处理识别结果
        for (let i = event.resultIndex; i < event.results.length; i++) {
            const transcript = event.results[i][0].transcript;
            if (event.results[i].isFinal) {
                finalTranscript += transcript;
            } else {
                interimTranscript += transcript;
            }
        }

        // 更新输入框内容
        const chatInput = document.getElementById('chatInput');
        if (chatInput) {
            if (finalTranscript) {
                // 最终结果，替换输入框内容
                chatInput.value = finalTranscript;
                chatInput.style.height = 'auto';
                chatInput.style.height = Math.min(chatInput.scrollHeight, 120) + 'px';
            } else if (interimTranscript) {
                // 中间结果，显示在状态栏
                showVoiceStatus(`识别中: ${interimTranscript}`);
            }
        }
    };

    // 语音识别结束事件
    recognition.onend = function () {
        console.log('🎤 语音识别结束');
        window.PythonLearningPlatform.isListening = false;
        updateVoiceButtonState(false);
        hideVoiceStatus();
    };

    // 语音识别错误事件
    recognition.onerror = function (event) {
        console.error('语音识别错误:', event.error);
        window.PythonLearningPlatform.isListening = false;
        updateVoiceButtonState(false);

        let errorMessage = '语音识别失败';
        switch (event.error) {
            case 'no-speech':
                errorMessage = '未检测到语音，请重试';
                break;
            case 'audio-capture':
                errorMessage = '无法访问麦克风，请检查权限';
                break;
            case 'not-allowed':
                errorMessage = '麦克风权限被拒绝';
                break;
            case 'network':
                errorMessage = '网络错误，请检查网络连接';
                break;
            default:
                errorMessage = `语音识别错误: ${event.error}`;
        }

        showVoiceStatus(errorMessage, 'error');
        setTimeout(hideVoiceStatus, 3000);
    };

    console.log('✅ 语音识别初始化完成');
}

/**
 * 切换语音输入状态
 */
function toggleVoiceInput() {
    const recognition = window.PythonLearningPlatform.speechRecognition;
    const isListening = window.PythonLearningPlatform.isListening;

    if (!recognition) {
        showNotification('浏览器不支持语音识别功能', 'warning');
        return;
    }

    if (isListening) {
        // 停止语音识别
        recognition.stop();
    } else {
        // 开始语音识别
        try {
            recognition.start();
        } catch (error) {
            console.error('启动语音识别失败:', error);
            showNotification('启动语音识别失败，请重试', 'error');
        }
    }
}

/**
 * 更新语音按钮状态
 */
function updateVoiceButtonState(isListening) {
    const voiceButton = document.getElementById('voiceButton');
    if (!voiceButton) return;

    const icon = voiceButton.querySelector('i');
    if (isListening) {
        voiceButton.classList.remove('btn-outline-secondary');
        voiceButton.classList.add('btn-danger');
        icon.className = 'fas fa-microphone-slash';
        voiceButton.title = '停止语音输入';
    } else {
        voiceButton.classList.remove('btn-danger');
        voiceButton.classList.add('btn-outline-secondary');
        icon.className = 'fas fa-microphone';
        voiceButton.title = '语音输入';
    }
}

/**
 * 显示语音状态
 */
function showVoiceStatus(message, type = 'info') {
    const chatStatus = document.getElementById('chatStatus');
    if (!chatStatus) return;

    const statusClass = type === 'error' ? 'error' : 'info';
    chatStatus.className = `chat-status ${statusClass}`;
    chatStatus.innerHTML = `
        <div class="voice-status">
            <i class="fas fa-microphone me-2"></i>
            <span>${message}</span>
        </div>
    `;
}

/**
 * 隐藏语音状态
 */
function hideVoiceStatus() {
    const chatStatus = document.getElementById('chatStatus');
    if (!chatStatus) return;

    chatStatus.className = 'chat-status';
    chatStatus.innerHTML = '';
}

/**
 * 初始化登出功能
 */
function initializeLogout() {
    const logoutBtn = document.getElementById('logoutBtn');
    if (!logoutBtn) {
        console.log('登出按钮不存在（用户未登录）');
        return;
    }

    logoutBtn.addEventListener('click', function(e) {
        e.preventDefault();
        e.stopPropagation();
        
        console.log('点击登出按钮');
        
        // 发送登出请求
        fetch('/logout', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            credentials: 'same-origin'
        })
        .then(response => {
            if (!response.ok) {
                throw new Error('登出请求失败');
            }
            return response.json();
        })
        .then(data => {
            console.log('登出成功:', data);
            // 登出成功，重定向到登录页面
            window.location.href = '/login';
        })
        .catch(error => {
            console.error('登出失败:', error);
            // 即使失败也重定向到登录页面
            window.location.href = '/login';
        });
    });
    
    console.log('登出功能已初始化');
}

console.log('📜 主JavaScript文件已加载');