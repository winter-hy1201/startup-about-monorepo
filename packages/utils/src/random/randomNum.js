/**
 *
 * @desc 生成指定范围[min, max]的随机数
 * @param  {Number} min
 * @param  {Number} max
 * @return {Number}
 */
export function randomNum(min, max) {
  const _min = Math.ceil(min); // 四舍五入并返回大于等于给定数字的最小整数
  const _max = Math.floor(max); // 返回小于等于一个给定数字的最大整数
  return Math.floor(Math.random() * (_max - _min + 1)) + _min;
}
