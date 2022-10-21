import React from "react";
import { Tab } from "../../pages/Recommend";

import Tap from "./Tab";

interface SideComponentProps {
  tabs: Tab[];
  selectedTap: number;
  onTabClick: React.MouseEventHandler<HTMLDivElement>;
}

function SideComponent({ tabs, selectedTap, onTabClick }: SideComponentProps) {
  return (
    <>
      {tabs.map((tab, idx) => (
        <Tap
          key={tab.id}
          id={tab.id}
          label={tab.label}
          isSelected={idx === selectedTap}
          onTabClick={onTabClick}
        />
      ))}
    </>
  );
}

export default SideComponent;
