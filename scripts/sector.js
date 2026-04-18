const planet = require("vne/planet");

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

/*Events.on(EventType.SectorCaptureEvent, e => {
    if(e.sector == ){
        seltis.unlock()
    }
})*/
