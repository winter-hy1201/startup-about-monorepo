export const getTypeAllName = (v) => Object.prototype.toString.call(v)

export function getTypeName(v) {
  //JavaScript 诞生以来便如此 typeof null === "object";
  if (v === null) return 'null'
  const type = getTypeAllName(v).slice(8, -1).toLowerCase()
  return typeof v === 'object' || typeof v === 'function' ? type : typeof v
}
