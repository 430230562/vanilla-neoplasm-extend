const item = require("vne/item");
const liquid = require("vne/liquid");

const unit = require("vne/unit");

const defense = require("vne/block/defense");
const env = require("vne/block/environment");
const factory = require("vne/block/factory");
const liquidBlock = require("vne/block/liquidBlock");
const power = require("vne/block/power");
const unitFactory = require("vne/block/unitFactory");

const sector = require("vne/sector");

exports.modName = "vne"
exports.mod = Vars.mods.locateMod(exports.modName);
//新旧模组检测替换
//以下为科技树部分
const addResearch = (content, research, children) => {
	if (!content) {
		throw new Error('content is null!');
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
    TechTree.nodeProduce(item.chitin, () => {}),
    TechTree.nodeProduce(item.biomassSteel, () => {})
})

//liquid
addResearch(liquid.ammonia, {
    parent: "nitrogen",
    objectives: Seq.with(
        Objectives.Produce(liquid.ammonia),
    )
}, () => {})

addResearch(item.coagulantIngot, {
    parent: "oxide",
    objectives: Seq.with(
        Objectives.Produce(item.coagulantIngot),
    )
}, () => {})

//defense
addResearch(defense.oxideWall, {
    parent: "beryllium-wall",
}, () => {
    TechTree.node(defense.oxideWallLarge, () => {
        TechTree.node(defense.biomassWall, () => {
            TechTree.node(defense.biomassWallLarge, () => {})
        })
    }),
    TechTree.node(defense.explosive, () => {})
});

//factory
addResearch(factory.incubator, {
    parent: "silicon-arc-furnace",
    objectives: Seq.with(Objectives.OnSector(SectorPresets.intersect))
}, () => {
    TechTree.node(factory.cyanidePlant, () => {})
});

addResearch(factory.ammoniaPlant, {
    parent: "oxidation-chamber",
}, () => {
    TechTree.node(factory.watergasStove, () => {})
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

//liquid
addResearch(liquidBlock.turbopump,{
    parent: "reinforced-pump",
}, () => {})

addResearch(liquidBlock.biomassConduit, {
    parent: "reinforced-conduit",
}, () => {
    TechTree.node(liquidBlock.biomassLiquidJunction,() => {
        TechTree.node(liquidBlock.biomassLiquidRouter, () => {}),
        TechTree.node(liquidBlock.biomassConduitBridge ,() => {})
    })
})

//power
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
    TechTree.node(unit.haploid,() => {}),
    TechTree.node(unit.ribosome, () => {}),
    TechTree.node(unit.bomber, () => {}),
    TechTree.node(unitFactory.shaper, Seq.with(
        Objectives.Research(factory.ammoniaPlant),
        Objectives.OnSector(sector.faultline)
    ), () => {
        TechTree.node(unit.diploid, () => {}),
        TechTree.node(unit.lysosome, () => {}),
        TechTree.node(unit.cytoderm, () => {})
    })
});

//sector
addResearch(sector.fumarole, {
    parent: "intersect",
    objectives: Seq.with(
        Objectives.SectorComplete(SectorPresets.intersect),
    )
}, () => {
    TechTree.node(sector.faultline, Seq.with(
        Objectives.SectorComplete(sector.fumarole),
        Objectives.Research(factory.ammoniaPlant)
    ), () => {})
});