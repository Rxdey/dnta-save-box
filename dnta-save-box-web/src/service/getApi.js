import axios from 'axios';
import fs from 'fs';
import path from 'path';

const template = ({ method, url, title, funName }) => `

/**
 * ${title}-接口
 */
export const ${funName}Use${method} = (params) => request({
    url: '${url}',
    method: '${method}'
}, params);
`;
const writeFile = list => {
    let str = '';
    list.forEach(item => {
        const { path: url } = item;
        const funName = url.split('/').map(v => {
            if (v) v = v.charAt(0).toUpperCase() + v.slice(1);
            return v;
        }).join('');
        str += template({ ...item, funName, url });
    });
    return str;
};
const getApiList = async () => {
    const res = await axios.get('http://yapi.smart-xwork.cn/api/interface/list?page=1&limit=20&project_id=252335', {
        headers: {
            Cookie: 'Hm_lvt_810592944f2f8014e1cb9a46bef65a6c=1685000686; _yapi_token=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1aWQiOjMxNDUzNiwiaWF0IjoxNjg1MDAwOTQ5LCJleHAiOjE2ODU2MDU3NDl9.mMu4s9Iu0Cawiz_AnjSuGv6lTQn4ef1B-qJS5vSDj9Q; _yapi_uid=314536; Hm_lpvt_810592944f2f8014e1cb9a46bef65a6c=1685003413'
        }
    });
    if (res && res.data) {
        const str = writeFile(res.data.data.list);
        // console.log(str);
        fs.writeFileSync(path.resolve('./src/service/model/api.js'), str, { encoding: 'utf-8'});

    }
};

getApiList();
