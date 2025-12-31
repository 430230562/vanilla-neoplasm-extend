const lib = require("vne/lib/researchlib");

const item = require("vne/item");
const liquid = require("vne/liquid")

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

        this.stats.add(Stat.output, StatValues.items(this.craftTime, ItemStack.with(item.protein, 7, item.chitin, 2)));
    },
    icons(){
		return [Core.atlas.find("vne-cyanide-plant")]
	},
})
cyanidePlant.buildType = prov(() => extend(GenericCrafter.GenericCrafterBuild, cyanidePlant, {
    style: false,
    i:0,
    updateTile() {
        this.super$updateTile();

        this.dump(item.chitin)
        this.dump(item.protein)
        if(!this.style){
            this.i += Time.delta * this.efficiency
        }
    },
    craft() {
        this.consume();

        if (this.style) {
            for (let i = 0; i < 2; i++) {
                this.offload(item.chitin);
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
    draw(){
        this.super$draw();
        
        Draw.z(35);
        
        Draw.rect(Core.atlas.find("vne-cyanide-plant-bottom"),this.x,this.y,0)
        
        LiquidBlock.drawTiledFrames(3, this.x, this.y, 0, Liquids.neoplasm, this.liquids.get(Liquids.neoplasm) / 30)
        Draw.rect(Core.atlas.find("vne-cyanide-plant-rotator0"),this.x,this.y,this.i * 3);
        Draw.rect(Core.atlas.find("vne-cyanide-plant-rotator1"),this.x,this.y,this.i * -4);
        LiquidBlock.drawTiledFrames(3, this.x, this.y, 0, Liquids.cyanogen, this.liquids.get(Liquids.cyanogen) / 30 * 0.5)
        
        Draw.rect(Core.atlas.find("vne-cyanide-plant-top"),this.x,this.y,0)
        
        if(this.style){
            Draw.rect(Core.atlas.find("vne-cyanide-plant-cell0"),this.x,this.y,0)
        }else{
            Draw.rect(Core.atlas.find("vne-cyanide-plant-cell1"),this.x,this.y,0)
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
    Liquids.neoplasm, 10 / 60
));
cyanidePlant.consumePower(1);

const adsorbent = new GenericCrafter("adsorbent");
exports.adsorbent = adsorbent;
Object.assign(adsorbent,{
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
        new DrawDefault()
    ),
    buildVisibility: BuildVisibility.shown,
    category: Category.crafting,
    requirements: ItemStack.with(
        Items.graphite, 35,
        Items.silicon, 30,
        Items.oxide, 25,
    ),
})
adsorbent.consumeLiquid(Liquids.neoplasm, 20 / 60);
adsorbent.consumeItem(Items.oxide, 1);

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
    Object.assign(new DrawArcSmelt(), {
        flameColor: Color.valueOf("fa7f7f"),
        midColor: Color.valueOf("ff9999")
    }),
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
Object.assign(laserIncinerator,{
    buildVisibility: BuildVisibility.shown,
    category: Category.crafting,
    hasPower: true,
    hasLiquids: false,
    requirements: ItemStack.with(
        Items.silicon, 8,
        Items.tungsten, 12,
    )
})
laserIncinerator.consumePower(5);

lib.addResearch(incubator, {
    parent: "silicon-arc-furnace",
    objectives: Seq.with(Objectives.OnSector(SectorPresets.intersect))
}, () => {
    TechTree.node(cyanidePlant, () => {})
});

lib.addResearch(ammoniaPlant, {
    parent: "oxidation-chamber",
}, () => {
    TechTree.node(watergasStove, () => {})
});

lib.addResearch(adsorbent, {
    parent: "oxidation-chamber",
}, () => {})

lib.addResearch(laserIncinerator, {
    parent: "slag-incinerator",
    objectives: Seq.with(Objectives.Research(adsorbent))
}, () => {})