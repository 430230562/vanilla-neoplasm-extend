let mod = Vars.modDirectory.child("vne").child("setting.txt");
let version = 0.20;
mod.exists() || mod.writeString("-1");
let currentVersion = parseFloat(mod.readString());


Events.on(EventType.ClientLoadEvent, () => {
	const remind = new BaseDialog("Vanilla Neoplasm Extend");
	
	remind.cont.pane(table => {
		table.image(Core.atlas.find("vne-icon")).size(64,64).pad(3).row();
		table.add(Core.bundle.get("vne.para1") + version).left().growX().wrap().width(420).maxWidth(420).pad(4).labelAlign(Align.left).row();

		table.button(Core.bundle.get("vne.changelog"), run(() => { 
			const changelog = new BaseDialog("Changelog");
			changelog.cont.pane(t => {
				t.add(Core.bundle.get("vne.changelogtext")).left().growX().wrap().width(500).maxWidth(500).pad(4).labelAlign(Align.left).row();	
			});
			changelog.buttons.button("@close", run(() => {
				changelog.hide();
			})).size(128,64);

			changelog.show();
		})).size(200,64).pad(4).row();
		
		table.add(Core.bundle.get("vne.para2")).left().growX().wrap().width(420).maxWidth(420).pad(4).labelAlign(Align.left).row();
		
		table.add(Core.bundle.get("vne.subtile1")).pad(4).labelAlign(Align.center).row();
		table.image(Tex.whiteui, Pal.accent).growX().height(3).pad(4).row();
		
		table.button("QQ交流群", run(() => {
			Core.app.openURI("");
		})).size(200,64).pad(4).row();
		
		table.button("github", run(() => {
			Core.app.openURI("https://github.com/430230562/vanilla-neoplasm-extend");
		})).size(200,64).pad(4).row();

		table.add(Core.bundle.get("vne.subtile2")).pad(4).labelAlign(Align.center).row();
		table.image(Tex.whiteui, Pal.accent).growX().height(3).pad(4).row();
		table.add(Core.bundle.get("vne.para3")).left().growX().wrap().width(420).maxWidth(420).pad(4).labelAlign(Align.left).row();

		table.add()
		
	});
	let time = 15 * 60;
	remind.buttons.button("",run(() => {
		remind.hide();
		mod.writeString("" + version)
	})).size(128,64).disabled(b => time > 0).update(b => {
		if(time > 0){
			time -= Time.delta
			b.setText(Core.bundle.get("close") + "(" + parseInt(time / 60) + "s)")
		}else{
			b.setText("@close")
			b.update(null)
		}
	})
	
	if(currentVersion < version) remind.show();
})