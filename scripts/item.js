const protein = new Item("protein", Color.valueOf("d6dbe7"));
exports.protein = protein;
Object.assign(protein, {
	flammability: 0.95
})

const chitin = new Item("chitin",Color.valueOf("695e45"));
exports.chitin = chitin;
Object.assign(chitin,{
    cost: 0.75,
	healthScaling: 0.3,
})

const coagulantIngot = new Item("coagulant-ingot",Color.valueOf("8c1225"));
exports.coagulantIngot = coagulantIngot;
Object.assign(coagulantIngot,{
    cost: 1.2,
    healthScaling: 0.5,
})

const biomassSteel = new Item("biomass-steel", Color.valueOf("98ba53"));
exports.biomassSteel = biomassSteel;
Object.assign(biomassSteel, {
	cost: 2.5,
	healthScaling: 1.2,
})