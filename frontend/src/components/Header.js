import React from "react";
import Settings from "./Settings";

const Header = ( { handleToggleDarkMode }) => {
    return (
        <div className = "header">
            <h1>Sticky Notions</h1>
            <div>
                <button 
                    onClick = {() => 
                        handleToggleDarkMode(
                            (previousDarkMode) => !previousDarkMode
                        )
                    }
                    className="toggle-mode">
                    Toggle Mode
                </button>
                <button className="settings">
                    <Settings />
                </button>
            </div>
        </div>
    )
}

export default Header;