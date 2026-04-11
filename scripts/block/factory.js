const item = require("vne/item");
const liquid = require("vne/liquid");
const {
    ammoniaTurbine
} = require("vne/effect");
const {
    DrawMultiRotationRegion
} = require("vne/lib/draw")

const {
    MultiCrafter, DrawRecipe, IOEntry, Recipe
} = require("vne/lib/multi-crafter")

/*const c = new MultiCrafter("js")
c.recipes = [{
    input:{
        items : [
        "copper/1",{
            item:"surge-alloy",
            amount: 2
        }]
    },
    output:{
        items : ["coal/1"],
        power : 2
    },
    craftTime : 120.0
},{
    input:{
        items : [

        "titanium/1"
        ],
        power : 2
    },
    output:{
        items : "graphite/1",
        fluids : "water/1.2"
    },
    craftTime : 240.0
},{
    input:{
        fluids : "water/1"
    },
    output:{
        fluids:{
            fluid : "slag",
            amount : 1.5
        }
    },
    craftTime : 240.0
},{
    input:{
        fluids : "water/1"
    },
    output:{
        heat : 5
    },
    craftTime : 120.0
},{
    input:{
        heat : 8
    },
    output: "sand/1",
    craftTime : 120.0
}]
*/

const microHeatRedirector = new HeatConductor("micro-heat-redirector")
exports.microHeatRedirector = microHeatRedirector;
Object.assign(microHeatRedirector, {
    buildVisibility: BuildVisibility.shown,
    category: Category.crafting,
    requirements: ItemStack.with(
    Items.graphite, 3,
    item.biomassSteel, 1, ),
    size: 1,
    drawer: new DrawMulti(
    new DrawDefault(),
    new DrawHeatOutput(),
    new DrawHeatInput("-heat")),
    regionRotated1: 1,
})

const smallHeatRouter = new HeatConductor("small-heat-router");
exports.smallHeatRouter = smallHeatRouter;
Object.assign(smallHeatRouter, {
    buildVisibility: BuildVisibility.shown,
    category: Category.crafting,
    requirements: ItemStack.with(
    Items.graphite, 8,
    Items.surgeAlloy, 8, ),
    size: 2,
    drawer: new DrawMulti(
    new DrawDefault(),
    new DrawHeatOutput(-1, false),
    new DrawHeatOutput(),
    new DrawHeatOutput(1, false),
    new DrawHeatInput("-heat")),
    regionRotated1: 1,
    splitHeat: true
})

const microHeatRouter = new HeatConductor("micro-heat-router");
exports.microHeatRouter = microHeatRouter;
Object.assign(microHeatRouter, {
    buildVisibility: BuildVisibility.shown,
    category: Category.crafting,
    requirements: ItemStack.with(
    Items.graphite, 3,
    item.biomassSteel, 1, ),
    size: 1,
    drawer: new DrawMulti(
    new DrawDefault(),
    new DrawHeatOutput(-1, false),
    new DrawHeatOutput(),
    new DrawHeatOutput(1, false),
    new DrawHeatInput("-heat")),
    regionRotated1: 1,
    splitHeat: true
})

const incubator = new AttributeCrafter("incubator");
exports.incubator = incubator;
Object.assign(incubator, {
    craftEffect: Fx.none,
    outputItem: new ItemStack(item.protein, 1),
    craftTime: 150,
    size: 3,
    hasPower: true,
    hasLiquids: true,
    hasItems: true,
    attribute: Attribute.get("biomass"),
    boostScale: 1 / 9,
    maxBoost: 2,
    drawer: new DrawMulti(
    new DrawRegion("-bottom"),
    new DrawLiquidTile(Liquids.water),
    Object.assign(new DrawCultivator(), {}),
    new DrawDefault(),
    new DrawRegion("-top")),
    buildVisibility: BuildVisibility.shown,
    category: Category.crafting,
    requirements: ItemStack.with(
    Items.graphite, 70,
    Items.silicon, 60,
    Items.tungsten, 25),
})
incubator.consumePower(1.2);
incubator.consumeLiquid(Liquids.water, 18 / 60);

