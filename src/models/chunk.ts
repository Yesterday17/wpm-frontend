export class Chunk {
  readonly x: number;
  readonly z: number;

  constructor(x: number, z: number) {
    this.x = x;
    this.z = z;
  }

  is(): boolean {
    return false;
  }

  equals(c: Chunk): boolean {
    return this.x === c.x && this.z === c.z;
  }
}
