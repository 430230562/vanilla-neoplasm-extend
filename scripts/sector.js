const lib = require("vne/lib/researchlib");
const unitFactory = require("vne/block/unitFactory")

const fumarole = new SectorPreset("fumarole",Planets.erekir,22);
exports.fumarole = fumarole;
Object.assign(fumarole,{
    difficulty: 2
})

lib.addResearch(fumarole, {
    parent: "intersect",
    objectives: Seq.with(
        Objectives.SectorComplete(SectorPresets.intersect),
    )
}, () => {});