const item = require("vne/item");

const ductJunction = new Junction("duct-junction");
exports.ductJunction = ductJunction;
Object.assign(ductJunction, {
	buildVisibility: BuildVisibility.shown,
	category: Category.distribution,
	requirements: ItemStack.with(
	    Items.beryllium, 5,
		item.siliconNitride, 3
	),
	speed: 1,
	capacity: 1,
	health: 55,
})

//路由器和交叉器用s星的
const distributor = new Router("distributor");
exports.distributor = distributor;
Object.assign(distributor, {
	buildVisibility: BuildVisibility.shown,
	category: Category.distribution,
	requirements: ItemStack.with(
		Items.copper, 6,
		item.nickel, 4,
	),
	size: 2
})

const nickelConveyor = new Conveyor("nickel-conveyor");
exports.nickelConveyor = nickelConveyor;
Object.assign(nickelConveyor, {
	buildVisibility: BuildVisibility.shown,
	category: Category.distribution,
	requirements: ItemStack.with(
	    Items.copper, 1,
		item.nickel, 1
	),
	health: 55,
	speed: 0.05,
	displayedSpeed: 6.5,
	alwaysUnlocked: true,
})

const manganeseConveyor = new Conveyor("manganese-conveyor");
exports.manganeseConveyor = manganeseConveyor;
Object.assign(manganeseConveyor, {
	buildVisibility: BuildVisibility.shown,
	category: Category.distribution,
	requirements: ItemStack.with(
	    Items.copper, 1,
		item.nickel, 1,
		item.manganese, 1,
	),
	health: 80,
	speed: 0.11,
	displayedSpeed: 15.7,
})

const armoredConveyor = ArmoredConveyor("armored-conveyor");
exports.armoredConveyor = armoredConveyor;
Object.assign(armoredConveyor,{
	buildVisibility: BuildVisibility.shown,
	category: Category.distribution,
	requirements: ItemStack.with(
	    Items.tungsten, 1,
		item.manganese, 2
	),
	health: 220,
	speed: 0.11,
	displayedSpeed: 15.7,
})

const biomassConveyor = new StackConveyor("biomass-conveyor");
exports.biomassConveyor = biomassConveyor;
Object.assign(biomassConveyor, {
	health: 125,
	speed: 5 / 60,
	itemCapacity: 15,
	buildVisibility: BuildVisibility.shown,
	category: Category.distribution,
	requirements: ItemStack.with(
		Items.graphite, 1,
		Items.silicon, 1,
		item.biomassSteel, 1,
	),
})

const nickelBridge = new ItemBridge("nickel-bridge");
exports.nickelBridge = nickelBridge;
Object.assign(nickelBridge, {
	fadeIn: false,
	moveArrows: false,
	hasPower: false,
	range: 6,
	arrowSpacing: 6,
	buildVisibility: BuildVisibility.shown,
	category: Category.distribution,
	requirements: ItemStack.with(
	    Items.copper, 15,
		item.nickel, 10,
	),
})

/*const biosulfideBridge = new ItemBridge("biosulfide-bridge");
exports.biosulfideBridge = biosulfideBridge;
Object.assign(biosulfideBridge,{
    fadeIn: false,
	moveArrows: false,
	hasPower: false,
	range: 14,
	arrowSpacing: 6,
	baseExplosiveness: 10,
	envRequired: Env.oxygen,
	buildVisibility: BuildVisibility.shown,
	category: Category.distribution,
	requirements: ItemStack.with(
		item.nickel, 10,
		item.biosulfide, 5,
	),
})*/

const sorter = new Sorter("sorter");
exports.sorter = sorter;
Object.assign(sorter, {
	buildVisibility: BuildVisibility.shown,
	category: Category.distribution,
	requirements: ItemStack.with(
	    Items.copper, 6,
		item.nickel, 4
	),
})

const invertedSorter = new Sorter("inverted-sorter");
exports.invertedSorter = invertedSorter;
Object.assign(invertedSorter, {
	buildVisibility: BuildVisibility.shown,
	category: Category.distribution,
	requirements: ItemStack.with(
		Items.copper, 4,
		item.nickel, 6
	),
	invert: true
})

const overflowGate = new OverflowGate("overflow-gate");
exports.overflowGate = overflowGate;
Object.assign(overflowGate, {
	buildVisibility: BuildVisibility.shown,
	category: Category.distribution,
	requirements: ItemStack.with(
		Items.copper, 6,
		item.nickel, 4
	),
})

const underflowGate = new OverflowGate("underflow-gate");
exports.underflowGate = underflowGate;
Object.assign(underflowGate, {
	buildVisibility: BuildVisibility.shown,
	category: Category.distribution,
	requirements: ItemStack.with(
		Items.copper, 4,
		item.nickel, 6
	),
	invert: true
})

nickelConveyor.junctionReplacement = Blocks.junction;
nickelConveyor.bridgeReplacement = nickelBridge;
manganeseConveyor.junctionReplacement = Blocks.junction;
manganeseConveyor.bridgeReplacement = nickelBridge;
armoredConveyor.junctionReplacement = Blocks.junction;
armoredConveyor.bridgeReplacement = nickelBridge;