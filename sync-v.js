const fs = require("fs");
const util = require("util");

const readFile = util.promisify(fs.readFile);
const writeFile = util.promisify(fs.writeFile);

(async () => {
  const packageJson = await readFile("package.json", "utf8");
  const packageJsonObj = JSON.parse(packageJson);
  const version = packageJsonObj.version;
  const tauriConfig = await readFile("./src-tauri/tauri.conf.json", "utf8");
  const tauriConfObj = JSON.parse(tauriConfig);
  tauriConfObj.package.version = version;
  const tauriConfigStr = JSON.stringify(tauriConfObj, null, 2);
  await writeFile("./src-tauri/tauri.conf.json", tauriConfigStr);
})();
