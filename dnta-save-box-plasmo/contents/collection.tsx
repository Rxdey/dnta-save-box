import createCache from "@emotion/cache"
import { CacheProvider } from "@emotion/react"
import AddCircleTwoToneIcon from "@mui/icons-material/AddCircleTwoTone"
import CatchingPokemonOutlinedIcon from "@mui/icons-material/CatchingPokemonOutlined"
import CheckCircleOutlineIcon from "@mui/icons-material/CheckCircleOutline"
import CheckOutlinedIcon from "@mui/icons-material/CheckOutlined"
import HighlightOffIcon from "@mui/icons-material/HighlightOff"
import {
    Button,
    CircularProgress,
} from "@mui/material"
import type { PlasmoCSConfig } from "plasmo"
import { useEffect, useState } from "react"

import {
    AddTagWrap,
    ButtonWrap,
    Container,
    IconBtnWrap,
    LoadingMask,
    StatusBar,
    TagItem,
    TagWrap,
    Text,
    Wrap
} from "~components"
import Field from "~components/Field"
import Server from "~service/model"
import type { FavoriteData } from "~service/model/favorite"
import type { TagAllResponse } from "~service/model/tag"

// import { getColor } from "~util"


export const config: PlasmoCSConfig = {
    matches: ["<all_urls>"],
    all_frames: true
}

const styleElement = document.createElement("style")
const styleCache = createCache({
    key: "world-pack-mui-cache",
    prepend: true,
    container: styleElement
})

export const getStyle = () => styleElement

export const getShadowHostId = () => "world-pack-collection"

type LoadStatus = {
    status?: "loading" | "success" | "error" | ""
    msg?: string
}

type ContentData = {
    editable: boolean
    frameId: number
    menuItemId: string
    /**页面地址 */
    pageUrl: string
    /**选中文本 */
    selectionText?: string
    /**媒体类型 */
    mediaType?: string
    /**媒体地址 */
    srcUrl?: string
}

