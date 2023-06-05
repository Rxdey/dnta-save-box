import { useState } from "react"
import { CustomTextField } from "~components"
import { InputAdornment, IconButton, CircularProgress } from "@mui/material"
import CheckCircleTwoToneIcon from '@mui/icons-material/CheckCircleTwoTone';

type Props = {
    onIconClick?: () => void
    currentIcon?: any
    [key: string]: any
}


const Field = ({ onIconClick, currentIcon, ...props }: Props) => {
    const [showIcon, setShowIcon] = useState(false);
    // const [loading, setLoading] = useState(false);


    return <CustomTextField
        onFocus={() => {
            setShowIcon(true)
        }}
        onBlur={() => {
            setTimeout(() => {
                setShowIcon(false)
            }, 200);
        }}
        InputProps={{
            endAdornment: (
                <InputAdornment position="end">
                    {(showIcon) ? <IconButton
                        onClick={() => {
                            onIconClick();
                        }}
                        edge="end"
                    >
                        {currentIcon ? currentIcon : <CheckCircleTwoToneIcon sx={{ color: '#08d8ed' }} />}
                    </IconButton> : null}
                </InputAdornment>
            ),
        }}
        {...props}
    />
}

export default Field;