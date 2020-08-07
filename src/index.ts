import { fetchDimension, fetchDimensions } from "./api/api";
import { Grid } from "./components/grid";
import { InfoPanel } from "./components/info";
import { config } from "./config";
import { Application, InteractionEvent, Point, Rectangle, utils } from "./pixi";
import { states } from "./states";
import { Theme } from "./theme";
import { Persist } from "./utils/persist";

utils.sayHello("rua!");

Theme.darkMode = Persist.getBoolean("dark_mode"); // dark mode = not transparent
const baseUrl = process.env.BASE_URL;

// App
const app = new Application({
  width: window.innerWidth,
  height: window.innerHeight,
  antialias: true,
  resolution: 1,
  transparent: !Theme.darkMode,
});

// Interactive stage
app.stage.interactive = true;
app.stage.hitArea = new Rectangle(0, 0, window.innerWidth, window.innerHeight);

// Grid
const grid = new Grid(window.innerWidth, window.innerHeight, 48, 2);
app.stage.addChild(grid);

// Info
InfoPanel.reposition();
app.stage.addChild(InfoPanel);

// Resize
document.body.appendChild(app.view);
window.addEventListener("resize", () => {
  app.renderer.resize(window.innerWidth, window.innerHeight);
  app.stage.hitArea = new Rectangle(
    0,
    0,
    window.innerWidth,
    window.innerHeight
  );

  InfoPanel.reposition();

  grid.resize(window.innerWidth, window.innerHeight);
  grid.rerender();
});

async function main() {
  const dims = await fetchDimensions(baseUrl);

  if (dims.includes(config.dim)) {
    config.dim = "0";
  }

  const points = await fetchDimension(config.dim, baseUrl);
  grid.bindWaypoints(points);

  // Drag
  let dragPoint: Point;
  app.stage.addListener("pointerdown", (event) => {
    states.dragging = true;
    dragPoint = event.data.global.clone();
  });
  app.stage.addListener("pointerup", () => (states.dragging = false));
  app.stage.addListener("pointerupoutside", () => (states.dragging = false));
  app.stage.addListener("pointermove", (event: InteractionEvent) => {
    if (states.dragging) {
      const offsetX = event.data.global.x - dragPoint.x,
        offsetY = event.data.global.y - dragPoint.y;
      dragPoint = event.data.global.clone();

      grid.handleDrag(offsetX, offsetY);
      grid.removeChildren();
      grid.renderWaypoints();
    }
  });
}

main().catch((e) => {
  console.error(e);
});
