const loader = Vars.mods.mainLoader();
const scripts = Vars.mods.scripts;
const NativeJavaClass = Packages.rhino.NativeJavaClass;
function getClass(name){
	return NativeJavaClass(scripts.scope, loader.loadClass(name));
};

module.exports = {
    MultiCrafter : getClass("multicraft.MultiCrafter"),
    DrawRecipe : getClass("multicraft.DrawRecipe"),
    IOEntry : getClass("multicraft.IOEntry"),
    Recipe : getClass("multicraft.Recipe")
}

print(">>>>>MultiCrafter JavaScript loaded.")
