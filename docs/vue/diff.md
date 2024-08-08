---
title: Vue3 的 Diff 算法
---

# Vue3 的 Diff 算法

如果新旧虚拟 DOM 的子节点都为 ARRAY_CHILDREN，比较两组子节点时就会进入 Diff 算法。

## Vue3 Diff 算法的执行流程

1. 从左向右比较新老子节点，节点相同则 patch，不同则停止循环
2. 从右向左比较新老子节点，节点相同则 patch，不同则停止循环
3. 判断如果旧子节点为空，新子节点不为空，则挂载剩余新子节点
4. 判断如果旧子节点不为空，新子节点为空，则卸载剩余旧子节点
5. 判断如果剩余旧子节点不为空，剩余新子节点也不为空，则进行乱序比较

## Vue3 Diff 算法的核心

Diff 算法的核心就是第 5 步的乱序比较过程，具体如下：

**1. 为新子节点构建 key:index 映射**

把剩余新子节点的 key 和 index 做成映射表：keyToNewIndexMap，keyToNewIndexMap 的 key 就是节点的 key 值，value 就是节点的下标。通过该 map 可以直接获取到新的子节点所在位置。

**2. 循环旧子节点，patch 匹配的节点，卸载不再存在的节点**

遍历剩余旧子节点，从 keyToNewIndexMap 中查找是否有对应的新子节点，如果找到对应的新子节点，则 patch，否则卸载旧子节点。

构建一个数组 newIndexToOldIndexMap，该数组的下标是新元素的相对下标（加上 s2 后就是新元素的真实下标），数组元素的初始值是 0，如果找到对应的旧节点则把值设置为旧元素的下标 + 1，数组长度就是剩余新子节点的数量。

经过此论循环所有 patch 过的新子节点在 newIndexToOldIndexMap 中的值都不为 0。

并且标记是否有节点需要移动。

**3. 移动和挂载新子节点**

倒序遍历剩余新子节点，如果 newIndexToOldIndexMap 对应的值为 0，说明该节点是新节点，挂载即可。

否则判断该节点是否需要移动，如果不存在最长递增子序列（或者最长递增子序列已经遍历完）或者该元素不在最长递增子序列中，则需要移动。

## 源码分析

Vue3 的 diff 算法分为 5 个场景，核心源码是 `patchKeyedChildren` 函数：

