import { fetchDimension, fetchDimensions } from "./api/api";
import { Grid } from "./components/grid";
import { InfoPanel } from "./components/info";
import { SearchBox } from "./components/search";
import { config } from "./config";
import {
  Application,
  InteractionEvent,
  Point,
  Rectangle,
  utils,
} from "./pixi/pixi";
import { states } from "./states";
import { Theme } from "./theme";
import { Persist } from "./utils/persist";

utils.sayHello("rua!");

Theme.darkMode = Persist.getBoolean("dark_mode"); // dark mode = not transparent
const baseUrl = "https://waypoint.mmf.moe";

// App
const app = new Application({
  antialias: true,
  resolution: 1,
  transparent: !Theme.darkMode,
});
app.renderer.view.style.position = "absolute";
app.renderer.view.style.display = "block";
app.renderer.autoDensity = true;
app.renderer.resize(window.innerWidth, window.innerHeight);

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

app.view.addEventListener("wheel", (event) => {
  let diff = 0.2 * (event.deltaY > 0 ? -1 : 1);
  let original = grid.zoomFactor;
  let scale = Math.sqrt(grid.zoomFactor ** 2 * (1 + diff));
  diff = scale - original;
  if ((diff < 0 && scale < 1) || (diff > 0 && scale > 5)) {
    // do not scale
    return;
  }

  grid.zoomAt(scale, event.x, event.y);
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

  window.addEventListener("keydown", (event) => {
    if (event.ctrlKey && event.keyCode === 70 && !states.search) {
      // Ctrl+F
      event.preventDefault();
      app.stage.addChild(SearchBox);
      SearchBox.focus();
      states.search = true;
    } else if (event.keyCode === 27 && states.search) {
      // ESC
      event.preventDefault();
      app.stage.removeChild(SearchBox);
      states.search = false;
    } else if (event.keyCode === 13 && states.search) {
      // Enter
      event.preventDefault();
      // Show search result
    }
  });
}

main().catch((e) => {
  console.error(e);
});