const arkyciteRefinery = extend(Separator, "arkycite-refinery", {
    results: ItemStack.with(
    Items.graphite, 4,
    item.protein, 6),
    craftTime: 20,
    liquidCapacity: 160,
    size: 3,
    hasPower: true,
    hasLiquids: true,
    drawer: new DrawMulti(
    new DrawRegion("-bottom"),
    Object.assign(new DrawParticles(), {
        alpha: 0.70,
        particleRad: 10,
        particleSize: 9,
        particleLife: 60,
        particles: 8,
        rotateScl: -3,
        reverse: true,
        color: Color.valueOf("84a94b"),
    }),
    new DrawDefault()),
    buildVisibility: BuildVisibility.shown,
    category: Category.crafting,
    requirements: ItemStack.with(
    Items.graphite, 60,
    Items.silicon, 60,
    Items.tungsten, 25,
    Items.oxide, 25, ),

    setStats() {
        this.super$setStats();

        this.stats.add(Stat.output, StatValues.liquid(liquid.naturalGas, 3, true));
    },
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
        }))))
    }
});
exports.arkyciteRefinery = arkyciteRefinery;
arkyciteRefinery.consumePower(3);
arkyciteRefinery.consumeLiquid(Liquids.arkycite, 40 / 60);
arkyciteRefinery.buildType = prov(() => extend(Separator.SeparatorBuild, arkyciteRefinery, {
    updateTile() {
        this.super$updateTile();

        if (this.efficiency > 0) {
            let maxProduce = Math.min(this.block.liquidCapacity - this.liquids.get(liquid.naturalGas), Time.delta * this.efficiency * 0.05);
            this.liquids.add(liquid.naturalGas, maxProduce)
        }

        this.dumpLiquid(liquid.naturalGas);
    },
    getOutputLiquid() {
        return {
            liquid: liquid.naturalGas,
            amount: this.liquids.get(liquid.naturalGas)
        }
    },
}))

const irradiationChamber = new GenericCrafter("irradiation-chamber");
exports.irradiationChamber = irradiationChamber;
Object.assign(irradiationChamber, {
    craftEffect: Fx.none,
    size: 3,
    liquidCapacity: 90,
    itemCapacity: 24,
    craftTime: 120,
    hasPower: true,
    hasLiquids: true,
    hasItems: true,
    outputItem: new ItemStack(Items.dormantCyst, 1),
    outputLiquid: new LiquidStack(Liquids.neoplasm, 10 / 60),
    drawer: new DrawMulti(
    new DrawDefault(),
    new DrawWarmupRegion()),
    buildVisibility: BuildVisibility.shown,
    category: Category.crafting,
    requirements: ItemStack.with(
    Items.silicon, 125,
    Items.oxide, 75,
    Items.carbide, 35,
    item.siliconNitride, 45),
})
irradiationChamber.consumeItem(item.protein, 4)
irradiationChamber.consume(ConsumeItemRadioactive(0.5))
irradiationChamber.buildType = prov(() => extend(GenericCrafter.GenericCrafterBuild, irradiationChamber, {
    updateTile() {
        this.super$updateTile()

        if (this.liquids.get(Liquids.neoplasm) >= this.block.liquidCapacity - 0.01) {
            this.kill()
        }
    },
    craft(){
        this.super$craft();
        
        Vars.content.items().each(i => {
            if(this.items.get(i) > 0 && this.items.get(i) <= this.block.itemCapacity &&
                i.radioactivity >= 0.5 && 
                Mathf.chance(1.175 - i.radioactivity * 0.375)){
                    this.items.add(i, 1)
                }
        });
    }
}))

