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

const nickelBridge = new ItemBridge("nickel-bridge");
exports.nickelBridge = nickelBridge;
Object.assign(nickelBridge, {
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
})
nickelBridge.buildType = prov(() => extend(ItemBridge.ItemBridgeBuild, nickelBridge, {
	status() {
		if (Mathf.equal(this.power.status, 0, 0.001)) return BlockStatus.noInput;
		if (Mathf.equal(this.power.status, 1, 0.001)) return BlockStatus.active;
		return BlockStatus.noOutput;
	},
	updateTransport(other) {
		this.super$updateTransport(other);
		
		//怀疑没这么简单，但真就是把俩电网并起来这么简单
		if (other.power.graph != this.power.graph) {
			this.power.graph.addGraph(other.power.graph)
		}
	},
}))
nickelBridge.consumePowerBuffered(75)

const stackBridge = new ItemBridge("stack-bridge");
exports.stackBridge = stackBridge;
Object.assign(stackBridge, {
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
})
stackBridge.buildType = prov(() => extend(ItemBridge.ItemBridgeBuild, stackBridge, {
	status() {
		if (Mathf.equal(this.power.status, 0, 0.001)) return BlockStatus.noInput;
		if (Mathf.equal(this.power.status, 1, 0.001)) return BlockStatus.active;
		return BlockStatus.noOutput;
	},
	updateTransport(other) {
		this.super$updateTransport(other);
		
		//怀疑没这么简单，但真就是把俩电网并起来这么简单
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