```ts
function patchKeyedChildren(
  c1: VNode[], // 旧子节点
  c2: VNodeArrayChildren, // 新子节点
  container: RendererElement,
  parentAnchor: RendererNode | null,
  parentComponent: ComponentInternalInstance | null,
  parentSuspense: SuspenseBoundary | null,
  namespace: ElementNamespace,
  slotScopeIds: string[] | null,
  optimized: boolean
) {
  // 当前子节点下标
  const i = 0
  // 新子节点的长度
  const l2 = c2.length
  // 旧子节点最大下标
  const e1 = c1.length - 1 // prev ending index
  // 新子节点最大下标
  const e2 = l2 - 1 // next ending index

  // 1. sync from start
  // (a b) c
  // (a b) d e
  // 从头开始比较，patch 相同的节点
  // 直到遇到不同的节点为止
  while (i <= e1 && i <= e2) {
    // 旧子节点的第 i 个节点
    const n1 = c1[i]
    // 新子节点的第 i 个节点
    const n2 = (c2[i] = optimized
      ? cloneIfMounted(c2[i] as VNode)
      : normalizeVNode(c2[i]))
    // 如果两个节点相同，直接 patch
    if (isSameVNodeType(n1, n2)) {
      patch(
        n1,
        n2,
        container,
        null,
        parentComponent,
        parentSuspense,
        namespace,
        slotScopeIds,
        optimized,
      )
    }
    else {
      // 如果两个节点不同，跳出循环
      break
    }
    // 向右移动
    i++
  }

  // 2. sync from end
  // a (b c)
  // d e (b c)
  // 从尾部开始比较，patch 相同的节点
  // 直到遇到不同的节点为止
  while (i <= e1 && i <= e2) {
    const n1 = c1[e1]
    const n2 = (c2[e2] = optimized
      ? cloneIfMounted(c2[e2] as VNode)
      : normalizeVNode(c2[e2]))
    // 如果两个节点相同，直接 patch
    if (isSameVNodeType(n1, n2)) {
      patch(
        n1,
        n2,
        container,
        null,
        parentComponent,
        parentSuspense,
        namespace,
        slotScopeIds,
        optimized,
      )
    }
    else {
      // 如果两个节点不同，跳出循环
      break
    }
    // 向左移动
    e1--
    e2--
  }

  // 3. common sequence + mount
  // (a b)
  // (a b) c
  // i = 2, e1 = 1, e2 = 2
  // (a b)
  // c (a b)
  // i = 0, e1 = -1, e2 = 0
  // 此时首部和尾部如果有相同的节点都已经 patch 了
  // 判断如果剩余旧子节点为空，新子节点不为空，则挂载剩余新子节点
  if (i > e1) {
    if (i <= e2) {
      // 下一个节点的下标
      const nextPos = e2 + 1
      // 如果下一个节点存在，则使用下一个节点的 el 作为锚点（insertBefore），否则使用父节点的锚点（appendChild）
      const anchor = nextPos < l2 ? (c2[nextPos] as VNode).el : parentAnchor
      // 从 i 开始，到 e2 结束，挂载新子节点
      while (i <= e2) {
        patch(
          null,
          (c2[i] = optimized
            ? cloneIfMounted(c2[i] as VNode)
            : normalizeVNode(c2[i])),
          container,
          anchor,
          parentComponent,
          parentSuspense,
          namespace,
          slotScopeIds,
          optimized,
        )
        // 继续循环下一个节点
        i++
      }
    }
  }

  // 4. common sequence + unmount
  // (a b) c
  // (a b)
  // i = 2, e1 = 2, e2 = 1
  // a (b c)
  // (b c)
  // i = 0, e1 = 0, e2 = -1
  // 此时首部和尾部如果有相同的节点都已经 patch 了
  // 判断如果剩余旧子节点不为空，新子节点为空，则卸载剩余旧子节点
  else if (i > e2) {
    // 从 e1 开始，到 i 结束，卸载旧子节点
    while (i <= e1) {
      unmount(c1[i], parentComponent, parentSuspense, true)
      i++
    }
  }

  // 5. unknown sequence
  // [i ... e1 + 1]: a b [c d e] f g
  // [i ... e2 + 1]: a b [e d c h] f g
  // i = 2, e1 = 4, e2 = 5
  // 经过步骤 1 和 2 的循环后，剩余的旧子节点和新子节点都是乱序的
  // 这里也是 diff 算法核心部分：乱序子节点比较
  // 也就是有节点需要移动
  else {
    // i 为第 1 步循环结束后的下标
    // e1 为第 2 步循环结束后旧子节点的最大下标
    // e2 为第 2 步循环结束后新子节点的最大下标

    // 旧子节点开始下标
    const s1 = i // prev starting index
    // 新子节点开始下标
    const s2 = i // next starting index

    // 5.1 build key:index map for newChildren
    // 5.1 为新子节点构建 key:index 映射
    // key 就是节点的 key 值，value 就是节点的下标
    // 通过该 map 可以直接获取到新的子节点所在位置
    const keyToNewIndexMap: Map<string | number | symbol, number> = new Map()
    // 遍历新子节点构建 key:index 映射
    for (i = s2; i <= e2; i++) {
      const nextChild = (c2[i] = optimized
        ? cloneIfMounted(c2[i] as VNode)
        : normalizeVNode(c2[i]))
      if (nextChild.key != null) {
        // 开发环境会检查 key 是否重复，如果重复会给出警告
        if (__DEV__ && keyToNewIndexMap.has(nextChild.key)) {
          warn(
            `Duplicate keys found during update:`,
            JSON.stringify(nextChild.key),
            `Make sure keys are unique.`,
          )
        }
        keyToNewIndexMap.set(nextChild.key, i)
      }
    }

    // 5.2 loop through old children left to be patched and try to patch
    // matching nodes & remove nodes that are no longer present
    // 5.2 循环旧子节点，尝试 patch 匹配的节点，卸载不再存在的节点
    let j
    // 已经 patch 的节点数量
    let patched = 0
    // 新子节点中需要 patch 的节点数量
    // 也就是剩余新子节点的数量
    // 新子节点结束下标 - 新子节点开始下标 + 1
    const toBePatched = e2 - s2 + 1
    // 标记是否有节点需要移动
    let moved = false
    // used to track whether any node has moved
    // 最大新子节点下标，用于判断是否有节点需要移动
    let maxNewIndexSoFar = 0
    // works as Map<newIndex, oldIndex>
    // Note that oldIndex is offset by +1
    // and oldIndex = 0 is a special value indicating the new node has
    // no corresponding old node.
    // 数组下标是新元素的相对下标（加上 s2 后就是新元素的真实下标）
    // 数组元素的初始值是 0，如果找到对应的旧节点则把值设置为旧元素的下标 + 1
    // 数组长度就是剩余新子节点的数量
    // used for determining longest stable subsequence
    // 用于确定最长稳定子序列
    const newIndexToOldIndexMap = new Array(toBePatched)
    // 初始化 newIndexToOldIndexMap
    for (i = 0; i < toBePatched; i++) newIndexToOldIndexMap[i] = 0

    // 首先遍历旧子节点
    for (i = s1; i <= e1; i++) {
      const prevChild = c1[i]
      // 如果已经 patch 的节点数量大于等于新子节点中需要 patch 的节点数量
      // 说明所有新子节点都已经 patch 完毕，剩下的旧子节点都是需要卸载的
      if (patched >= toBePatched) {
        // all new children have been patched so this can only be a removal
        // 卸载旧子节点
        unmount(prevChild, parentComponent, parentSuspense, true)
        // 循环卸载剩余的旧子节点
        continue
      }
      // 新子节点的下标
      let newIndex
      // 查找新子节点中是否有对应的节点
      if (prevChild.key != null) {
        // 如果旧子节点有 key，就通过 key 查找新子节点中对应的节点
        // 并更新 newIndex
        newIndex = keyToNewIndexMap.get(prevChild.key)
      }
      else {
        // key-less node, try to locate a key-less node of the same type
        // 旧子节点没有 key，尝试查找相同类型的无 key 的节点
        for (j = s2; j <= e2; j++) {
          if (
            newIndexToOldIndexMap[j - s2] === 0
            && isSameVNodeType(prevChild, c2[j] as VNode)
          ) {
            // 如果找到了对应的新子节点，就更新 newIndex
            newIndex = j
            break
          }
        }
      }
      // 如果没有找到对应的新子节点，说明该旧子节点需要卸载
      if (newIndex === undefined) {
        unmount(prevChild, parentComponent, parentSuspense, true)
      }
      else {
        // 找到了对应的新子节点
        // 更新 newIndexToOldIndexMap，key 为新子节点的相对下标，value 为旧子节点的下标 + 1
        newIndexToOldIndexMap[newIndex - s2] = i + 1
        // 如果 newIndex >= maxNewIndexSoFar，更新 maxNewIndexSoFar
        if (newIndex >= maxNewIndexSoFar)
          maxNewIndexSoFar = newIndex
        else
          // 否则说明该节点需要移动
          moved = true

        // patch 对应的新子节点
        patch(
          prevChild,
          c2[newIndex] as VNode,
          container,
          null,
          parentComponent,
          parentSuspense,
          namespace,
          slotScopeIds,
          optimized,
        )
        // 更新已经 patch 的节点数量
        patched++
      }
    }

    // 5.3 move and mount
    // 5.3 移动和挂载
    // 经过上一个步骤，已经处理了所有需要 patch 的旧节点，卸载了所有需要卸载的旧节点
    // 剩下的旧节点都是需要移动的节点和需要挂载的新节点
    // 已经理过的旧节点都在 newIndexToOldIndexMap 中有对应的值
    // generate longest stable subsequence only when nodes have moved
    // 仅在有节点需要移动时才生成最长递增子序列
    const increasingNewIndexSequence = moved
      ? getSequence(newIndexToOldIndexMap)
      : EMPTY_ARR
    // j >= 0 表示最长递增子序列的最后一个节点的下标
    // < 0 表示没有最长递增子序列
    j = increasingNewIndexSequence.length - 1
    // looping backwards so that we can use last patched node as anchor
    // 反向循环，这样我们就可以使用最后一个 patch 的节点作为锚点（方便使用 insertBefore）
    // 遍历新元素，找出需要移动和挂载的节点
    for (i = toBePatched - 1; i >= 0; i--) {
      // 当前新子节点的下标
      const nextIndex = s2 + i
      // 当前新子节点
      const nextChild = c2[nextIndex] as VNode
      // 锚点，如果新子节点中有下一个节点，就使用下一个节点的 el 作为锚点，否则使用父节点的锚点
      // 有下一个节点说明当前节点不是最后一个节点，那么该节点就需要插入到下一个节点的前面
      // patch 时会使用 insertBefore
      // 否则说明当前节点是最后一个节点，那么该节点就需要插入到父节点的最后面
      const anchor
        = nextIndex + 1 < l2 ? (c2[nextIndex + 1] as VNode).el : parentAnchor
      // 如果 newIndexToOldIndexMap[i] === 0
      // 说明该节点在 5.2 步的时候没有被 patch
      // 那么该节点是新增子节点，直接挂载即可
      if (newIndexToOldIndexMap[i] === 0) {
        // mount new
        // 挂载新子节点
        patch(
          null,
          nextChild,
          container,
          anchor,
          parentComponent,
          parentSuspense,
          namespace,
          slotScopeIds,
          optimized,
        )
      }
      else if (moved) {
        // move if:
        // There is no stable subsequence (e.g. a reverse)
        // OR current node is not among the stable sequence
        // 如果该子节点不是新增子节点，说明该节点是需要移动的节点
        // 如果不存在最长递增子序列（或者最长递增子序列已经遍历完）或者当前节点不在最长递增子序列中
        // 则需要移动
        if (j < 0 || i !== increasingNewIndexSequence[j])
          move(nextChild, container, anchor, MoveType.REORDER)
        else
          // 否则说明该节点不需要移动
          // 最长递增子序列中的节点不需要移动
          j--
      }
    }
  }
}
```

