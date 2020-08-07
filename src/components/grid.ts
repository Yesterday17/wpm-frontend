import { Graphics, resources } from "../pixi";
import { Theme } from "../theme";
import { Waypoint } from "../models/waypoint";
import { WaypointGrid } from "./waypointGrid";

export class Grid extends Graphics {
  maxX: number;
  maxY: number;
  baseWidth: number;

  zoomFactor: number = 1;
  gridWidth: number = 0;

  baseChunkX: number = 0;
  baseChunkY: number = 0;

  waypoints: Map<string, Waypoint> = new Map();

  constructor(x: number, y: number, width: number, scale: number = 1) {
    super();

    this.baseWidth = width;
    this.zoom(scale);
    this.resize(x, y);
    this.rerender();
  }

  resize(x: number, y: number) {
    this.maxX = Math.ceil(x / this.gridWidth);
    this.maxY = Math.ceil(y / this.gridWidth);
  }

  zoom(scale: number) {
    this.zoomFactor = scale;
    this.gridWidth = this.zoomFactor * this.baseWidth;
  }

  rerender() {
    this.clear();
    this.removeChildren();
    this.renderGrid();
    this.renderWaypoints();
  }

  renderGrid() {
    // line style
    this.lineStyle(2, Theme.line);

    // horizonal
    for (let i = 0; i <= this.maxX; i++) {
      this.drawLine(
        i * this.gridWidth,
        -this.gridWidth,
        i * this.gridWidth,
        (this.maxY + 1) * this.gridWidth
      );
    }
    // vertical
    for (let i = 0; i <= this.maxY; i++) {
      this.drawLine(
        -this.gridWidth,
        i * this.gridWidth,
        (this.maxX + 1) * this.gridWidth,
        i * this.gridWidth
      );
    }
  }

  drawLine(startX: number, startY: number, finX: number, finY: number) {
    this.moveTo(startX, startY);
    this.lineTo(finX, finY);
  }

  bindWaypoints(wps: Waypoint[]) {
    wps.forEach((p) => this.waypoints.set(p.identifier, p));
    this.renderWaypoints();
  }

  renderWaypoints() {
    for (let i = -1; i < this.maxX + 1; i++) {
      const currentX = this.baseChunkX + i;
      for (let j = -1; j < this.maxY + 1; j++) {
        const currentY = this.baseChunkY + j;
        if (this.waypoints.has(`${currentX}/${currentY}`)) {
          this.drawWaypoint(
            i,
            j,
            this.waypoints.get(`${currentX}/${currentY}`)
          );
        }
      }
    }
  }

  drawWaypoint(x: number, y: number, wp: Waypoint) {
    const waypoint = new WaypointGrid(wp, this.baseWidth, this.zoomFactor);
    waypoint.x = x * this.gridWidth;
    waypoint.y = y * this.gridWidth;
    this.addChild(waypoint);
  }

  handleDrag(moveX: number, moveY: number) {
    this.baseChunkX -= ((this.x + moveX) / this.gridWidth) << 0;
    this.baseChunkY -= ((this.y + moveY) / this.gridWidth) << 0;

    this.x = (this.x + moveX) % this.gridWidth;
    this.y = (this.y + moveY) % this.gridWidth;
  }
}
