const fs = require("node:fs");
const path = require("node:path");

function incrementVersion(version, type) {
  const [major, minor, patch] = version.split(".").map(Number);

  switch (type) {
    case "patch":
      return `${major}.${minor}.${patch + 1}`;
    case "minor":
      return `${major}.${minor + 1}.0`;
    case "major":
      return `${major + 1}.0.0`;
    default:
      throw new Error(`Invalid version type: ${type}. Use 'patch', 'minor', or 'major'`);
  }
}

function updatePackageJson(filePath, newVersion) {
  const content = JSON.parse(fs.readFileSync(filePath, "utf8"));
  content.version = newVersion;
  fs.writeFileSync(filePath, `${JSON.stringify(content, null, 2)}\n`);
}

function log(message, type = "info") {
  const colors = {
    info: "\x1b[36m",
    success: "\x1b[32m",
    error: "\x1b[31m",
    reset: "\x1b[0m",
  };

  console.log(`${colors[type]}${message}${colors.reset}`);
}

const versionType = process.argv[2] || "patch";

// Get current version from first workspace package
const packagesDir = path.join(__dirname, "../packages");
const firstPackage = fs.readdirSync(packagesDir)[0];
const firstPkgPath = path.join(packagesDir, firstPackage, "package.json");
const firstPkg = JSON.parse(fs.readFileSync(firstPkgPath, "utf8"));
const currentVersion = firstPkg.version;
const newVersion = incrementVersion(currentVersion, versionType);

log(`\n📦 Bumping version: ${currentVersion} → ${newVersion} (${versionType})\n`);

// Update all workspace packages
let updatedCount = 0;
fs.readdirSync(packagesDir).forEach((pkg) => {
  const pkgJsonPath = path.join(packagesDir, pkg, "package.json");
  if (fs.existsSync(pkgJsonPath)) {
    updatePackageJson(pkgJsonPath, newVersion);
    log(`✅ packages/${pkg}/package.json updated to ${newVersion}`, "success");
    updatedCount++;
  }
});

log(`\n✨ Successfully updated ${updatedCount} package(s) to version ${newVersion}\n`, "success");
