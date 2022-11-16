import { Box, Text, VStack, Input, Wrap, Button } from "@chakra-ui/react";
import { useState } from "react";
import CanvasDraw from "react-canvas-draw";
import copy from "copy-to-clipboard";

const DEFAULT_LOWER_BOUND = -5;
const DEFAULT_UPPER_BOUND = 5;
const DEFAULT_SCALE = 1;

const createTestCase = (
  dataURL: string,
  equation: string,
  lowestX: number,
  highestX: number,
  lowestY: number,
  highestY: number,
  xScale: number,
  yScale: number
): string => {
  return `${dataURL}\n${equation}\n${lowestX}\n${highestX}\n${lowestY}\n${highestY}\n${xScale}\n${yScale}`;
};

export const Canvas = () => {
  const [dataURL, setDataURL] = useState("");
  const [equation, setEquation] = useState("");
  const [lowestX, setLowestX] = useState(DEFAULT_LOWER_BOUND);
  const [highestX, setHighestX] = useState(DEFAULT_UPPER_BOUND);
  const [lowestY, setLowestY] = useState(DEFAULT_LOWER_BOUND);
  const [highestY, setHighestY] = useState(DEFAULT_UPPER_BOUND);
  const [xScale, setXScale] = useState(DEFAULT_SCALE);
  const [yScale, setYScale] = useState(DEFAULT_SCALE);
  const [resizeCount, setResizeCount] = useState(0);

  var saveableCanvas: any;

  const labelInputs: Array<
    [string, string, (val: any) => void, (val: any) => any]
  > = [
    ["equation", "", setEquation, (e) => e],
    ["lowestX", DEFAULT_LOWER_BOUND.toString(), setLowestX, parseInt],
    ["highestX", DEFAULT_UPPER_BOUND.toString(), setHighestX, parseInt],
    ["lowestY", DEFAULT_LOWER_BOUND.toString(), setLowestY, parseInt],
    ["highestY", DEFAULT_UPPER_BOUND.toString(), setHighestY, parseInt],
    ["xScale", DEFAULT_SCALE.toString(), setXScale, parseFloat],
    ["yScale", DEFAULT_SCALE.toString(), setYScale, parseFloat],
  ];

  const labelInputToElement = (
    i: number,
    label: string,
    placeholder: string,
    setter: (val: any) => void,
    converter: (val: any) => any
  ) => (
    <Box key={i}>
      <Text size="sm"> {label}: </Text>
      <Input
        size="sm"
        width="auto"
        onChange={(e) => setter(converter(e.target.value))}
        placeholder={placeholder}
      />
    </Box>
  );

  return (
    <VStack spacing={8}>
      <Wrap>
        {labelInputs.map(([input, placeholder, el, converter], i) =>
          labelInputToElement(i, input, placeholder, el, converter)
        )}
      </Wrap>
      <Box boxShadow="2xl">
        <CanvasDraw
          key={resizeCount}
          style={{ position: "relative" }}
          brushRadius={1}
          ref={(canvasDraw: any) => saveableCanvas = canvasDraw}
          onChange={() => setDataURL(saveableCanvas.getDataURL())}
          lowestX={isNaN(lowestX) ? DEFAULT_LOWER_BOUND : lowestX}
          highestX={isNaN(highestX) ? DEFAULT_UPPER_BOUND : highestX}
          lowestY={isNaN(lowestY) ? DEFAULT_LOWER_BOUND : lowestY}
          highestY={isNaN(highestY) ? DEFAULT_UPPER_BOUND : highestY}
          xScale={isNaN(xScale) ? DEFAULT_SCALE : xScale}
          yScale={isNaN(yScale) ? DEFAULT_SCALE : yScale}
          lazyRadius={0}
        />
      </Box>
      <Wrap>
        <Button onClick={() => setResizeCount(resizeCount + 1)}>Resize</Button>
        <Button onClick={() => saveableCanvas.eraseAll()}>Erase</Button>
        <Button onClick={() => saveableCanvas.undo()}>Undo</Button>
        <Button
          onClick={() =>
            copy(
              createTestCase(
                dataURL,
                equation,
                lowestX,
                highestX,
                lowestY,
                highestY,
                xScale,
                yScale
              )
            )
          }
        >
          Copy Test
        </Button>
        <Button>Download Test</Button>
      </Wrap>
    </VStack>
  );
};
