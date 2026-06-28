const item = require("vne/item");

const ductJunction = new Junction("duct-junction");
exports.ductJunction = ductJunction;
Object.assign(ductJunction, {
	buildVisibility: BuildVisibility.shown,
	category: Category.distribution,
	requirements: ItemStack.with(
		Items.beryllium, 5,
		item.siliconNitride, 3
	),
	speed: 1,
	capacity: 1,
	health: 55,
})

const nickelConveyor = new Conveyor("nickel-conveyor");
exports.nickelConveyor = nickelConveyor;
Object.assign(nickelConveyor, {
	buildVisibility: BuildVisibility.shown,
	category: Category.distribution,
	requirements: ItemStack.with(
		Items.copper, 1,
		item.nickel, 1
	),
	health: 55,
	speed: 0.05,
	displayedSpeed: 6.5,

	hasPower: true,
	consumesPower: true,
	outputsPower: true,
	conductivePower: true,
})
nickelConveyor.buildType = prov(() => extend(Conveyor.ConveyorBuild, nickelConveyor, {
	status() {
		if (Mathf.equal(this.power.status, 0, 0.001)) return BlockStatus.noInput;
		if (Mathf.equal(this.power.status, 1, 0.001)) return BlockStatus.active;
		return BlockStatus.noOutput;
	}
}))
nickelConveyor.consumePowerBuffered(20)

const manganeseConveyor = new Conveyor("manganese-conveyor");
exports.manganeseConveyor = manganeseConveyor;
Object.assign(manganeseConveyor, {
	buildVisibility: BuildVisibility.shown,
	category: Category.distribution,
	requirements: ItemStack.with(
		Items.copper, 1,
		item.nickel, 1,
		item.manganese, 1,
	),
	health: 80,
	speed: 0.11,
	displayedSpeed: 15.7,

	hasPower: true,
	consumesPower: true,
	outputsPower: true,
	conductivePower: true,
})
manganeseConveyor.buildType = prov(() => extend(Conveyor.ConveyorBuild, manganeseConveyor, {
	status() {
		if (Mathf.equal(this.power.status, 0, 0.001)) return BlockStatus.noInput;
		if (Mathf.equal(this.power.status, 1, 0.001)) return BlockStatus.active;
		return BlockStatus.noOutput;
	}
}))
manganeseConveyor.consumePowerBuffered(50)

const armoredConveyor = ArmoredConveyor("armored-conveyor");
exports.armoredConveyor = armoredConveyor;
Object.assign(armoredConveyor, {
	buildVisibility: BuildVisibility.shown,
	category: Category.distribution,
	requirements: ItemStack.with(
		Items.tungsten, 1,
		item.manganese, 2
	),
	health: 220,
	speed: 0.11,
	displayedSpeed: 15.7,

	hasPower: true,
	consumesPower: true,
	outputsPower: true,
	conductivePower: true,
})
armoredConveyor.buildType = prov(() => extend(ArmoredConveyor.ArmoredConveyorBuild, armoredConveyor, {
	status() {
		if (Mathf.equal(this.power.status, 0, 0.001)) return BlockStatus.noInput;
		if (Mathf.equal(this.power.status, 1, 0.001)) return BlockStatus.active;
		return BlockStatus.noOutput;
	}
}))
armoredConveyor.consumePowerBuffered(50)

const biomassConveyor = new StackConveyor("biomass-conveyor");
exports.biomassConveyor = biomassConveyor;
Object.assign(biomassConveyor, {
	health: 125,
	speed: 5 / 60,
	itemCapacity: 15,
	buildVisibility: BuildVisibility.shown,
	category: Category.distribution,
	requirements: ItemStack.with(
		Items.graphite, 1,
		Items.silicon, 1,
		item.biomassSteel, 1,
	),

	hasPower: true,
	consumesPower: true,
	outputsPower: true,
	conductivePower: true,
})
biomassConveyor.buildType = prov(() => extend(StackConveyor.StackConveyorBuild, biomassConveyor, {
	status() {
		if (Mathf.equal(this.power.status, 0, 0.001)) return BlockStatus.noInput;
		if (Mathf.equal(this.power.status, 1, 0.001)) return BlockStatus.active;
		return BlockStatus.noOutput;
	}
}))
biomassConveyor.consumePowerBuffered(250)

