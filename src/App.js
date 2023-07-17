import { useCallback, useEffect, useRef, useState } from "react";
import "./styles.css";
import imgSrc from "./opec.jpg";
// import imgSrc from "./heart.jpeg";

const splitArrayIntoChunksOfLen = (arr, len) => {
  var chunks = [],
    i = 0,
    j = 0,
    n = arr.length;
  while (i < n && j < 100) {
    // j++;
    chunks.push(arr.slice(i, (i += len)));
  }
  return chunks;
};

const PixelBox = ({ x, y, dataList: d }) => {
  return (
    <div
      style={{
        width: "1px",
        height: "1px",
        fontSize: "10px",
        backgroundColor: `rgba(${d[0]}, ${d[1]}, ${d[2]}, ${d[3]})`,
      }}
    ></div>
  );
};

const RowArray = ({ y, value }) => {
  return (
    <div style={{ display: "flex" }}>
      {value.map((itm, idx) => (
        <PixelBox key={idx} x={idx} y={y} dataList={itm} />
      ))}
    </div>
  );
};

function rgbaToHex(rgba) {
  // Split the RGBA value into its red, green, blue, and alpha components
  const [r, g, b, a] = rgba;
  // rgba
  //   .substring(rgba.indexOf("(") + 1, rgba.lastIndexOf(")"))
  //   .split(",");
  // const r = parseInt(parts[0], 10);
  // const g = parseInt(parts[1], 10);
  // const b = parseInt(parts[2], 10);
  // const a = parseFloat(parts[3]);

  // Convert the red, green, and blue components to hexadecimal values
  const hex = "" + ((1 << 24) + (r << 16) + (g << 8) + b).toString(16).slice(1);

  // Return the hexadecimal value with the alpha component as an additional CSS function
  return `${hex}`; // ${a.toString(16)}
}

export default function App() {
  const [verticalArray, setVerticalArray] = useState([]);
  const [stringValue, setStringValue] = useState("");

  const initCanvas = useRef(null);
  const renderCanvas = useRef(null);

  useEffect(() => {
    const context = initCanvas.current.getContext("2d");

    const imageObj = new Image();
    imageObj.src = imgSrc;

    imageObj.onload = function () {
      imageObj.crossOrigin = "Anonymous";

      if (!imageObj.width) return;

      initCanvas.current.width = imageObj.width;
      initCanvas.current.height = imageObj.height;

      renderCanvas.current.width = imageObj.width;
      renderCanvas.current.height = imageObj.height;

      context.drawImage(imageObj, 0, 0);
      let imageData = context.getImageData(
        0,
        0,
        imageObj.width,
        imageObj.height
      );

      let teaser = splitArrayIntoChunksOfLen(imageData.data, 4);
      const dataList = splitArrayIntoChunksOfLen(teaser, imageData.width);
      const vertArr = [],
        rowArr = [];

      let y = 0;

      const renderContext = renderCanvas.current.getContext("2d");

      function myLoop() {
        //  create a loop function
        // setTimeout(function () {
        //  call a setTimeout when the loop is called

        // In the vertical cycle
        // for (let y = 0; y < imageData.height; y++) {
        // rowArr.length = 0;
        // rowArr.length = imageData.width;

        // In each row cycle
        for (let x = 0; x < imageData.width; x++) {
          const d = dataList[y][x];

          renderContext.fillStyle = `rgba(${d[0]}, ${d[1]}, ${d[2]}, ${d[3]})`;
          renderContext.fillRect(x, y, 1, 1);
          rowArr[x] = dataList[y][x];
        }
        vertArr.push(rowArr.slice());
        // }
        // setVerticalArray((el) => [...el, rowArr.slice()]); //  your code here
        // // }
        // setVerticalArray((el) => {
        //   const buffer = el;
        //   buffer.push(rowArr);
        //   return buffer;
        // }); //  your code here

        y++; //  increment the counter
        if (y < imageData.height) {
          //  if the counter < imageData.height, call the loop function
          myLoop(); //  ..  again which will trigger another
        } //  ..  setTimeout()
        // setStringValue(teaser);
        // }, 0);
      }
      // myLoop();
      teaser = teaser.map((e) => rgbaToHex(e));
      setStringValue(
        teaser.reduce((prev, curr, idx) => (idx ? prev + "," + curr : curr), "")
      );
    };
  }, []);

  return (
    <div className="App">
      <h1>Run!!!</h1>
      <div>
        <canvas ref={initCanvas} width="500" height="500"></canvas>
      </div>
      <h1>Render!!!</h1>
      <div style={{ marginBottom: "100px" }}>
        <div>Start</div>
        <Container>
          {/* {verticalArray.map((itm, idx) => (
            <RowArray key={idx} y={idx} value={itm} />
          ))} */}
          <canvas ref={renderCanvas} width="500" height="500"></canvas>
          <br />
          <div contentEditable>
            {JSON.stringify(stringValue).replace('"', "")}
          </div>
        </Container>
        <div>End</div>
      </div>
    </div>
  );
}

const Container = ({ children }) => (
  <div style={{ padding: "30px" }}>{children}</div>
);
