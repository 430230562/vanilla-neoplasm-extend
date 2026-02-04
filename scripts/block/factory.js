const item = require("vne/item");
const liquid = require("vne/liquid");
const {
    ammoniaTurbine
} = require("vne/effect");

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

const arkyciteRefinery = new Separator("arkycite-refinery");
exports.arkyciteRefinery = arkyciteRefinery;
Object.assign(arkyciteRefinery, {
    results: ItemStack.with(
    Items.graphite, 4,
    item.protein, 6),
    craftTime: 20,
    liquidCapacity: 160,
    size: 3,
    hasPower: true,
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
    Items.oxide, 25, )
})
arkyciteRefinery.consumePower(3);
arkyciteRefinery.consumeLiquid(Liquids.arkycite, 40 / 60);

const cyanidePlant = extend(GenericCrafter, "cyanide-plant", {
    craftEffect: Fx.none,
    craftTime: 150,
    size: 3,
    liquidCapacity: 30,
    hasPower: true,
    hasLiquids: true,
    hasItems: true,
    configurable: true,
    drawer: new DrawDefault(),
    buildVisibility: BuildVisibility.shown,
    category: Category.crafting,
    requirements: ItemStack.with(
    Items.graphite, 70,
    Items.silicon, 50,
    Items.oxide, 35,
    Items.carbide, 25),
    setStats() {
        this.super$setStats();

        this.stats.add(Stat.output, StatValues.items(this.craftTime, ItemStack.with(item.protein, 7, Items.dormantCyst, 2)));
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
        write.f(this.style);
    },
    read(read, revision) {
        this.super$read(read, revision);
        this.style = read.f();
    }
}));
cyanidePlant.consumeLiquids(LiquidStack.with(
Liquids.cyanogen, 0.05,
Liquids.neoplasm, 10 / 60));
cyanidePlant.consumePower(1);

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
    new DrawDefault(),
    new DrawHeatOutput()
    ),
    buildVisibility: BuildVisibility.shown,
    category: Category.crafting,
    requirements: ItemStack.with(
        Items.silicon, 120,
        Items.tungsten, 80,
        Items.carbide, 75,
    )
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