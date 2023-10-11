import React from 'react';

export function useLazyLoadImage({
  imageAttribute = '[data-img-src]',
  imageAttributeKey = 'imgSrc',
  rootMargin = '200px 0px',
  threshold = 0.01,
  debug = false,
  dependencies = [],
} = {}) {
  function log(...args) {
    // eslint-disable-next-line no-console
    if (debug) console.log(...args);
  }

  function loadImage(image) {
    const imageUrlToLoad = image.dataset[imageAttributeKey];
    log('Loading image url', imageUrlToLoad);
    // eslint-disable-next-line no-param-reassign
    image.src = imageUrlToLoad;
  }

  // eslint-disable-next-line consistent-return
  React.useEffect(() => {
    //获取dom树中所有img标签
    const images = document.querySelectorAll(imageAttribute);

    //window对象的IntersectionObserver属性为空时,直接加载所有图片
    if (!window.IntersectionObserver) {
      log(
        'IntersectionObserver not available on this browser, loading all images now',
      );
      Array.from(images).forEach((image) => loadImage(image));
    }
    //window 对象的 IntersectionObserver 属性不为空时,创建异步观察目标元素的实例 observer

    //相关说明:https://developer.mozilla.org/zh-CN/docs/Web/API/IntersectionObserver
    else {
      log(
        'Adding intersection observer to all elements that match',
        imageAttribute,
      );
      const observer = new IntersectionObserver(
        (entries) => {
          entries.forEach((entry) => {
            // 如果 intersectionRatio 为 0，则表示目标在视野外，不做任何操作
            if (entry.intersectionRatio > 0) {
              log('Unobserving image');
              observer.unobserve(entry.target);
              loadImage(entry.target);
            }
          });
        },
        { rootMargin, threshold },
      );
      //组件挂载时，监听所有img元素
      images.forEach((image) => observer.observe(image));

      //组件卸载时，取消监听
      return () => {
        images.forEach((image) => observer.unobserve(image));
      };
    }
  }, dependencies);
}
