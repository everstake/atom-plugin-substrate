import * as Path from "path";

export function getTypesPath(): string {
  const pkgPath = atom.packages.getPackageDirPaths()[0];
  const path = Path.join(pkgPath, "substrate-plugin", "assets", "types.json");
  return path;
}
