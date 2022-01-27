// import { list } from '../../src/DefinitionException/error-codes'
// import { expect } from 'chai'
//
// describe('DefinitionException error-codes', () => {
//   it('has a unique id for each error', () => {
//     const duplicates = findDuplicates('id')
//     if (duplicates.length > 0) console.log('Duplicates ids: ' + duplicates.join(', '))
//     expect(duplicates.length).to.equal(0)
//   })
//
//   it('has a unique code for each error', () => {
//     const duplicates = findDuplicates('code')
//     if (duplicates.length > 0) console.log('Duplicates codes: ' + duplicates.join(', '))
//     expect(duplicates.length).to.equal(0)
//   })
//
//   it('does not have alternates when level is error', () => {
//     const ids: string[] = []
//     const exceptions: string[] = ['PROPERTY_NOT_ALLOWED']
//     list.forEach(error => {
//       if (error.level === 'error' && error.alternateLevels.filter(l => l !== 'error').length > 0 && !exceptions.includes(error.id)) {
//         ids.push(error.id)
//       }
//     })
//     if (ids.length > 0) console.log('Alternate levels not allowed for IDs: ' + ids.join(', '))
//     expect(ids.length).to.equal(0)
//   })
// })
//
// function findDuplicates (key: 'id' | 'code'): string[] {
//   const map: Record<string, boolean> = {}
//   const duplicates: Set<string> = new Set()
//   list.forEach(error => {
//     const k = error[key]
//     if (!map[k]) {
//       map[k] = true
//     } else {
//       duplicates.add(key)
//     }
//   })
//   return Array.from(duplicates)
// }
