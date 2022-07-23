import React from "react";
import "./App.css";
import Sketch from "react-p5";
import p5Types from "p5";
import rules from "./rules.json";

////////// GLOBAL /////////

const canvas = {
  width: window.innerWidth,
  height: window.innerHeight,
};
const cell_resolution = 100;

////////// TYPES /////////
interface tiled {
  [key: string]: p5Types.Image;
}

////////// CLASS /////////
class Tile {
  x_pos: number;
  y_pos: number;
  entropy: tiled = {};
  env = {};

  constructor(x_pos: number, y_pos: number, entropy: tiled) {
    this.x_pos = x_pos;
    this.y_pos = y_pos;
    this.entropy = entropy;
  }

  get_corners = () => ({
    top: this.x_pos === 0 ? 1 : 0,
    bottom: this.x_pos === Math.floor(canvas.width / cell_resolution) ? 1 : 0,
    left: this.y_pos === 0 ? 1 : 0,
    right: this.y_pos === Math.floor(canvas.height / cell_resolution) ? 1 : 0,
  });

  is_collapsed = (): boolean => {
    if (Object.keys(this.entropy).length === 4) return true;
    return false;
  };

  reduce_sockets = (ids: string[]) => {
    ids.forEach((id) => {
      const { [id]: _, ...remain } = this.entropy;
      this.entropy = remain;
    });
  };
}

////////// COMPONENTS //////////

const App = () => {
  const images: tiled = {};

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
    p5.background(255);
    p5.angleMode("degrees");
    p5.noLoop();
  };

  const draw = (p5: p5Types) => {
    const grid = prepare_canvas(p5);
    collapse(p5, images, grid);
  };

  return <Sketch setup={setup} draw={draw} preload={preload} />;
};

////////// FUNCTIONS //////////

const prepare_canvas = (p5: p5Types) => {
  const grid: Tile[][] = [];
  const col: Tile[] = [];
  for (let x = 0; x < Math.floor(canvas.width / cell_resolution); x++) {
    const row = [];
    for (let y = 0; y < Math.floor(canvas.height / cell_resolution); y++) {
      row.push(undefined);
      p5.rect(
        x * cell_resolution,
        y * cell_resolution,
        cell_resolution,
        cell_resolution
      );
    }
    grid.push(col);
  }
  console.table(grid);
  return grid;
};

const collapse = (p5: p5Types, images: tiled, grid: Tile[][]) => {
  // wave_function_collapse(p5, new Tile(x, y, { ...images }));
};

const wave_function_collapse = (p5: p5Types, cell: Tile) => {
  const random_socket = Object.keys(cell.entropy)[
    Math.floor(Math.random() * Object.keys(cell.entropy).length)
  ];

  const is_corner = cell.get_corners();

  const random_rotation = [0, 90, 180, 270][Math.floor(Math.random() * 4)];

  cell.entropy[random_socket].resize(cell_resolution, cell_resolution);

  p5.push();
  p5.translate(
    cell.x_pos * cell_resolution + cell_resolution / 2,
    cell.y_pos * cell_resolution + cell_resolution / 2
  );
  p5.rotate(random_rotation);
  p5.imageMode("center");
  p5.image(cell.entropy[random_socket], 0, 0, cell_resolution);
  p5.pop();
};

////////// EXPORTS //////////

export default App;
