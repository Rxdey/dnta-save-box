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

// 距离当前时间
export const getTimeAgo = (date = '') => {
    if (!date) return '';
    if (typeof date === 'string') date = new Date(date);
    const minute = 60 * 1000;
    const hour = minute * 60;
    const day = hour * 24;
    const month = day * 30;
    const year = day * 365;

    const timeElapsed = Date.now() - date.getTime();

    if (timeElapsed < minute) {
        return '刚刚';
    } else if (timeElapsed < hour) {
        const minutes = Math.floor(timeElapsed / minute);
        return `${minutes} 分钟前`;
    } else if (timeElapsed < day) {
        const hours = Math.floor(timeElapsed / hour);
        return `${hours} 小时前`;
    } else if (timeElapsed < month) {
        const days = Math.floor(timeElapsed / day);
        return `${days} 天前`;
    } else if (timeElapsed < year) {
        const months = Math.floor(timeElapsed / month);
        return `${months} 个月前`;
    } else {
        const years = Math.floor(timeElapsed / year);
        return `${years} 年前`;
    }
};

export const extractDomain = (url) => {
    let domain = '';
    try {
        const parsedURL = new window.URL(url);
        domain = parsedURL.hostname;
    } catch (error) {
        console.error('Invalid URL:', error);
    }
    return domain;
};