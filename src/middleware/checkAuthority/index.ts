import session from './session.js'
import { type Context, type Next } from 'koa'
import { formatDate } from 'assist-tools'
import checkAuthority from './config.js'
import { symmetricEncrypt } from '#lib'

/**
 * 权限校验中间件
 */
export default () => {
	return async (ctx: Context, next: Next) => {
		let id = null
		try {
			id = symmetricEncrypt.decrypt(ctx.header.authorization)
		} catch {}

		ctx.container.userSession = {
			id,
			content: session.get(id),
			session
		}

		// 如果接口在白名单内
		if (checkAuthority.checkWhiteList({ method: ctx.method, url: ctx.url })) {
			await next()
			return
		}

		// 不在白名单内则验证会话和路由权限
		if (!ctx.container.userSession.content) {
			// 会话不存在
			ctx.body = {
				code: 401,
				msg: '登录过期'
			}
			return
		}

		const now = new Date()
		if (
			new Date(ctx.container.userSession.content.lastActiveTime).getTime() + config.project.session.maxAge <
			now.getTime()
		) {
			// 会话已过期
			ctx.body = {
				code: 401,
				msg: '登录过期 .'
			}
			return
		}

		// 活跃状态自动延长有效期
		if (config.project.session.activeExtend) {
			// 此处不等待, 让其异步执行
			session.update(ctx.container.userSession.id, 'lastActiveTime', formatDate(now))
		}

		const checkResult = checkAuthority.checkRoute({
			url: ctx.url,
			method: ctx.method,
			ruleName: ctx.container.userSession.content.identity
		})

		if (!checkResult) {
			ctx.body = {
				code: 403,
				msg: '权限不足'
			}
			return
		}

		await next()
	}
}
