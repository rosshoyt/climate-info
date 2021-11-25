import React, { useEffect } from 'react'
import IconButton from '@material-ui/core/IconButton';
import Brightness4Icon from '@material-ui/icons/Brightness4';
import Brightness7Icon from '@material-ui/icons/Brightness7';

export default function DarkModeSwitch({ darkMode, setDarkMode}) {

  useEffect(() => {
    console.log('Repainting DarkModeSwitch, darkMode = ', darkMode);
  }, [darkMode]);

  const handleClick = () => {
    console.log('clicked, darkMode =', darkMode)
    setDarkMode(!darkMode);
  }

  return (
    <IconButton onClick={handleClick}>
      { darkMode ? (
          <Brightness7Icon />
      ): (
          <Brightness4Icon />
      )} 
    </IconButton>
  );
}