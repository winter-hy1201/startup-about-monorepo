function getUrlParams(key) {
  const paramValuesArray = [];
  const url = window.location.href
    .slice(window.location.href.indexOf('?') + 1)
    .split('&');
  for (let i = 0; i < url.length; i++) {
    const arrParamInfo = url[i].split('=');
    if (arrParamInfo[0] === key) {
      paramValuesArray.push(decodeURIComponent(arrParamInfo[1]));
    }
  }
  return paramValuesArray.length > 0
    ? paramValuesArray.length === 1
      ? paramValuesArray[0]
      : paramValuesArray
    : null;
}

export { getUrlParams };
