/*
这个函数接受一个参数 response，该参数是一个 axios 发送请求后返回的响应对象。
  1.这个函数首先从响应对象的 headers 中提取出文件名。
  2.然后将响应对象中的二进制流转换为 Blob 对象。
  3.如果浏览器是 IE，使用 window.navigator.msSaveBlob 方法将 Blob 对象以本地方式保存文件。
  4.如果浏览器不是 IE，则创建一个 a 标签，将 Blob 对象的 URL 赋值给 href 属性，设置 download 属性为文件名，然后模拟用户点击该 a 标签进行下载。
  5.下载完成后，将 a 标签从页面中移除，并释放 Blob 对象的 URL。
总的来说，这个函数和之前的函数实现的功能类似，但使用的方法略有不同，主要是在处理响应对象和兼容性方面有所不同。
*/

export function convertResBlob(response) {
  // 提取文件名
  const filename = response.headers['content-disposition'].match(/filename=(.*)/)[1]

  // 将二进制流转为blob
  const blob = new Blob([response.data], { type: 'application/octet-stream' })
  if (typeof window.navigator.msSaveBlob !== 'undefined') {
    // 兼容IE，window.navigator.msSaveBlob：以本地方式保存文件
    window.navigator.msSaveBlob(blob, decodeURI(filename))
  } else {
    // 创建新的URL并指向File对象或者Blob对象的地址
    const blobURL = window.URL.createObjectURL(blob)
    // 创建a标签，用于跳转至下载链接
    const tempLink = document.createElement('a')
    tempLink.style.display = 'none'
    tempLink.href = blobURL
    tempLink.setAttribute('download', decodeURI(filename))
    // 兼容：某些浏览器不支持HTML5的download属性
    if (typeof tempLink.download === 'undefined') {
      tempLink.setAttribute('target', '_blank')
    }
    // 挂载a标签
    document.body.appendChild(tempLink)
    tempLink.click()
    document.body.removeChild(tempLink)
    // 释放blob URL地址
    window.URL.revokeObjectURL(blobURL)
  }
}
