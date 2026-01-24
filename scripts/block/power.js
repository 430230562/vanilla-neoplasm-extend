const item = require("vne/item");
const liquid = require("vne/liquid");
const {ammoniaTurbine} = require("vne/effect")
const {
    UnlimitedPuddle
} = require("vne/lib/ability")

const oxidationChamber = extend(ThermalGenerator, "oxidation-chamber", {
    setBars() {
        this.super$setBars();
        
        this.addBar("outputLiquid", func(e => new Bar(
        prov(() => {
            if (e.getOutputLiquid() != null) {
                return e.getOutputLiquid()
                    .liquid.localizedName
            } else {
                return Core.bundle.get("bar.liquid")
            }
        }),
        prov(() => {
            if (e.getOutputLiquid() != null) {
                return e.getOutputLiquid()
                    .liquid.color
            } else {
                return Color.white
            }
        }),
        floatp(() => {
            if (e.getOutputLiquid() != null) {
                return e.getOutputLiquid()
                    .amount / this.liquidCapacity
            } else {
                return 0
            }
        })
        
        )))
    },
    attribute: Attribute.get("ammonia"),
    displayEfficiencyScale: 1 / 9,
    minEfficiency: 9 - 0.0001,
    powerProduction: 15 / 9,
    displayEfficiency: false,
    generateEffect: ammoniaTurbine,
    effectChance: 0.04,
    size: 3,
    ambientSound: Sounds.loopHum,
    ambientSoundVolume: 0.06,

    drawer: new DrawMulti(
    new DrawDefault(),
    Object.assign(new DrawWarmupRegion(),{
        color: Color.valueOf("57c3c2"),
        sinScl: 8 * 9
    }),
    new DrawBlurSpin("-rotator0",0.4),
    new DrawBlurSpin("-rotator1",-0.4)
    ),

    hasLiquids: true,
    outputLiquid: new LiquidStack(Liquids.water, 10 / 60 / 9),
    liquidCapacity: 30,
    fogRadius: 3,

    buildVisibility: BuildVisibility.shown,
    category: Category.power,
    requirements: ItemStack.with(
    Items.silicon, 35,
    Items.tungsten, 25, ),
});
exports.oxidationChamber = oxidationChamber;
oxidationChamber.buildType = prov(() => extend(ThermalGenerator.ThermalGeneratorBuild, oxidationChamber, {
    workTime: 0,
    updateTile() {
        if (this.liquids.get(Liquids.ozone) > 0) {
            this.super$updateTile()
            this.workTime += this.productionEfficiency;
        } else {
            this.productionEfficiency = 0
        }
    },
    totalProgress(){
        return this.workTime
    },
    getOutputLiquid(){
        return {liquid: Liquids.water, amount: this.liquids.get(Liquids.water)}
    },
    write(write) {
		this.super$write(write);
		write.f(this.workTime);
	},
	read(read, revision) {
		this.super$read(read, revision);
		this.workTime = read.f();
	}
}))
oxidationChamber.consumeLiquid(Liquids.ozone, 4 / 60);

const biomassReactor = extend(ConsumeGenerator, "biomass-reactor", {
    ambientSound: Sounds.loopBio,
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
    new DrawDefault(), ),

    buildVisibility: BuildVisibility.shown,
    category: Category.power,
    requirements: ItemStack.with(
    Items.graphite, 80,
    Items.silicon, 75,
    Items.tungsten, 125,
    Items.oxide, 75),

    setBars() {
        this.super$setBars();

        this.addBar("instability", func(e => new Bar(
        prov(() => Core.bundle.get("bar.instability")),
        prov(() => Pal.sap),
        floatp(() => e.getInstability()))));
    }

});
biomassReactor.buildType = prov(() => extend(ConsumeGenerator.ConsumeGeneratorBuild, biomassReactor, {
    volatility: 0,
    coolantLiquid: liquid.ammonia,
    fuelItem: item.protein,

    getInstability() {
        return this.volatility;
    },
    updateTile() {
        this.super$updateTile();

        let fuel = this.items.get(this.fuelItem);
        let fullness = fuel / 20;

        if (fuel > 0 && this.enabled) {
            this.productionEfficiency = fullness;
        } else {
            this.productionEfficiency = 0;
        }

        if (this.productionEfficiency > 0) {
            if (this.liquids.get(this.coolantLiquid) < 0.001) {
                this.volatility += fullness * 0.0025 * Math.min(Time.delta, 4);
            } else if (this.volatility >= 0) {
                this.volatility -= 0.005 * Math.min(Time.delta, 4);
            }
            
            if(Mathf.chance(0.5 * this.volatility)){
                Fx.reactorsmoke.at(this.x + Mathf.range(20),this.y + Mathf.range(20))
            }
        }

        if (this.volatility >= 0.999) {
            this.kill();
        }
    },
    draw() {
        this.super$draw();

        Draw.color(Color.red);
        Draw.alpha(this.volatility * 0.75)
        Fill.rect(this.x, this.y, 40, 40);

        Draw.reset();
    },
    shouldExplode() {
        return this.super$shouldExplode() && (this.items.get(this.fuelItem) >= 5 || this.volatility >= 0.25);
    },
    //听说有人会在快爆了的时候拆掉防爆
    onDeconstructed() {
        if(this.volatility >= 0.5)this.onDestroyed();
    },
    write(write) {
        this.super$write(write);

        write.f(this.volatility);
    },
    read(read, revision) {
        this.super$read(read, revision);

        this.volatility = read.f();
    }
}))
exports.biomassReactor = biomassReactor;
biomassReactor.consumeItem(item.protein, 1);
biomassReactor.consumeLiquid(liquid.ammonia, 0.1)
    .optional = true;