const fs = require("fs");
const path = require("path");
const JavaScriptObfuscator = require("javascript-obfuscator");

// Path to your compiled TypeScript files
const distFolder = path.resolve(__dirname, "../dist");

// Obfuscate each `.js` file in the `dist` directory
fs.readdir(distFolder, (err, files) => {
  if (err) {
    console.error("Error reading dist directory:", err);
    return;
  }

  files.forEach((file) => {
    if (file.endsWith(".js")) {
      const filePath = path.join(distFolder, file);
      const sourceCode = fs.readFileSync(filePath, "utf-8");

      const obfuscatedCode = JavaScriptObfuscator.obfuscate(sourceCode, {
        compact: true,
        controlFlowFlattening: true,
      }).getObfuscatedCode();

      fs.writeFileSync(filePath, obfuscatedCode, "utf-8");
      console.log(`Obfuscated ${file}`);
    }
  });
});
