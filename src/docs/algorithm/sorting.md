---
title: 排序算法
---

# 排序算法

排序算法（sorting algorithm）用于对一组数据按照特定顺序进行排列。排序算法有着广泛的应用，因为有序数据通常能够被更高效地查找、分析和处理。

## 选择排序

选择排序（selection sort）的工作原理非常简单：开启一个循环，每轮从未排序区间选择最小的元素，将其放到已排序区间的末尾。

算法流程：

1. 初始状态下，所有元素未排序，即未排序（索引）区间为 [0, n-1]。
2. 选取区间 [0, n-1] 中的最小元素，将其与索引 0 处的元素交换。完成后，数组前 1 个元素已排序。
3. 选取区间 [1, n-1] 中的最小元素，将其与索引 1  处的元素交换。完成后，数组前 2 个元素已排序。
4. 以此类推。经过 n-1 轮选择与交换后，数组前 n-1 个元素已排序。
5. 仅剩的一个元素必定是最大元素，无须排序，因此数组排序完成。

```js
/**
 * 选择排序
 * @param {number[]} nums
 */
function selectionSort(nums) {
  const n = nums.length
  // 外循环：未排序区间为 [i, n-1]
  for (let i = 0; i < n - 1; i++) {
    // 内循环：找到未排序区间内的最小元素
    let k = i
    for (let j = i + 1; j < n; j++) {
      if (nums[j] < nums[k])
        k = j // 记录最小元素的索引
    }
    // 将该最小元素与未排序区间的首个元素交换
    [nums[i], nums[k]] = [nums[k], nums[i]]
  }
}
```

## 冒泡排序

冒泡排序（bubble sort）通过连续地比较与交换相邻元素实现排序。这个过程就像气泡从底部升到顶部一样，因此得名冒泡排序。

冒泡过程可以利用元素交换操作来模拟：从数组最左端开始向右遍历，依次比较相邻元素大小，如果“左元素 > 右元素”就交换二者。遍历完成后，最大的元素会被移动到数组的最右端。

算法流程：

1. 首先，对 n 个元素执行“冒泡”，将数组的最大元素交换至正确位置
2. 接下来，对剩余 n-1 个元素执行“冒泡”，将第二大元素交换至正确位置
3. 以此类推，经过 n-1 轮“冒泡”后，前 n-1 大的元素都被交换至正确位置
4. 仅剩的一个元素必定是最小元素，无须排序，因此数组排序完成

```js
/**
 * 冒泡排序
 * @param {number[]} nums
 */
function bubbleSort(nums) {
  const n = nums.length
  // 外循环：未排序区间为 [0, n-1]
  for (let i = 0; i < n - 1; i++) {
    // 内循环：从左向右依次比较相邻元素
    for (let j = 0; j < n - 1 - i; j++) {
      // 如果“左元素 > 右元素”，则交换二者
      if (nums[j] > nums[j + 1])
        [nums[j], nums[j + 1]] = [nums[j + 1], nums[j]]
    }
  }
}
```

## 插入排序

插入排序（insertion sort）是一种简单的排序算法，它的工作原理与手动整理一副牌的过程非常相似。

具体来说，我们在未排序区间选择一个基准元素，将该元素与其左侧已排序区间的元素逐一比较大小，并将该元素插入到正确的位置。

算法流程：

1. 初始状态下，数组的第 1 个元素已完成排序
2. 选取数组的第 2 个元素作为 base ，将其插入到正确位置后，数组的前 2 个元素已排序
3. 选取第 3 个元素作为 base ，将其插入到正确位置后，数组的前 3 个元素已排序
4. 以此类推，在最后一轮中，选取最后一个元素作为 base ，将其插入到正确位置后，所有元素均已排序

```js
/* 插入排序 */
function insertionSort(nums) {
  // 外循环：已排序元素数量为 1, 2, ..., n
  for (let i = 1; i < nums.length; i++) {
    const base = nums[i]
    let j = i - 1
    // 内循环：将 base 插入到已排序部分的正确位置
    while (j >= 0 && nums[j] > base) {
      nums[j + 1] = nums[j] // 将 nums[j] 向右移动一位
      j--
    }
    nums[j + 1] = base // 将 base 赋值到正确位置
  }
}
```

## 快速排序

快速排序（quick sort）是一种基于分治策略的排序算法，运行高效，应用广泛。

快速排序的核心操作是“哨兵划分”，其目标是：选择数组中的某个元素作为“基准数”，将所有小于基准数的元素移到其左侧，而大于基准数的元素移到其右侧。具体来说，哨兵划分的流程如图 11-8 所示。

算法流程：

1. 首先，对原数组执行一次“哨兵划分”，得到未排序的左子数组和右子数组
2. 然后，对左子数组和右子数组分别递归执行“哨兵划分”
3. 持续递归，直至子数组长度为 1 时终止，从而完成整个数组的排序

```js
function quickSort(nums, left, right) {
  // 子数组长度为 1 时终止递归
  if (left >= right)
    return
  // 哨兵划分
  const pivot = partition(nums, left, right)
  // 递归左子数组、右子数组
  this.quickSort(nums, left, pivot - 1)
  this.quickSort(nums, pivot + 1, right)
}

function partition(arr, left, right) { // 分区操作
  const pivot = left // 设定基准值（pivot）
  let index = pivot + 1
  for (let i = index; i <= right; i++) {
    if (arr[i] < arr[pivot]) {
      swap(arr, i, index)
      index++
    }
  }
  swap(arr, pivot, index - 1)
  return index - 1
}

function swap(arr, i, j) {
  const temp = arr[i]
  arr[i] = arr[j]
  arr[j] = temp
}
```