const cyanidePlant = new MultiCrafter("cyanide-plant");
exports.cyanidePlant = cyanidePlant;
Object.assign(cyanidePlant, {
    craftEffect: Fx.none,
    size: 3,
    liquidCapacity: 30,
    hasPower: true,
    hasLiquids: true,
    hasItems: true,
    configurable: true,
    drawer: Object.assign(new DrawRecipe(), {
        defaultDrawer: 0,
        drawers: [
        //配方1
        new DrawMulti(
        new DrawRegion("-bottom"),
        new DrawLiquidTile(Liquids.neoplasm),
        new DrawRegion("-rotator0", 0, true),
        new DrawRegion("-rotator1", 0, true),
        Object.assign(new DrawLiquidTile(Liquids.cyanogen), {
            alpha: 0.5,
        }),
        new DrawDefault(),
        new DrawRegion("-cell0")),
        //配方2
        new DrawMulti(
        new DrawRegion("-bottom"),
        new DrawLiquidTile(Liquids.neoplasm),
        new DrawRegion("-rotator0", 3, true),
        new DrawRegion("-rotator1", -4, true),
        Object.assign(new DrawLiquidTile(Liquids.cyanogen), {
            alpha: 0.5,
        }),
        new DrawDefault(),
        new DrawRegion("-cell1"))
        ]
    }),
    resolvedRecipes: Seq.with(
        Object.assign(new Recipe(),{
            input: Object.assign(new IOEntry(),{
                fluids: LiquidStack.with(
                    Liquids.cyanogen, 0.05,
                    Liquids.neoplasm, 10 / 60
                ),
                power: 1,
                icon: prov(() => Core.atlas.find("liquid-neoplasm"))
            }),
            output: Object.assign(new IOEntry(),{
                items: ItemStack.with(Items.dormantCyst, 1)
            }),
            craftTime: 150.0
    }),
        Object.assign(new Recipe(),{
            input: Object.assign(new IOEntry(),{
                fluids: LiquidStack.with(
                    Liquids.cyanogen, 0.05,
                    Liquids.neoplasm, 10 / 60
                ),
                power: 1,
                icon: prov(() => Core.atlas.find("liquid-neoplasm"))
            }),
            output: Object.assign(new IOEntry(),{
                items: ItemStack.with(item.protein, 1)
            }),
            craftTime: 50.0
        })
    ),
    buildVisibility: BuildVisibility.shown,
    category: Category.crafting,
    requirements: ItemStack.with(
    Items.graphite, 70,
    Items.silicon, 50,
    Items.oxide, 35,
    item.siliconNitride, 45),
})

/*const cyanidePlant = extend(GenericCrafter, "", {

    setStats() {
        this.super$setStats();

        this.stats.add(Stat.output, StatValues.items(this.craftTime, ItemStack.with(item.protein, 7, )));
    },
    icons() {
        return [Core.atlas.find("vne-cyanide-plant")]
    },
})
exports.cyanidePlant = cyanidePlant;
cyanidePlant.buildType = prov(() => extend(GenericCrafter.GenericCrafterBuild, cyanidePlant, {
    style: false,
    i: 0,
    updateTile() {
        this.super$updateTile();

        this.dump(Items.dormantCyst)
        this.dump(item.protein)
        if (!this.style) {
            this.i += Time.delta * this.efficiency
        }
    },
    craft() {
        this.consume();

        if (this.style) {
            for (let i = 0; i < 2; i++) {
                this.offload(Items.dormantCyst);
            }
        } else {
            for (let i = 0; i < 7; i++) {
                this.offload(item.protein);
            }
        }

        this.progress %= 1
    },
    buildConfiguration(table) {
        table.button(Icon.upOpen, Styles.cleari, run(() => {
            this.style = !this.style
        }))
    },
    draw() {
        this.super$draw();

        Draw.z(35);

        Draw.rect(Core.atlas.find("vne-cyanide-plant-bottom"), this.x, this.y, 0)

        LiquidBlock.drawTiledFrames(3, this.x, this.y, 0, Liquids.neoplasm, this.liquids.get(Liquids.neoplasm) / 30)
        Draw.rect(Core.atlas.find("vne-cyanide-plant-rotator0"), this.x, this.y, this.i * 3);
        Draw.rect(Core.atlas.find("vne-cyanide-plant-rotator1"), this.x, this.y, this.i * -4);
        LiquidBlock.drawTiledFrames(3, this.x, this.y, 0, Liquids.cyanogen, this.liquids.get(Liquids.cyanogen) / 30 * 0.5)

        Draw.rect(Core.atlas.find("vne-cyanide-plant-top"), this.x, this.y, 0)

        if (this.style) {
            Draw.rect(Core.atlas.find("vne-cyanide-plant-cell0"), this.x, this.y, 0)
        } else {
            Draw.rect(Core.atlas.find("vne-cyanide-plant-cell1"), this.x, this.y, 0)
        }
        Draw.reset();
    },
    //为什么我之前没发现这一点
    write(write) {
        this.super$write(write);
        write.bool(this.style);
    },
    read(read, revision) {
        this.super$read(read, revision);
        this.style = read.bool();
    }
}));
cyanidePlant.consumeLiquids();
cyanidePlant.consumePower(1);
*/

