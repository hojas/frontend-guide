---
title: Vue3 的 Diff 算法
---

# Vue3 的 Diff 算法

如果新旧 ELEMENT 的子节点都为 ARRAY_CHILDREN，比较两组子节点时，想要高效更新就需要 diff 算法了。

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
  const i = 0
  // 新子节点的长度
  const l2 = c2.length
  // 旧子节点最大下标
  const e1 = c1.length - 1 // prev ending index
  // 新子节点最大下标
  const e2 = l2 - 1 // next ending index

  // (a b) c
  // (a b) d e
  // 从头开始比较，直到遇到不同的节点为止
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
    // 继续循环下一个节点
    i++
  }

  // 2. sync from end
  // a (b c)
  // d e (b c)
  // 从尾开始比较，直到遇到不同的节点为止
  while (i <= e1 && i <= e2) {
    // 旧子节点的第 i 个节点
    const n1 = c1[e1]
    // 新子节点的第 i 个节点
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
    // 继续循环上一个节点
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
  // 从 i 开始，到 e2 结束，如果新子节点中有旧子节点中没有的节点，就挂载新子节点
  // 也就是此时旧子节点为空，新子节点不为空
  if (i > e1) {
    if (i <= e2) {
      const nextPos = e2 + 1
      // 如果父节点有锚点，就挂载到锚点前面，否则挂载到父节点内部
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
  // 从 e1 开始，到 i 结束，如果旧子节点中有新子节点中没有的节点，就卸载旧子节点
  // 也就是此时旧子节点不为空，新子节点为空
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
  // diff 算法核心部分：乱序子节点比较
  else {
    // 旧子节点开始下标
    const s1 = i // prev starting index
    // 新子节点开始下标
    const s2 = i // next starting index

    // 5.1 build key:index map for newChildren
    // 5.1 为新子节点构建 key:index 映射
    // 通过该对象可以知道新的子节点更新后的位置
    const keyToNewIndexMap: Map<string | number | symbol, number> = new Map()
    for (i = s2; i <= e2; i++) {
      const nextChild = (c2[i] = optimized
        ? cloneIfMounted(c2[i] as VNode)
        : normalizeVNode(c2[i]))
      if (nextChild.key != null) {
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

    // 5.2 loop through old children left to be patched and try to patch matching nodes & remove nodes that are no longer present
    // 5.2 循环旧子节点，尝试 patch 匹配的节点，卸载不再存在的节点
    let j
    // 已经 patch 的节点数量
    let patched = 0
    // 新子节点中需要 patch 的节点数量
    const toBePatched = e2 - s2 + 1
    // 标记节点是否需要移动
    let moved = false
    // used to track whether any node has moved
    // 用于跟踪是否有节点移动
    let maxNewIndexSoFar = 0
    // works as Map<newIndex, oldIndex> Note that oldIndex is offset by +1 and oldIndex = 0 is a special value indicating the new node has no corresponding old node.
    // 工作原理与 Map<newIndex, oldIndex> 相同。注意，oldIndex 的偏移量为 +1，而 oldIndex = 0 是一个特殊值，表示新节点没有对应的旧节点。
    // used for determining longest stable subsequence
    // 用于确定最长稳定子序列
    const newIndexToOldIndexMap = new Array(toBePatched)
    for (i = 0; i < toBePatched; i++) newIndexToOldIndexMap[i] = 0

    // 遍历旧子节点
    for (i = s1; i <= e1; i++) {
      const prevChild = c1[i]
      // 如果已经 patch 的节点数量大于等于新子节点中需要 patch 的节点数量，说明所有新子节点都已经 patch 完毕，剩下的旧子节点都是需要卸载的
      if (patched >= toBePatched) {
        // all new children have been patched so this can only be a removal
        // 卸载旧子节点
        unmount(prevChild, parentComponent, parentSuspense, true)
        continue
      }
      let newIndex
      if (prevChild.key != null) {
        // 如果旧子节点有 key，就通过 key 查找新子节点中对应的节点
        newIndex = keyToNewIndexMap.get(prevChild.key)
      }
      else {
        // key-less node, try to locate a key-less node of the same type
        // 无 key 的节点，尝试查找相同类型的无 key 的节点
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
        // 如果找到了对应的新子节点，就更新 newIndexToOldIndexMap
        newIndexToOldIndexMap[newIndex - s2] = i + 1
        // 如果 newIndex 大于 maxNewIndexSoFar，说明该节点需要移动
        if (newIndex >= maxNewIndexSoFar)
          maxNewIndexSoFar = newIndex
        else
          moved = true

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
        patched++
      }
    }

    // 5.3 move and mount
    // 5.3 移动和挂载
    // generate longest stable subsequence only when nodes have moved
    // 仅在节点移动时生成最长稳定子序列
    const increasingNewIndexSequence = moved
      ? getSequence(newIndexToOldIndexMap)
      : EMPTY_ARR
    // 大于等于 0 表示最长递增子序列的最后一个节点的下标
    // 小于 0 表示没有最长递增子序列
    j = increasingNewIndexSequence.length - 1
    // looping backwards so that we can use last patched node as anchor
    // 反向循环，这样我们就可以使用最后一个 patch 的节点作为锚点
    for (i = toBePatched - 1; i >= 0; i--) {
      const nextIndex = s2 + i
      const nextChild = c2[nextIndex] as VNode
      // 锚点，如果新子节点中有下一个节点，就使用下一个节点的 el 作为锚点，否则使用父节点的锚点
      const anchor
        = nextIndex + 1 < l2 ? (c2[nextIndex + 1] as VNode).el : parentAnchor
      // 如果 newIndexToOldIndexMap[i] === 0，说明该节点是新节点，需要挂载
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
        // 不存在最长递增子序列或者当前节点不在最后位置，就移动节点
        if (j < 0 || i !== increasingNewIndexSequence[j])
          move(nextChild, container, anchor, MoveType.REORDER)
        else
          j--
      }
    }
  }
}
```
