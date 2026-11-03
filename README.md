# dsh-model-provider-label

在 DeepSeek Harness 输入框的模型选择器里，**把当前模型来自哪个供应商显示出来**。

收起态只会显示 `DeepSeek-V4.1-Flash` 时，如果两个 provider 都提供了同名模型（例如 `tencent-tokenhub` 和 `tt-switch-tencent-intranet` 都叫 `DeepSeek-V4.1-Flash`），你就无法判断这条请求走的是哪条链路。这个插件在模型名后补一个供应商短标签。

## 效果

```
⋯  DeepSeek-V4.1-Flash  [TT Switch]  High  ⌄
```

三处都会生效：收起态按钮、菜单根行（「模型」的当前值）、模型列表项。
列表项本身就是按供应商分组的，所以 `placement: 'option'` 只输出模型名，不重复贴标签。

供应商短标签取 `displayName` 里 `·` 之后的片段：`腾讯内网 · TT Switch` → `TT Switch`。
宽度上限 `9em`，超出省略；完整名称放在 `title` 悬浮提示里。

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
}, ProviderLabel))
```

组件收到的 props：`provider: { id, name }`、`model`（目录条目）、`placement: 'trigger' | 'menu' | 'option'`、`selected`。

## 已知限制

- 该槽是 `single` 类型，且已有一个内置占用者（`@deepseek-ai/dsh-client-ui-deepseek-model-label-1017` 的发布徽标）。两者同时注册时的叠加行为取决于宿主，实测以页面显示为准。
- 收起态在窄窗口下会被宿主换成纯图标（`--dsh-composer-model-text-display: none`），此时标签也不显示。
- 只影响显示，不改变路由；供应商和模型的实际选择仍由宿主的模型选择器决定。

## License

MIT
