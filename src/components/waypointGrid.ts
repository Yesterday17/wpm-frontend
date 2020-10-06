import { Graphics, Text } from "../pixi/pixi";
import { Theme } from "../theme";
import { color2rgba } from "../utils/color";
import { Waypoint } from "../models/waypoint";
import { InfoPanel } from "./info";

export class WaypointGrid extends Graphics {
  gridWidth: number;
  zoomFactor: number = 1;
  waypoint: Waypoint;
  nameText: Text;

  constructor(wp: Waypoint, width: number, zoom: number = 1) {
    super();
    this.waypoint = wp;
    this.gridWidth = width;
    this.zoomFactor = zoom;

    this.renderBackground();
    this.createWaypointText();

    this.interactive = true;
    this.on("mouseover", () => {
      InfoPanel.showWaypoint(wp);
    });

    this.on("mouseout", () => {
      InfoPanel.clearWaypoint();
    });
  }

  zoom(factor: number) {
    if (factor !== this.zoomFactor) {
      // Update zoomFactor
      this.zoomFactor = factor;

      // Redraw background
      this.clear();
      this.renderBackground();

      // Update style & position
      this.nameText.style.strokeThickness = 2 * this.zoomFactor;
      this.nameText.style.fontSize = 16 * this.zoomFactor;
      this.nameText.position.set(
        0.5 * this.gridWidth * this.zoomFactor,
        0.5 * this.gridWidth * this.zoomFactor
      );
    }
  }

  createWaypointText() {
    this.nameText = new Text(this.waypoint.name, {
      fill: "white",
      fillGradientType: 1,
      lineJoin: "round",
      strokeThickness: 2 * this.zoomFactor,
      fontSize: 16 * this.zoomFactor,
    });
    this.nameText.anchor.set(0.5, 0.5);
    this.nameText.position.set(
      0.5 * this.gridWidth * this.zoomFactor,
      0.5 * this.gridWidth * this.zoomFactor
    );
    this.addChild(this.nameText);
  }

  renderBackground(color?: string) {
    this.lineStyle(2, Theme.line);
    const rgba = color2rgba(color ?? this.waypoint.color);
    this.beginFill(rgba.color, rgba.alpha)
      .drawRect(
        0,
        0,
        this.gridWidth * this.zoomFactor,
        this.gridWidth * this.zoomFactor
      )
      .endFill();
  }
}
