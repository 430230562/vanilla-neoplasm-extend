let armorDamage = Stat("armorDamage");

const corroding = extend(StatusEffect,"corroding",{
	update(unit, time){
		this.super$update(unit, time);
		
		if(unit.armor >= 0){
			unit.armor -= 0.5 / 60
		}
	},
	setStats(){
		this.super$setStats();
		
		this.stats.add(armorDamage, 0.5, StatUnit.perSecond)
	},
	init(){
	    this.affinity(StatusEffects.shocked, (unit, result, time) => {
	        unit.damagePierce(17);
	    })
	},
	damage: 0.2,
	transitionDamage: 17,
});
exports.corroding = corroding;

const neoplasmSlow = new extend(StatusEffect,"neoplasm-slow",{
    speedMultiplier: 0.25,
    update(unit, entry){
        this.super$update(unit, entry);
        
		Puddles.deposit(unit.tileOn(),Liquids.neoplasm,0);
    }
})
exports.neoplasmSlow = neoplasmSlow;

const antagonistic = extend(StatusEffect,"antagonistic",{
    speedMultiplier: 0.98,
    init(){
	    this.opposite(StatusEffects.burning, neoplasmSlow)
	}
});
exports.antagonistic = antagonistic;

/*let scope = new Packages.rhino.TopLevel();
new Packages.rhino.ClassCache().associate(scope);
let n = new Packages.rhino.NativeJavaObject(scope, StatusEffects.shocked, StatusEffect, true)

n.affinity(corroding, (unit, result, time) => {})*/