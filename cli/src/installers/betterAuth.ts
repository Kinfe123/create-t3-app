import path from "path";
import fs from "fs-extra";

import { PKG_ROOT } from "~/consts.js";
import { type AvailableDependencies } from "~/installers/dependencyVersionMap.js";
import { type Installer } from "~/installers/index.js";
import { addPackageDependency } from "~/utils/addPackageDependency.js";

export const betterAuthInstaller: Installer = ({ projectDir, packages }) => {
  const usingPrisma = packages?.prisma.inUse;
  const usingDrizzle = packages?.drizzle.inUse;
  const deps: AvailableDependencies[] = ["better-auth"];

  addPackageDependency({
    projectDir,
    dependencies: deps,
    devMode: false,
  });

  const extrasDir = path.join(PKG_ROOT, "template/extras");

  const apiHandlerFile = "src/app/api/auth/[...betterAuth]/route.ts";

  const apiHandlerSrc = path.join(extrasDir, apiHandlerFile);
  const apiHandlerDest = path.join(projectDir, apiHandlerSrc);

  const libFile = "src/app/lib/auth.ts";
  const authConfigSrc = path.join(
    extrasDir,
    "src/server/auth/config/better-auth",
    usingPrisma
      ? "with-prisma.ts"
      : usingDrizzle
        ? "with-drizzle.ts"
        : "base.ts"
  );
  const authConfigDest = path.join(projectDir, libFile);

  // const authIndexSrc = path.join(extrasDir, "src/server/auth/index.ts");
  // const authIndexDest = path.join(projectDir, "src/server/auth/index.ts");

  fs.copySync(apiHandlerSrc, apiHandlerDest);
  fs.copySync(authConfigSrc, authConfigDest);
};
