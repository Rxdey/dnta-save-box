import{r as a}from"./index-481bb3df.js";const u=(t=()=>{})=>{const r=a(!1);return{uploadLoading:r,onDrop:e=>{e.preventDefault(),e.target.toggleAttribute("over",!1),!r.value&&t(e.dataTransfer.files)},onDragleave:e=>{e.preventDefault(),e.target.toggleAttribute("over",!1)},onDragenter:e=>{e.preventDefault(),e.target.toggleAttribute("over",!0)},onFileChange:e=>{t(e.target.files)}}};export{u};
