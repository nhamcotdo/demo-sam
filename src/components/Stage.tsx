// Copyright (c) Meta Platforms, Inc. and affiliates.
// All rights reserved.

// This source code is licensed under the license found in the
// LICENSE file in the root directory of this source tree.

import React, { useContext, useState } from "react";
import * as _ from "underscore";
import Tool from "./Tool";
import { modelInputProps } from "./helpers/Interfaces";
import AppContext from "./hooks/createContext";

const Stage = () => {
  const {
    clicks: [clicks, setClicks],
    image: [image],
  } = useContext(AppContext)!;
  const [a, setA] = useState<modelInputProps[]>([]);
  const [b, setB] = useState<modelInputProps[]>([]);
  const getClick = (x: number, y: number, clickType: number = 1): modelInputProps => {
    return { x, y, clickType };
  };

  // Get mouse position and scale the (x, y) coordinates back to the natural
  // scale of the image. Update the state of clicks with setClicks to trigger
  // the ONNX model to run and generate a new mask via a useEffect in App.tsx
  // if is left click, clickType = 1 else clickType = 0
  // append click to clicks
  const handleMouseMove = _.throttle((e: any) => {
    let el = e.nativeEvent.target;
    const rect = el.getBoundingClientRect();
    let x = e.clientX - rect.left;
    let y = e.clientY - rect.top;
    const imageScale = image ? image.width / el.offsetWidth : 1;
    const clickb = getClick(e.clientX, e.clientY);
    x *= imageScale;
    y *= imageScale;
    const click = getClick(x, y);
    if (e.ctrlKey){
        click.clickType = 0;
        clickb.clickType = 0;
    }
    setB([...b, clickb]);
    setA([...a, click]);
    if (click) setClicks(a);
  }, 15);

  const renderPoints = () => {
    return b.map((point, index) => (
      <div
        key={index}
        style={{
          position: 'absolute',
          left: point.x,
          top: point.y,
          width: '10px', // adjust as needed
          height: '10px', // adjust as needed
          background: point.clickType === 1 ? 'blue' : 'red', // choose colors for different click types
          borderRadius: '50%',
        }}
      ></div>
    ));
  };
  
  const flexCenterClasses = "flex items-center justify-center";
  return (
    <div className={`${flexCenterClasses} w-full h-full`}>
        <Tool handleMouseMove={handleMouseMove} />
        {renderPoints()}
    </div>
  );
};

export default Stage;
