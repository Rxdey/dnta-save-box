import type { PlasmoCSConfig } from "plasmo"

export const config: PlasmoCSConfig = {
    matches: ["<all_urls>"],
}

window.addEventListener('message', function (event) {
    const { type, action, token } = event.data;
    if (type === 'worldpack') {
        if (action === 'login') {
            console.log('login')
            chrome.runtime.sendMessage({ value: token, type: 'login' });
        }
    }
});