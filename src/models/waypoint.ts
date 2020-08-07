import { Chunk } from "./chunk";

export class Waypoint {
  name: string;
  x: number;
  y: number;
  z: number;
  color: string;
  available: boolean;

  constructor(
    name: string,
    x: number,
    y: number,
    z: number,
    color: string,
    available: boolean
  ) {
    this.name = name;
    this.x = x;
    this.y = y;
    this.z = z;
    this.color = color;
    this.available = available;
  }

  asChunk(): Chunk {
    return new Chunk(this.x >> 4, this.z >> 4);
  }

  get identifier() {
    return `${this.x >> 4}/${this.z >> 4}`;
  }

  static from(wp: Waypoint): Waypoint {
    return new Waypoint(wp.name, wp.x, wp.y, wp.z, wp.color, wp.available);
  }
}
