const item = require('vne/item');
const core = require("vne/block/core");

Planets.sun.radius = 7

const ochre = new Planet("ochre", Planets.sun, 4.5);
exports.ochre = ochre;
Object.assign(ochre, {
    generator: extend(SerpuloPlanetGenerator, {
        getColor(position) {
            return Color.valueOf("d6a01d")
        }
    }),
    meshLoader: prov(() => new HexMesh(ochre, 5)),
    cloudMeshLoader: () => new MultiMesh(
    new HexSkyMesh(ochre, 0, 0.5, 0.15, 5, Color.valueOf("d6a01d"), 2, 1, 0.8, 1),

    new HexSkyMesh(ochre, 1, 0.48, 0.154, 5, Color.valueOf("f9f4dcbf"), 2, 0.1, 0.5, 0.26),
    new HexSkyMesh(ochre, 2, 0.52, 0.158, 5, Color.valueOf("f7e8aabf"), 2, 0.1, 0.5, 0.23),
    new HexSkyMesh(ochre, 3, 0.51, 0.162, 5, Color.valueOf("f8df72bf"), 2, 0.1, 0.5, 0.25),
    new HexSkyMesh(ochre, 4, 0.49, 0.166, 5, Color.valueOf("f8df70bf"), 2, 0.1, 0.5, 0.21),
    new HexSkyMesh(ochre, 5, 0.45, 0.170, 5, Color.valueOf("c1651abf"), 2, 0.1, 0.5, 0.19),
    new HexSkyMesh(ochre, 6, 0.53, 0.174, 5, Color.valueOf("f7de98bf"), 2, 0.1, 0.5, 0.29),
    new HexSkyMesh(ochre, 7, 0.46, 0.178, 5, Color.valueOf("f8d86abf"), 2, 0.1, 0.5, 0.26),
    new HexSkyMesh(ochre, 8, 0.54, 0.182, 5, Color.valueOf("f6deadbf"), 2, 0.1, 0.5, 0.33),
    new HexSkyMesh(ochre, 9, 0.55, 0.186, 5, Color.valueOf("fbb612bf"), 2, 0.1, 0.5, 0.25),
    new HexSkyMesh(ochre, 10, 0.47, 0.19, 5, Color.valueOf("f9f1dbbf"), 2, 0.1, 0.5, 0.31), ),
    atmosphereColor: Color.valueOf("fca104"),
    atmosphereRadIn: 0,
    atmosphereRadOut: 0.5,
    clipRadius: 1,
    visible: true,
    bloom: false,
    accessible: false,
    alwaysUnlocked: false,
    startSector: 0,
    orbitRadius: 110
})

const p = extend(Planet, "ochre-rim", ochre, 0.1, {
    scale: 1,
    base: Blocks.yellowStone,
    tint: Blocks.ferricStone,
    tintThresh: 0.5,
    pieces: 400, //陨石数量
    orbitRadius: 0,
    hasAtmosphere: false,
    minZoom: 0.01,
    accessible: false,
    generator: new AsteroidGenerator(),
    meshLoader: prov(() => {
        let meshes = new Seq();
        let tinted = p.tint.mapColor;
        let color = p.base.mapColor;
        let rand = new Rand(p.id + 2);
        for (let j = 0; j < p.pieces; j++) {
            let v2 = new Vec2();
            v2.setToRandomDirection()
                .setLength(rand.random(1.45, 1.9)); //宽度
            let v22 = new Vec2(v2.y, rand.random(-0.05, 0.05)); //厚度
            v22.rotate(75); //倾斜角度
            meshes.add(new MatMesh(
            new NoiseMesh(p, j + 1, 1, 0.022 + rand.random(0.039) * p.scale, 2, 0.6, 0.38, 20, color, tinted, 3, 0.6, 0.38, p.tintThresh),
            new Mat3D()
                .setToTranslation(new Vec3(v2.x, v22.x, v22.y)
                .scl(5)) //整体大小
            ));
        };
        return new JavaAdapter(GenericMesh, {
            meshes: meshes.toArray(),
            render(params, projection, transform) {
                for (let v of this.meshes) {
                    v.render(params, projection, transform);
                }
            }
        });
    })
});
//p.sectors.add(new Sector(p, new PlanetGrid.Ptile(0, 0)));

const seltis = new Planet("seltis", ochre, 1, 2);
exports.seltis = seltis;
Object.assign(seltis, {
    generator: extend(SerpuloPlanetGenerator, {
        getDefaultLoadout() {
            return Schematics.readBase64("bXNjaAF4nGNgZmBmYWDJS8xNZWBOLM5g4ErOzytJzSvxTSxgYKquZeBOSS1OLsosKMnMz2NgYGDLSUxKzSlmYIqOZWRgL8tL1QVpYmBgBCEgAQAqBBKr");
        }
    }),
    

    meshLoader: prov(() => new MultiMesh(
    new NoiseMesh(
    seltis,
    5,
    5,
    0.978,
    5,
    0.8,
    0.5,
    0.8,
    Color.valueOf("a8a49c"),
    Color.valueOf("c0bcb4"),
    3,
    0.5,
    0.5,
    0),
    new NoiseMesh(
    seltis,
    204,
    5,
    1.004,
    3,
    0.3,
    1,
    0.2,
    Color.valueOf("3d3836"),
    Color.valueOf("5a524d"),
    3,
    0.5,
    0.3,
    0))
    ),

    cloudMeshLoader: () => new MultiMesh(
    new HexSkyMesh(seltis, 0, 0.05, 0.034, 5, Color.valueOf("87723e80"), 3, 0.3, 0.8, 0.3),
    new HexSkyMesh(seltis, 0, -0.03, 0.05, 5, Color.valueOf("815f255b"), 3, 0.2, 0.2, 0.21)
    ),

    atmosphereColor: Color.valueOf("604a4865"),
    landCloudColor: Color.valueOf("3d383680"),
    atmosphereRadIn: 0,
    atmosphereRadOut: 0.1,
    visible: true,
    bloom: false,
    accessible: true,
    alwaysUnlocked: true,
    allowLaunchLoadout: true,
    allowLaunchSchematics: true,
    autoAssignPlanet: true,
    allowCampaignRules: true,
    launchCapacityMultiplier: 1,
    clearSectorOnLose: false,
    allowLaunchToNumbered: false,
    ruleSetter: r => {
        r.waves = true;
        r.airUseSpawns = true;
        r.hideBannedBlocks = true;
        r.planet = seltis;
        r.bannedBlocks.addAll(
            Blocks.conveyor, Blocks.junction, Blocks.router
        )
    },
    startSector: 88,
    orbitRadius: 16,
    //defaultEnv: Env.terrestrial | Env.groundOil,
    rotateTime: 34.7 * 60,
    defaultCore: core.ash,
    iconColor: Color.valueOf("3d3836"),
    })