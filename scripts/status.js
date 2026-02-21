const neoplasmSlow = extend(StatusEffect,"neoplasm-slow",{
    speedMultiplier: 0.25,
    effect: Fx.neoplasmHeal,
    update(unit, entry){
        this.super$update(unit, entry);
        
		Puddles.deposit(unit.tileOn(),Liquids.neoplasm,0);
    }
})
exports.neoplasmSlow = neoplasmSlow;

const stimulated = extend(StatusEffect,"stimulated",{
    damageMultiplier: 1,
    healthMultiplier: 1.2,
    speedMultiplier: 1.25,
    reloadMultiplier: 1.25,
    color: Color.valueOf("cd6240ff"),
    update(unit, entry){
        this.super$update(unit, entry);
        
        //非瘤液单位无法获得
        if(unit.type.outlineColor != Pal.neoplasmOutline){
            unit.unapply(this)
        }
    }
})
exports.stimulated = stimulated;

const antagonistic = extend(StatusEffect,"antagonistic",{
    speedMultiplier: 0.98,
    color: Color.valueOf("d1efff"),
    init(){
	    this.opposite(StatusEffects.burning, neoplasmSlow)
	}
});
exports.antagonistic = antagonistic;

/*let scope = new Packages.rhino.TopLevel();
new Packages.rhino.ClassCache().associate(scope);
let n = new Packages.rhino.NativeJavaObject(scope, StatusEffects.shocked, StatusEffect, true)

n.affinity(StatusEffects.corroded, (unit, result, time) => {})*/