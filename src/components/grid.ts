import { config } from "../config";
import { Waypoint } from "../models/waypoint";
import { Graphics } from "../pixi/pixi";
import { Theme } from "../theme";
import { Persist } from "../utils/persist";
import { WaypointGrid } from "./waypointGrid";

export class Grid extends Graphics {
  maxX: number;
  maxY: number;
  baseWidth: number;

  zoomFactor: number = 1;
  gridWidth: number = 0;

  baseChunkX: number = 0;
  baseChunkY: number = 0;

  dim: string;
  waypoints: Map<string, Waypoint> = new Map();
  rendered: Map<string, WaypointGrid> = new Map();

  constructor(x: number, y: number, width: number, scale: number = 1) {
    super();

    this.baseWidth = width;
    this.zoom(scale);
    this.resize(x, y);
  }

  resize(x: number, y: number) {
    this.maxX = Math.ceil(x / this.gridWidth);
    this.maxY = Math.ceil(y / this.gridWidth);
  }

  zoom(scale: number) {
    this.zoomFactor = scale;
    Persist.setNumber("zoom", this.zoomFactor);

    this.gridWidth = this.zoomFactor * this.baseWidth;
    this.resize(this.width, this.height);
  }

  zoomAt(scale: number, x: number, y: number) {
    const rate = scale / this.zoomFactor - 1;
    this.zoom(scale);
    this.handleDrag(-rate * x, -rate * y);
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
    switch (config.gridLineStyle) {
      case "line":
        this.lineTo(finX, finY);
        break;
      case "dash":
        this.dashLineTo(finX, finY);
        break;
      case "none":
      default:
        break;
    }
  }

  load(dim: string, wps: Waypoint[]) {
    this.dim = dim;
    this.baseChunkX = Persist.getNumber(`grid-${dim}-baseChunkX`, 0);
    this.baseChunkY = Persist.getNumber(`grid-${dim}-baseChunkY`, 0);

    this.x = Persist.getNumber(`grid-${dim}-x`, 0);
    this.y = Persist.getNumber(`grid-${dim}-y`, 0);
    this.bindWaypoints(wps);

    this.rerender();
  }

  persist() {
    Persist.setNumber(`grid-${this.dim}-baseChunkX`, this.baseChunkX);
    Persist.setNumber(`grid-${this.dim}-baseChunkY`, this.baseChunkY);
    Persist.setNumber(`grid-${this.dim}-x`, this.x);
    Persist.setNumber(`grid-${this.dim}-y`, this.y);
  }

  bindWaypoints(wps: Waypoint[]) {
    this.waypoints.clear();
    wps.forEach((p) => this.waypoints.set(p.identifier, p));
    this.renderWaypoints();
  }

  renderWaypoints() {
    for (let i = -1; i < this.maxX + 1; i++) {
      const currentX = this.baseChunkX + i;
      for (let j = -1; j < this.maxY + 1; j++) {
        const currentY = this.baseChunkY + j;
        const identifier = `${currentX}/${currentY}`;
        if (this.waypoints.has(identifier)) {
          this.drawWaypoint(i, j, this.waypoints.get(identifier));
        }
      }
    }
  }

  drawWaypoint(x: number, y: number, wp: Waypoint) {
    let waypoint: WaypointGrid;
    // Reuse / create WaypointGrid
    if (this.rendered.has(wp.identifier)) {
      waypoint = this.rendered.get(wp.identifier);
      waypoint.zoom(this.zoomFactor);
    } else {
      waypoint = new WaypointGrid(wp, this.baseWidth, this.zoomFactor);
    }

    // Update offset
    waypoint.x = x * this.gridWidth;
    waypoint.y = y * this.gridWidth;

    // Add to grid & save
    this.addChild(waypoint);
    this.rendered.set(wp.identifier, waypoint);
  }

  handleDrag(moveX: number, moveY: number) {
    this.baseChunkX -= ((this.x + moveX) / this.gridWidth) << 0;
    this.baseChunkY -= ((this.y + moveY) / this.gridWidth) << 0;

    this.x = (this.x + moveX) % this.gridWidth;
    this.y = (this.y + moveY) % this.gridWidth;
  }

  // https://github.com/pixijs/pixi.js/issues/1333#issuecomment-424324927
  dashLineTo(toX: number, toY: number, dash = 16, gap = 8) {
    const lastPosition = this.currentPath.points;

    const currentPosition = {
      x: lastPosition[lastPosition.length - 2] || 0,
      y: lastPosition[lastPosition.length - 1] || 0,
    };

    const absValues = {
      toX: Math.abs(toX),
      toY: Math.abs(toY),
    };

    for (
      ;
      Math.abs(currentPosition.x) < absValues.toX ||
      Math.abs(currentPosition.y) < absValues.toY;

    ) {
      currentPosition.x =
        Math.abs(currentPosition.x + dash) < absValues.toX
          ? currentPosition.x + dash
          : toX;
      currentPosition.y =
        Math.abs(currentPosition.y + dash) < absValues.toY
          ? currentPosition.y + dash
          : toY;

      this.lineTo(currentPosition.x, currentPosition.y);

      currentPosition.x =
        Math.abs(currentPosition.x + gap) < absValues.toX
          ? currentPosition.x + gap
          : toX;
      currentPosition.y =
        Math.abs(currentPosition.y + gap) < absValues.toY
          ? currentPosition.y + gap
          : toY;

      this.moveTo(currentPosition.x, currentPosition.y);
    }
  }
}
