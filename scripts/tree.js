const nodeRoot = TechTree.nodeRoot;
const nodeProduce = TechTree.nodeProduce
const node = TechTree.node;

const item = require("vne/item");
const liquid = require("vne/liquid");

const unit = require("vne/unit");

const core = require("vne/block/core");
const distribution = require("vne/block/distribution");
const defense = require("vne/block/defense");
const env = require("vne/block/environment");
const factory = require("vne/block/factory");
const liquidBlock = require("vne/block/liquidBlock");
const power = require("vne/block/power");
const unitFactory = require("vne/block/unitFactory");

const planet = require("vne/planet");
const sector = require("vne/sector");

exports.modName = "vne"
exports.mod = Vars.mods.locateMod(exports.modName);
//新旧模组检测替换
//以下为科技树部分
const addResearch = (content, research, children) => {
	if (!content) {
		//throw new Error('content is null!');
	}
	if (!research.parent) {
		throw new Error('research.parent is empty!');
	}
	var researchName = research.parent;
	var customRequirements = research.requirements;
	var objectives = research.objectives;

	var lastNode = TechTree.all.find(boolf(t => t.content == content));
	if (lastNode != null) {
		lastNode.remove();
	}

	//var node = new TechTree.TechNode(null, content, customRequirements !== undefined ? customRequirements : content.researchRequirements());
	if(customRequirements != null && objectives != null){
	    var node = new TechTree.node(content, customRequirements, objectives, children);
	}else{
	    var node = new TechTree.node(content, children);
	}
	var currentMod = exports.mod;
	if (objectives) {
		node.objectives.addAll(objectives);
	}

	if (node.parent != null) {
		node.parent.children.remove(node);
	}

	//寻找父级节点
	var parent = TechTree.all.find(boolf(t => t.content.name.equals(researchName) || t.content.name.equals(currentMod.name + "-" + researchName)));

	if (parent == null) {
		throw new Error("Content '" + researchName + "' isn't in the tech tree, but '" + content.name + "' requires it to be researched.");
	}

	//添加子节点
	if (!parent.children.contains(node)) {
		parent.children.add(node);
	}
	//重定父级
	node.parent = parent;
};

//item
addResearch(item.protein, {
    parent: "beryllium",
    objectives: Seq.with(
        Objectives.Produce(item.protein),
    )
}, () => {
    nodeProduce(Items.dormantCyst, () => {}),
    nodeProduce(item.biomassSteel, () => {})
})

addResearch(item.coagulantIngot, {
    parent: "oxide",
    objectives: Seq.with(
        Objectives.Produce(item.coagulantIngot),
    )
}, () => {})

addResearch(item.siliconNitride,{
    parent: "oxide",
    objectives: Seq.with(
        Objectives.Produce(item.siliconNitride),
    )
},() => {})

//liquid
addResearch(liquid.ammonia, {
    parent: "nitrogen",
    objectives: Seq.with(
        Objectives.Produce(liquid.ammonia),
    )
}, () => {})

addResearch(liquid.naturalGas, {
    parent: "hydrogen",
    objectives: Seq.with(
        Objectives.Produce(liquid.naturalGas),
    )
}, () => {})

//distribution
addResearch(distribution.ductJunction, {
    parent: "duct"
},() => {})

//defense
addResearch(defense.oxideWall, {
    parent: "beryllium-wall",
}, () => {
    node(defense.oxideWallLarge, () => {
        node(defense.biomassWall, () => {
            node(defense.biomassWallLarge, () => {})
        })
    }),
    node(defense.explosive, () => {}),
    node(defense.siliconNitrideWall, () => {
        node(defense.siliconNitrideWallLarge, () => {})
    })
});

addResearch(defense.neoplasmCollecter,{
    parent: "radar",
},() => {})

addResearch(defense.defuse, {
    parent: "diffuse",
}, () => {})

//factory
addResearch(factory.incubator, {
    parent: "silicon-arc-furnace",
    objectives: Seq.with(Objectives.OnSector(SectorPresets.intersect))
}, () => {
    node(factory.arkyciteRefinery, () => {
        node(factory.cyanidePlant, () => {}),
        node(factory.BMAStove, () => {})
    })
    node(factory.irradiationChamber, () => {})
});

addResearch(factory.ammoniaPlant, {
    parent: "oxidation-chamber",
}, () => {
    node(factory.watergasStove, () => {})
});

addResearch(factory.adsorbent, {
    parent: "oxidation-chamber",
}, () => {})

addResearch(factory.laserIncinerator, {
    parent: "slag-incinerator",
    objectives: Seq.with(Objectives.Research(factory.adsorbent))
}, () => {})

addResearch(factory.ammoniaCollector,{
    parent: "vent-condenser",
},() => {})

addResearch(factory.atmosphericCondenser,{
    parent: "vent-condenser",
},() => {})

addResearch(factory.siliconNitrideFurnace, {
    parent: "atmospheric-concentrator",
}, () => {
    node(factory.biomassSmelter, () => {
        node(factory.stableBiomassSmelter, () => {})
    })
})

addResearch(factory.floorCrusher,{
    parent: "cliff-crusher"
},() => {
    node(factory.largeFloorCrusher, () => {})
})

addResearch(factory.smallHeatRouter,{
    parent: "small-heat-redirector",
},() => {
    node(factory.microHeatRedirector, () => {
        node(factory.microHeatRouter, () => {})
    })
})

//liquid
addResearch(liquidBlock.turbopump,{
    parent: "reinforced-pump",
}, () => {})

addResearch(liquidBlock.biomassConduit, {
    parent: "reinforced-conduit",
}, () => {
    node(liquidBlock.biomassLiquidJunction,() => {
        node(liquidBlock.biomassLiquidRouter, () => {}),
        node(liquidBlock.biomassConduitBridge ,() => {})
    })
})

//power
addResearch(power.nodeDiode,{
    parent: "beam-tower"
},() => {
    node(power.assistantBattery, () => {})
})

addResearch(power.oxidationChamber,{
    parent: "turbine-condenser"
},() => {});

addResearch(power.biomassReactor, { 
    parent: "chemical-combustion-chamber",
    objectives: Seq.with(
        Objectives.Research(factory.ammoniaPlant),
        Objectives.SectorComplete(sector.faultline)
    )
}, () => {});

//unitFactory
addResearch(unitFactory.unitIncubator, { 
    parent: "tank-fabricator",
    objectives: Seq.with(
        Objectives.OnSector(sector.fumarole)
    )
}, () => {
    node(unit.haploid,() => {}),
    node(unit.ribosome, () => {}),
    node(unit.bomber, () => {}),
    node(unitFactory.shaper, Seq.with(
        Objectives.Research(factory.ammoniaPlant),
        Objectives.OnSector(sector.faultline)
    ), () => {
        node(unit.diploid, () => {}),
        node(unit.lysosome, () => {}),
        node(unit.cytoderm, () => {}),
        node(unitFactory.evolver, Seq.with(
            Objectives.Produce(Items.dormantCyst)
        ), () => {
            node(unit.triploid, () => {}),
            node(unit.trichocyst, () => {}),
            node(unit.adenoma, () => {})
        })
    })
});

//sector
addResearch(sector.fumarole, {
    parent: "intersect",
    objectives: Seq.with(
        Objectives.SectorComplete(SectorPresets.intersect),
    )
}, () => {
    node(sector.faultline, Seq.with(
        Objectives.SectorComplete(sector.fumarole),
        Objectives.Research(factory.ammoniaPlant)
    ), () => {})
});


//seltis
planet.seltis.techTree = nodeRoot("seltis", planet.seltis, () => {
    
})