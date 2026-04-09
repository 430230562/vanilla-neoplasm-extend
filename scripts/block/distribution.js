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