import fs from "fs";
import util from "util";

const readFile = util.promisify(fs.readFile);
const writeFile = util.promisify(fs.writeFile);

(async () => {
  const packageJson = await readFile("package.json", "utf8");
  const packageJsonObj = JSON.parse(packageJson);
  const version = packageJsonObj.version;
  const tauriConfig = await readFile("./src-tauri/tauri.conf.json", "utf8");
  const tauriConfObj = JSON.parse(tauriConfig);
  tauriConfObj.version = version;
  const tauriConfigStr = JSON.stringify(tauriConfObj, null, 2);
  await writeFile("./src-tauri/tauri.conf.json", tauriConfigStr);
})();
