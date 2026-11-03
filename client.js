window.__ModuleLoader__.load({
  id: 'dsh-model-provider-label',
  factory(require) {
    const React = require('react')
    const h = React.createElement

    const NS = 'model-provider-label'

    /** 内置 provider 的专用短名 */
    const zh = {
      'provider.account': 'DeepSeek 账号',
      'provider.official': 'DeepSeek 官方',
    }
    const en = {
      'provider.account': 'DeepSeek account',
      'provider.official': 'DeepSeek official',
    }

    const KNOWN = {
      'deepseek-account': 'provider.account',
      'deepseek-official': 'provider.official',
    }

    /**
     * 把 provider 显示名压缩成标签长度。
     * displayName 含 `·` 时取最后一段，如「My Relay · OpenRouter」→「OpenRouter」。
     */
    function shortName(provider, t) {
      const known = KNOWN[provider.id]
      if (known !== undefined) return t(known)
      const raw = String(provider.name || provider.id || '').trim()
      const parts = raw.split('·')
      const short = (parts.length > 1 ? parts[parts.length - 1] : raw).trim()
      return short === '' ? provider.id : short
    }

    /**
     * 单行内联布局：供应商作为小一号的同排文字放在模型名前。
     *
     * 为什么不用绝对定位：宿主把本槽包在 `.triggerLabel` 里，该元素带
     * `overflow: hidden` + `line-height: 20px`。任何 `top: 负值` 的内容都会被裁掉，
     * 实测 `position:absolute; top:-9px` 完全不可见。所以供应商必须留在行盒内部。
     *
     * 同排（不用 `vertical-align: super`）意味着不改变行盒高度，
     * 宿主渲染的推理强度（`High`）与模型名保持同一基线。
     */
    const wrapStyle = {
      display: 'inline',
      minWidth: 0,
    }

    /** 供应商：10px 同排小字，正常基线。 */
    const providerStyle = {
      fontSize: 10,
      letterSpacing: '0.02em',
      color: 'var(--dsw-alias-label-caption, var(--dsw-alias-label-secondary, inherit))',
      marginRight: 5,
      whiteSpace: 'nowrap',
    }

    /** 模型名：沿用宿主字号与行高。 */
    const modelStyle = {
      whiteSpace: 'nowrap',
    }

    /**
     * 模型标签槽：供应商小字在模型名前，同一行。
     * `option` 是被供应商分组的列表项，重复展示没有必要，只输出模型名。
     */
    function ProviderLabel({ provider, model, placement, t }) {
      if (placement === 'option') return h('span', null, model.name)
      return h('span', { style: wrapStyle },
        h('span', {
          key: 'provider',
          style: providerStyle,
          title: provider.name || provider.id,
          'data-provider-id': provider.id,
        }, shortName(provider, t)),
        h('span', { key: 'model', style: modelStyle }, model.name),
      )
    }

    return {
      inject: ['slots', 'locale'],
      apply(ctx) {
        ctx.effect(() => ctx.locale.register(NS, { zh, en }), 'model-provider-label: dictionaries')
        ctx.slots.inject('conversation.input.model.label', () => ctx.slots.register({
          name: 'conversation.input.model.label',
          locale: NS,
          // single 槽已有内置占用者（1017 发布徽标，priority 0）。实测 priority 数值
          // 小者胜出，因此用 -10 取代它拿到渲染权。
          priority: -10,
        }, ProviderLabel))
      },
    }
  },
})
