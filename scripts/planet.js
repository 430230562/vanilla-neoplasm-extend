const item = require('vne/item');

Planets.sun.radius = 7

const ochre = new Planet("ochre", Planets.sun, 4.5);
exports.ochre = ochre;
Object.assign(ochre,{
    generator: extend(SerpuloPlanetGenerator,{
		getColor(position){
			return Color.valueOf("d6a01d")
		}
	}),
	meshLoader: prov(() => new HexMesh(ochre, 5)),
	cloudMeshLoader: () => new MultiMesh(
	    new HexSkyMesh(ochre, 0, 0.5, 0.15, 5, Color.valueOf("d6a01d"), 2, 1, 0.8, 1),
	    
		new HexSkyMesh(ochre, 1, 0.48, 0.152, 5, Color.valueOf("f9f4dcbf"), 2, 0.1, 0.5, 0.26),
		new HexSkyMesh(ochre, 2, 0.52, 0.154, 5, Color.valueOf("f7e8aabf"), 2, 0.1, 0.5, 0.23),
		new HexSkyMesh(ochre, 3, 0.51, 0.156, 5, Color.valueOf("f8df72bf"), 2, 0.1, 0.5, 0.25),
		new HexSkyMesh(ochre, 4, 0.49, 0.158, 5, Color.valueOf("f8df70bf"), 2, 0.1, 0.5, 0.21),
		new HexSkyMesh(ochre, 5, 0.45, 0.160, 5, Color.valueOf("c1651abf"), 2, 0.1, 0.5, 0.19),
		new HexSkyMesh(ochre, 6, 0.53, 0.162, 5, Color.valueOf("f7de98bf"), 2, 0.1, 0.5, 0.29),
		new HexSkyMesh(ochre, 7, 0.46, 0.164, 5, Color.valueOf("f8d86abf"), 2, 0.1, 0.5, 0.26),
		new HexSkyMesh(ochre, 8, 0.54, 0.166, 5, Color.valueOf("f6deadbf"), 2, 0.1, 0.5, 0.33),
		new HexSkyMesh(ochre, 9, 0.55, 0.168, 5, Color.valueOf("fbb612bf"), 2, 0.1, 0.5, 0.25),
		new HexSkyMesh(ochre, 10, 0.47, 0.17, 5, Color.valueOf("f9f1dbbf"), 2, 0.1, 0.5, 0.31),
	),
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
    		v2.setToRandomDirection().setLength(rand.random(1.45, 1.9)); //宽度
    		let v22 = new Vec2(v2.y, rand.random(-0.05, 0.05)); //厚度
    		v22.rotate(75); //倾斜角度
    		meshes.add(new MatMesh(
    			new NoiseMesh(p, j + 1, 1, 0.022 + rand.random(0.039) * p.scale, 2, 0.6, 0.38, 20, color, tinted, 3, 0.6, 0.38, p.tintThresh),
    			new Mat3D().setToTranslation(new Vec3(v2.x, v22.x, v22.y).scl(5)) //整体大小
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