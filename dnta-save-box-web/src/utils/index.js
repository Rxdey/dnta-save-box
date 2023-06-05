export function scrollToTop(position = 0) {
    window.scrollTo({ top: position, behavior: 'smooth' });
}

// 复制指定文本
export const copyToClipboard = (txt, cb = () => { }) => {
    const node = document.createElement('textarea');
    node.value = txt;
    node.class = 'copy-txt';
    document.body.appendChild(node);
    node.select();
    document.execCommand('Copy');
    document.body.removeChild(node);
    cb();
};

// storage
export const customStorage = {
    setItem(key, val) {
        window.localStorage.setItem(key, typeof val === 'object' ? JSON.stringify(val) : val);
    },
    getItem(key) {
        let val;
        try {
            val = JSON.parse(window.localStorage.getItem(key));
        } catch (e) {
            val = window.localStorage.getItem(key);
        }
        return val;
    }
};