import React from "react";
import "./App.css";
import Sketch from "react-p5";
import p5Types from "p5";

const App = () => {
  const canvas = {
    width: window.innerWidth,
    height: window.innerHeight,
  };
  const render = 100;
  const images: { [key: string]: p5Types.Image } = {};

  const preload = (p5: p5Types) => {
    [1, 2, 3, 4].forEach(
      (i) =>
        (images[`block${i}`] = p5.loadImage(
          `assets/block${i}.png`,
          (img: p5Types.Image) => (images[`block${i}`] = img)
        ))
    );
  };

  const setup = (
    p5: p5Types,
    canvasParentRef: string | object | p5Types.Element
  ) => {
    p5.createCanvas(canvas.width, canvas.height).parent(canvasParentRef);
    // p5.strokeWeight(2);
    p5.background(255, 0, 0);
    p5.angleMode("degrees");
    p5.noLoop();
  };

  const draw = (p5: p5Types) => {
    p5.background(255);
    display(p5, canvas, images, render);
  };

  return <Sketch setup={setup} draw={draw} preload={preload} />;
};

const display = (
  p5: p5Types,
  winDim: { width: number; height: number },
  images: { [key: string]: p5Types.Image },
  render?: number
): void => {
  const cell_dim = render ? render : 40;

  for (let x = 0; x < Math.floor(winDim.width / cell_dim); x++) {
    for (let y = 0; y < Math.floor(winDim.height / cell_dim); y++) {
      wave_function_collapse(p5, images, { x_pos: x, y_pos: y, dim: cell_dim });
      // if (y === 1) return;
    }
  }
  return;
};

const wave_function_collapse = (
  p5: p5Types,
  images: { [key: string]: p5Types.Image },
  cell: { x_pos: number; y_pos: number; dim: number }
) => {
  const random_socket =
    Object.keys(images)[Math.floor(Math.random() * Object.keys(images).length)];
  const random_rotation = [0, 90, 180, 270][Math.floor(Math.random() * 4)];

  p5.rect(cell.x_pos * cell.dim, cell.y_pos * cell.dim, cell.dim, cell.dim);
  images[random_socket].resize(cell.dim, cell.dim);
  images[random_socket].loadPixels();

  p5.push();
  p5.translate(
    cell.x_pos * cell.dim + cell.dim / 2,
    cell.y_pos * cell.dim + cell.dim / 2
  );
  p5.rotate(random_rotation);
  p5.imageMode("center");
  p5.image(images[random_socket], 0, 0, cell.dim);
  p5.pop();
};

export default App;
