
/** 多层级合并对象 */
export const mergeObjects = (obj1, obj2) => {
    const merged = { ...obj2 };
    for (let key in obj1) {
        if (obj1.hasOwnProperty(key)) {
            if (typeof obj1[key] === 'object' && !Array.isArray(obj1[key]) &&
                typeof obj2[key] === 'object' && !Array.isArray(obj2[key])) {
                merged[key] = mergeObjects(obj1[key], obj2[key]);
            } else {
                merged[key] = obj1[key];
            }
        }
    }

    return merged;
};

export const createId = (randomLength = 11) => {
    return Number(Math.random().toString().substring(3, randomLength) + Date.now()).toString(36);
};