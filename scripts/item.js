Items.dormantCyst.hidden = false;

const protein = new Item("protein", Color.valueOf("d6dbe7"));
exports.protein = protein;
Object.assign(protein, {
	flammability: 0.95
})

const coagulantIngot = new Item("coagulant-ingot",Color.valueOf("D6A17C"));
exports.coagulantIngot = coagulantIngot;
Object.assign(coagulantIngot,{
    buildable:false
})

const siliconCarbide = new Item("silicon-carbide", Color.valueOf("404040"));
exports.siliconCarbide = siliconCarbide;
Object.assign(siliconCarbide, {
	cost: 1.7,
	healthScaling: 1.4,
})

const biomassSteel = new Item("biomass-steel", Color.valueOf("7EA341"));
exports.biomassSteel = biomassSteel;
Object.assign(biomassSteel, {
	cost: 2.5,
	healthScaling: 2.2,
})

Items.erekirItems.addAll(protein,coagulantIngot,siliconCarbide,biomassSteel)