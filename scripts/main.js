const internalMods = require("internal-mod");

if (internalMods.tryInstallInternalMods()) {
    // 这里能确保所有内置mod都已安装
    Log.info("[@] 所有内置mod已安装", modName);
    Log.info("MultiCrafter JavaScript loaded.",modName)
}

require("vne/item");
require("vne/liquid");
require("vne/status");

require("vne/unit");

require("vne/block/core");
require("vne/block/defense");
require("vne/block/distribution");
require("vne/block/environment");
require("vne/block/factory");
require("vne/block/liquidBlock");
require("vne/block/power");
require("vne/block/unitFactory");

require("vne/block/neopBlock")

require("vne/sector");
require("vne/planet");

require("vne/tree");

require("vne/report");

print("vanilla neoplasm extend successfully loaded")