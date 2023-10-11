import { Message } from 'element-ui'

/*
  这个函数用于在浏览器中通过虚拟 a 标签下载文件。具体流程如下：
    1.接受两个参数：文件的 url 和文件名。
    2.如果 url 不是以 http 或 https 开头，则在 url 前面添加 https，以确保 url 合法。
    3.使用 fetch 函数获取文件的 blob 对象。
    4.创建一个虚拟 a 标签，设置标签的 href 属性为获取到的 blob 对象的 URL，设置 download 属性为文件名（如果没有传入文件名，则使用 url 中的文件名），设置 style 属性为 display:none，这样就不会在页面上显示该标签。
    5.如果页面中已经存在一个 id 为 virtualATagDownload 的 a 标签，则先将其从页面中移除。
    6.将虚拟 a 标签添加到页面中。
    7.触发 a 标签的 click 事件，即模拟用户点击下载链接。
    8.下载完成后，将虚拟 a 标签从页面中移除，并提示下载完成。
  该函数的作用是在浏览器中通过虚拟 a 标签下载文件，可以避免直接使用浏览器下载功能时弹出下载框，提供了更好的用户体验。
*/
export const fileByVirtualATagDownload = (url, fileName) => {
  if (!/^(http|https):/.test(url)) url = `https://${url}`
  fetch(url)
    .then((res) => res.blob())
    .then((blob) => {
      const a = document.createElement('a')
      a.id = 'virtualATagDownload'
      a.href = URL.createObjectURL(blob)
      a.download = fileName ? `${fileName + url.substring(url.lastIndexOf('.'))}` : url.substring(url.lastIndexOf('/') + 1)
      a.style.display = 'none'
      a.target = '_blank'
      if (document.getElementById('virtualATagDownload')) {
        document.body.removeChild(document.getElementById('virtualATagDownload'))
      }
      document.body.appendChild(a)
      a.click()
      document.body.removeChild(a)
      Message.success('下载完成')
    })
}

/*
  批量下载文件
  浏览器安全策略，同一时间只能有一个下载任务，所以使用定时器多次调用下载方法
*/
export const batchDownload = (fileList) => {
  fileList.forEach((item, index) => {
    setTimeout(() => {
      fileByVirtualATagDownload(item?.url, item?.fileName)
    }, 1000 * index)
  })
}
