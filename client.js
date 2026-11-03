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
     * 目录里常见写法是「腾讯内网 · TT Switch」，取 `·` 之后的部分。
     */
    function shortName(provider, t) {
      const known = KNOWN[provider.id]
      if (known !== undefined) return t(known)
      const raw = String(provider.name || provider.id || '').trim()
      const parts = raw.split('·')
      const short = (parts.length > 1 ? parts[parts.length - 1] : raw).trim()
      return short === '' ? provider.id : short
    }

    /** 竖向两行：供应商在上，模型名在下，整体左上对齐。 */
    const stackStyle = {
      display: 'inline-flex',
      flexDirection: 'column',
      alignItems: 'flex-start',
      justifyContent: 'center',
      lineHeight: 1,
      minWidth: 0,
      maxWidth: '100%',
      verticalAlign: 'middle',
    }

    /** 供应商：左上角小字。 */
    const providerStyle = {
      fontSize: 9,
      lineHeight: '10px',
      letterSpacing: '0.02em',
      color: 'var(--dsw-alias-label-caption, var(--dsw-alias-label-secondary, inherit))',
      maxWidth: '100%',
      overflow: 'hidden',
      textOverflow: 'ellipsis',
      whiteSpace: 'nowrap',
    }

    /** 模型名：沿用宿主字号（13px），只压低行高以塞进 28px 高的触发器。 */
    const modelStyle = {
      lineHeight: '16px',
      maxWidth: '100%',
      overflow: 'hidden',
      textOverflow: 'ellipsis',
      whiteSpace: 'nowrap',
    }

    /**
     * 模型标签槽：供应商小字放左上角，模型名在其下方。
     * `option` 是被供应商分组的列表项，重复展示没有必要，只输出模型名。
     */
    function ProviderLabel({ provider, model, placement, t }) {
      if (placement === 'option') return h('span', null, model.name)
      return h('span', { style: stackStyle },
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
