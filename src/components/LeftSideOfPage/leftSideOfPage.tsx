import React from "react";
import "./leftSideOfPage.css";

const LeftSideOfPage = () => {
  return (
    <div className="wrapper">
      <div className="text-wrapper">
        <span className="welcome">Welcome!</span>
        <span className="BEI">Brain Exercise Initiative</span>
      </div>
      <img className="BEI-image" src="/assets/bei_edited.png" alt="BEI Image" />
    </div>
  );
};

export default LeftSideOfPage;
