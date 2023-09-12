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
    },
    remove(key) {
        if (typeof key === 'string') {
            window.localStorage.removeItem(key);
            return;
        }
        if (Object.prototype.toString.call(key) === '[object Array]') {
            key.forEach(item => {
                window.localStorage.removeItem(item);
            });
        }

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
    let parsedURL = {};
    try {
        parsedURL = new window.URL(url);
    } catch (error) {
        console.error('Invalid URL:', error);
    }
    return parsedURL;
};


export const uniqueArray = (array = []) => Array.from(new Set(array.map(obj => obj.id))).map(id => {
    return array.find(obj => obj.id === id);
});


export function hasClass(element, classname) {
    return new RegExp('(^| )' + classname + '( |$)', 'gi').test(element.className);
};
// 移动元素
export function moveObjectElement(array, elementId, targetId, position) {
    const elementIndex = array.findIndex(obj => obj.id === elementId);
    const targetIndex = array.findIndex(obj => obj.id === targetId);
    console.log(targetIndex);
    if (elementIndex === -1 || targetIndex === -1) {
        // 检查元素和目标是否存在于数组中
        console.log("元素或目标不存在于数组中");
        return array;
    }

    const element = array[elementIndex];
    array.splice(elementIndex, 1); // 先将元素从数组中删除

    if (position === "left") {
        // 将元素放置到目标之前
        const insertionIndex = elementIndex < targetIndex ? targetIndex - 1 : targetIndex;
        array.splice(insertionIndex, 0, element);
    } else if (position === "right") {
        // 将元素放置到目标之后
        const insertionIndex = elementIndex < targetIndex ? targetIndex : targetIndex + 1;
        array.splice(insertionIndex, 0, element);
    } else {
        console.log("无效的位置参数");
        return array;
    }

    return array;
}

export const downLoadFile = (href = '', fileName = '') => {
    if (!href) return;
    const a = document.createElement('a');
    a.href = href;
    a.download = fileName;
    a.click();
}