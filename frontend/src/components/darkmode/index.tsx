import React from "react";
import "./style.css";

function DarkmodeButton() {
  return (
    <main className="content">
      <div className="theme-toggle theme-toggle-js">
        <span className="moon" />
        <span className="sun" />
        <small className="sun__ray" />
        <small className="sun__ray" />
        <small className="sun__ray" />
        <small className="sun__ray" />
        <small className="sun__ray" />
        <small className="sun__ray" />
      </div>
    </main>
  );
}

export default DarkmodeButton;
