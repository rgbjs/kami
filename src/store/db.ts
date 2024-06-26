import { readOnly } from 'assist-tools'

/**
 * 会话表配置
 */
export const sessionTable = readOnly({
	name: 'session',
	idLenght: 50
})

/**
 * ip会话表配置
 */
export const ipListSessionTable = readOnly({
	name: 'ipList',
	idLenght: 50
})

/**
 * 管理员表配置
 */
export const adminTable = readOnly({
	name: 'admin',
	accountLength: 16,
	/** 密码会被加密, 需要预留大一些 */
	passwordLength: 255
})

/**
 * 卡密表配置
 */
export const cardTable = readOnly({
	name: 'card',
	tokenLength: 255,
	titleLength: 255,
	descLength: 255,
	stateLength: 1
})