const adsorbent = new GenericCrafter("adsorbent");
exports.adsorbent = adsorbent;
Object.assign(adsorbent, {
    craftEffect: Fx.none,
    craftTime: 120,
    outputItem: new ItemStack(item.coagulantIngot, 1),
    size: 2,
    liquidCapacity: 40,
    hasPower: false,
    hasLiquids: true,
    hasItems: true,
    drawer: new DrawMulti(
    new DrawRegion("-bottom"),
    new DrawLiquidTile(Liquids.neoplasm),
    new DrawDefault()),
    buildVisibility: BuildVisibility.shown,
    category: Category.crafting,
    requirements: ItemStack.with(
    Items.graphite, 35,
    Items.silicon, 30,
    Items.oxide, 25, ),
})
adsorbent.consumeLiquid(Liquids.neoplasm, 20 / 60);
adsorbent.consumeItem(Items.oxide, 1);

const siliconNitrideFurnace = new HeatProducer("silicon-nitride-furnace");
exports.siliconNitrideFurnace = siliconNitrideFurnace;
Object.assign(siliconNitrideFurnace, {
    ambientSound: Sounds.loopSmelter,
    ambientSoundVolume: 0.11,
    craftEffect: Fx.none,
    craftTime: 60,
    outputItem: new ItemStack(item.siliconNitride, 2),
    itemCapacity: 15,
    hasPower: true,
    hasLiquids: true,
    hasItems: true,
    rotateDraw: false,
    size: 3,
    regionRotated1: 2,
    liquidCapacity: 30,
    heatOutput: 12,
    drawer: new DrawMulti(
    new DrawRegion("-bottom"),
    new DrawArcSmelt(),
    Object.assign(new DrawLiquidTile(Liquids.nitrogen), {
        alpha: 0.5,
    }),
    new DrawDefault(),
    new DrawHeatOutput()),
    buildVisibility: BuildVisibility.shown,
    category: Category.crafting,
    requirements: ItemStack.with(
    Items.silicon, 120,
    Items.tungsten, 80,
    Items.oxide, 75, )
});
siliconNitrideFurnace.consumeItem(Items.silicon, 3)
siliconNitrideFurnace.consumeLiquid(Liquids.nitrogen, 8 / 60)
siliconNitrideFurnace.consumePower(1.5);

