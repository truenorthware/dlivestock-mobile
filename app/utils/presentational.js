import merge from 'lodash/merge'
import transform from 'lodash/transform'

export const listWithSeparators = (list, renderSeparator, dirtyOptions) => {
  const DEFAULT_OPTIONS = {
    separatorBefore: false,
    separatorAfter: false,
  }

  const options = merge({}, DEFAULT_OPTIONS, dirtyOptions)
  const makeSeparator = ({ item, index }, before) =>
    renderSeparator({
      item,
      index,
      id: [before ? 'before' : 'after', index].join('-'),
    })

  return transform(
    list,
    (acc, item, index) => {
      if (options.separatorBefore) {
        acc.push(makeSeparator({ index, item }, true))
      }

      acc.push(item)

      if (index < list.length - 1 || options.separatorAfter) {
        acc.push(makeSeparator({ index, item }))
      }
    },
    [],
  )
}

export const hitSlopArea = offset => ({
  top: offset,
  right: offset,
  bottom: offset,
  left: offset,
})