const junction = new Junction("junction");
exports.junction = junction;
Object.assign(junction, {
	buildVisibility: BuildVisibility.shown,
	category: Category.distribution,
	requirements: ItemStack.with(
		Items.copper, 2,
		item.nickel, 4,
	),
	speed: 1,
	capacity: 1,
	health: 55,
	solid: false,

	hasPower: true,
	consumesPower: true,
	outputsPower: true,
	conductivePower: true,
})
junction.buildType = prov(() => extend(Junction.JunctionBuild, junction, {
	status() {
		if (Mathf.equal(this.power.status, 0, 0.001)) return BlockStatus.noInput;
		if (Mathf.equal(this.power.status, 1, 0.001)) return BlockStatus.active;
		return BlockStatus.noOutput;
	}
}))
junction.consumePowerBuffered(50)

const nickelBridge = extend(ItemBridge, "nickel-bridge", {
	fadeIn: false,
	moveArrows: false,
	range: 6,
	arrowSpacing: 6,
	transportTime: 10,
	buildVisibility: BuildVisibility.shown,
	category: Category.distribution,
	requirements: ItemStack.with(
		Items.copper, 15,
		item.nickel, 10,
	),
	solid: false,

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
})
exports.nickelBridge = nickelBridge;
nickelBridge.buildType = prov(() => extend(ItemBridge.ItemBridgeBuild, nickelBridge, {
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
}))
nickelBridge.consumePowerBuffered(75)

