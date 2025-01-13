// 定义一个包含网站信息的数组
const domain = [
    {
        'url': 'https://115.com', // 网站的URL
        'domain': '.115.com' // 网站的域名，用于设置cookie
    },
    {
        'url': 'https://anxia.com', // 另一个网站的URL
        'domain': '.anxia.com' // 另一个网站的域名，用于设置cookie
    }
];

// 定义一个新的cookie对象
const newC = {
    url: 'https://115.com', // 设置cookie的URL
    name: '', // cookie的名称
    value: '', // cookie的值
    domain: '.115.com', // cookie的域名
    expirationDate: 253402300799, // cookie的过期时间
    path: '/' // cookie的路径
};

// 用于标记cookie是否过期的变量
let isExpired = false;

// 定义一个设置cookie的函数，返回一个Promise对象
function setCookie(newC) {
    return new Promise((resolve, reject) => {
        // 使用chrome.cookies.set方法设置cookie
        chrome.cookies.set(newC, cookie => {
            // 如果设置过程中出现错误，reject这个Promise
            if (chrome.runtime.lastError) {
                reject(chrome.runtime.lastError);
            }
            // 如果设置的cookie不存在，reject这个Promise
            else if (!cookie) {
                reject(new Error('This cookie is deleted (expired)'));
            }
            // 否则，resolve这个Promise，并返回设置的cookie
            else {
                resolve(cookie);
            }
        });
    });
}

// 定义一个应用cookie的函数
function applayCookie(){
    // 遍历domain数组中的每个网站信息
    for (let i = 0; i < domain.length; i++) {
        newC['url'] = domain[i]['url']; // 更新cookie的URL
        // 如果CID存在，设置CID的cookie
        if (CID.length > 0){
            newC['domain'] = domain[i]['domain'];
            newC['name'] = 'CID';
            newC['value'] = CID;
            setCookie(newC);
        }
        // 如果SEID存在，设置SEID的cookie
        if (SEID.length > 0){
            newC['name'] = 'SEID';
            newC['value'] = SEID;
            setCookie(newC);
        }
        // 如果UID存在，设置UID的cookie
        if (UID.length > 0){
            newC['name'] = 'UID';
            newC['value'] = UID;
            setCookie(newC);
        }
        // 如果KID存在，设置KID的cookie
        if (KID.length > 0){
            newC['name'] = 'KID';
            newC['value'] = KID;
            setCookie(newC);
        }
    }
}

// 监听来自其他脚本的消息
chrome.runtime.onMessage.addListener((message, sender, sendResponse) => {
    // 如果收到的消息动作是'greet'
    if (message.action === 'greet') {
        // 如果cookie没有过期，应用cookie
        if(!isExpired){
            applayCookie();
        }
        // 发送一个请求到'https://115.com/?ct=offline&ac=space'
        fetch('https://115.com/?ct=offline&ac=space').then(response => {
            // 如果响应被重定向，说明cookie可能过期
            if (response.redirected) {
                sendResponse('offline');
                isExpired = true;
            }
        });
    }
    // 返回true以表示异步使用sendResponse
    return true;
});
