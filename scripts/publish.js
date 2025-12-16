const { execSync } = require("node:child_process");
const fs = require("node:fs");
const path = require("node:path");

const PACKAGES = [
  {
    name: "@node-edit-utils/core",
    dir: "packages/core",
    order: 1,
  },
  {
    name: "@node-edit-utils/react",
    dir: "packages/react",
    order: 2,
  },
];

function log(message, type = "info") {
  const colors = {
    info: "\x1b[36m",
    success: "\x1b[32m",
    error: "\x1b[31m",
    warning: "\x1b[33m",
    reset: "\x1b[0m",
  };

  console.log(`${colors[type]}${message}${colors.reset}`);
}

function runCommand(command, cwd) {
  try {
    log(`Running: ${command}`, "info");
    execSync(command, { cwd, stdio: "inherit" });
    return true;
  } catch {
    log(`Failed to run: ${command}`, "error");
    return false;
  }
}

function getPackageVersion(pkgDir) {
  try {
    const pkgJson = JSON.parse(fs.readFileSync(path.join(pkgDir, "package.json"), "utf8"));
    return pkgJson.version;
  } catch (error) {
    log(`Failed to read package.json from ${pkgDir}: ${error.message}`, "error");
    return null;
  }
}

function checkDistExists(pkgDir) {
  const distPath = path.join(pkgDir, "dist");
  return fs.existsSync(distPath);
}

function validatePackage(pkg) {
  const pkgPath = path.join(process.cwd(), pkg.dir);

  if (!fs.existsSync(pkgPath)) {
    log(`Package directory not found: ${pkg.dir}`, "error");
    return false;
  }

  const pkgJsonPath = path.join(pkgPath, "package.json");
  if (!fs.existsSync(pkgJsonPath)) {
    log(`package.json not found in ${pkg.dir}`, "error");
    return false;
  }

  return true;
}

function publishPackage(pkg, otp) {
  const pkgPath = path.join(process.cwd(), pkg.dir);
  const version = getPackageVersion(pkgPath);

  if (!version) {
    return false;
  }

  log(`\n📦 Publishing ${pkg.name}@${version}...`, "info");

  // Check if dist exists
  if (!checkDistExists(pkgPath)) {
    log(`Building ${pkg.name}...`, "info");
    if (!runCommand("npm run build", pkgPath)) {
      log(`Failed to build ${pkg.name}`, "error");
      return false;
    }
  }

  // Publish to npm with optional OTP
  const otpFlag = otp ? ` --otp=${otp}` : "";
  if (!runCommand(`npm publish --access public${otpFlag}`, pkgPath)) {
    log(`Failed to publish ${pkg.name}`, "error");
    return false;
  }

  log(`✅ Successfully published ${pkg.name}@${version}`, "success");
  return true;
}

async function main() {
  log("\n🚀 Starting publication process...\n", "info");

  // Parse OTP from command line arguments (--otp=123456)
  const otpArg = process.argv.find((arg) => arg.startsWith("--otp="));
  const otp = otpArg ? otpArg.split("=")[1] : null;

  if (otp) {
    log(`Using OTP for 2FA authentication`, "info");
  } else {
    log(`ℹ️  No OTP provided. If 2FA is enabled, pass --otp=123456`, "info");
  }

  // Check if logged in to npm
  try {
    execSync("npm whoami", { stdio: "pipe" });
  } catch {
    log("❌ You are not logged in to npm. Please run 'npm login' first.", "error");
    process.exit(1);
  }

  // Validate all packages exist
  log("Validating packages...", "info");
  for (const pkg of PACKAGES) {
    if (!validatePackage(pkg)) {
      log(`Validation failed for ${pkg.name}`, "error");
      process.exit(1);
    }
  }
  log("✅ All packages validated\n", "success");

  // Sort packages by order
  const sortedPackages = PACKAGES.sort((a, b) => a.order - b.order);

  let publishedCount = 0;
  let failedCount = 0;

  for (const pkg of sortedPackages) {
    if (publishPackage(pkg, otp)) {
      publishedCount++;
    } else {
      failedCount++;
      log(`\n⚠️  Publication process stopped due to failure at ${pkg.name}`, "warning");
      break;
    }
  }

  // Summary
  log("\n📊 Publication Summary", "info");
  log(`✅ Published: ${publishedCount}`, "success");
  if (failedCount > 0) {
    log(`❌ Failed: ${failedCount}`, "error");
    process.exit(1);
  } else {
    log(`\n🎉 All packages published successfully!\n`, "success");
  }
}

main().catch((error) => {
  log(`Fatal error: ${error.message}`, "error");
  process.exit(1);
});