const biomassSmelter = extend(GenericCrafter, "biomass-smelter", {
    setBars() {
        this.super$setBars();

        this.addBar("instability", func(e => new Bar(
        prov(() => Core.bundle.get("bar.instability")),
        prov(() => Pal.sap),
        floatp(() => e.getInstability()))));
    },
    health: 360,
    craftEffect: Fx.smeltsmoke,
    outputItem: new ItemStack(item.biomassSteel, 3),
    craftTime: 120,
    itemCapacity: 30,
    size: 3,
    baseExplosiveness: 360,
    hasPower: true,
    hasLiquids: false,
    drawer: new DrawMulti(
    new DrawDefault(),
    new DrawFlame(Color.valueOf("c7d9a3"))),
    ambientSound: Sounds.loopSmelter,
    ambientSoundVolume: 0.55, //一定很吵，但这是我想要的
    buildVisibility: BuildVisibility.shown,
    category: Category.crafting,
    requirements: ItemStack.with(
    Items.silicon, 50,
    Items.carbide, 35,
    Items.oxide, 25,
    item.siliconNitride, 20, )
});
exports.biomassSmelter = biomassSmelter;
biomassSmelter.buildType = prov(() => extend(GenericCrafter.GenericCrafterBuild, biomassSmelter, {
    volatility: 0,
    coolantLiquid: Liquids.water,

    getInstability() {
        return this.volatility;
    },
    updateTile() {
        this.super$updateTile();

        if (this.efficiency > 0) {
            if (this.liquids.get(this.coolantLiquid) < 0.001) {
                this.volatility += 0.0025 * Math.min(Time.delta, 4);
            } else if (this.volatility >= 0) {
                this.volatility -= 0.005 * Math.min(Time.delta, 4);
            }

            if (Mathf.chance(0.05)) {
                Fx.reactorsmoke.at(this.x + Mathf.range(12), this.y + Mathf.range(12))
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
        Fill.rect(this.x, this.y, 24, 24);

        Draw.reset();
    },
    onDestroyed() {
        if (this.tile != null) this.tile.circle(8 * this.volatility, cons(tile => {
            Puddles.deposit(tile, Liquids.neoplasm, 70);
        }))

        Fx.reactorExplosion.at(this.x, this.y, 0, Color.valueOf("c33e2b"));
        Sounds.explosionReactor.at(this);

        this.super$onDestroyed();
    },
    //听说有人会在快爆了的时候拆掉防爆
    onDeconstructed() {
        if (this.volatility >= 0.5) this.onDestroyed();
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
biomassSmelter.consumeItems(ItemStack.with(
Items.carbide, 2,
Items.oxide, 3,
item.protein, 7, ));
biomassSmelter.consumePower(3);
biomassSmelter.consumeLiquid(Liquids.water, 0.1)
    .optional = true;

const stableBiomassSmelter = new GenericCrafter("stable-biomass-smelter");
exports.stableBiomassSmelter = stableBiomassSmelter;
Object.assign(stableBiomassSmelter, {
    health: 1180,
    craftEffect: Fx.smeltsmoke,
    outputItem: new ItemStack(item.biomassSteel, 3),
    craftTime: 180,
    itemCapacity: 30,
    size: 5,
    hasPower: true,
    hasLiquids: false,
    drawer: new DrawMulti(
    new DrawDefault(),
    new DrawFlame(Color.valueOf("c7d9a3"))),
    ambientSound: Sounds.loopSmelter,
    ambientSoundVolume: 0.1,
    buildVisibility: BuildVisibility.shown,
    category: Category.crafting,
    requirements: ItemStack.with(
    Items.silicon, 120,
    Items.carbide, 150,
    Items.oxide, 110,
    item.biomassSteel, 100, )
})
stableBiomassSmelter.consumeItems(ItemStack.with(
Items.carbide, 2,
Items.oxide, 3,
item.protein, 7, ));
stableBiomassSmelter.consumePower(5);

const ammoniaPlant = new HeatCrafter("ammonia-plant");
exports.ammoniaPlant = ammoniaPlant;
Object.assign(ammoniaPlant, {
    craftEffect: Fx.none,
    ambientSound: Sounds.loopSmelter,
    ambientSoundVolume: 0.06,
    outputLiquid: new LiquidStack(liquid.ammonia, 0.1),
    heatRequirement: 5,
    maxEfficiency: 3,
    liquidCapacity: 30,
    craftTime: 60,
    size: 3,
    hasPower: true,
    hasLiquids: true,
    drawer: new DrawMulti(
    new DrawRegion("-bottom"),
    new DrawLiquidTile(Liquids.hydrogen),
    new DrawLiquidTile(Liquids.nitrogen),
    new DrawLiquidTile(liquid.ammonia),
    Object.assign(new DrawParticles(), {
        alpha: 0.10,
        particleRad: 10,
        particleSize: 9,
        particleLife: 110,
        particles: 15,
        rotateScl: -3,
        reverse: true,
        color: Color.valueOf("9eabf7"),
    }),
    Object.assign(new DrawParticles(), {
        alpha: 0.10,
        particleRad: 10,
        particleSize: 9,
        particleLife: 110,
        particles: 15,
        rotateScl: -3,
        reverse: true,
        color: Color.valueOf("efe3ff"),
    }),
    new DrawDefault(),
    new DrawHeatInput(), ),
    buildVisibility: BuildVisibility.shown,
    category: Category.crafting,
    requirements: ItemStack.with(
    Items.graphite, 110,
    Items.silicon, 100,
    Items.tungsten, 75,
    Items.oxide, 35, ),
})
ammoniaPlant.consumeLiquids(LiquidStack.with(
Liquids.hydrogen, 0.15,
Liquids.nitrogen, 0.05));
ammoniaPlant.consumePower(0.6);

const watergasStove = new HeatCrafter("watergas-stove");
exports.watergasStove = watergasStove;
Object.assign(watergasStove, {
    craftEffect: Fx.none,
    ambientSound: Sounds.loopSmelter,
    ambientSoundVolume: 0.12,
    outputLiquid: new LiquidStack(Liquids.hydrogen, 0.45),
    heatRequirement: 8,
    maxEfficiency: 5,
    liquidCapacity: 30,
    craftTime: 60,
    size: 3,
    hasPower: true,
    hasLiquids: true,
    drawer: new DrawMulti(
    new DrawRegion("-bottom"),
    new DrawLiquidTile(Liquids.water),
    new DrawLiquidTile(Liquids.hydrogen),
    Object.assign(new DrawParticles(), {
        alpha: 0.15,
        particleRad: 12,
        particleSize: 9,
        particleLife: 110,
        particles: 15,
        rotateScl: -3,
        reverse: true,
        color: Color.valueOf("9eabf7"),
    }),
    new DrawDefault(),
    new DrawHeatInput(), ),
    buildVisibility: BuildVisibility.shown,
    category: Category.crafting,
    requirements: ItemStack.with(
    Items.silicon, 100,
    Items.tungsten, 100,
    Items.oxide, 55, )
})
watergasStove.consumeLiquid(Liquids.water, 0.3);
watergasStove.consumeItem(Items.graphite, 3);
watergasStove.consumePower(2.5);

const BMAStove = new GenericCrafter("BMA-stove");
exports.BMAStove = BMAStove;
Object.assign(BMAStove, {
    ambientSound: Sounds.loopSmelter,
    ambientSoundVolume: 0.11,
    craftEffect: Fx.none,
    hasPower: true,
    hasLiquids: true,
    hasItems: false,
    rotateDraw: false,
    size: 3,
    liquidCapacity: 30,
    liquidOutputDirections: [1, 3],
    outputLiquids: LiquidStack.with(
    Liquids.hydrogen, 0.3,
    Liquids.cyanogen, 0.05),
    rotate: true,
    invertFlip: true,
    regionRotated1: 3,
    drawer: new DrawMulti(
    new DrawRegion("-bottom"),
    new DrawArcSmelt(),
    Object.assign(new DrawLiquidTile(liquid.naturalGas), {
        alpha: 0.5,
    }),
    Object.assign(new DrawLiquidTile(liquid.ammonia), {
        alpha: 0.5,
    }),
    new DrawDefault(),
    new DrawLiquidOutputs(), ),
    buildVisibility: BuildVisibility.shown,
    category: Category.crafting,
    requirements: ItemStack.with(
    Items.silicon, 120,
    Items.tungsten, 150,
    Items.oxide, 80,
    item.siliconNitride, 125, )
})
BMAStove.consumeLiquids(LiquidStack.with(
liquid.naturalGas, 0.1,
liquid.ammonia, 0.1));
BMAStove.consumePower(700 / 60);

const laserIncinerator = new Incinerator("laser-incinerator");
exports.laserIncinerator = laserIncinerator;
Object.assign(laserIncinerator, {
    buildVisibility: BuildVisibility.shown,
    category: Category.crafting,
    hasPower: true,
    hasLiquids: false,
    requirements: ItemStack.with(
    Items.silicon, 8,
    Items.tungsten, 12, )
})
laserIncinerator.consumePower(5);

const floorCrusher = extend(AttributeCrafter, "floor-crusher", {
    attribute: Attribute.sand,
    baseEfficiency: 0,
    minEfficiency: 0.1,
    boostScale: 1 / 4,
    maxBoost: 2,
    craftEffect: Fx.mine,
    drawer: new DrawMulti(
    new DrawMultiRotationRegion("-rotator", 2, 4, 3.6, 3, false),
    new DrawMultiRotationRegion("-axis", 2, 4, 0, 3, false),
    new DrawDefault()),
    craftTime: 300 / 4,
    size: 2,
    ambientSound: Sounds.loopDrill,
    ambientSoundVolume: 0.06,
    outputItem: new ItemStack(Items.sand, 1),
    buildVisibility: BuildVisibility.shown,
    category: Category.production,
    requirements: ItemStack.with(
    Items.graphite, 40,
    Items.beryllium, 25, ),
    setStats() {
        this.super$setStats();

        //假装它是一个Drill
        this.stats.add(Stat.drillSpeed, 60 / this.craftTime, StatUnit.itemsSecond);
        this.stats.remove(Stat.productionTime)
    },
});
exports.floorCrusher = floorCrusher;
floorCrusher.consumePower(10 / 60);

const largeFloorCrusher = extend(AttributeCrafter, "large-floor-crusher", {
    attribute: Attribute.sand,
    baseEfficiency: 0,
    minEfficiency: 0.1,
    boostScale: 1 / 9,
    maxBoost: 2,
    craftEffect: Fx.mineBig,
    drawer: new DrawMulti(
    new DrawMultiRotationRegion("-rotator", 1.2, 6, 3, 6, false),
    new DrawMultiRotationRegion("-axis", 1.2, 6, 0, 6, false),
    new DrawDefault()),
    craftTime: 225 / 9,
    size: 3,
    ambientSound: Sounds.loopDrill,
    ambientSoundVolume: 0.08,
    outputItem: new ItemStack(Items.sand, 1),
    itemCapacity: 20,
    buildVisibility: BuildVisibility.shown,
    category: Category.production,
    requirements: ItemStack.with(
    Items.silicon, 120,
    Items.beryllium, 120,
    Items.tungsten, 75,
    item.siliconNitride, 55, ),
    setStats() {
        this.super$setStats();

        //假装它是一个Drill
        this.stats.add(Stat.drillSpeed, 60 / this.craftTime, StatUnit.itemsSecond);
        this.stats.remove(Stat.productionTime)

        let consumer = this.findConsumer(f => f instanceof ConsumeLiquidBase);

        this.stats.remove(Stat.input);
        this.stats.add(Stat.booster,
        StatValues.speedBoosters("{0}" + StatUnit.timesSpeed.localized(),
        consumer.amount, 2,
        false, liquid => consumer.consumes(liquid)))

    },
});
exports.largeFloorCrusher = largeFloorCrusher;
largeFloorCrusher.buildType = prov(() => extend(AttributeCrafter.AttributeCrafterBuild, largeFloorCrusher, {
    efficiencyMultiplier() {
        let originalEfficiency = this.super$efficiencyMultiplier();
        if (this.liquids.get(liquid.naturalGas) >= 0.001) {
            return originalEfficiency * 2
        } else {
            return originalEfficiency
        }
    }
}))
largeFloorCrusher.consumePower(1);
largeFloorCrusher.consumeLiquid(liquid.naturalGas, 3 / 60)
    .optional = true;

const ammoniaCollector = new AttributeCrafter("ammonia-collector");
exports.ammoniaCollector = ammoniaCollector;
Object.assign(ammoniaCollector, {
    attribute: Attribute.get("ammonia"),
    group: BlockGroup.liquids,
    minEfficiency: 9 - 0.0001,
    baseEfficiency: 0,
    displayEfficiency: false,
    craftEffect: ammoniaTurbine,
    drawer: new DrawMulti(
    new DrawRegion("-bottom"),
    new DrawBlurSpin("-rotator", 3.6),
    Object.assign(new DrawLiquidTile(liquid.ammonia), {
        alpha: 0.75
    }),
    new DrawDefault(),
    new DrawRegion("-top"), ),
    craftTime: 120,
    size: 3,
    ambientSound: Sounds.loopHum,
    ambientSoundVolume: 0.06,
    hasLiquids: true,
    boostScale: 1 / 9,
    itemCapacity: 0,
    outputLiquid: new LiquidStack(liquid.ammonia, 6 / 60),
    liquidCapacity: 30,

    buildVisibility: BuildVisibility.shown,
    category: Category.production,
    requirements: ItemStack.with(
    Items.graphite, 40,
    Items.silicon, 75,
    Items.oxide, 55)
})
ammoniaCollector.consumePower(1);