const lib = require("vne/lib/researchlib");
const unitFactory = require("vne/block/unitFactory");
const factory = require("vne/block/factory");

const fumarole = new SectorPreset("[Neop1]fumarole", Planets.erekir, 22);
exports.fumarole = fumarole;
Object.assign(fumarole, {
    difficulty: 2
})

const faultline = new SectorPreset("[Neop2]faultline", Planets.erekir,20);
exports.faultline = faultline;
Object.assign(faultline, {
    difficulty: 4
})

lib.addResearch(fumarole, {
    parent: "intersect",
    objectives: Seq.with(
        Objectives.SectorComplete(SectorPresets.intersect),
    )
}, () => {
    TechTree.node(faultline, Seq.with(
        Objectives.SectorComplete(fumarole),
        Objectives.Research(unitFactory.shaper),
        Objectives.Research(factory.ammoniaPlant)
    ) ,() => {})
});