import { useState, useRef } from "react";

export default function Privacy() {
  return (
    <>
      <nav className="navbar">
        <div id="priv" className="title"><a href="/home">Come back home</a></div>
      </nav>

      <div className="layout">
        <div className="quadrant">
          <h2>Quick Privacy Policy Disclaimer</h2>
          <p>● Vid To Gif does not store any of your videos or gifs. All processing is done locally in your browser.</p>
          <p>● Videos must have a maximum duration of 3 minutes and they're all automatically reduced to a 10-second-max gif. To guarantee they can be posted on Piffy.</p>
          <p>● Vid To Gif has no affiliation with PI.FYI</p>
        </div>
      </div>
    </>
  );
}
