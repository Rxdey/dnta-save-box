
const colors = ['#f56c6c', '#ff4301', '#89c9b8', '#a37eba', '#46cdcf', '#f6416c', '#776d8a', '#a35d6a', '#393e46', '#e36387', '#1b6ca8', '#7c3c21', '#45046a'];

const hashCode = (str: string) => {
    let hash = 0;
    if (str.length === 0) {
        return hash;
    }
    for (let i = 0; i < str.length; i++) {
        const char = str.charCodeAt(i);
        hash = ((hash << 5) - hash) + char;
        hash = hash & hash; // Convert to 32bit integer
    }
    return Math.abs(hash) % 11;
};
export const getColor = (i = 0) => colors[hashCode(i.toString())];