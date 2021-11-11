// import { expect } from 'chai'
// import { Schema2 as Definition2, Schema3 as Definition3 } from '../../src/components/helpers/DefinitionTypes'
// import { determineType } from '../../src/utils/schema-merge'
//
// describe.only('schema-merge', () => {
//   describe('determine-types', () => {
//     describe('single definition', () => {
//       describe('array', () => {
//         it('will be array if "items" used', function () {
//           const def = {
//             items: {}
//           }
//           expect(determineType(def)).to.equal('array')
//         })
//
//         it('will be array if "maxItems" used', function () {
//           const def = {
//             maxItems: 5
//           }
//           expect(determineType(def)).to.equal('array')
//         })
//
//         it('will be array if "minItems" used', function () {
//           const def = {
//             minItems: 5
//           }
//           expect(determineType(def)).to.equal('array')
//         })
//
//         it('will be array if "uniqueItems" used', function () {
//           const def = {
//             uniqueItems: true
//           }
//           expect(determineType(def)).to.equal('array')
//         })
//
//         it('will be array if default is an array', function () {
//           const def = {
//             default: ['string']
//           }
//           expect(determineType(def)).to.equal('array')
//         })
//
//         it('will be array if example is an array', function () {
//           const def = {
//             example: ['string']
//           }
//           expect(determineType(def)).to.equal('array')
//         })
//
//         it('will be array if enum item is an array', function () {
//           const def = {
//             enum: [['string']]
//           }
//           expect(determineType(def)).to.equal('array')
//         })
//       })
//
//       describe('boolean', () => {
//         it('will be boolean if default is a boolean', function () {
//           const def = {
//             default: false
//           }
//           expect(determineType(def)).to.equal('boolean')
//         })
//
//         it('will be boolean if example is a boolean', function () {
//           const def = {
//             example: true
//           }
//           expect(determineType(def)).to.equal('boolean')
//         })
//
//         it('will be boolean if enum item is a boolean', function () {
//           const def = {
//             enum: [true]
//           }
//           expect(determineType(def)).to.equal('boolean')
//         })
//       })
//
//       describe('number and integer', () => {
//         it('will be number if "maximum" used', function () {
//           const def = {
//             maximum: 5
//           }
//           expect(determineType(def)).to.equal('number')
//         })
//
//         it('will be number if "minimum" used', function () {
//           const def = {
//             minimum: 5
//           }
//           expect(determineType(def)).to.equal('number')
//         })
//
//         it('will be number if "exclusiveMaximum" used', function () {
//           const def = {
//             exclusiveMaximum: true
//           }
//           expect(determineType(def)).to.equal('number')
//         })
//
//         it('will be number if "exclusiveMinimum" used', function () {
//           const def = {
//             exclusiveMinimum: true
//           }
//           expect(determineType(def)).to.equal('number')
//         })
//
//         it('will be number if "multipleOf" used', function () {
//           const def = {
//             multipleOf: 5.1
//           }
//           expect(determineType(def)).to.equal('number')
//         })
//
//         it('will be number if default is a number', function () {
//           const def = {
//             default: ''
//           }
//           expect(determineType(def)).to.equal('string')
//         })
//
//         it('will be number if example is a number', function () {
//           const def = {
//             example: ''
//           }
//           expect(determineType(def)).to.equal('string')
//         })
//
//         it('will be number if enum item is a number', function () {
//           const def = {
//             enum: ['']
//           }
//           expect(determineType(def)).to.equal('string')
//         })
//       })
//
//       describe('object', () => {
//         it('will be object if "additionalProperties" used', function () {
//           const def = {
//             additionalProperties: false
//           }
//           expect(determineType(def)).to.equal('object')
//         })
//
//         it('will be object if "properties" used', function () {
//           const def = {
//             properties: {}
//           }
//           expect(determineType(def)).to.equal('object')
//         })
//
//         it('will be object if "maxProperties" used', function () {
//           const def = {
//             maxProperties: 5
//           }
//           expect(determineType(def)).to.equal('object')
//         })
//
//         it('will be object if "minProperties" used', function () {
//           const def = {
//             minProperties: 5
//           }
//           expect(determineType(def)).to.equal('object')
//         })
//
//         it('will be object if "discriminator" used', function () {
//           const def = {
//             discriminator: 'foo'
//           }
//           expect(determineType(def)).to.equal('object')
//         })
//
//         it('will be object if default is an object', function () {
//           const def = {
//             default: {}
//           }
//           expect(determineType(def)).to.equal('object')
//         })
//
//         it('will be object if example is an object', function () {
//           const def = {
//             example: {}
//           }
//           expect(determineType(def)).to.equal('object')
//         })
//
//         it('will be object if enum item is an object', function () {
//           const def = {
//             enum: [{}]
//           }
//           expect(determineType(def)).to.equal('object')
//         })
//       })
//
//       describe('string', () => {
//         it('will be string if "maxLength" used', function () {
//           const def = {
//             maxLength: 5
//           }
//           expect(determineType(def)).to.equal('string')
//         })
//
//         it('will be string if "minLength" used', function () {
//           const def = {
//             minLength: 5
//           }
//           expect(determineType(def)).to.equal('string')
//         })
//
//         it('will be string if "pattern" used', function () {
//           const def = {
//             pattern: 'abc'
//           }
//           expect(determineType(def)).to.equal('string')
//         })
//
//         it('will be string if default is a string', function () {
//           const def = {
//             default: ''
//           }
//           expect(determineType(def)).to.equal('string')
//         })
//
//         it('will be string if example is a string', function () {
//           const def = {
//             example: ''
//           }
//           expect(determineType(def)).to.equal('string')
//         })
//
//         it('will be string if enum item is a string', function () {
//           const def = {
//             enum: ['']
//           }
//           expect(determineType(def)).to.equal('string')
//         })
//       })
//     })
//
//     describe('allOf definitions', () => {
//       it('can determine string from multiple string-like definitions', () => {
//         const def = {
//           allOf: [
//             { maxLength: 20 },
//             { minLength: 10 }
//           ]
//         }
//         expect(determineType(def)).to.equal('string')
//       })
//
//       it('will throw an error if determined types are in conflict', () => {
//         const def = {
//           allOf: [
//             { maxLength: 20 },
//             { minimum: 10 }
//           ]
//         }
//         expect(() => determineType(def)).to.throw(/types conflict/)
//       })
//     })
//
//     describe('oneOf definitions', () => {
//       it('will select the first definition if there is no context', () => {
//         const def = {
//           oneOf: [
//             { maxLength: 20 },
//             { type: 'object' }
//           ]
//         }
//         expect(determineType(def)).to.equal('string')
//       })
//
//       it('will select the correct definition if there is context', () => {
//         const def: Definition3 = {
//           allOf: [
//             {
//               oneOf: [
//                 { minimum: 10 }, // number
//                 { maxLength: 20 } // string <-- selected type
//               ]
//             },
//             { type: 'string' }
//           ]
//         }
//         expect(determineType(def)).to.equal('string')
//       })
//     })
//
//     describe('not definitions', () => {
//       it('can determine type with enough data', () => {
//         const def = {
//           not: [
//             { items: {} }, // array
//             { maximum: 5 }, // number
//             { type: 'object' }, // object
//             { maxLength: 20 } // string
//           ]
//         }
//         expect(determineType(def)).to.equal('boolean')
//       })
//
//       it('will produce an error if it conflicts with other types', () => {
//         const def: Definition3 = {
//           allOf: [
//             { type: 'string' }
//           ]
//         }
//         expect(determineType(def)).to.equal('string')
//       })
//     })
//   })
// })
