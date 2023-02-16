import { expect } from 'chai'
import { OpenAPI3, Discriminator3 } from '../../src/components'
import { load } from '../../src/Loader/Loader'

describe('Discriminator', () => {
  describe('Discriminator3', () => {
    describe('legality', () => {
      it('will not check for legality if there is no OpenApi object', () => {
        const es = Discriminator3.validate({ propertyName: 'foo' })
        expect(es.hasError).to.equal(false)
      })

      it('can be used with allOf', () => {
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
        })
        def.components.schemas.Dog.allOf[0] = def.components.schemas.Pet
        const es = OpenAPI3.validate(def)
        expect(es.hasError).to.equal(false)
      })

      it('can be used with anyOf', () => {
        const def = OpenAPI3.createDefinition<any>({
          components: {
            schemas: {
              Pet: {
                anyOf: [
                  {
                    type: 'object',
                    required: ['petType'],
                    properties: {
                      petType: 'string',
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
        def.components.schemas.Dog.allOf[0] = def.components.schemas.Pet
        const es = OpenAPI3.validate(def)
        expect(es.hasError).to.equal(false)
      })

      it('can be used with oneOf', () => {
        const def = OpenAPI3.createDefinition<any>({
          components: {
            schemas: {
              Pet: {
                oneOf: [
                  {
                    type: 'object',
                    required: ['petType'],
                    properties: {
                      petType: 'string',
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
        def.components.schemas.Dog.allOf[0] = def.components.schemas.Pet
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
        })
        def.components.schemas.Dog.allOf[0] = def.components.schemas.Pet
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
                      petType: 'string',
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
                      petType: 'string',
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
      it('can use implicit mapping', () => {
        throw Error('not implemented')
      })

      it('can use explicit mapping', () => {
        throw Error('not implemented')
      })

      it('will produce an error if mapping cannot be found', () => {
        throw Error('not implemented')
      })

      it('must match an item reference when used with anyOf', () => {
        throw Error('not implemented')
      })

      it('must match an item reference when used with oneOf', () => {
        throw Error('not implemented')
      })
    })
  })
})
