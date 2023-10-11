/**
 * @desc 获取指定日期月份的总天数
 * @param {Date} time
 * @return {Number}
 */
export function monthDays(time) {
  const transformTime = new Date(time);
  let year = transformTime.getFullYear();
  let month = transformTime.getMonth() + 1;
  return new Date(year, month, 0).getDate();
}
