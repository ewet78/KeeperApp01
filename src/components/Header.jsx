import React from "react";
import HighlightIcon from '@mui/icons-material/Highlight';

function Header({userData}){
    const userName = userData.name;

    function logOut() {
        window.localStorage.clear();
        window.location.href="./";
    }

    return (
        <header>
        <h1><HighlightIcon />Keeper </h1>
        <p id="greeting">Hello, {userName}!</p>
        <button onClick={logOut} id="logout-button">Log Out</button>
        </header>
    );
}

export default Header 