const status = require("vne/status");

Liquids.neoplasm.viscosity = 0.95;
Liquids.neoplasm.maxSpread = 1.25;
Liquids.neoplasm.spreadConversion = 2.5;
Liquids.neoplasm.spreadDamage = 0.1;
Liquids.neoplasm.removeScaling = 0.05;
Liquids.neoplasm.incinerable = false;
Liquids.neoplasm.effect = status.neoplasmSlow;
Liquids.neoplasm.canStayOn.addAll(Liquids.neoplasm)

const acid = extend(Liquid,"acid",Color.valueOf("84a94b"),{
	update(puddle){
		if(puddle.tile != null && puddle.tile.build != null){
			puddle.tile.build.damage(0.2)
			
			puddle.amount -= 0.2
			
			if(Mathf.chanceDelta(0.05)){
				Fx.mineSmall.at(puddle.x,puddle.y)
			}
		}
	},
	effect: status.corroding,
	viscosity: 0.8,
	heatCapacity: 0.2,
	temperature: 0.54,
	flammability: 0,
	capPuddles: false,
	coolant: false
});
exports.acid = acid;

const venous = extend(CellLiquid,"venous",Color.valueOf("9e172c"),{
    viscosity: 0.95,
	heatCapacity: 0.2,
	temperature: 0.5,
	flammability: 0,
	spreadTarget: null,
	capPuddles: false,
	coolant: false,
	
	colorFrom: Color.valueOf("e05438"),
    colorTo: Color.valueOf("7a0c15"),
})
exports.venous = venous;

const nutrient = new Liquid("nutrient",Color.valueOf("f8df70"));
exports.nutrient = nutrient;
Object.assign(nutrient,{
    viscosity: 0.5,
	temperature: 0.54,
	flammability: 0.55,
	coolant: false,
})

const ammonia = new Liquid("ammonia",Color.valueOf("57c3c2"));
exports.ammonia = ammonia
Object.assign(ammonia,{
    gas: true,
	flammability: 0.8,
	explosiveness: 0.6,
	coolant: false,
})