import castArray from 'lodash/castArray'
import difference from 'lodash/difference'
import isString from 'lodash/isString'
import mapValues from 'lodash/mapValues'
import trim from 'lodash/trim'
import union from 'lodash/union'

export const toggleItem = (items, item, active) =>
  active ? union(items, castArray(item)) : difference(items, castArray(item))

export const trimify = x => mapValues(x, o => (isString(o) ? trim(o) : o))

// Calculate The Percentage Of Value To A Value
// "num1" is what percent of "num2"
export const percentageOfNumberToNumber = (num1, num2) => (num1 / num2) * 100

// Calculate The Value Of A Percentage Of A Value
// What is "pct"% of "num"
export const percentageOfNumber = (num, pct) => (pct / 100) * num
