import { Graphics, Rectangle, Text } from "../pixi/pixi";
import { Waypoint } from "../models/waypoint";

class Info extends Graphics {
  constructor() {
    super();

    this.interactive = true;
    this.hitArea = new Rectangle(0, 0, 180, 100);
    this.addListener("mousedown", (event) => {
      event.stopPropagation();
    });

    this.width = 180;
    this.height = 100;

    this.bg();
  }

  reposition() {
    this.x = (window.innerWidth - this.width) / 2;
    this.y = window.innerHeight - this.height;
  }

  bg() {
    this.beginFill(0x1c1c1c, 0.8).drawRect(0, 0, 300, 40).endFill();
  }

  showWaypoint(wp: Waypoint) {
    const nameText = new Text(wp.name);
    this.addChild(nameText);
  }

  clearWaypoint() {
    this.clear();
    this.removeChildren();
    this.bg();
  }
}

export const InfoPanel: Info = new Info();
