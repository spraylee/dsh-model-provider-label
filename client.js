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

    /**
     * 模型名保持原样占据正常流，供应商用绝对定位浮到它的左上角。
     *
     * 关键收益：标签块的盒模型高度仍等于模型名那一行（line-height 20px），
     * 与宿主紧接着渲染的推理强度（`High`，同样垂直居中）保持同一基线，
     * 不会因为多出一行文字而被顶得上移。
     */
    const wrapStyle = {
      position: 'relative',
      display: 'inline-block',
      minWidth: 0,
      maxWidth: '100%',
    }

    /** 供应商：绝对定位到模型名左上角，脱离文档流不占高度。 */
    const providerStyle = {
      position: 'absolute',
      left: 0,
      top: '-9px',
      fontSize: 9,
      lineHeight: '9px',
      letterSpacing: '0.02em',
      color: 'var(--dsw-alias-label-caption, var(--dsw-alias-label-secondary, inherit))',
      maxWidth: '100%',
      overflow: 'hidden',
      textOverflow: 'ellipsis',
      whiteSpace: 'nowrap',
      pointerEvents: 'none',
    }

    /** 模型名：完全沿用宿主字号与行高，保证与 `High` 基线一致。 */
    const modelStyle = {
      maxWidth: '100%',
      overflow: 'hidden',
      textOverflow: 'ellipsis',
      whiteSpace: 'nowrap',
    }

    /**
     * 模型标签槽：供应商小字绝对定位到模型名左上角，模型名本身留在正常流里。
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
