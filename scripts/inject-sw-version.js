const fs = require("fs");
const path = require("path");
const crypto = require("crypto");

// Generate a build ID from the current time + a random suffix
const buildId = Date.now().toString(36) + "-" + crypto.randomBytes(4).toString("hex");

const swPaths = [
  path.join(__dirname, "..", "out", "sw.js"),
];

for (const p of swPaths) {
  if (!fs.existsSync(p)) continue;
  let content = fs.readFileSync(p, "utf8");
  content = content.replace(/__BUILD_ID__/g, buildId);
  fs.writeFileSync(p, content);
  console.log(`Injected build ID ${buildId} into ${path.relative(process.cwd(), p)}`);
}

// Also write the build ID to a small JSON so the app can show it
fs.writeFileSync(
  path.join(__dirname, "..", "public", "build-id.json"),
  JSON.stringify({ id: buildId, builtAt: new Date().toISOString() })
);
