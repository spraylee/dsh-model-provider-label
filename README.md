# dsh-model-provider-label

在 DeepSeek Harness 输入框的模型选择器里，**把当前模型来自哪个供应商显示出来**。

收起态只会显示 `DeepSeek-V4.1-Flash` 时，如果两个 provider 都提供了同名模型（例如 `tencent-tokenhub` 和 `tt-switch-tencent-intranet` 都叫 `DeepSeek-V4.1-Flash`），你就无法判断这条请求走的是哪条链路。这个插件在模型名后补一个供应商短标签。

## 效果

```
TT SWITCH                    ← 9px，绝对定位浮在模型名左上角
DeepSeek-V4.1-Flash  High ⌄  ← 模型名与推理强度保持同一基线
```

供应商小字用 `position: absolute` 浮到模型名左上角，**不占文档流高度**，
所以模型名那一行的高度和基线完全不变，宿主渲染的推理强度（`High`）仍然与模型名垂直对齐。

收起态按钮、菜单根行（「模型」的当前值）都生效。
模型列表项本身就是按供应商分组的，所以 `placement: 'option'` 只输出模型名，不重复贴标签。

供应商短标签取 `displayName` 里 `·` 之后的片段：`腾讯内网 · TT Switch` → `TT Switch`。
宽度超出省略；完整名称放在 `title` 悬浮提示里。

## 安装

这是 DSH 插件包（bundle），不是独立应用。用 `plugin_manager` 安装本地目录：

```
plugin_manager({
  action: "install_bundle",
  target: "/absolute/path/to/dsh-model-provider-label"
})
```

或从 npm 安装已发布版本：

```
plugin_manager({ action: "install_bundle", target: "dsh-model-provider-label" })
```

安装后无需重启，Client 侧通过 HMR 生效。回滚：

```
plugin_manager({ action: "remove_bundle", target: "dsh-model-provider-label" })
```

## 实现

| 文件 | 作用 |
|---|---|
| `package.json` | `dsh.bundle.patch` + `dsh.client`（platform: web） |
| `cordis.patch.yml` | 往 profile 插入 `model-provider-label` 行 |
| `index.js` | Host 半边，空实现（纯 Client 插件） |
| `client.js` | 注册 `conversation.input.model.label` 槽 |

挂载点是官方提供的扩展点：

```js
ctx.slots.inject('conversation.input.model.label', () => ctx.slots.register({
  name: 'conversation.input.model.label',
  locale: 'model-provider-label',
  priority: -10,
}, ProviderLabel))
```

组件收到的 props：`provider: { id, name }`、`model`（目录条目）、`placement: 'trigger' | 'menu' | 'option'`、`selected`。

### 为什么要 `priority: -10`

`conversation.input.model.label` 是 `single` 槽，已有内置占用者
`@deepseek-ai/dsh-client-ui-deepseek-model-label-1017`（priority 0）。
实测 **priority 数值小者胜出**（`Slots.listSubTree` 里显示 `active: true` 的那个 occupant），
所以用 `-10` 才能拿到渲染权；用正数会被内置徽标挡住。

## 已知限制

- 抢占后内置的 1017 发布徽标不再显示（它是同一个 single 槽的另一位占用者）。
- 收起态在窄窗口下会被宿主换成纯图标（`--dsh-composer-model-text-display: none`），此时标签也不显示。
- 只影响显示，不改变路由；供应商和模型的实际选择仍由宿主的模型选择器决定。

## License

MIT
