const item = require("vne/item");

const turbopump = extend(Pump,"turbopump",{
    hasPower: true,
    consumesPower: true,
    size: 3,
    pumpAmount: 20 / 60,
    liquidCapacity: 360,
    buildVisibility: BuildVisibility.shown,
    category: Category.liquid,
    requirements: ItemStack.with(
        item.biomassSteel, 20,
        Items.silicon, 50,
        Items.tungsten, 75
    ),
    setStats(){
        this.super$setStats();
        
        let consumer = this.findConsumer(f => f instanceof ConsumeLiquidBase);
        if(consumer instanceof ConsumeLiquidBase){
            let consBase = consumer;
            
            this.stats.remove(Stat.input);
            this.stats.add(Stat.booster,
                StatValues.speedBoosters("{0}" + StatUnit.timesSpeed.localized(),
                consBase.amount, 1.5, 
                false, liquid => consBase.consumes(liquid))
            )
        
        }
    }
});
exports.turbopump = turbopump;
turbopump.buildType = prov(() => extend(Pump.PumpBuild, turbopump, {
    mul: 1,
    updateTile() {
        if (this.liquids.get(Liquids.hydrogen) > 0.0001) {
            this.mul = 1.5;
        } else {
            this.mul = 1;
        }
        if (this.efficiency > 0 && this.liquidDrop != null) {
            let maxPump = Math.min(this.block.liquidCapacity - this.liquids.get(this.liquidDrop), this.amount * this.block.pumpAmount * Time.delta * this.efficiency * this.mul);
            this.liquids.add(this.liquidDrop, maxPump);
        }

        this.totalProgress += this.mul * Time.delta;

        if (this.liquidDrop != null) {
            this.dumpLiquid(this.liquidDrop);
        }
    }
}))
turbopump.consumeLiquid(Liquids.hydrogen, 3 / 60)
    .optional = true;
turbopump.consumePower(1);

const biomassConduit = new ArmoredConduit("biomass-conduit");
exports.biomassConduit = biomassConduit;
Object.assign(biomassConduit, {
    hasPower: true,
    consumesPower: true,
    outputsPower: true,
    conductivePower: true,

    underBullets: true,
    health: 400,
    liquidCapacity: 50,
    buildVisibility: BuildVisibility.shown,
    category: Category.liquid,
    requirements: ItemStack.with(
        Items.beryllium, 1,
        item.biomassSteel, 1
    )
})
biomassConduit.buildType = prov(() => extend(ArmoredConduit.ArmoredConduitBuild, biomassConduit, {
    status(){
        if(Mathf.equal(this.power.status, 0, 0.001)) return BlockStatus.noInput;
        if(Mathf.equal(this.power.status, 1, 0.001)) return BlockStatus.active;
        return BlockStatus.noOutput;
    }
}))
biomassConduit.consumePowerBuffered(250)

const biomassLiquidRouter = new LiquidRouter("biomass-liquid-router");
exports.biomassLiquidRouter = biomassLiquidRouter;
Object.assign(biomassLiquidRouter, {
	buildVisibility: BuildVisibility.shown,
	category: Category.liquid,
	requirements: ItemStack.with(
		Items.beryllium, 3,
        item.biomassSteel, 1
	),
	liquidCapacity: 75,
	hasPower: true,
    consumesPower: true,
    outputsPower: true,
    conductivePower: true,

    underBullets: true,
    health: 500,
});
biomassLiquidRouter.consumePowerBuffered(750)

const biomassLiquidJunction = new LiquidJunction("biomass-liquid-junction");
exports.biomassLiquidJunction = biomassLiquidJunction;
Object.assign(biomassLiquidJunction, {
	buildVisibility: BuildVisibility.shown,
	category: Category.liquid,
	requirements: ItemStack.with(
		Items.beryllium, 3,
        item.biomassSteel, 1
	),
	hasPower: true,
    consumesPower: true,
    outputsPower: true,
    conductivePower: true,

    underBullets: true,
    health: 500,
})
biomassLiquidJunction.consumePowerBuffered(750)

/*电路角色判断
if(build.block.outputsPower && build.block.consumesPower && !build.block.consPower.buffered){
    冲击反应堆
    producers.add(build);
    consumers.add(build);
}else if(build.block.outputsPower && build.block.consumesPower){
    电池
    batteries.add(build);
}else if(build.block.outputsPower){
    发电机
    producers.add(build);
}else if(build.block.consumesPower && build.block.consPower != null){
    用电器
    consumers.add(build);
}
*/

//未来发光贴图
/*draw(){
            int r = this.rotation;

            //draw extra conduits facing this one for tiling purposes
            Draw.z(Layer.blockUnder);
            for(int i = 0; i < 4; i++){
                if((blending & (1 << i)) != 0){
                    int dir = r - i;
                    drawAt(x + Geometry.d4x(dir) * tilesize*0.75f, y + Geometry.d4y(dir) * tilesize*0.75f, 0, i == 0 ? r : dir, i != 0 ? SliceMode.bottom : SliceMode.top);
                }
            }

            Draw.z(Layer.block);

            Draw.scl(xscl, yscl);
            drawAt(x, y, blendbits, r, SliceMode.none);
            Draw.reset();

            if(capped && capRegion.found()) Draw.rect(capRegion, x, y, rotdeg());
            if(backCapped && capRegion.found()) Draw.rect(capRegion, x, y, rotdeg() + 180);
        }*/