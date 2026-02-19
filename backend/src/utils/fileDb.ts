import fs from "fs";
import path from "path";

export function readJson<T>(filePath: string): T {
  const absPath = path.join(__dirname, "..", filePath);
  const raw = fs.readFileSync(absPath, "utf-8");
  return JSON.parse(raw) as T;
}

export function writeJson<T>(filePath: string, data: T): void {
  const absPath = path.join(__dirname, "..", filePath);
  fs.writeFileSync(absPath, JSON.stringify(data, null, 2), "utf-8");
}
