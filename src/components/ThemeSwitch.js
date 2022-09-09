import React, { useContext } from 'react';
import { DarkModeContext } from '../providers/DarkModeProvider';
import { Switch } from "antd"

function ThemeSwitch() {
    const { darkMode, toggleDarkMode } = useContext(DarkModeContext);
    const handleClick = () => {
        toggleDarkMode();
    }


    return (
        <Switch defaultChecked={darkMode} onChange={handleClick} />
    )
}

// Light Switch design by Jeremy Loyd, US - Public Domain
export default ThemeSwitch