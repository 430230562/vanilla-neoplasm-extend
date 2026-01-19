# Vanilla Neoplasm Extend (vne)

Vanilla neoplasm? Sounds delicious!

项目简介
- 一个为 Mindustry 扩展“neoplasm / 瘤液”相关内容的 mod。目标是把原版瘤液主题扩展为更多玩法：新流体、新方块、新物品、新单位以及新的生产链与交互（例如合成氨、焚化、吸附等）。
- 简短描述（来自 mod.hjson）：  
  "Do you think the original neoplasm solution, burned in a slag pool, is a too singular; Such biologically active materials should have other uses: as ammunition, synthesizing new materials, and even building their own biological armies... Please unleash your imagination to the fullest"

关键元数据
- 仓库：430230562/vanilla-neoplasm-extend  
- 作者/维护者（mod.hjson 标注）：pardon  
- 当前 mod 版本（mod.hjson）：0.22  
- 最低 Mindustry 兼容版本：154  
- 许可证：GNU GPL v3.0

主要特性（非穷尽）
- 新流体：瘤液/静脉浆（venous plasma）、营养液（nutrient solution）、酸液（acid liquid）、氨气（ammonia）等。
- 新物品：瘤蛋白块（Tumor Protein Block）、壳质（Chitin）、腐蚀性瘤块（Corrosive Tumor Block）、生物质钢（Biomass Steel）等。
- 新方块/机器：吸附器、合成氨厂、激光焚化炉、涡轮泵、生物质钢导管/路由器/交叉桥、氧化物墙（吸附瘤液）等。
- 新单位（示例）：Haploid、Diploid、Triploid、Ribosome、Lysosome、Trichocyst、Bomber、Cytoderm、Centrosome 等——各自具备吸收/留下瘤液、喷射酸液、牺牲攻击等特性。
- 多语言翻译资源：包含 zh_CN、ja、ko、es、pt_BR/pt_PT 等 bundle 文件。

快速安装
1. 下载发行包（release）或将本仓库打包为 mod：
   - 如果仓库已有打包好的 .zip/.mod：下载并放入 Mindustry 的 mods 目录。
2. 手动从源码打包（示例）：
   - 在仓库根目录，确保 mod.hjson 位于根目录并包含所有资源后执行：
     - Linux / macOS / Windows (Git Bash):
       zip -r vne.zip . -x ".git/*"
     - 把生成的 vne.zip 移动到 Mindustry/mods 文件夹中，或重命名为 vne.mod（按 Mindustry 习惯）。
3. 启动 Mindustry，确认 mod 已加载。

使用说明（游戏内）
- 在游戏的模组/内容浏览器中寻找 "Vanilla Neoplasm Extend" 或 vne 的内容。
- 可在沙盒/多人对战/地图中使用新增方块、单位与流体。某些方块（如合成氨厂、激光焚化炉、吸附器）拥有特定交互与能源需求，请参照游戏内描述与工具提示。

开发与构建（面向贡献者）
- 代码/资源组织：
  - 文本国际化资源位于 bundles/*（bundle.properties 及各语种文件）。
  - mod.hjson 包含 mod 元信息（name, displayName, minGameVersion, author, version 等）。
- 本地构建要点：
  - 保持 mod.hjson 在打包根目录。
  - 所有 asset、bundle、content 文件需与原仓库结构一致。
  - 打包时排除 .git 文件夹与不必要的开发文件。
- 提交与 PR：
  - Fork → 创建 feature/bugfix 分支 → 提交 → 发起 Pull Request。
  - 在 PR 描述中说明变更目的、影响的 game content 与兼容性（尤其是 minGameVersion 变更）。

报告问题与反馈
- 使用 GitHub Issues（仓库 Issues）提交 bug 报告、平衡建议或翻译修正，尽量提供重现步骤与日志截图。

版权与许可证
- 本项目采用 GNU General Public License v3.0 (GPL-3.0)。参见 LICENSE 文件或仓库中的许可声明。

致谢
- 作者/原始贡献者：pardon  
- 灵感来源：Mindustry 社区与原版 neoplasm 内容。  
- 翻译贡献：项目包含多语种 bundle 文件（中文/日文/韩文/西班牙语/葡萄牙语等），感谢社区协助翻译。
