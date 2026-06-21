const thisModName = modName; // modName是自带的变量，不用手动改

// 可直接修改部分
// 注意：为了确保模组加载顺序正确，mod.json 的 softDependencies 需要添加所依赖模组内部名
const config = {
    modsPath: "libs", // 内置模组的文件夹路径，相对于mod根目录
};

function getInternalMods() {
    const root = Vars.mods.locateMod(thisModName).root;
    const modsFi = root.child(config.modsPath);

    if (!modsFi.exists() || !modsFi.isDirectory()) {
        Log.err("Internal mods path isn't existed or not a directory.");
        return [];
    }

    const internalModInfo = [];
    modsFi.walk(modFi => {
        let tmpFi = Vars.tmpDirectory.child(modFi.name());
        modFi.copyTo(tmpFi);

        const modRootFi = tmpFi.isDirectory() ? tmpFi : new ZipFi(tmpFi);
        const meta = Vars.mods.findMeta(resolveRoot(modRootFi));
        if (meta == null) {
            throw new Error("No meta file found for internal mod:" + modFi.absolutePath());
        }

        tmpFi.delete();

        internalModInfo.push({
            meta: meta,
            fi: modFi,
        });
    });
    return internalModInfo;

    function resolveRoot(fi) {
        const files = fi.list();
        return files.length == 1 && files[0].isDirectory() ? files[0] : fi;
    }
}

function importInternalMods() {
    const internalMods = getInternalMods();

    const imported = [];
    const versionMismatched = [];
    const disabled = [];
    internalMods.forEach(mod => {
        const {internalName, version} = mod.meta;
        const installed = Vars.mods.getMod(internalName);

        if (installed) {
            if (!installed.meta.version.equals(version)) {
                versionMismatched.push(mod);
            }

            if (!installed.enabled()) {
                disabled.push(mod);
            }
        } else {
            mod.fi.copyTo(Vars.modDirectory);
            imported.push(mod);
        }
    });

    return {
        imported: imported,
        versionMismatched: versionMismatched,
        disabled: disabled,
    };
}

exports.tryInstallInternalMods = function () {
    let result = null;
    try {
        result = importInternalMods();
    } catch (e) {
        afterLoaded(() =>
            Vars.ui.showException(thisModName + "无法导入内置的库模组，请联系作者", new java.lang.RuntimeException(e)),
        );
        return;
    }

    const {imported, versionMismatched, disabled} = result;
    if (imported.length || versionMismatched.length || disabled.length) {
        afterLoaded(() => {
            showImportInfo(imported, versionMismatched, disabled);
        });
        return false;
    }

    return true;
};

function afterLoaded(fn) {
    if (Vars.clientLoaded) {
        fn();
    } else {
        Events.on(ClientLoadEvent, e => {
            fn();
        });
    }
}

function showImportInfo(imported, versionMismatched, disabled) {
    const thisMod = Vars.mods.locateMod(thisModName);
    const dialog = new Dialog("");

    dialog.setFillParent(true);
    const {cont} = dialog;
    cont.margin(15);
    cont.add(thisMod.meta.displayName).color(Pal.accent);
    cont.row();
    cont.image().width(300).pad(2).height(4).color(Pal.accent);
    cont.row();

    cont.defaults().padTop(12);

    if (imported.length) {
        cont.table(null, t => {
            t.add("成功导入内置mods:");

            t.table(null, info => {
                imported.forEach((modInfo, index) => {
                    info.table(Tex.whiteui, nameTable => {
                        nameTable.add(modInfo.meta.displayName).pad(4);
                    })
                        .color(Pal.gray)
                        .pad(4);
                    if ((index + 1) % 4 == 0) info.row();
                });
            }).padLeft(8);
        });
        cont.row();
    }

    if (disabled.length) {
        cont.table(null, t => {
            t.add("未启用所需mods:");

            t.table(null, info => {
                disabled.forEach((modInfo, index) => {
                    info.table(Tex.whiteui, nameTable => {
                        nameTable.add(modInfo.meta.displayName).pad(4);
                    })
                        .color(Pal.gray)
                        .pad(4);
                    if ((index + 1) % 4 == 0) info.row();
                });
            }).pad(8);
        });
        cont.row();
    }

    if (versionMismatched.length) {
        cont.table(null, t => {
            t.add("版本不匹配的mods:");
            t.row();

            t.table(Styles.grayPanel, info => {
                info.defaults().pad(4);
                info.add("模组");
                info.add("当前版本");
                info.add("需要版本");
                info.row();

                versionMismatched.forEach((modInfo, index) => {
                    const installed = Vars.mods.getMod(modInfo.meta.internalName);
                    info.table(Tex.whiteui, nameTable => {
                        nameTable.add(modInfo.meta.displayName).pad(4);
                    })
                        .color(Pal.gray)
                        .pad(4);
                    info.add(installed.meta.version);
                    info.add(modInfo.meta.version);
                    info.row();
                });
            }).pad(8);
        });
        cont.row();
    }

    const requireRestart = imported.length > 0;

    if (requireRestart) cont.add("需要重启以刷新导入的模组");
    cont.row();

    cont.table(null, buttons => {
        buttons
            .button("@ok", () => dialog.hide())
            .size(120, 50)
            .pad(4);
        if (requireRestart)
            buttons
                .button("立即重启", () => Core.app.exit())
                .size(120, 50)
                .pad(4);
    });

    dialog.show();
}
