const item = require("vne/item");

const hydraulicPump = new Pump("hydraulic-pump");
exports.hydraulicPump = hydraulicPump;
Object.assign(hydraulicPump, {
    pumpAmount: 10 / 60,
    buildVisibility: BuildVisibility.shown,
    category: Category.liquid,
    requirements: ItemStack.with(
        Items.metaglass, 10,
        Items.copper, 8,
        item.nickel, 8,
    )
})

const screwPump = new Pump("screw-pump");
exports.screwPump = screwPump;
Object.assign(screwPump, {
    size: 2,
    pumpAmount: 15 / 60,
    health: 240,
    liquidCapacity: 60,
    hasPower: true,
    buildVisibility: BuildVisibility.shown,
    category: Category.liquid,
    requirements: ItemStack.with(
        Items.copper, 35,
        Items.silicon, 20,
        Items.metaglass, 50,
        item.nickel, 35,
        item.manganese, 35,
    )
})
screwPump.consumePower(0.3);

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

const currentConduit = new Conduit("current-conduit");
exports.currentConduit = currentConduit;
Object.assign(currentConduit, {
    health: 45,
    liquidCapacity: 25,
    liquidPressure: 1,
    buildVisibility: BuildVisibility.shown,
    category: Category.liquid,
    requirements: ItemStack.with(
        Items.graphite, 1,
        Items.metaglass, 1,
    ),
    hasPower: true,
    consumesPower: true,
    outputsPower: true,
    conductivePower: true,
}),
    currentConduit.buildType = prov(() => extend(Conduit.ConduitBuild, currentConduit, {
        status() {
            if (Mathf.equal(this.power.status, 0, 0.001)) return BlockStatus.noInput;
            if (Mathf.equal(this.power.status, 1, 0.001)) return BlockStatus.active;
            return BlockStatus.noOutput;
        }
    }))
currentConduit.consumePowerBuffered(50)

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

const liquidRouter = new LiquidRouter("liquid-router");
exports.liquidRouter = liquidRouter;
Object.assign(liquidRouter, {
    buildVisibility: BuildVisibility.shown,
    category: Category.liquid,
    requirements: ItemStack.with(
        Items.graphite, 4,
        Items.metaglass, 2
    ),
    liquidCapacity: 50,
    hasPower: true,
    consumesPower: true,
    outputsPower: true,
    conductivePower: true,
});
liquidRouter.buildType = prov(() => extend(LiquidRouter.LiquidRouterBuild, liquidRouter, {
    status() {
        if (Mathf.equal(this.power.status, 0, 0.001)) return BlockStatus.noInput;
        if (Mathf.equal(this.power.status, 1, 0.001)) return BlockStatus.active;
        return BlockStatus.noOutput;
    }
}))
liquidRouter.consumePowerBuffered(75)

