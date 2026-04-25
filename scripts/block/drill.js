const item = require("vne/item");
const liquid = require("vne/liquid");

const nickelDrill = new Drill("nickel-drill");
exports.nickelDrill = nickelDrill;
Object.assign(nickelDrill, {
	tier: 3,
	drillTime: 480,
	hardnessDrillMultiplier: 0,
	size: 2,
	alwaysUnlocked: true,
	buildVisibility: BuildVisibility.shown,
	category: Category.production,
	requirements: ItemStack.with(
		Items.graphite, 10,
		item.nickel, 18,
	),
})
nickelDrill.consumeLiquid(Liquids.water, 2.5 / 60).boost()

const manganeseDrill = new Drill("manganese-drill");
exports.manganeseDrill = manganeseDrill;
Object.assign(manganeseDrill, {
	tier: 4,
	drillTime: 400,
	hardnessDrillMultiplier: 0,
	size: 2,
	buildVisibility: BuildVisibility.shown,
	category: Category.production,
	requirements: ItemStack.with(
	    Items.graphite, 10,
		item.nickel, 35,
		item.manganese, 15,
	),
})
manganeseDrill.consumeLiquid(Liquids.water, 2.5 / 60).boost()