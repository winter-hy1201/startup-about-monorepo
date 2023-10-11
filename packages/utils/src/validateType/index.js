import { getTypeName } from '@/utils/validateType/getType'

export function isNullOrUndef(value) {
  return value === null || value === undefined
}

/*
  用于判断一个字符串是否为空串 第二个判断条件中有一个额外的限制 (str !== 0) && (str !== '0')，用于避免对数字和字符串 "0" 判定为空串的错误情况。
*/
export function isEmptyStr(str) {
  return str === undefined || (!str && str !== 0 && str !== '0') || !/[^\s]/.test(str)
}

export function isNumber(value) {
  return typeof value === 'number' || getTypeName(value) === 'number'
}
