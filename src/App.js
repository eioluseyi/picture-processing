import { useCallback, useEffect, useRef, useState } from "react";
import "./styles.css";
import imgSrc from "./opec.jpg";

const splitArrayIntoChunksOfLen = (arr, len) => {
  var chunks = [],
    i = 0,
    j = 0,
    n = arr.length;
  while (i < n && j < 100) {
    j++;
    chunks.push(arr.slice(i, (i += len)));
  }
  return chunks;
};

const Devon = ({ x, y, dataList: d }) => {
  return (
    <div
      style={{
        width: "10px",
        height: "10px",
        fontSize: "10px",
        backgroundColor: `rgba(${d[0]}, ${d[1]}, ${d[2]}, ${d[3]})`
      }}
    >
      X
    </div>
  );
};

export default function App() {
  const [size, setSize] = useState([0, 0]);
  const [diviate, setDiviate] = useState([]);

  const canv = useRef(null);

  const reRenderImage = useCallback(
    (imgArray) => {
      const dataList = splitArrayIntoChunksOfLen(
        splitArrayIntoChunksOfLen(imgArray, 4),
        size[0]
      );

      for (let y = 0; y < dataList.length; y++) {
        for (let x = 0; x < dataList[y].length; x++) {
          setDiviate([
            ...diviate,
            <Devon y={y} x={x} dataList={dataList[y][x]} />
          ]);
        }
      }
    },
    [diviate, size]
  );

  useEffect(() => {
    const context = canv.current.getContext("2d");

    const imageObj = new Image();
    imageObj.src = imgSrc;

    imageObj.onload = function () {
      imageObj.crossOrigin = "Anonymous";

      if (!imageObj.width) return;

      setSize([imageObj.width, imageObj.height]);

      context.drawImage(imageObj, 0, 0);
      let imageData = context.getImageData(
        0,
        0,
        imageObj.width,
        imageObj.height
      );
      reRenderImage(imageData.data);
    };

    return imageObj;
  }, [reRenderImage]);

  // useEffect(() => console.log(diviate), [diviate]);

  return (
    <div className="App">
      <h1>Run!!!</h1>
      <div>
        <canvas ref={canv} width="500" height="500"></canvas>
      </div>
      <h1>Render!!!</h1>
      <div style={{ marginBottom: "100px" }}>
        <div>Start</div>
        {diviate.map((deev) => deev)}
        <div>End</div>
      </div>
    </div>
  );
}
