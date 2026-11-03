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

    const tagStyle = {
      display: 'inline-block',
      marginLeft: 6,
      padding: '0 4px',
      border: '1px solid var(--dsw-alias-border-l1, currentColor)',
      borderRadius: 4,
      fontSize: 11,
      lineHeight: '16px',
      color: 'var(--dsw-alias-label-caption, var(--dsw-alias-label-secondary, inherit))',
      maxWidth: '9em',
      overflow: 'hidden',
      textOverflow: 'ellipsis',
      whiteSpace: 'nowrap',
      verticalAlign: 'baseline',
    }

    /**
     * 模型标签槽：在模型名后补一个供应商标签。
     * `option` 是被供应商分组的列表项，重复展示没有必要，只输出模型名。
     */
    function ProviderLabel({ provider, model, placement, t }) {
      if (placement === 'option') return h('span', null, model.name)
      return h('span', null,
        h('span', null, model.name),
        h('span', {
          key: 'provider',
          style: tagStyle,
          title: provider.name || provider.id,
          'data-provider-id': provider.id,
        }, shortName(provider, t)),
      )
    }

    return {
      inject: ['slots', 'locale'],
      apply(ctx) {
        ctx.effect(() => ctx.locale.register(NS, { zh, en }), 'model-provider-label: dictionaries')
        ctx.slots.inject('conversation.input.model.label', () => ctx.slots.register({
          name: 'conversation.input.model.label',
          locale: NS,
        }, ProviderLabel))
      },
    }
  },
})
