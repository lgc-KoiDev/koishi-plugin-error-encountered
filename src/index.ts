import { Computed, Context, Schema } from 'koishi'

export const name = 'error-encountered'
export const inject = []

export interface Config {
  userList: Computed<string[]>
}
export const Config: Schema<Config> = Schema.object({
  userList: Schema.computed(Schema.array(Schema.string()).role('table').default([]))
    .default([])
    .description('生效的用户 ID 列表，支持 `userId` 与 `platform:userId` 格式'),
})

export function apply(ctx: Context, config: Config) {
  ctx.before('command/execute', ({ session }) => {
    if (!session) return

    const userList = session.resolve(config.userList)
    const { userId, platform } = session
    if (userList.includes(userId) || userList.includes(`${platform}:${userId}`)) {
      return session.i18n('internal.error-encountered')
    }
  })
}
