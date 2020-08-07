import { Persist } from "./utils/persist";
import { Waypoint } from "./models/waypoint";

export class config {
  static scale: number = 1;
  static dim: string = "0";
  static showCursorInfo: number = 1;

  static gridLineStyle: "line" | "dash" | "none" = "dash";

  static auth: string = "";
  static nowChunksX: number = 0;
  static nowChunksZ: number = 0;
  static canvasX: number = 0;
  static canvasY: number = 0;

  static rmenu: boolean = false;
  static edit: boolean = false;

  static mouseX: number = 0;
  static mouseY: number = 0;
  static activeChunk: Waypoint = undefined;

  static load() {
    this.scale = Persist.getNumber("scale", 1);
    this.dim = Persist.getString("dim", "0");
    this.showCursorInfo = Persist.getNumber("showCursorInfo", 1);
    this.auth = Persist.getString("auth", "");
  }

  static persist() {
    Persist.setNumber("scale", this.scale);
    Persist.setString("dim", this.dim);
    Persist.setString("auth", this.auth);
  }
}
