// 获取当前页面的完整URL
const currentUrl = window.location.href;

// 检查当前URL是否包含字符串'115.com'
// 并且检查URL中是否不包含'goto='这个子字符串
if (currentUrl.includes('115.com') && currentUrl.indexOf("goto=")==-1) {
    // 如果上述条件都满足，则执行以下代码块
    
    // 使用chrome.runtime.sendMessage方法向扩展的后台脚本发送消息
    // 第一个参数是一个对象，包含要发送的数据，这里发送的数据包含一个action属性，值为'greet'
    // 第二个参数是一个回调函数，用于处理后台脚本的响应
    chrome.runtime.sendMessage({ action: 'greet' }, response => {
        // 检查是否有错误发生
        if (chrome.runtime.lastError) {
            // 如果有错误，使用console.error输出错误信息
            console.error('消息发送错误:', chrome.runtime.lastError);
        } else {
            // 如果没有错误，使用console.log输出后台脚本的响应
            console.log('收到后台响应:', response);
        }
    });
}
