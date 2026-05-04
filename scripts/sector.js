const planet = require("vne/planet");

const core = require("vne/block/core");
const distribution = require("vne/block/distribution");
const drill = require("vne/block/drill");
const factory = require("vne/block/factory");

const fumarole = new SectorPreset("[Neop1]fumarole", Planets.erekir, 22);
exports.fumarole = fumarole;
Object.assign(fumarole, {
    difficulty: 2
})

const faultline = new SectorPreset("[Neop2]faultline", Planets.erekir, 20);
exports.faultline = faultline;
Object.assign(faultline, {
    difficulty: 4
})

const sinkhole = new SectorPreset("[Neop3]sinkhole",Planets.erekir,70);
exports.sinkhole = sinkhole;
Object.assign(sinkhole, {
    difficulty: 5
})

const mesa = new SectorPreset("[NeopI]mesa", planet.seltis, 88);
exports.mesa = mesa;
Object.assign(mesa,{
    difficulty: 2,
    captureWave: 15,
    addStartingItems: true,
})

Events.on(EventType.SectorCaptureEvent, e => {
    if(e.sector == sinkhole){
        planet.seltis.unlock();
        mesa.unlock();
        core.ash.unlock();
        distribution.nickelConveyor.unlock();
        drill.nickelDrill.unlock();
        factory.compressor.unlock();
    }
})
