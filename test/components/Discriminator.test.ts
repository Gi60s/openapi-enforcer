import { expect } from 'chai'
import { OpenAPI3, Discriminator3 } from '../../src/components'
import { loadAndThrow } from '../../src/Loader'

describe('Discriminator', () => {
  describe('Discriminator3', () => {
    describe('legality', () => {
      it('will not check for legality if there is no OpenApi object', () => {
        const es = Discriminator3.validate({ propertyName: 'foo' })
        expect(es.hasError).to.equal(false)
      })

      it('can be used with allOf', () => {
        const def = loadAndThrow(OpenAPI3.createDefinition<any>({
          components: {
            schemas: {
              Pet: {
                type: 'object',
                required: ['petType'],
                properties: {
                  petType: { type: 'string' }
                },
                discriminator: {
                  propertyName: 'petType'
                }
              },
              Dog: {
                allOf: [
                  { $ref: '#/components/schemas/Pet' },
                  {
                    type: 'object',
                    properties: {
                      name: { type: 'string' },
                      packSize: { type: 'integer' }
                    }
                  }
                ]
              }
            }
          }
        }))
        const es = OpenAPI3.validate(def)
        expect(es.hasError).to.equal(false)
      })

      it('can be used with anyOf', () => {
        const def = OpenAPI3.createDefinition({
          components: {
            schemas: {
              Pet: {
                anyOf: [
                  {
                    type: 'object',
                    required: ['petType'],
                    properties: {
                      petType: { type: 'string' },
                      name: { type: 'string' },
                      packSize: { type: 'integer' }
                    }
                  }
                ],
                discriminator: {
                  propertyName: 'petType'
                }
              }
            }
          }
        })
        def.components.schemas.Dog = {
          allOf: [def.components.schemas.Pet]
        }
        const es = OpenAPI3.validate(def)
        expect(es.hasError).to.equal(false)
      })

      it('can be used with oneOf', () => {
        const def = OpenAPI3.createDefinition({
          components: {
            schemas: {
              Pet: {
                oneOf: [
                  {
                    type: 'object',
                    required: ['petType'],
                    properties: {
                      petType: { type: 'string' },
                      name: { type: 'string' },
                      packSize: { type: 'integer' }
                    }
                  }
                ],
                discriminator: {
                  propertyName: 'petType'
                }
              }
            }
          }
        })
        def.components.schemas.Dog = {
          allOf: [def.components.schemas.Pet]
        }
        const es = OpenAPI3.validate(def)
        expect(es.hasError).to.equal(false)
      })

      it('cannot be used without allOf, anyOf, or oneOf', () => {
        const def = OpenAPI3.createDefinition<any>({
          components: {
            schemas: {
              Pet: {
                type: 'object',
                required: ['petType'],
                properties: {
                  petType: { type: 'string' }
                },
                discriminator: {
                  propertyName: 'petType'
                }
              }
            }
          }
        })
        const es = OpenAPI3.validate(def)
        expect(es.hasErrorByCode('DISCRIMINATOR_ILLEGAL')).to.equal(true)
      })

      it('requires allOf to specify that the propertyName is required on at least one allOf schema', () => {
        const def = OpenAPI3.createDefinition<any>({
          components: {
            schemas: {
              Pet: {
                type: 'object',
                properties: {
                  petType: { type: 'string' }
                },
                discriminator: {
                  propertyName: 'petType'
                }
              },
              Dog: {
                allOf: [
                  {
                    type: 'object',
                    properties: {
                      name: { type: 'string' },
                      packSize: { type: 'integer' }
                    }
                  }
                ]
              }
            }
          }
        })
        def.components.schemas.Dog.allOf.push(def.components.schemas.Pet)
        const es = OpenAPI3.validate(def)
        expect(es.hasErrorByCode('DISCRIMINATOR_REQUIRED_PROPERTY')).to.equal(true)
      })

      it('requires anyof to specify that the propertyName is required on all anyOf schemas', () => {
        const def = OpenAPI3.createDefinition<any>({
          components: {
            schemas: {
              Pet: {
                anyOf: [
                  {
                    type: 'object',
                    properties: {
                      petType: { type: 'string' },
                      name: { type: 'string' },
                      packSize: { type: 'integer' }
                    }
                  }
                ],
                discriminator: {
                  propertyName: 'petType'
                }
              }
            }
          }
        })
        const es = OpenAPI3.validate(def)
        expect(es.hasErrorByCode('DISCRIMINATOR_REQUIRED_PROPERTY')).to.equal(true)
      })

      it('requires oneOf to specify that the propertyName is required on all oneOf schemas', () => {
        const def = OpenAPI3.createDefinition<any>({
          components: {
            schemas: {
              Pet: {
                oneOf: [
                  {
                    type: 'object',
                    properties: {
                      petType: { type: 'string' },
                      name: { type: 'string' },
                      packSize: { type: 'integer' }
                    }
                  }
                ],
                discriminator: {
                  propertyName: 'petType'
                }
              }
            }
          }
        })
        const es = OpenAPI3.validate(def)
        expect(es.hasErrorByCode('DISCRIMINATOR_REQUIRED_PROPERTY')).to.equal(true)
      })
    })

    describe('mapping', () => {
      it.skip('can use implicit mapping', () => {
        // TODO: move this test to schema testing on discriminate() function
        throw Error('not implemented')
      })

      it.skip('can use explicit mapping', () => {
        // TODO: move this test to schema testing on discriminate() function
        throw Error('not implemented')
      })

      it.skip('will produce an error if mapping cannot be found', () => {
        // TODO: move this test to schema testing on discriminate() function
        throw Error('not implemented')
      })

      it('can match an item reference when used with anyOf', async () => {
        const def = OpenAPI3.createDefinition<any>({
          components: {
            schemas: {
              Pet: {
                anyOf: [
                  { $ref: '#/components/schemas/Dog' }
                ],
                discriminator: {
                  propertyName: 'petType',
                  mapping: {
                    puppy: '#/components/schemas/Dog'
                  }
                }
              },
              Dog: {
                type: 'object',
                required: ['petType'],
                properties: {
                  petType: { type: 'string' },
                  name: { type: 'string' },
                  packSize: { type: 'integer' }
                }
              }
            }
          }
        })
        const es = await OpenAPI3.validateAsync(def)
        expect(es.hasErrorByCode('DISCRIMINATOR_MAPPING_INVALID')).to.equal(false)
      })

      it('must match an item reference when used with anyOf', async () => {
        const def = OpenAPI3.createDefinition<any>({
          components: {
            schemas: {
              Pet: {
                anyOf: [
                  { $ref: '#/components/schemas/Dog' }
                ],
                discriminator: {
                  propertyName: 'petType',
                  mapping: {
                    kitten: '#/components/schemas/Cat'
                  }
                }
              },
              Dog: {
                type: 'object',
                required: ['petType'],
                properties: {
                  petType: { type: 'string' },
                  name: { type: 'string' },
                  packSize: { type: 'integer' }
                }
              }
            }
          }
        })
        const es = await OpenAPI3.validateAsync(def)
        expect(es.hasErrorByCode('DISCRIMINATOR_MAPPING_INVALID')).to.equal(true)
      })

      it('must match an item reference when used with oneOf', () => {
        throw Error('not implemented')
      })
    })
  })
})