let st = null
const dely = 3000;
function Collection() {
    const [showPage, setShowPage] = useState(false)
    const [isDel, setIsDel] = useState(false)
    const [loadSatus, setLoadSatus] = useState<LoadStatus>({})
    const [tagList, setTagList] = useState<TagAllResponse[]>([])
    const [active, setActive] = useState(0)
    const [showAddTag, setShowAddTag] = useState(false)
    const [addTagValue, setAddTagValue] = useState("")
    const [foucs, setFoucs] = useState(false)

    const [form, setForm] = useState<FavoriteData>({
        title: "",
        desc_txt: ""
    })

    // const { enqueueSnackbar } = useSnackbar()

    // 保存/更新收藏
    const onSave = async (params: FavoriteData) => {
        // 加载中不允许操作
        if (loadSatus.status === "loading") return
        if (!params && !params.id) {
            // console.log(params)
            setLoadSatus({ status: "error", msg: "数据异常" })
            return
        }
        setLoadSatus({ status: "loading", msg: "请稍后..." })
        const res = await Server.favoriteSave(params)
        const { success, data, msg, state } = res
        if (!success || !state) {
            setLoadSatus({ status: "error", msg: msg || "操作失败" })
            return
        }
        changeValue("id", params.id ? params.id : data)
        const action = {
            img: '图片',
            text: '文本',
            url: '网页'
        };
        setLoadSatus({ status: "success", msg: `${action[params.type] || ''} 收藏成功！` })
    }
    // 获取标签然后存储
    const getTags = async (params: FavoriteData) => {
        setLoadSatus({ status: "loading", msg: "正在加载..." })
        const res = await Server.TagAll()
        const { success, data, msg } = res
        if (!success) {
            setLoadSatus({ status: "error", msg: msg || "操作失败" })
            return
        }
        setTagList(data)
        // 初次存储
        await onSave({
            ...params,
            tid: data.length ? data[0].id : null
        })
    }
    // 更新收藏Active
    const onChangeActive = (i: number) => {
        // 加载中不允许操作
        if (loadSatus.status === "loading") return
        setActive(i)
        const select = tagList[i]
        if (!form.id) {
            setLoadSatus({ status: "error", msg: "条目异常" })
            return
        }
        onSave({
            tid: select.id,
            id: form.id
        })
    }
    // 删除收藏
    const onDel = async (id: number | string) => {
        if (!id) {
            setLoadSatus({ status: "error", msg: "删除的数据不存在" })
            return
        }
        setLoadSatus({ status: "loading", msg: "请稍后..." })
        const res = await Server.favoriteDel({ id })
        const { success, data, msg } = res
        if (!success) {
            setLoadSatus({ status: "error", msg: msg || "操作失败" })
            return
        }
        setLoadSatus({ status: "success", msg: "已删除" })
        setIsDel(true)
        setTimeout(() => {
            setShowPage(false)
        }, 1000)
    }
    // 增加标签
    const onAddTag = async () => {
        if (!addTagValue) return
        const res = await Server.addTag({
            name: addTagValue
        })
        const { success, data, msg } = res
        if (!success) {
            setLoadSatus({ status: "error", msg: msg || "操作失败" })
            return
        }
        setLoadSatus({ status: "success", msg: "添加成功" })

        setTagList((list) => [...list, { id: data, name: addTagValue }])
        setShowAddTag(false)
        setAddTagValue("")
    }
    const changeValue = (key: string, value: string | number) => {
        setForm((data) => ({
            ...data,
            [key]: value
        }))
    }

    const resetContent = () => {
        setActive(0);
        setForm({
            title: "",
            desc_txt: ""
        });
        setShowPage(false)
    }

    useEffect(() => {
        chrome.runtime.onMessage.addListener(
            (message: { action: string; value: ContentData }) => {
                const { action, value } = message
                if (action === "collection") {
                    // console.log("收藏！", message)
                    // 默认收藏网页
                    let params: FavoriteData = {
                        title: document.title,
                        origin: value.pageUrl,
                        content: value.pageUrl,
                        type: "url",
                        desc_txt: ""
                    }
                    // 文本类型
                    if (value.selectionText) {
                        params.type = "text"
                        params.title = value.selectionText
                        params.content = value.selectionText
                    }
                    // 文本类型
                    if (value.mediaType === "image") {
                        params.type = "img"
                        params.title = value.srcUrl
                        params.content = value.srcUrl
                    }
                    // console.log(window.location.href);
                    if (window.location.href !== value.pageUrl) return;
                    // 如果上一个页面未关闭,移除计时器
                    if (showPage) {
                        setActive(0);
                        clearTimeout(st);
                    }
                    setForm(params)
                    setShowPage(true)
                    setIsDel(false)
                    getTags(params).then(() => {
                        st = setTimeout(resetContent, dely);
                    })
                }
            }
        )
    }, [])

    useEffect(() => {
        // console.log('foucs', showPage && !foucs);
        if (showPage && !foucs) {
            st = setTimeout(resetContent, dely);
        } else {
            clearTimeout(st)
        }
    }, [foucs])

    const LoadingStatus = ({ msg = "WORLD PACK", status = "" }: LoadStatus) => (
        <>
            {status === "loading" && <CircularProgress size={24} />}
            {status === "success" && (
                <CheckCircleOutlineIcon sx={{ fontSize: 24, color: "#fff" }} />
            )}
            {status === "error" && (
                <HighlightOffIcon sx={{ fontSize: 24, color: "#fff" }} />
            )}
            {status === "" && <CatchingPokemonOutlinedIcon />}
            <Wrap left="12px">{msg}</Wrap>
        </>
    )

    return (
        <CacheProvider value={styleCache}>
                {showPage ? (
                    <Container
                        onMouseOver={(e) => {
                            setFoucs(true)
                        }}
                        onMouseOut={(e) => {
                            setFoucs(false)
                        }}
                        onMouseLeave={() => {
                            setFoucs(false)
                        }}>
                        {loadSatus.status === "loading" && <LoadingMask></LoadingMask>}
                        <StatusBar>
                            <LoadingStatus {...loadSatus} />
                        </StatusBar>
                        {isDel ? (
                            <></>
                        ) : (
                            <>
                                <Wrap padding="0 16px" top="8px">
                                    <Text bottom="8px">添加至:</Text>
                                    <TagWrap>
                                        {tagList.map((item, i) => (
                                            <TagItem
                                                key={item.id}
                                                active={active === i}
                                                onClick={() => {
                                                    onChangeActive(i)
                                                }}>
                                                {item.name}
                                            </TagItem>
                                        ))}
                                        {showAddTag ? (
                                            <AddTagWrap>
                                                <Field
                                                    variant="standard"
                                                    value={addTagValue}
                                                    maxLength="16"
                                                    onChange={(e) => {
                                                        setAddTagValue(e.target.value)
                                                    }}
                                                    onIconClick={onAddTag}
                                                    currentIcon={
                                                        <CheckOutlinedIcon sx={{ color: "#08d8ed" }} />
                                                    }
                                                />
                                            </AddTagWrap>
                                        ) : (
                                            <IconBtnWrap
                                                onClick={() => {
                                                    setShowAddTag(true)
                                                }}>
                                                <AddCircleTwoToneIcon sx={{ color: "#fff" }} />
                                            </IconBtnWrap>
                                        )}
                                    </TagWrap>
                                </Wrap>
                                <Wrap padding="8px 16px" bottom="16px">
                                    <Field
                                        label="标题"
                                        variant="standard"
                                        value={form.title}
                                        onChange={(e) => {
                                            changeValue("title", e.target.value)
                                        }}
                                        onIconClick={() => {
                                            onSave(form)
                                        }}
                                    />
                                    <Field
                                        label="点击添加描述"
                                        variant="standard"
                                        value={form.desc_txt}
                                        onChange={(e) => {
                                            changeValue("desc_txt", e.target.value)
                                        }}
                                        onIconClick={() => {
                                            onSave(form)
                                        }}
                                    />
                                </Wrap>
                                <ButtonWrap padding="0 16px">
                                    <Button
                                        color="error"
                                        onClick={() => {
                                            onDel(form.id)
                                        }}>
                                        删除
                                    </Button>
                                    <Button color="secondary">查看</Button>
                                </ButtonWrap>
                            </>
                        )}
                    </Container>
                ) : null}
        </CacheProvider>
    )
}

export default Collection