const stackBridge = extend(ItemBridge, "stack-bridge", {
	fadeIn: false,
	moveArrows: false,
	range: 10,
	arrowSpacing: 6,
	transportTime: 1,
	buildVisibility: BuildVisibility.shown,
	category: Category.distribution,
	requirements: ItemStack.with(
		Items.tungsten, 4,
		item.manganese, 4,
		item.biomassSteel, 8,
	),
	solid: false,

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
});
exports.stackBridge = stackBridge;
stackBridge.buildType = prov(() => extend(ItemBridge.ItemBridgeBuild, stackBridge, {
	status() {
		if (Mathf.equal(this.power.status, 0, 0.001)) return BlockStatus.noInput;
		if (Mathf.equal(this.power.status, 1, 0.001)) return BlockStatus.active;
		return BlockStatus.noOutput;
	},
	updateTransport(other) {
		this.super$updateTransport(other);

		//怀疑没这么简单,但真就是把俩电网并起来这么简单
		if (other.power.graph != this.power.graph) {
			this.power.graph.addGraph(other.power.graph)
		}
	},
	updateTile() {
		this.super$updateTile();

		for (let i = 0; i < 8; i++) {
			let p = Geometry.d8[i];
			let other = this.nearby(p.x, p.y);

			if (other != null && other.block instanceof StackConveyor && other.cooldown > 1) {
				other.cooldown = 1
			}
		}

		const other = Vars.world.tile(this.link);
		if (other != null && this.block.linkValid(this.tile, other) && other.build != null) {

			if (Vars.world.tile(other.build.link) != null) {
				//不理解
				other.build.rotation = Mathf.slerpDelta(other.build.rotation, other.build.angleTo(this), 0.125 * other.build.power.status);
				this.rotation = Mathf.slerpDelta(this.rotation, this.angleTo(other.build), 0.125 * this.power.status);
			}
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
	}
}))
stackBridge.consumePowerBuffered(350)

const router = new Router("router");
exports.router = router;
Object.assign(router, {
	buildVisibility: BuildVisibility.shown,
	category: Category.distribution,
	requirements: ItemStack.with(
		Items.copper, 2,
		item.nickel, 2,
	),
	solid: false,

	hasPower: true,
	consumesPower: true,
	outputsPower: true,
	conductivePower: true,
})
router.buildType = prov(() => extend(Router.RouterBuild, router, {
	status() {
		if (Mathf.equal(this.power.status, 0, 0.001)) return BlockStatus.noInput;
		if (Mathf.equal(this.power.status, 1, 0.001)) return BlockStatus.active;
		return BlockStatus.noOutput;
	}
}))
router.consumePowerBuffered(50)

const distributor = new Router("distributor");
exports.distributor = distributor;
Object.assign(distributor, {
	buildVisibility: BuildVisibility.shown,
	category: Category.distribution,
	requirements: ItemStack.with(
		Items.copper, 6,
		item.nickel, 4,
	),
	size: 2,
	solid: false,

	hasPower: true,
	consumesPower: true,
	outputsPower: true,
	conductivePower: true,
})
distributor.buildType = prov(() => extend(Router.RouterBuild, distributor, {
	status() {
		if (Mathf.equal(this.power.status, 0, 0.001)) return BlockStatus.noInput;
		if (Mathf.equal(this.power.status, 1, 0.001)) return BlockStatus.active;
		return BlockStatus.noOutput;
	}
}))
distributor.consumePowerBuffered(250)

const sorter = new Sorter("sorter");
exports.sorter = sorter;
Object.assign(sorter, {
	buildVisibility: BuildVisibility.shown,
	category: Category.distribution,
	requirements: ItemStack.with(
		Items.copper, 6,
		item.nickel, 4
	),
	solid: false,

	hasPower: true,
	consumesPower: true,
	outputsPower: true,
	conductivePower: true,
})
sorter.buildType = prov(() => extend(Sorter.SorterBuild, sorter, {
	status() {
		if (Mathf.equal(this.power.status, 0, 0.001)) return BlockStatus.noInput;
		if (Mathf.equal(this.power.status, 1, 0.001)) return BlockStatus.active;
		return BlockStatus.noOutput;
	}
}))
sorter.consumePowerBuffered(50)

const invertedSorter = new Sorter("inverted-sorter");
exports.invertedSorter = invertedSorter;
Object.assign(invertedSorter, {
	buildVisibility: BuildVisibility.shown,
	category: Category.distribution,
	requirements: ItemStack.with(
		Items.copper, 4,
		item.nickel, 6
	),
	invert: true,
	solid: false,

	hasPower: true,
	consumesPower: true,
	outputsPower: true,
	conductivePower: true,
})
invertedSorter.buildType = prov(() => extend(Sorter.SorterBuild, invertedSorter, {
	status() {
		if (Mathf.equal(this.power.status, 0, 0.001)) return BlockStatus.noInput;
		if (Mathf.equal(this.power.status, 1, 0.001)) return BlockStatus.active;
		return BlockStatus.noOutput;
	}
}))
invertedSorter.consumePowerBuffered(50)

const overflowGate = new OverflowGate("overflow-gate");
exports.overflowGate = overflowGate;
Object.assign(overflowGate, {
	buildVisibility: BuildVisibility.shown,
	category: Category.distribution,
	requirements: ItemStack.with(
		Items.copper, 6,
		item.nickel, 4
	),
	solid: false,

	hasPower: true,
	consumesPower: true,
	outputsPower: true,
	conductivePower: true,
})
overflowGate.buildType = prov(() => extend(OverflowGate.OverflowGateBuild, overflowGate, {
	status() {
		if (Mathf.equal(this.power.status, 0, 0.001)) return BlockStatus.noInput;
		if (Mathf.equal(this.power.status, 1, 0.001)) return BlockStatus.active;
		return BlockStatus.noOutput;
	}
}))
overflowGate.consumePowerBuffered(50)

const underflowGate = new OverflowGate("underflow-gate");
exports.underflowGate = underflowGate;
Object.assign(underflowGate, {
	buildVisibility: BuildVisibility.shown,
	category: Category.distribution,
	requirements: ItemStack.with(
		Items.copper, 4,
		item.nickel, 6
	),
	invert: true,
	solid: false,

	hasPower: true,
	consumesPower: true,
	outputsPower: true,
	conductivePower: true,
})
underflowGate.buildType = prov(() => extend(OverflowGate.OverflowGateBuild, underflowGate, {
	status() {
		if (Mathf.equal(this.power.status, 0, 0.001)) return BlockStatus.noInput;
		if (Mathf.equal(this.power.status, 1, 0.001)) return BlockStatus.active;
		return BlockStatus.noOutput;
	}
}))
underflowGate.consumePowerBuffered(50)

nickelConveyor.junctionReplacement = junction;
nickelConveyor.bridgeReplacement = nickelBridge;
manganeseConveyor.junctionReplacement = junction;
manganeseConveyor.bridgeReplacement = nickelBridge;
armoredConveyor.junctionReplacement = junction;
armoredConveyor.bridgeReplacement = nickelBridge;