import lodash from 'lodash'

const reduceSum = (grouping, valueKey) => {
  return lodash.mapValues(grouping, (recordsInGroup) => {
    return recordsInGroup.reduce((accumulator, next) => {
      const nextValue = Number(next[valueKey])
      if(isNaN(nextValue)) {
        console.warn('Tried to reduce with a non numeric value: ' + next[valueKey])
        console.warn('Using zero as the value instead')
        return accumulator += 0
      }
      return accumulator += Number(next[valueKey])
    }, 0)
  })
}

const reduceCount = (grouping) => {
  return lodash.mapValues(grouping, (recordsInGroup) => recordsInGroup.length)
}

const reduceCountIncludeExtraData = (grouping, generateExtraData) => {
  return lodash.mapValues(grouping, (recordsInGroup) => {
    const extraData = generateExtraData(recordsInGroup)
    const countWithExtra = Object.assign({ count: recordsInGroup.length }, extraData)
    return countWithExtra
  })
}
export { reduceSum, reduceCount, reduceCountIncludeExtraData }