## 最长递增子序列

使用动态规划和二分查找算法实现最长递增子序列的获取。

注释版本：

```ts
function getSequence(arr: number[]): number[] {
  // 查找结果
  const result = [0]
  const len = arr.length

  // 记录每个元素的前一个元素的下标
  const record = arr.slice()

  for (let i = 0; i < len; i++) {
    // 当前元素
    const current = arr[i]
    // 在 newIndexToOldIndexMap 中 0 表示新增节点
    // 所以不用管
    if (current !== 0) {
      // 最后一个元素的下标
      const last = result[result.length - 1]
      // 如果当前元素大于最后一个元素，直接 push 到 result 中
      if (arr[last] < current) {
        record[i] = last
        result.push(i)
        continue
      }
    }

    // 二分查找，查找第一个比 current 大的元素
    let left = 0
    let right = result.length - 1
    while (left < right) {
      // 中间元素的下标
      const mid = (left + right) >> 1
      // 如果中间元素小于 current，说明中间元素不是第一个比 current 大的元素
      if (arr[result[mid]] < current) {
        // 下一轮查找从 mid + 1 开始
        left = mid + 1
      }
      else {
        // 否则下一轮查找从 mid 开始
        right = mid
      }
    }

    // 从 result 中找比 current 大的元素中最小的元素，并替换
    if (current < arr[result[left]]) {
      if (left > 0) {
        record[i] = result[left - 1]
      }
      result[left] = i
    }

    let i = result.length
    let last = result[i - 1]

    while (i-- > 0) {
      result[i] = last
      last = record[last]
    }

    return result
  }
}
```

Vue 源码：

```ts
// https://en.wikipedia.org/wiki/Longest_increasing_subsequence
function getSequence(arr: number[]): number[] {
  const p = arr.slice()
  const result = [0]
  let i, j, u, v, c
  const len = arr.length
  for (i = 0; i < len; i++) {
    const arrI = arr[i]
    if (arrI !== 0) {
      j = result[result.length - 1]
      if (arr[j] < arrI) {
        p[i] = j
        result.push(i)
        continue
      }
      u = 0
      v = result.length - 1
      while (u < v) {
        c = (u + v) >> 1
        if (arr[result[c]] < arrI) {
          u = c + 1
        }
        else {
          v = c
        }
      }
      if (arrI < arr[result[u]]) {
        if (u > 0) {
          p[i] = result[u - 1]
        }
        result[u] = i
      }
    }
  }
  u = result.length
  v = result[u - 1]
  while (u-- > 0) {
    result[u] = v
    v = p[v]
  }
  return result
}
```
