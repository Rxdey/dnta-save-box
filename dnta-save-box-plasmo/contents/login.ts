import type { PlasmoCSConfig } from "plasmo"

export const config: PlasmoCSConfig = {
    matches: ["http://10.255.74.163:7888/*"],
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