const unit = require('vne/unit');
const sector = require("vne/sector");

const item = require('vne/item');
const liquid = require("vne/liquid");
const factory = require("vne/block/factory");

const UnitPlan = UnitFactory.UnitPlan;
const AssemblerUnitPlan = UnitAssembler.AssemblerUnitPlan;

const unitIncubator = new UnitFactory("unit-incubator");
exports.unitIncubator = unitIncubator;
Object.assign(unitIncubator, {
	size: 3,
	plans: Seq.with(
		new UnitPlan(unit.haploid, 60 * 15, ItemStack.with(
		    Items.silicon, 5,
			item.protein, 15,
		)),
		new UnitPlan(unit.ribosome, 60 * 18, ItemStack.with(
		    Items.silicon, 5,
			item.protein, 20,
		)),
		new UnitPlan(unit.bomber, 60 * 8, ItemStack.with(
		    Items.silicon, 3,
			item.protein, 10,
		)),
	),
	buildVisibility: BuildVisibility.shown,
	category: Category.units,
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
    },
    onDestroyed(){
        this.super$onDestroyed();
    
        if(this.progress >= 60)unit.polyp.spawn(this.team, this.x,this.y);
    },
    onDeconstructed(){
        this.onDestroyed();
    }
}))

const shaper = new UnitFactory("shaper");
exports.shaper = shaper;
Object.assign(shaper, {
	size: 3,
	plans: Seq.with(
		new UnitPlan(unit.haploid, 60 * 10, ItemStack.with(
		    Items.silicon, 5,
			item.protein, 15,
		)),
		new UnitPlan(unit.ribosome, 60 * 12, ItemStack.with(
		    Items.silicon, 5,
			item.protein, 20,
		)),
		new UnitPlan(unit.bomber, 60 * 5, ItemStack.with(
		    Items.silicon, 3,
			item.protein, 10,
		)),
		new UnitPlan(unit.diploid, 60 * 20, ItemStack.with(
		    Items.silicon, 12,
			item.protein, 35,
		)),
		new UnitPlan(unit.lysosome, 60 * 25, ItemStack.with(
		    Items.silicon, 12,
			item.protein, 45,
		)),
		new UnitPlan(unit.cytoderm, 60 * 25, ItemStack.with(
		    Items.silicon, 20,
			item.protein, 35,
		)),
	),
	buildVisibility: BuildVisibility.shown,
	category: Category.units,
	requirements: ItemStack.with(
	    Items.beryllium, 150,
	    Items.tungsten, 75,
	    Items.silicon, 100
	),
})
shaper.consumePower(1.8);
shaper.consumeLiquid(liquid.ammonia, 0.1);
shaper.buildType = prov(() => extend(UnitFactory.UnitFactoryBuild, shaper,{
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
    },
    onDestroyed(){
        this.super$onDestroyed();
        
        if(this.currentPlan < 3 && this.progress >= 45){
            unit.polyp.spawn(this.team, this.x,this.y);
        }else if(this.progress >= 90){
            unit.sarcoma.spawn(this.team, this.x,this.y);
        }
    },
    onDeconstructed(){
        this.onDestroyed();
    }
}))

const evolver = new Reconstructor("evolver");
exports.evolver = evolver;
Object.assign(evolver,{
    size: 5,
	constructTime: 60 * 20,
	liquidCapacity: 20,
	buildVisibility: BuildVisibility.shown,
	category: Category.units,
	requirements: ItemStack.with(
	    Items.thorium, 150,
	    Items.silicon, 300,
	    Items.tungsten, 150,
	    item.siliconNitride, 200,
	)
})
evolver.addUpgrade(unit.diploid, unit.triploid);
evolver.addUpgrade(unit.lysosome, unit.trichocyst);
evolver.addUpgrade(unit.cytoderm, unit.adenoma)
evolver.consumePower(2.7);
evolver.consumeItems(ItemStack.with(
	Items.dormantCyst, 20
));
evolver.buildType = prov(() => extend(Reconstructor.ReconstructorBuild, evolver,{
    a: 0,
    draw(){
        this.super$draw()
        
        if(this.progress <= 120){
            this.a = (this.progress / 120)
        }else if(this.progress >= 60 * 18){
            this.a = (60 * 20 - this.progress) / 120
        }else{
            this.a = 1
        }
        
        Draw.z(35.05);
        LiquidBlock.drawTiledFrames(4, this.x, this.y, 0, Liquids.neoplasm, this.a * 0.7)
    },
    onDestroyed(){
        this.super$onDestroyed();
    
        if(this.progress >= 120)unit.metastasis.spawn(this.team, this.x,this.y);
    },
    onDeconstructed(){
        this.onDestroyed();
    }
}))

const laboratory = new UnitFactory("laboratory");
exports.laboratory = laboratory;
Object.assign(laboratory, {
	size: 3,
	plans: Seq.with(
		new UnitPlan(unit.polyp, 60 * 40, ItemStack.with()),
		new UnitPlan(UnitTypes.renale, 60 * 60, ItemStack.with()),
		new UnitPlan(unit.sarcoma, 60 * 120, ItemStack.with()),
		new UnitPlan(unit.metastasis , 60 * 200, ItemStack.with())
	),
	//目前仅敌方可用
	buildVisibility: BuildVisibility.shown,
	category: Category.units,
	requirements: ItemStack.with(
	    Items.carbide, 200,
		Items.dormantCyst, 75,
		item.siliconNitride, 125,
		item.biomassSteel, 225,
	),
})
laboratory.consumeLiquid(Liquids.neoplasm, 20 / 60)
laboratory.consumePower(6);
laboratory.buildType = prov(() => extend(UnitFactory.UnitFactoryBuild, laboratory,{
    a: 0,
    draw(){
        this.super$draw()
        
        if(this.currentPlan != -1){
            var plan = this.block.plans.get(this.currentPlan);
        }
        
        if(this.progress <= 120){
            this.a = (this.progress / 120)
        }else if(this.progress >= plan.time - 120){
            this.a = (plan.time - this.progress) / 120
        }else{
            this.a = 1
        }
        
        Draw.z(35.05);
        LiquidBlock.drawTiledFrames(2, this.x, this.y, 0, Liquids.neoplasm, this.a * 0.7)
        
        Draw.reset();
    },
    onDestroyed(){
        Damage.damage(this.x, this.y, 72, 1200);
        
        if (this.tile != null) this.tile.circle(9, cons(tile => {
            Puddles.deposit(tile, Liquids.neoplasm, 70);
        }))

        Fx.reactorExplosion.at(this.x, this.y, 0, Color.valueOf("c33e2b"));
        Sounds.explosionReactor.at(this);
    },
    onDeconstructed(){
        if(this.progress >= 60) this.onDestroyed();
    }
}))

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
reincubator.addUpgrade(unit.haploid, unit.diploid);
reincubator.addUpgrade(unit.ribosome, unit.lysosome);
//reincubator.addUpgrade(unit.glycocalyx, unit.hydrolase)
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
hyperplasia.addUpgrade(unit.diploid, unit.triploid);
hyperplasia.addUpgrade(unit.lysosome, unit.trichocyst);
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