import type { DependencyList } from 'react';

/*
  这个函数判断两个依赖数组 oldDeps 和 deps 是否相等。DependencyList 是一个自定义的类型，通常用于 React Hooks 中标识组件的依赖项数组。
  1.首先，该函数会检查 oldDeps 是否完全等于 deps（即引用是否相同），如果是，则返回 true，表示它们是相等的。
  2.如果两个数组的引用不同，则使用 for 循环遍历每个元素，并使用 Object.is() 方法比较相应位置上的元素是否相等。如果有任何一个元素不相等，则立即返回 false 表示两个数组不同；否则，如果所有元素都相等，则返回 true，表示两个数组相等。
  3.React 的 useEffect 和 useCallback 钩子经常使用这个函数来确定依赖项是否发生了变化，以决定是否重新运行钩子中的回调函数。
*/

export default function depsAreSame(
  oldDeps: DependencyList,
  deps: DependencyList,
): boolean {
  if (oldDeps === deps) return true;
  for (let i = 0; i < oldDeps.length; i++) {
    if (!Object.is(oldDeps[i], deps[i])) return false;
  }
  return true;
}
