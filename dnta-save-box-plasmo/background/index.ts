import { Storage } from "@plasmohq/storage"
// import type { PlasmoMessaging } from "@plasmohq/messaging"

const storage = new Storage()
chrome.runtime.onMessage.addListener((message, sender) => {
    const { type, value } = message;
    if (type === 'login' && value) {
        storage.set('token', value)
    }
});

chrome.contextMenus.create({
    id: "worldpack-collector",
    title: "收藏到DNTA",
    contexts: ["all"],
    type: "normal",
    documentUrlPatterns: ["<all_urls>"]
});

chrome.contextMenus.onClicked.addListener((info, tab) => {
    if (info.menuItemId === "worldpack-collector") {
        chrome.tabs.sendMessage(tab.id, { action: 'collection', value: info });
    }
});