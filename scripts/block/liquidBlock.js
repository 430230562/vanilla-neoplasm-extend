const item = require("vne/item");

const turbopump = new Pump("turbopump");
exports.turbopump = turbopump;
Object.assign(turbopump, {
    hasPower: true,
    consumesPower: true,
    size: 3,
    pumpAmount: 20 / 60,
    liquidCapacity: 200,
    buildVisibility: BuildVisibility.shown,
    category: Category.liquid,
    requirements: ItemStack.with(
    item.biomassSteel, 20,
    Items.silicon, 50,
    Items.tungsten, 75)
})
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
    conductivePower: true,

    underBullets: true,
    health: 400,
    liquidCapacity: 50,
    buildVisibility: BuildVisibility.shown,
    category: Category.liquid,
    requirements: ItemStack.with(item.biomassSteel, 1)
})
biomassConduit.buildType = prov(() => extend(ArmoredConduit.ArmoredConduitBuild, biomassConduit, {}))

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