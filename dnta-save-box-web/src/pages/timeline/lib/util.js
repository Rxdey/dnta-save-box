import { fabric } from 'fabric';

/** 时间格式化 */
export function formatTime(milliseconds) {
  const totalSeconds = Math.floor(milliseconds / 1000);
  const hours = Math.floor(totalSeconds / 3600);
  const minutes = Math.floor((totalSeconds % 3600) / 60);
  const seconds = totalSeconds % 60;
  const ms = milliseconds % 1000;

  let formattedTime = [
    hours.toString().padStart(2, '0'),
    minutes.toString().padStart(2, '0'),
    seconds.toString().padStart(2, '0')
  ].join(':');

  if (ms > 0) {
    formattedTime += `.${ms.toString().padStart(3, '0')}`;
  }

  return formattedTime;
}
/** 获取传入时间的默认比例 */
export function getDefaultLevel(time, zoom) {
  if (!time) return 0;
  const index = zoom.findIndex(item => (time / 20) <= item);
  if (!index) return zoom.length - 1;
  if (index === 0) return 0;
  return index - 1;
}

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

export const draw = {
  ract: (x, y, width, height, color = '#fff', selectable = false, hoverCursor = 'default') => {
    return new fabric.Rect({
      top: y, // 距离容器顶部 30px
      left: x, // 距离容器左侧 30px
      width: width, // 宽 100px
      height: height, // 高 60px
      fill: color, // 填充 红色
      selectable: selectable,
      hoverCursor
    });
  },
  line: (x, y, x2, y2, color = '#fff', selectable = false, hoverCursor = 'default') => {
    return new fabric.Line([
      x, y, // 起始点坐标
      x2, y2 // 结束点坐标
    ],
      {
        stroke: color, // 笔触颜色
        selectable: selectable,
        hoverCursor
      });
  },
  text: (str, x, y, color = '#fff', size = 11, selectable = false, hoverCursor = 'default') => {
    return new fabric.Text(str, {
      top: y,
      left: x,
      fontSize: parseInt(size),
      fill: color,
      padding: 0,
      selectable: selectable,
      hoverCursor
    });
  }
};