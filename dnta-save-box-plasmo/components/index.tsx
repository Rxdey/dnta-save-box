import styled from "@emotion/styled"
import { TextField } from '@mui/material'

export const BorderStyle = styled.div`
    border: 1px solid #08d8ed;
    box-shadow: 0px 0px 2px #08d8ed;
    background: #fff;
    position: relative;
    transform-style: preserve-3d;
    pointer-events: auto;
    &::after,
    &::before {
        content: '';
        position: absolute;
        width: 70%;
        height: 70%;
        background-color: #08d8ed;
        transform: translateZ(-10px);
        box-shadow: 0px 0px 2px #08d8ed;
        pointer-events: none;
    }
    &::after {
        left: -5px;
        top: -5px;
        box-shadow: 0px 0px 2px #f101eb;
    }
    &::before {
        bottom: -5px;
        right: -5px;
        background-color: #f101eb;
    }
    `
export const BorderShadow = styled(BorderStyle)`
    &::after {
        width: 100%;
        height: 100%;
        left: 4px;
        top: 4px;
    }
    &::before {
        content: none;
    }
    `


export const Container = styled(BorderStyle)`
    width: 340px;
    background-color: #260d2a;
    position: fixed;
    right: 14px;
    top: 14px;
    font-size: 14px;
    color: #fff;
    z-index: 99999999;
    svg {
        font-size: inherit!important;
    }
    .MuiButtonBase-root {
        font-size: inherit!important;
    }
    `.withComponent('main')

export const LoadingMask = styled.div`
    width: 100%;
    height: 100%;
    position: absolute;
    top: 0;
    left: 0;
    background-color: transparent;
    /* background-color: #000; */
    z-index: 10;
    `
export const StatusBar = styled.div`
    background-color: #f101eb;
    color: #fff;
    font-size: 18px;
    font-weight: bold;
    padding: 16px;
    display: flex;
    flex-flow: row;
    align-items: center;
    `
export const Wrap = styled.div((props: {
    left?: string,
    right?: string,
    top?: string,
    bottom?: string,
    padding?: string,
}) => ({
    marginLeft: props.left || '',
    marginRight: props.right || '',
    marginTop: props.top || '',
    marginBottom: props.bottom || '',
    padding: props.padding || ''
}))
export const Text = styled.div((props: {
    color?: string,
    size?: string,
    bottom?: string
}) => ({
    color: props.color || 'inherit',
    fontSize: props.size || '',
    marginBottom: props.bottom || 0
}))


export const TagWrap = styled.div`
    display: flex;
    flex-flow: row wrap;
    `
export const TagItem = styled(BorderShadow)`
    position: relative;
    font-size: 14px;
    padding: 2px 12px;
    font-weight: bold;
    color: ${(props: { active?: boolean, color?: string }) => props.active ? '#fff' : '#260d2a'};
    background-color: ${(props) => props.active ? '#f101eb' : ''};
    margin: 0 12px 12px 0;
    cursor: pointer;
    transition: all 0.3s;
    z-index: 10;
    &::after {
        background-color: ${(props) => props.active ? '#fff' : '#f101eb'};
    }
    &:hover {
        color: #fff;
        background-color: #f101eb;
        &::after {
            background-color: #fff;
        }
    }
    `

export const CustomTextField = styled(TextField)`
    width: 100%;
    & {
        input {
            color: #fff;
            font-size: 14px;
        }
        label {
            color: #f101eb;
            font-size: 14px;
        }
        label[data-shrink="true"] {
            transform: translate(0, 3px) scale(0.9);
        }
        label.Mui-focused {
            color: #08d8ed;
        }
        .MuiInput-underline:after {
            border-bottom-color: #08d8ed;
        }
        .MuiInput-root:before, .MuiInputBase-root:hover:not(.Mui-disabled, .Mui-error):before {
            border-bottom-color: #f101eb!important;
        }
        .MuiButtonBase-root, svg {
            font-size: inherit!important;
        }
        svg {
            width: 20px!important;
            height: 20px!important;
        }
    }
`

export const ButtonWrap = styled(Wrap)`
    display: flex;
    flex-flow: row nowrap;
    justify-content: space-between;
    `

export const IconBtnWrap = styled.div`
    cursor: pointer;
    font-size: 0;
    `
export const AddTagWrap = styled.div`
    width: 80px;
    font-size: 12px;
    `