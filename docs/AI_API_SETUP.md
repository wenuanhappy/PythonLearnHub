# AI助手API配置指南

## 概述

本Python学习平台集成了AI助手功能，用户可以在任何页面右下角点击AI图标与AI助手对话，获得Python学习帮助。

## 当前配置 (MiniMax)

**当前使用的API配置：**
```javascript
const apiConfig = {
    apiKey: 'NjZiZGFmYjA0MGQ5NjA3ODZlY2ZkYjBjNjk3NmI3NjlhNzMzYTgwNQ==',
    apiUrl: 'http://1517457097276560.cn-wulanchabu.pai-eas.aliyuncs.com/api/predict/minimax_27_int8/v1',
    model: 'minimax-2.7-INT8',
    temperature: 0.7,
    maxTokens: 2000
};
```

---

## 支持的大模型服务商

### 1. MiniMax (当前使用)

**配置方法：**
在 `static/js/main.js` 文件中找到 `callAIAPI` 函数，修改配置：

```javascript
const apiConfig = {
    apiKey: 'your-api-key',
    apiUrl: 'http://your-pai-eas-endpoint/api/predict/your-model/v1',
    model: 'your-model-name',
    temperature: 0.7,
    maxTokens: 2000
};
```

### 2. OpenAI (推荐)

**申请步骤：**
1. 访问 [OpenAI官网](https://platform.openai.com/)
2. 注册账号并登录
3. 进入 "API Keys" 页面
4. 点击 "Create new secret key" 创建API密钥
5. 复制生成的API密钥（以sk-开头）

**配置方法：**
在 `static/js/main.js` 文件中找到 `callAIAPI` 函数，修改以下配置：

```javascript
const apiConfig = {
    apiKey: 'sk-your-openai-api-key-here', // 替换为你的OpenAI API密钥
    apiUrl: 'https://api.openai.com/v1/chat/completions',
    model: 'gpt-3.5-turbo', // 或 'gpt-4'
    temperature: 0.7,
    maxTokens: 2000
};
```

**费用说明：**
- GPT-3.5-turbo: $0.002/1K tokens
- GPT-4: $0.03/1K tokens

### 2. 百度文心一言

**申请步骤：**
1. 访问 [百度智能云](https://cloud.baidu.com/)
2. 注册并实名认证
3. 开通文心一言服务
4. 创建应用获取API Key和Secret Key

**配置方法：**
```javascript
const apiConfig = {
    apiKey: 'your-access-token', // 需要通过API Key和Secret Key获取
    apiUrl: 'https://aip.baidubce.com/rpc/2.0/ai_custom/v1/wenxinworkshop/chat/completions',
    model: 'ernie-bot-turbo',
    temperature: 0.7,
    maxTokens: 2000
};
```

### 3. 阿里通义千问

**申请步骤：**
1. 访问 [阿里云](https://www.aliyun.com/)
2. 开通通义千问服务
3. 获取API Key

**配置方法：**
```javascript
const apiConfig = {
    apiKey: 'your-api-key',
    apiUrl: 'https://dashscope.aliyuncs.com/api/v1/services/aigc/text-generation/generation',
    model: 'qwen-turbo',
    temperature: 0.7,
    maxTokens: 2000
};
```

### 4. 腾讯混元

**申请步骤：**
1. 访问 [腾讯云](https://cloud.tencent.com/)
2. 开通混元大模型服务
3. 获取SecretId和SecretKey

**配置方法：**
```javascript
const apiConfig = {
    apiKey: 'your-secret-id:your-secret-key',
    apiUrl: 'https://hunyuan.tencentcloudapi.com/',
    model: 'hunyuan-lite',
    temperature: 0.7,
    maxTokens: 2000
};
```

### 5. 智谱AI (GLM)

**申请步骤：**
1. 访问 [智谱AI开放平台](https://open.bigmodel.cn/)
2. 注册账号
3. 创建API Key

**配置方法：**
```javascript
const apiConfig = {
    apiKey: 'your-api-key',
    apiUrl: 'https://open.bigmodel.cn/api/paas/v4/chat/completions',
    model: 'glm-4',
    temperature: 0.7,
    maxTokens: 2000
};
```

## 通用配置说明

### API配置参数

- `apiKey`: 你的API密钥
- `apiUrl`: API接口地址
- `model`: 模型名称
- `temperature`: 控制回答的随机性 (0-1)
- `maxTokens`: 最大生成token数

### 安全注意事项

1. **不要将API密钥提交到代码仓库**
2. **建议使用环境变量存储敏感信息**
3. **定期轮换API密钥**
4. **设置API使用限额**

### 环境变量配置（推荐）

创建 `.env` 文件（不要提交到git）：

```env
AI_API_KEY=your-api-key-here
AI_API_URL=your-api-url-here
AI_MODEL=your-model-name
```

然后在JavaScript中读取：

```javascript
const apiConfig = {
    apiKey: process.env.AI_API_KEY || 'YOUR_API_KEY',
    apiUrl: process.env.AI_API_URL || 'YOUR_API_URL',
    model: process.env.AI_MODEL || 'gpt-3.5-turbo',
    temperature: 0.7,
    maxTokens: 2000
};
```

## 功能特性

- ✅ 流式输出：实时显示AI回答
- ✅ Markdown渲染：支持代码高亮、表格、列表等
- ✅ 响应式设计：适配手机和桌面
- ✅ 打字动画：模拟真实对话体验
- ✅ 错误处理：网络异常时友好提示

## 故障排除

### 常见问题

1. **API密钥无效**
   - 检查密钥是否正确复制
   - 确认密钥是否过期
   - 验证API服务是否正常

2. **网络连接失败**
   - 检查网络连接
   - 确认API地址是否正确
   - 检查防火墙设置

3. **CORS跨域问题**
   - 使用代理服务器
   - 配置服务器CORS头
   - 使用JSONP（如果支持）

### 调试方法

1. 打开浏览器开发者工具
2. 查看Console面板的错误信息
3. 检查Network面板的请求状态
4. 确认API响应格式是否正确

## 联系支持

如果遇到问题，请：
1. 查看浏览器控制台错误信息
2. 检查API服务商文档
3. 确认网络连接正常
4. 验证API配置是否正确

---

**注意：** 使用AI服务会产生费用，请根据实际需求选择合适的服务商和模型。