const biomassLiquidRouter = new LiquidRouter("biomass-liquid-router");
exports.biomassLiquidRouter = biomassLiquidRouter;
Object.assign(biomassLiquidRouter, {
    buildVisibility: BuildVisibility.shown,
    category: Category.liquid,
    requirements: ItemStack.with(
        Items.beryllium, 3,
        item.biomassSteel, 1),
    liquidCapacity: 125,
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

const liquidContainer = new LiquidRouter("liquid-container");
exports.liquidContainer = liquidContainer;
Object.assign(liquidContainer, {
    buildVisibility: BuildVisibility.shown,
    category: Category.liquid,
    requirements: ItemStack.with(
        Items.graphite, 5,
        Items.metaglass, 15,
        item.manganese, 15,
    ),
    liquidCapacity: 500,
    size: 2,
    hasPower: true,
    consumesPower: true,
    outputsPower: true,
    conductivePower: true,
})
liquidContainer.buildType = prov(() => extend(LiquidRouter.LiquidRouterBuild, liquidContainer, {
    status() {
        if (Mathf.equal(this.power.status, 0, 0.001)) return BlockStatus.noInput;
        if (Mathf.equal(this.power.status, 1, 0.001)) return BlockStatus.active;
        return BlockStatus.noOutput;
    }
}))
liquidContainer.consumePowerBuffered(1500)

const liquidTank = new LiquidRouter("liquid-tank");
exports.liquidTank = liquidTank;
Object.assign(liquidTank, {
    buildVisibility: BuildVisibility.shown,
    category: Category.liquid,
    requirements: ItemStack.with(
        Items.graphite, 15,
        Items.metaglass, 45,
        item.manganese, 20,
    ),
    liquidCapacity: 2000,
    size: 3,
    hasPower: true,
    consumesPower: true,
    outputsPower: true,
    conductivePower: true,
})
liquidTank.buildType = prov(() => extend(LiquidRouter.LiquidRouterBuild, liquidTank, {
    status() {
        if (Mathf.equal(this.power.status, 0, 0.001)) return BlockStatus.noInput;
        if (Mathf.equal(this.power.status, 1, 0.001)) return BlockStatus.active;
        return BlockStatus.noOutput;
    }
}))
liquidTank.consumePowerBuffered(6000)

const liquidJunction = new LiquidJunction("liquid-junction");
exports.liquidJunction = liquidJunction;
Object.assign(liquidJunction, {
    buildVisibility: BuildVisibility.shown,
    category: Category.liquid,
    requirements: ItemStack.with(
        Items.graphite, 4,
        Items.metaglass, 8
    ),
    hasPower: true,
    consumesPower: true,
    outputsPower: true,
    conductivePower: true,
})
liquidJunction.buildType = prov(() => extend(LiquidJunction.LiquidJunctionBuild, liquidJunction, {
    status() {
        if (Mathf.equal(this.power.status, 0, 0.001)) return BlockStatus.noInput;
        if (Mathf.equal(this.power.status, 1, 0.001)) return BlockStatus.active;
        return BlockStatus.noOutput;
    }
}))
liquidJunction.consumePowerBuffered(75)

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

const conduitBridge = extend(LiquidBridge, 'conduit-bridge', {
    fadeIn: false,
    moveArrows: false,
    range: 6,
    speed: 74,
    arrowSpacing: 6,
    buildVisibility: BuildVisibility.shown,
    category: Category.liquid,
    requirements: ItemStack.with(
        Items.graphite, 8,
        Items.metaglass, 15,
    ),
    hasPower: true,
    consumesPower: true,
    outputsPower: true,
    conductivePower: true,

    load() {
        this.super$load();

        Object.assign(this, {
            endRegion: Core.atlas.find(this.name + "-end"),
            bridgeRegion: Core.atlas.find(this.name + "-bridge"),
            arrowRegion: Core.atlas.find(this.name + "-arrow")
        });
    },
    linkValid(tile, other, checkDouble) {

        if (other == null || other.build == null || tile == null || tile.build == null || other == tile) {
            return false;
        } else {
            //应该是算距离
            //if (Math.pow(other.x - tile.x, 2) + Math.pow(other.y - tile.y, 2) > Math.pow(this.range + 0.5, 2)) return false;
            return tile.build.within(other.build, (this.range + 0.5) * Vars.tilesize)
        }
    },
    drawPlace(x, y, rotation, valid) {
        let link = this.findLink(x, y);

        if (link != null) {
            const sin = Mathf.absin(Time.time, 6, 1);
            Tmp.v1.set(x * Vars.tilesize + this.offset(), y * Vars.tilesize + this.offset()).sub(link.drawx(), link.drawy()).limit((this.size / 2 + 1) * Vars.tilesize + sin + 0.5);
            const x2 = x * Vars.tilesize - Tmp.v1.x;
            const y2 = y * Vars.tilesize - Tmp.v1.y;
            const x1 = link.drawx() + Tmp.v1.x;
            const y1 = link.drawy() + Tmp.v1.y;
            const segs = Math.floor(link.dst(x * Vars.tilesize, y * Vars.tilesize) / Vars.tilesize);

            Lines.stroke(4, Pal.gray);
            Lines.dashLine(x1, y1, x2, y2, segs);
            Lines.stroke(2, Pal.placing);
            Lines.dashLine(x1, y1, x2, y2, segs);
            Drawf.circles(link.drawx(), link.drawy(), (this.size / 3 + 1) * Vars.tilesize + sin - 2, Pal.accent);
            Drawf.arrow(link.drawx(), link.drawy(), x * Vars.tilesize + this.offset(), y * Vars.tilesize + this.offset(), this.size * Vars.tilesize + sin, 4 + sin, Pal.accent);
            Draw.reset();
        }
        Drawf.dashCircle(x * Vars.tilesize, y * Vars.tilesize, (this.range) * Vars.tilesize, Pal.accent);
    },
    // drawBase(tile) {
    //     Draw.rect(Core.atlas.find(this.name + "-base"), tile.worldx(), tile.worldy(), 0);
    // },
    icons() {
        return [
            Core.atlas.find(this.name + "-base"),
            Core.atlas.find(this.name),
        ];
    },
})
exports.conduitBridge = conduitBridge;
conduitBridge.buildType = prov(() => extend(LiquidBridge.LiquidBridgeBuild, conduitBridge, {
    status() {
        if (Mathf.equal(this.power.status, 0, 0.001)) return BlockStatus.noInput;
        if (Mathf.equal(this.power.status, 1, 0.001)) return BlockStatus.active;
        return BlockStatus.noOutput;
    },
    updateTile() {
        this.super$updateTile();

        const other = Vars.world.tile(this.link);
        if (other != null && this.block.linkValid(this.tile, other) && other.build != null) {

            if (Vars.world.tile(other.build.link) != null) {
                //不理解
                other.build.rotation = Mathf.slerpDelta(other.build.rotation, other.build.angleTo(this), 0.125 * other.build.power.status);
                this.rotation = Mathf.slerpDelta(this.rotation, this.angleTo(other.build), 0.125 * this.power.status);
            }
        }

    },
    updateTransport(other) {
        this.super$updateTransport(other);

        //怀疑没这么简单,但真就是把俩电网并起来这么简单
        if (other.power.graph != this.power.graph) {
            this.power.graph.addGraph(other.power.graph)
        }
    },
    drawSelect() {
        this.super$drawSelect();

        const sin = Mathf.absin(Time.time, 6, 1);

        Draw.color(Pal.accent);
        Lines.stroke(1);
        Drawf.circles(this.x, this.y, (this.block.size / 2 + 1) * Vars.tilesize + sin - 2, Pal.accent);
        if (this.link != -1) {
            const other = Vars.world.tile(this.link);
            if (other != null && other.build != null) {
                Drawf.circles(other.build.x, other.build.y, (this.block.size / 3 + 1) * Vars.tilesize + sin - 2, Pal.place);
                Drawf.arrow(this.x, this.y, other.build.x, other.build.y, this.block.size * Vars.tilesize + sin, 4 + sin, Pal.accent);
            }
        }
        Drawf.dashCircle(this.x, this.y, this.block.range * Vars.tilesize, Pal.accent);
    },

    draw() {
        const { block, x, y } = this;
        if (block.variants == 0 || block.variantRegions == null) {
            Draw.rect(block.region, x, y, this.drawrot());
        } else {
            Draw.rect(block.variantRegions[Mathf.randomSeed(this.tile.pos(), 0, Math.max(0, block.variantRegions.length - 1))], x, y, this.drawrot());
        }

        this.drawTeamTop();

        const other = Vars.world.tile(this.link);
        if (!block.linkValid(this.tile, other)) return;

        if (Mathf.zero(Renderer.bridgeOpacity)) return;

        const angleDeg = this.angleTo(other.build);

        const {
            pulse, hasPower, fadeIn,
            bridgeWidth, arrowSpacing, arrowOffset, arrowPeriod, arrowTimeScl,
            endRegion, bridgeRegion, arrowRegion
        } = block;

        const { time } = this;

        if (pulse) {
            Draw.color(Color.white, Color.black, Mathf.absin(Time.time, 6, 0.07));
        }

        const warmup = hasPower ? this.warmup : 1;

        Draw.alpha((fadeIn ? Math.max(warmup, 0.25) : 1) * Renderer.bridgeOpacity);

        Draw.rect(endRegion, x, y, angleDeg + 90);
        Draw.rect(endRegion, other.drawx(), other.drawy(), angleDeg + 270);

        Lines.stroke(bridgeWidth);

        Tmp.v1.set(x, y).sub(other.worldx(), other.worldy()).setLength(Vars.tilesize / 2).scl(-1);

        Lines.line(
            bridgeRegion,
            x + Tmp.v1.x,
            y + Tmp.v1.y,
            other.worldx() - Tmp.v1.x,
            other.worldy() - Tmp.v1.y,
            false
        );

        const dist = this.dst(other.build);

        Draw.color();

        const arrows = Math.floor((dist - arrowSpacing) / arrowSpacing);
        const vec = Tmp.v1.set(other).sub(this).nor();

        for (let a = 0; a < arrows; a++) {
            Draw.alpha(
                Mathf.absin(a - time / arrowTimeScl, arrowPeriod, 1) * warmup * Renderer.bridgeOpacity
            );
            Draw.rect(
                arrowRegion,
                x + vec.x * (Vars.tilesize / 2 + a * arrowSpacing + arrowOffset),
                y + vec.y * (Vars.tilesize / 2 + a * arrowSpacing + arrowOffset),
                angleDeg
            );
        }

        Draw.reset();
    },

    drawLayer(tile) {
        const entity = tile.ent();
        Draw.rect(Core.atlas.find(this.name), tile.drawx(), tile.drawy(), entity.rotation - 90);
    },
}))
conduitBridge.consumePowerBuffered(100)


const biomassConduitBridge = extend(LiquidBridge, 'biomass-conduit-bridge', {
    fadeIn: false,
    moveArrows: false,
    hasPower: true,
    consumesPower: true,
    outputsPower: true,
    conductivePower: true,
    underBullets: true,
    health: 750,
    range: 10,
    speed: 74,
    arrowSpacing: 6,
    buildVisibility: BuildVisibility.shown,
    category: Category.liquid,
    requirements: ItemStack.with(
        Items.beryllium, 9,
        item.biomassSteel, 3
    ),

    load() {
        this.super$load();

        Object.assign(this, {
            endRegion: Core.atlas.find(this.name + "-end"),
            bridgeRegion: Core.atlas.find(this.name + "-bridge"),
            arrowRegion: Core.atlas.find(this.name + "-arrow")
        });
    },
    linkValid(tile, other, checkDouble) {

        if (other == null || other.build == null || tile == null || tile.build == null || other == tile) {
            return false;
        } else {
            //应该是算距离
            //if (Math.pow(other.x - tile.x, 2) + Math.pow(other.y - tile.y, 2) > Math.pow(this.range + 0.5, 2)) return false;
            return tile.build.within(other.build, (this.range + 0.5) * Vars.tilesize)
        }
    },
    drawPlace(x, y, rotation, valid) {
        let link = this.findLink(x, y);

        if (link != null) {
            const sin = Mathf.absin(Time.time, 6, 1);
            Tmp.v1.set(x * Vars.tilesize + this.offset(), y * Vars.tilesize + this.offset()).sub(link.drawx(), link.drawy()).limit((this.size / 2 + 1) * Vars.tilesize + sin + 0.5);
            const x2 = x * Vars.tilesize - Tmp.v1.x;
            const y2 = y * Vars.tilesize - Tmp.v1.y;
            const x1 = link.drawx() + Tmp.v1.x;
            const y1 = link.drawy() + Tmp.v1.y;
            const segs = Math.floor(link.dst(x * Vars.tilesize, y * Vars.tilesize) / Vars.tilesize);

            Lines.stroke(4, Pal.gray);
            Lines.dashLine(x1, y1, x2, y2, segs);
            Lines.stroke(2, Pal.placing);
            Lines.dashLine(x1, y1, x2, y2, segs);
            Drawf.circles(link.drawx(), link.drawy(), (this.size / 3 + 1) * Vars.tilesize + sin - 2, Pal.accent);
            Drawf.arrow(link.drawx(), link.drawy(), x * Vars.tilesize + this.offset(), y * Vars.tilesize + this.offset(), this.size * Vars.tilesize + sin, 4 + sin, Pal.accent);
            Draw.reset();
        }
        Drawf.dashCircle(x * Vars.tilesize, y * Vars.tilesize, (this.range) * Vars.tilesize, Pal.accent);
    },
    // drawBase(tile) {
    //     Draw.rect(Core.atlas.find(this.name + "-base"), tile.worldx(), tile.worldy(), 0);
    // },
    icons() {
        return [
            Core.atlas.find(this.name + "-base"),
            Core.atlas.find(this.name),
        ];
    },
})
exports.biomassConduitBridge = biomassConduitBridge;
biomassConduitBridge.buildType = prov(() => extend(LiquidBridge.LiquidBridgeBuild, biomassConduitBridge, {
    status() {
        if (Mathf.equal(this.power.status, 0, 0.001)) return BlockStatus.noInput;
        if (Mathf.equal(this.power.status, 1, 0.001)) return BlockStatus.active;
        return BlockStatus.noOutput;
    },
    updateTile() {
        this.super$updateTile();

        const other = Vars.world.tile(this.link);
        if (other != null && this.block.linkValid(this.tile, other) && other.build != null) {

            if (Vars.world.tile(other.build.link) != null) {
                //不理解
                other.build.rotation = Mathf.slerpDelta(other.build.rotation, other.build.angleTo(this), 0.125 * other.build.power.status);
                this.rotation = Mathf.slerpDelta(this.rotation, this.angleTo(other.build), 0.125 * this.power.status);
            }
        }

    },
    updateTransport(other) {
        this.super$updateTransport(other);

        //怀疑没这么简单,但真就是把俩电网并起来这么简单
        if (other.power.graph != this.power.graph) {
            this.power.graph.addGraph(other.power.graph)
        }
    },
    drawSelect() {
        this.super$drawSelect();

        const sin = Mathf.absin(Time.time, 6, 1);

        Draw.color(Pal.accent);
        Lines.stroke(1);
        Drawf.circles(this.x, this.y, (this.block.size / 2 + 1) * Vars.tilesize + sin - 2, Pal.accent);
        if (this.link != -1) {
            const other = Vars.world.tile(this.link);
            if (other != null && other.build != null) {
                Drawf.circles(other.build.x, other.build.y, (this.block.size / 3 + 1) * Vars.tilesize + sin - 2, Pal.place);
                Drawf.arrow(this.x, this.y, other.build.x, other.build.y, this.block.size * Vars.tilesize + sin, 4 + sin, Pal.accent);
            }
        }
        Drawf.dashCircle(this.x, this.y, this.block.range * Vars.tilesize, Pal.accent);
    },

    draw() {
        const { block, x, y } = this;
        if (block.variants == 0 || block.variantRegions == null) {
            Draw.rect(block.region, x, y, this.drawrot());
        } else {
            Draw.rect(block.variantRegions[Mathf.randomSeed(this.tile.pos(), 0, Math.max(0, block.variantRegions.length - 1))], x, y, this.drawrot());
        }

        this.drawTeamTop();

        const other = Vars.world.tile(this.link);
        if (!block.linkValid(this.tile, other)) return;

        if (Mathf.zero(Renderer.bridgeOpacity)) return;

        const angleDeg = this.angleTo(other.build);

        const {
            pulse, hasPower, fadeIn,
            bridgeWidth, arrowSpacing, arrowOffset, arrowPeriod, arrowTimeScl,
            endRegion, bridgeRegion, arrowRegion
        } = block;

        const { time } = this;

        if (pulse) {
            Draw.color(Color.white, Color.black, Mathf.absin(Time.time, 6, 0.07));
        }

        const warmup = hasPower ? this.warmup : 1;

        Draw.alpha((fadeIn ? Math.max(warmup, 0.25) : 1) * Renderer.bridgeOpacity);

        Draw.rect(endRegion, x, y, angleDeg + 90);
        Draw.rect(endRegion, other.drawx(), other.drawy(), angleDeg + 270);

        Lines.stroke(bridgeWidth);

        Tmp.v1.set(x, y).sub(other.worldx(), other.worldy()).setLength(Vars.tilesize / 2).scl(-1);

        Lines.line(
            bridgeRegion,
            x + Tmp.v1.x,
            y + Tmp.v1.y,
            other.worldx() - Tmp.v1.x,
            other.worldy() - Tmp.v1.y,
            false
        );

        const dist = this.dst(other.build);

        Draw.color();

        const arrows = Math.floor((dist - arrowSpacing) / arrowSpacing);
        const vec = Tmp.v1.set(other).sub(this).nor();

        for (let a = 0; a < arrows; a++) {
            Draw.alpha(
                Mathf.absin(a - time / arrowTimeScl, arrowPeriod, 1) * warmup * Renderer.bridgeOpacity
            );
            Draw.rect(
                arrowRegion,
                x + vec.x * (Vars.tilesize / 2 + a * arrowSpacing + arrowOffset),
                y + vec.y * (Vars.tilesize / 2 + a * arrowSpacing + arrowOffset),
                angleDeg
            );
        }

        Draw.reset();
    },

    drawLayer(tile) {
        const entity = tile.ent();
        Draw.rect(Core.atlas.find(this.name), tile.drawx(), tile.drawy(), entity.rotation - 90);
    },
}))
biomassConduitBridge.consumePowerBuffered(250)

currentConduit.junctionReplacement = liquidJunction;
currentConduit.bridgeReplacement = conduitBridge;
biomassConduit.junctionReplacement = biomassLiquidJunction;
biomassConduit.bridgeReplacement = biomassConduitBridge;

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