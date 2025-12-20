const lib = require("vne/lib/researchlib");

const item = require("vne/item");
const liquid = require("vne/liquid")

const factory = require("vne/block/factory");

const biomassReactor = extend(ConsumeGenerator,"biomass-reactor",{
    ambientSound: Sounds.hum,
    ambientSoundVolume: 0.24,
    size: 5,
    health: 700,
    itemDuration: 150,
    itemCapacity: 20,
    powerProduction: 3000 / 60,
    
    liquidCapacity: 24 * 5,
	outputLiquid: new LiquidStack(Liquids.neoplasm, 10 / 60),
	explodeOnFull: true,
	canOverdrive: false,
	fuelItem: item.protein,
	
	explosionDamage: 800,
	explosionPuddles: 160,
    explosionPuddleRange: 56,
    explosionPuddleLiquid: Liquids.neoplasm,
    explosionPuddleAmount: 200,
    explosionMinWarmup: 0.25,
    
    drawer: new DrawMulti(
        new DrawRegion("-bottom"),
		new DrawLiquidTile(liquid.ammonia, 4),
		Object.assign(new DrawCultivator(), {
			plantColor: Color.valueOf("8c1225"),
			plantColorLight: Color.valueOf("e8803f"),
		}),
		Object.assign(new DrawCells(), {
			color: Color.valueOf("c33e2b"),
			particleColorFrom: Color.valueOf("e8803f"),
			particleColorTo: Color.valueOf("8c1225"),
			particles: 75,
			range: 4.5,
		}),
		new DrawDefault(),
    ),
    
    buildVisibility: BuildVisibility.shown,
	category: Category.power,
	requirements: ItemStack.with(
	    Items.graphite, 80,
		Items.silicon, 75,
		Items.tungsten, 125,
		Items.oxide, 75
	),
	
	setBars(){
	    this.super$setBars();
	    
	    this.addBar("instability", func(e => new Bar(
			prov(() => Core.bundle.get("bar.instability")),
			prov(() => Pal.sap),
			floatp(() => e.getInstability())
		)));
	}
	
});
biomassReactor.buildType = prov(() => extend(ConsumeGenerator.ConsumeGeneratorBuild, biomassReactor, {
    volatility: 0,
    coolantLiquid: liquid.ammonia,
    fuelItem: item.protein,
    
    getInstability(){
        return this.volatility;
    },
    updateTile(){
        this.super$updateTile();
        
        let fuel = this.items.get(this.fuelItem);
        let fullness = fuel / 20;
        
        if(fuel > 0 && this.enabled){
            this.productionEfficiency = fullness;
        }else{
            this.productionEfficiency = 0;
        }
        
        if(this.productionEfficiency > 0){
            if(this.liquids.get(this.coolantLiquid) < 0.001){
                this.volatility += fullness * 0.0025 * Math.min(Time.delta, 4);
            }else if(this.volatility >= 0){
                this.volatility -= 0.005 * Math.min(Time.delta, 4);
            }
        }
        
        if(this.volatility >= 0.999){
            this.kill();
        }
    },
    draw(){
        this.super$draw();

        Draw.color(Color.red);
        Draw.alpha(this.volatility)
        Fill.rect(this.x, this.y, 40, 40);
        
        Draw.reset();
    },
    shouldExplode(){
        return this.super$shouldExplode() && (this.items.get(this.fuelItem) >= 5 || this.volatility >= 0.25);
    },
    write(write){
        this.super$write(write);
        
        write.f(this.volatility);
    },
    read(read,revision){
        this.super$read(read, revision);
        
        this.volatility = read.f();
    }
}))

exports.biomassReactor = biomassReactor;
biomassReactor.consumeItem(item.protein, 1);
biomassReactor.consumeLiquid(liquid.ammonia, 0.1).optional = true;

lib.addResearch(biomassReactor, { 
    parent: "chemical-combustion-chamber",
    objectives: Seq.with(Objectives.Research(factory.ammoniaPlant))
}, () => {});
