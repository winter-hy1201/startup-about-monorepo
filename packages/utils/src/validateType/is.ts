import { getTypeAllName } from './getType.js'

export const isDef = <T = any>(val?: T): val is T => typeof val !== 'undefined'
export const isBoolean = (val: any): val is boolean => typeof val === 'boolean'
export const isFunction = <T extends Function>(val: any): val is T => typeof val === 'function'
export const isNumber = (val: any): val is number => typeof val === 'number'
export const isString = (val: unknown): val is string => typeof val === 'string'
export const isObject = (val: any): val is object => getTypeAllName(val) === '[object Object]'
export const isUndefined = (val: any): val is undefined => getTypeAllName(val) === '[object Undefined]'
export const isNull = (val: any): val is null => getTypeAllName(val) === '[object Null]'
export const isRegExp = (val: any): val is RegExp => getTypeAllName(val) === '[object RegExp]'
export const isDate = (val: any): val is Date => getTypeAllName(val) === '[object Date]'

// @ts-ignore
export const isWindow = (val: any): boolean => typeof window !== 'undefined' && getTypeAllName(val) === '[object Window]'
// @ts-ignore
export const isBrowser = typeof window !== 'undefined'
