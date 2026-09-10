# 浮光守卫 v2.2 平衡与检查记录

日期：2026-09-08。代码更新已应用；本记录覆盖十关自动模拟，不代表真人逐关完整试玩。

## 修复范围

- 统一基础敌人、波次生命成长、逐步引入强敌、战斗升级成本与效果。
- 初始守卫不再能仅靠三个 I 阶守卫挂机通关第一关。
- 第八关第三入口延后到第五波，并加长其河道，缓解短路线突袭。
- 普通敌人金币、召唤/分裂怪金币和波次补给下调，降低中后期闲置资金；保留工坊投资选择。
- 工坊升级成本从 90 / 150 改为 50 / 80，收入由 12 / 18 / 26 改为 12 / 20 / 30，每 6 秒结算；增量回本约 37.5 / 48 秒。
- 狭窄战斗侧栏按钮改为整行显示，角色名称和价格分行；页面切换滚动归顶。
- 旧版未完成战局继续时先提示重新布阵，永久资源、伙伴、培养、星级与掉券计数保留。
- 作品集入口指向 v2.2，独立包仍单独维护。

## 十关样例

每 0.65 秒自动决策部署或升级，60 Hz 模拟。第一关仅携带萤巡；其他关携带初始萤巡与新手固定两抽获得的露米、烬团。角色等级随关卡提高，不使用五星或道具。自动策略不等于新手操作，也不是最佳策略。

| 关卡 | 培养等级 | 结果 | 莲花生命 | 秒数 | 剩余金币 | 击败敌人数 |
| --- | --- | --- | --- | --- | --- | --- |
| 1 | 1 | 通关 | 10 | 146 | 43 | 45 |
| 2 | 1 | 通关 | 10 | 168 | 39 | 54 |
| 3 | 1 | 通关 | 10 | 210 | 59 | 63 |
| 4 | 2 | 通关 | 10 | 246 | 97 | 81 |
| 5 | 2 | 通关 | 10 | 275 | 93 | 114 |
| 6 | 3 | 通关 | 10 | 263 | 28 | 110 |
| 7 | 3 | 通关 | 10 | 312 | 149 | 114 |
| 8 | 4 | 通关 | 10 | 315 | 97 | 156 |
| 9 | 4 | 通关 | 10 | 332 | 1396 | 171 |
| 10 | 5 | 通关 | 7 | 508 | 1366 | 230 |

## 对照

- 第一关三个 I 阶萤巡不再追加操作：失败，约 166 秒。旧版对应样例满血通关。
- 第一关主动布阵与升级：满血通关，约 146 秒。
- 第九、十关同一套新手伙伴全部 Lv.1：均失败；适当培养后可通关。
- 高难关仍可能剩余金币，尤其落脚点有限的第九关；本次缓解收入与升级投入失衡，不声称彻底消除所有余钱或完成最终难度定案。

## 回归检查

- PASS：ten maps are available
- PASS：level 1 continuous waves and road containment
- PASS：level 2 continuous waves and road containment
- PASS：level 3 continuous waves and road containment
- PASS：level 4 continuous waves and road containment
- PASS：level 5 continuous waves and road containment
- PASS：level 6 continuous waves and road containment
- PASS：level 7 continuous waves and road containment
- PASS：level 8 continuous waves and road containment
- PASS：level 9 continuous waves and road containment
- PASS：level 10 continuous waves and road containment
- PASS：summoned monster coin reward is reduced
- PASS：workshop costs and incremental return
- PASS：save restores updated balance and income state
- PASS：所有本轮修改的 JavaScript 通过语法解析。

## 通关随机抽奖券

v2.1 已实现并通过上一轮边界、结算去重、失败不重置计数和首通叠加检查；本轮保留实现，不修改奖池概率或免费伙伴规则。1–3 关基础 25%，4–7 关 35%，8–10 关 45%，每次成功通关独立尝试掉一张。连续三次成功通关未掉后，下次成功通关必掉一张；失败不发券也不更改未掉计数。重复通关同样可掉落。

## 未完成的验证

新版浏览器交互检查连续两次遇到工具授权审核超时，未能连接测试浏览器，因此没有取得本轮新版界面截图，也没有在新版真实浏览器中重跑结算与导入流程。不将旧版浏览器检查结果冒充新版通过。布局改善与旧存档提示仍需补充实机确认。独立压缩包更新不等于原生安装程序，Windows 启动脚本本轮未重新验证。
