export const menus = [
    {
        name: '我的收藏',
        id: 'all',
        url: '/home/collect/all',
        edit: false,
        drag: false,
        children: [
            {
                name: '未分类', id: 0, icon: 'mdi:tag-outline', url: '/home/collect/0', edit: false,
                drag: false,
            }
        ],
    },
    { name: '回收站', id: 'recovery', icon: 'mdi:delete-sweep', url: '/home/collect/recovery', edit: false, drag: false },
    { name: '视频', id: 'video', icon: 'mdi:video-check', url: '/home/collect/video', edit: false, drag: false },
    { name: '上传', id: 'upload', icon: 'ic:round-drive-folder-upload', url: '/home/upload', edit: false, drag: false },
    { name: '转换', id: 'convert', icon: 'mdi:image-move', url: '/home/convert', edit: false, drag: false },
];


