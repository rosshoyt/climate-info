import React from 'react'
import IconButton from '@material-ui/core/IconButton';
import Brightness4Icon from '@material-ui/icons/Brightness4';
import Brightness7Icon from '@material-ui/icons/Brightness7';

export default function DarkModeSwitch({ darkMode, setDarkMode}) {
  const handleClick = () => {
    setDarkMode(!darkMode);
  }

  return (
    <>
    { darkMode ? (
        <IconButton onClick={handleClick}>
          <Brightness4Icon />
        </IconButton>
      ): (
        <IconButton onClick={handleClick}>
          <Brightness7Icon />
        </IconButton>
      )} 
    </>
  );
}