import { useEffect, useState } from "react"
import { Storage } from "@plasmohq/storage"
import { PAGE } from "~service/api.config";
import './index.less'

const storage = new Storage()
function IndexPopup() {
    const [status, setStatus] = useState(false);

    const checkStatus = async () => {
        const res = await storage.get('token');
        setStatus(!!res);
    };

    useEffect(() => {
        chrome.runtime.onMessage.addListener((message, sender) => {
            const { type, value } = message;
            // 登录
            if (type === 'login' && value) {
                setStatus(true);
            }
        });
        checkStatus();
    }, []);

    return (
        <div className="popup">
            <p>状态：<span className={status ? 'color-green' : 'color-red'}>{status ? '已登录' : '未登录'}</span></p>
            <p className="link" onClick={() => {
                window.open(`${PAGE}`, '_brank')
            }}>查看收藏</p>
        </div>
    )
}

export default IndexPopup
