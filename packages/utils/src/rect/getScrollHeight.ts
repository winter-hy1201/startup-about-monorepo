//scrollHeight 的值等于该元素在不使用滚动条的情况下为了适应视口中所用内容所需的最小高度
export const getScrollHeight = (el: Document | Element) => {
  return (
    (el as Element).scrollHeight ||
    Math.max(document.documentElement.scrollHeight, document.body.scrollHeight)
  );
};
