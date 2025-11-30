const lib = require("vne/lib/researchlib");

const insect = require('vne/unit');

const item = require('vne/item');

const UnitPlan = UnitFactory.UnitPlan;
const AssemblerUnitPlan = UnitAssembler.AssemblerUnitPlan;

const unitIncubator = new UnitFactory("unit-incubator");
exports.unitIncubator = unitIncubator;
Object.assign(unitIncubator, {
	size: 3,
	buildVisibility: BuildVisibility.shown,
	category: Category.units,
	plans: Seq.with(
		new UnitPlan(insect.haploid, 60 * 15, ItemStack.with(
		    Items.silicon, 5,
			item.protein, 15,
		)),
		new UnitPlan(insect.ribosome, 60 * 20, ItemStack.with(
		    Items.silicon, 5,
			item.protein, 20,
		)),
		new UnitPlan(insect.bomber, 60 * 7.5, ItemStack.with(
		    Items.silicon, 3,
			item.protein, 10,
		)),
	),
	requirements: ItemStack.with(
	    Items.graphite, 60,
		Items.silicon, 70,
		Items.beryllium, 100,
	),
})
unitIncubator.consumePower(1.2);
unitIncubator.buildType = prov(() => extend(UnitFactory.UnitFactoryBuild, unitIncubator,{
    a: 0,
    draw(){
        this.super$draw()
        
        if(this.currentPlan != -1){
            var plan = this.block.plans.get(this.currentPlan);
        }
        
        if(this.progress <= 60){
            this.a = (this.progress / 60)
        }else if(this.progress >= plan.time - 60){
            this.a = (plan.time - this.progress) / 60
        }else{
            this.a = 1
        }
        
        Draw.z(35.05);
        LiquidBlock.drawTiledFrames(2, this.x, this.y, 0, Liquids.neoplasm, this.a * 0.7)
        
        Draw.reset();
    }
}))

lib.addResearch(unitIncubator, { 
    parent: "tank-fabricator",
    objectives: Seq.with(Objectives.OnSector(SectorPresets.intersect))
}, () => {
    TechTree.node(insect.haploid,() => {}),
    TechTree.node(insect.ribosome, () => {}),
    TechTree.node(insect.bomber, () => {})
});

/*const reincubator = new Reconstructor("reincubator");
exports.reincubator = reincubator;
Object.assign(reincubator,{
	size: 3,
	constructTime: 60 * 10,
	liquidCapacity: 30,
	buildVisibility: BuildVisibility.shown,
	category: Category.units,
	requirements: ItemStack.with(
		Items.silicon, 100,
		Items.graphite, 75,
		item.nickel, 200,
		item.manganese, 100,
	),
})
reincubator.addUpgrade(insect.haploid, insect.diploid);
reincubator.addUpgrade(insect.ribosome, insect.lysosome);
//reincubator.addUpgrade(insect.glycocalyx, insect.hydrolase)
reincubator.consumePower(2.7);
reincubator.consumeItems(ItemStack.with(
	item.biomass, 40,
	item.amino, 60,
));
reincubator.buildType = prov(() => extend(Reconstructor.ReconstructorBuild, reincubator,{
    a: 0,
    draw(){
        this.super$draw()
        
        if(this.progress <= 60){
            this.a = (this.progress / 60)
        }else if(this.progress >= 60 * 9){
            this.a = (60 * 10 - this.progress) / 60
        }else{
            this.a = 1
        }
        
        Draw.z(35.05);
        LiquidBlock.drawTiledFrames(2, this.x, this.y, 0, Liquids.neoplasm, this.a * 0.7)
    }
}))
reincubator.consumeLiquids(LiquidStack.with(
	liquid.colchicine, 0.1
));

const hyperplasia = new Reconstructor("hyperplasia");
exports.hyperplasia = hyperplasia;
Object.assign(hyperplasia,{
	size: 5,
	constructTime: 60 * 30,
	liquidCapacity: 30,
	buildVisibility: BuildVisibility.shown,
	category: Category.units,
	requirements: ItemStack.with(
		Items.silicon, 500,
		Items.graphite, 275,
		item.nickel, 600,
		item.manganese, 500,
		item.biomassSteel, 400,
	),
})
hyperplasia.addUpgrade(insect.diploid, insect.triploid);
hyperplasia.addUpgrade(insect.lysosome, insect.trichocyst);
hyperplasia.consumePower(7.7);
hyperplasia.consumeItems(ItemStack.with(
	item.biomass, 80,
	item.biosulfide, 20,
	item.biomassSteel, 20,
));
hyperplasia.consumeLiquids(LiquidStack.with(
	Liquids.neoplasm, 0.1,
	liquid.colchicine, 0.2
));
hyperplasia.buildType = prov(() => extend(Reconstructor.ReconstructorBuild, hyperplasia,{
    a: 0,
    draw(){
        this.super$draw()
        
        if(this.progress <= 60){
            this.a = (this.progress / 60)
        }else if(this.progress >= 60 * 29){
            this.a = (60 * 30 - this.progress) / 60
        }else{
            this.a = 1
        }
        
        Draw.z(35.05);
        LiquidBlock.drawTiledFrames(3, this.x, this.y, 0, Liquids.neoplasm, this.a * 0.7)
    }
}))*/