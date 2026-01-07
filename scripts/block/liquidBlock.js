const item = require("vne/item");

const turbopump = extend(Pump, "turbopump", {
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
    Items.tungsten, 75),
    setStats() {
        this.super$setStats();

        let consumer = this.findConsumer(f => f instanceof ConsumeLiquidBase);
        if (consumer instanceof ConsumeLiquidBase) {
            let consBase = consumer;

            this.stats.remove(Stat.input);
            this.stats.add(Stat.booster,
            StatValues.speedBoosters("{0}" + StatUnit.timesSpeed.localized(),
            consBase.amount, 1.5,
            false, liquid => consBase.consumes(liquid)))
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
    solid: false,
    health: 400,
    liquidCapacity: 50,
    buildVisibility: BuildVisibility.shown,
    category: Category.liquid,
    requirements: ItemStack.with(
    Items.beryllium, 1,
    item.biomassSteel, 1)
})
biomassConduit.buildType = prov(() => extend(ArmoredConduit.ArmoredConduitBuild, biomassConduit, {
    status() {
        if (Mathf.equal(this.power.status, 0, 0.001)) return BlockStatus.noInput;
        if (Mathf.equal(this.power.status, 1, 0.001)) return BlockStatus.active;
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
    item.biomassSteel, 1),
    liquidCapacity: 75,
    hasPower: true,
    consumesPower: true,
    outputsPower: true,
    conductivePower: true,

    underBullets: true,
    solid: false,
    health: 500,
});
biomassLiquidRouter.buildType = prov(() => extend(LiquidRouter.LiquidRouterBuild, biomassLiquidRouter, {
    status() {
        if (Mathf.equal(this.power.status, 0, 0.001)) return BlockStatus.noInput;
        if (Mathf.equal(this.power.status, 1, 0.001)) return BlockStatus.active;
        return BlockStatus.noOutput;
    }
}))
biomassLiquidRouter.consumePowerBuffered(750)

const biomassLiquidJunction = new LiquidJunction("biomass-liquid-junction");
exports.biomassLiquidJunction = biomassLiquidJunction;
Object.assign(biomassLiquidJunction, {
    buildVisibility: BuildVisibility.shown,
    category: Category.liquid,
    requirements: ItemStack.with(
    Items.beryllium, 3,
    item.biomassSteel, 1),
    hasPower: true,
    consumesPower: true,
    outputsPower: true,
    conductivePower: true,

    underBullets: true,
    solid: false,
    health: 500,
})
biomassLiquidJunction.buildType = prov(() => extend(LiquidJunction.LiquidJunctionBuild, biomassLiquidJunction, {
    status() {
        if (Mathf.equal(this.power.status, 0, 0.001)) return BlockStatus.noInput;
        if (Mathf.equal(this.power.status, 1, 0.001)) return BlockStatus.active;
        return BlockStatus.noOutput;
    }
}))
biomassLiquidJunction.consumePowerBuffered(750)

const biomassConduitBridge = new LiquidBridge("biomass-conduit-bridge");
exports.biomassConduitBridge = biomassConduitBridge;
Object.assign(biomassConduitBridge, {
    fadeIn: false,
    moveArrows: false,
    hasPower: true,
    consumesPower: true,
    outputsPower: true,
    conductivePower: true,
    underBullets: true,
    health: 750,
    range: 8,
    arrowSpacing: 6,
    buildVisibility: BuildVisibility.shown,
    category: Category.liquid,
    requirements: ItemStack.with(
    Items.beryllium, 9,
    item.biomassSteel, 3),
})
biomassConduitBridge.buildType = prov(() => extend(LiquidBridge.LiquidBridgeBuild, biomassConduitBridge, {
    status(){
        if(Mathf.equal(this.power.status, 0, 0.001)) return BlockStatus.noInput;
        if(Mathf.equal(this.power.status, 1, 0.001)) return BlockStatus.active;
        return BlockStatus.noOutput;
    },
    updateTransport(other) {
        this.super$updateTransport(other);
        
        //怀疑没这么简单，但真就是把俩电网并起来这么简单
        if (other.power.graph != this.power.graph) {
            this.power.graph.addGraph(other.power.graph)
        }

        /*if(other.block.hasPower && other.block.outputsPower){
            
            //可能有更好的方法
            this.power.status = other.power.status = (this.power.status + other.power.status) / 2
        }*/
    },
    /*getPowerProduction(){
        let consumer = this.block.findConsumer(f => f instanceof ConsumePower);
        if(consumer != null && this.shouldConsume)return consumer.usage
        else return 0
    }*/
    /*updateTile() {
        this.super$updateTile();

        let nowLink = Vars.world.tile(this.link), lastLink;

        if (other == null)

        this.power

        let newgraph = new PowerGraph();
        //reflow from this point, covering all tiles on this side
        newgraph.reflow(this);

        if (prev.power.graph != newgraph) {
            //reflow power for other end
            PowerGraph og = new PowerGraph();
            og.reflow(prev);
        }

        /*
        let thisConsumer = this.block.findConsumer(f => f instanceof ConsumePower);
        
        Units.nearbyBuildings(this.x,this.y,12,b => {
            if(b != null && b != this){
                let otherConsumer = b.block.findConsumer(f => f instanceof ConsumePower);
            
                if(otherConsumer != null && otherConsumer.buffered && b.block.hasPower && b.block.consumesPower && b.block.outputsPower){
                    let transAmount = Math.min(50, (1 - b.power.status) * otherConsumer.capacity, this.power.status * thisConsumer.capacity);
                    b.power.status += transAmount / otherConsumer.capacity
                    this.power.status -= transAmount / thisConsumer.capacity
                }
            }
        })
    }*/
}))
biomassConduitBridge.consumePowerBuffered(250)
//biomassConduitBridge.consumePower(0.3);

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

/*updateDirections(){
            for(int i = 0; i < 4; i ++){
                var prev = links[i];
                var dir = Geometry.d4[i];
                links[i] = null;
                dests[i] = null;
                int offset = size/2;
                //find first block with power in range
                for(int j = 1 + offset; j <= range + offset; j++){
                    var other = world.build(tile.x + j * dir.x, tile.y + j * dir.y);

                    //hit insulated wall
                    if(other != null && other.isInsulated()){
                        break;
                    }

                    //power nodes do NOT play nice with beam nodes, do not touch them as that forcefully modifies their links
                    if(other != null && other.block.hasPower && other.block.connectedPower && other.team == team && !(other.block instanceof PowerNode)){
                        links[i] = other;
                        dests[i] = world.tile(tile.x + j * dir.x, tile.y + j * dir.y);
                        break;
                    }
                }

                var next = links[i];

                if(next != prev){
                    //unlinked, disconnect and reflow
                    if(prev != null && prev.isAdded()){
                        prev.power.links.removeValue(pos());
                        power.links.removeValue(prev.pos());

                        PowerGraph newgraph = new PowerGraph();
                        //reflow from this point, covering all tiles on this side
                        newgraph.reflow(this);

                        if(prev.power.graph != newgraph){
                            //reflow power for other end
                            PowerGraph og = new PowerGraph();
                            og.reflow(prev);
                        }
                    }

                    //linked to a new one, connect graphs
                    if(next != null){
                        power.links.addUnique(next.pos());
                        next.power.links.addUnique(pos());

                        power.graph.addGraph(next.power.graph);
                    }
                }
            }
        }*/

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