import { expect } from 'chai'
import { Operation as Operation2, Parameter as Parameter2, PathItem as PathItem2 } from '../../src/v2'
import { Operation as Operation3, Parameter as Parameter3, PathItem as PathItem3 } from '../../src/v3'

describe.only('Component: Operation', () => {
  describe('build', () => {
    it('can build', () => {
      const op2 = new Operation2({ responses: { 200: { description: '' } } })
      expect(op2).to.be.instanceof(Operation2)

      const op3 = new Operation3({ responses: { 200: { description: '' } } })
      expect(op3).to.be.instanceof(Operation3)
    })

    describe('enforcer data', () => {
      describe('v2', () => {
        it('will map parameters by type in the enforcer object', () => {
          const op = new Operation2({
            parameters: [
              { name: 'b', in: 'body', schema: { type: 'string' } },
              { name: 'f1', in: 'formData', type: 'string' },
              { name: 'f2', in: 'formData', type: 'string' },
              { name: 'h1', in: 'header', type: 'string' },
              { name: 'h2', in: 'header', type: 'string' },
              { name: 'h3', in: 'header', type: 'string' },
              { name: 'p', in: 'path', type: 'string' },
              { name: 'q', in: 'query', type: 'string' }
            ],
            responses: { 200: { description: '' } }
          })
          expect(op.enforcer.parameters).to.be.an('object')
          expect(op.enforcer.parameters.body).to.be.instanceof(Parameter2)
          expect(op.enforcer.parameters.formData?.f1).to.be.instanceof(Parameter2)
          expect(op.enforcer.parameters.formData?.f2).to.be.instanceof(Parameter2)
          expect(op.enforcer.parameters.header?.h1).to.be.instanceof(Parameter2)
          expect(op.enforcer.parameters.header?.h2).to.be.instanceof(Parameter2)
          expect(op.enforcer.parameters.header?.h3).to.be.instanceof(Parameter2)
          expect(op.enforcer.parameters.path?.p).to.be.instanceof(Parameter2)
          expect(op.enforcer.parameters.query?.q).to.be.instanceof(Parameter2)
          expect(op.enforcer.parameters.query?.x).to.equal(undefined)
        })

        it('will leave type undefined if no parameters for that type', () => {
          const op = new Operation2({
            parameters: [
              { name: 'q', in: 'query', type: 'string' }
            ],
            responses: { 200: { description: '' } }
          })
          expect(op.enforcer.parameters).to.be.an('object')
          expect(op.enforcer.parameters.body).to.equal(undefined)
          expect(op.enforcer.parameters.formData).to.equal(undefined)
          expect(op.enforcer.parameters.header).to.equal(undefined)
          expect(op.enforcer.parameters.path).to.equal(undefined)
          expect(op.enforcer.parameters.query).not.to.equal(undefined)
        })

        it('will add required parameter names to any required parameters', () => {
          const op = new Operation2({
            parameters: [
              { name: 'b', in: 'body', schema: { type: 'string' } },
              { name: 'f1', in: 'formData', type: 'string' },
              { name: 'f2', in: 'formData', required: true, type: 'string' },
              { name: 'h1', in: 'header', required: true, type: 'string' },
              { name: 'h2', in: 'header', required: true, type: 'string' },
              { name: 'h3', in: 'header', type: 'string' },
              { name: 'p', in: 'path', required: true, type: 'string' },
              { name: 'q', in: 'query', type: 'string' }
            ],
            responses: { 200: { description: '' } }
          })
          expect(op.enforcer.requiredParameters).to.be.an('object')
          expect(op.enforcer.requiredParameters.body).to.equal(false)
          expect(op.enforcer.requiredParameters.formData).to.deep.equal(['f2'])
          expect(op.enforcer.requiredParameters.header).to.deep.equal(['h1', 'h2'])
          expect(op.enforcer.requiredParameters.path).to.deep.equal(['p'])
          expect(op.enforcer.requiredParameters.query).to.deep.equal([])
        })

        it('will set required parameter for body to true', () => {
          let op = new Operation2({
            parameters: [{ name: 'b', in: 'body', schema: { type: 'string' } }],
            responses: { 200: { description: '' } }
          })
          expect(op.enforcer.requiredParameters.body).to.equal(false)

          op = new Operation2({
            parameters: [{ name: 'b', in: 'body', required: true, schema: { type: 'string' } }],
            responses: { 200: { description: '' } }
          })
          expect(op.enforcer.requiredParameters.body).to.equal(true)
        })

        it('will include path item parameters in operation enforcer data', () => {
          const pi = new PathItem2({
            parameters: [
              { name: 'b', in: 'body', schema: { type: 'string' } },
              { name: 'f1', in: 'formData', type: 'string' },
              { name: 'f2', in: 'formData', required: true, type: 'string' },
              { name: 'h1', in: 'header', required: true, type: 'string' },
              { name: 'h2', in: 'header', required: true, type: 'string' },
              { name: 'h3', in: 'header', type: 'string' },
              { name: 'p', in: 'path', required: true, type: 'string' },
              { name: 'q', in: 'query', type: 'string' }
            ],
            get: {
              parameters: [
                { name: 'p2', in: 'path', required: true, type: 'string' }
              ],
              responses: {
                200: { description: 'ok' }
              }
            }
          })
          const op = pi.get
          expect(op?.enforcer.parameters.body).to.be.instanceof(Parameter2)
          expect(op?.enforcer.parameters.formData?.f1).to.be.instanceof(Parameter2)
          expect(op?.enforcer.parameters.formData?.f2).to.be.instanceof(Parameter2)
          expect(op?.enforcer.parameters.header?.h1).to.be.instanceof(Parameter2)
          expect(op?.enforcer.parameters.header?.h2).to.be.instanceof(Parameter2)
          expect(op?.enforcer.parameters.header?.h3).to.be.instanceof(Parameter2)
          expect(op?.enforcer.parameters.path?.p).to.be.instanceof(Parameter2)
          expect(op?.enforcer.parameters.path?.p2).to.be.instanceof(Parameter2)
          expect(op?.enforcer.parameters.query?.q).to.be.instanceof(Parameter2)
          expect(op?.enforcer.parameters.query?.x).to.equal(undefined)
          expect(op?.enforcer.requiredParameters.body).to.equal(false)
          expect(op?.enforcer.requiredParameters.formData).to.deep.equal(['f2'])
          expect(op?.enforcer.requiredParameters.header).to.deep.equal(['h1', 'h2'])
          expect(op?.enforcer.requiredParameters.path).to.deep.equal(['p2', 'p'])
          expect(op?.enforcer.requiredParameters.query).to.deep.equal([])
        })
      })
    })

    describe('request', () => {
      describe('v2', () => {
        describe('body', () => {
          it('can parse a body with a schema', () => {
            const op = new Operation2({
              parameters: [
                { name: 'p', in: 'body', schema: { type: 'number' } }
              ],
              responses: {
                200: { description: 'ok' }
              }
            })
            const [req] = op.makeRequest({ body: '1' })
            expect(req.body).to.equal(1)
          })
        })

        describe('formData', () => {
          it('will parse the last entry for a non-array', () => {
            const op = new Operation2({
              parameters: [
                { name: 'p', in: 'formData', type: 'number' }
              ],
              responses: {
                200: { description: 'ok' }
              }
            })
            const [req] = op.makeRequest({ body: { p: ['1', '2', '3'] } })
            expect(req.body.p).to.equal(3)
          })

          it('will use csv parsing to extract an array', () => {
            const op = new Operation2({
              parameters: [
                { name: 'p', in: 'formData', type: 'array', items: { type: 'number' } }
              ],
              responses: {
                200: { description: 'ok' }
              }
            })
            const [req] = op.makeRequest({ body: { p: ['1,2,3'] } })
            expect(req.body.p).to.deep.equal([1, 2, 3])
          })

          it('will use multi parsing to extract an array', () => {
            const op = new Operation2({
              parameters: [
                { name: 'p', in: 'formData', type: 'array', collectionFormat: 'multi', items: { type: 'number' } }
              ],
              responses: {
                200: { description: 'ok' }
              }
            })
            const [req] = op.makeRequest({ body: { p: ['1', '2', '3'] } })
            expect(req.body.p).to.deep.equal([1, 2, 3])
          })
        })

        describe('path', () => {
          it('can parse a path singular value', () => {
            const op = new Operation2({
              parameters: [
                { name: 'p', in: 'path', required: true, type: 'string', format: 'date' }
              ],
              responses: {
                200: { description: 'ok' }
              }
            })
            const [req] = op.makeRequest({ params: { p: '2000-01-01' } })
            expect(req.path.p).to.be.instanceof(Date)
          })

          it('can parse a path singular value as an array', () => {
            const op = new Operation2({
              parameters: [
                { name: 'p', in: 'path', required: true, type: 'array', items: { type: 'number' } }
              ],
              responses: {
                200: { description: 'ok' }
              }
            })
            const [req] = op.makeRequest({ params: { p: '1,2,3' } })
            expect(req.path.p).to.deep.equal([1, 2, 3])
          })

          it('will not accept an array of values as input', () => {
            const op = new Operation2({
              parameters: [
                { name: 'p', in: 'path', required: true, type: 'array', items: { type: 'number' } }
              ],
              responses: {
                200: { description: 'ok' }
              }
            })
            const [, error] = op.makeRequest({
              params: {
                // @ts-expect-error
                p: ['1', '2', '3']
              }
            })
            expect(error).to.match(/not of the expected type/)
          })

          it('will produce an error is missing a required path variable', () => {
            const op = new Operation2({
              parameters: [
                { name: 'p', in: 'path', required: true, type: 'number' }
              ],
              responses: {
                200: { description: 'ok' }
              }
            })
            const [, error] = op.makeRequest({})
            expect(error).to.match(/Missing required path parameter: "p"/)
          })
        })

        describe('header', () => {
          describe('schema type singular', () => {
            it('can parse a header with a singular string value', () => {
              const op = new Operation2({
                parameters: [
                  { name: 'p', in: 'header', type: 'string', format: 'date' }
                ],
                responses: { 200: { description: 'ok' } }
              })
              const [req] = op.makeRequest({ header: { p: '2000-01-01' } })
              expect(req.header.p).to.be.instanceof(Date)
            })

            it('can parse a header with an array of string values', () => {
              const op = new Operation2({
                parameters: [
                  { name: 'p', in: 'header', type: 'string', format: 'date' }
                ],
                responses: { 200: { description: 'ok' } }
              })
              const [req] = op.makeRequest({ header: { p: ['2000-01-01'] } })
              expect(req.header.p).to.be.instanceof(Date)
            })

            it('can parse a header with an undefined value', () => {
              const op = new Operation2({
                parameters: [
                  { name: 'p', in: 'header', type: 'string', format: 'date', allowEmptyValue: true }
                ],
                responses: { 200: { description: 'ok' } }
              })
              const [req] = op.makeRequest({ header: { p: undefined } })
              expect('p' in req.header).to.equal(true)
              expect(req.header.p).to.be.equal('')
            })

            it('cannot parse a number', () => {
              const op = new Operation2({
                parameters: [
                  { name: 'p', in: 'header', type: 'number' }
                ],
                responses: { 200: { description: 'ok' } }
              })
              const [, error] = op.makeRequest({
                header: {
                  // @ts-expect-error
                  p: 1
                }
              })
              expect(error).to.match(/Value not valid for any criteria/)
              expect(error?.hasCode('OAE-EDTNOOO')).to.equal(true)
            })

            it('cannot parse an array of numbers', () => {
              const op = new Operation2({
                parameters: [
                  { name: 'p', in: 'header', type: 'array', items: { type: 'number' } }
                ],
                responses: { 200: { description: 'ok' } }
              })
              const [, error] = op.makeRequest({
                header: {
                  // @ts-expect-error
                  p: [1, 2, 3]
                }
              })
              expect(error).to.match(/Value not valid for any criteria/)
              expect(error?.hasCode('OAE-EDTNOOO')).to.equal(true)
            })

            it('will produce an error is missing a required header', () => {
              const op = new Operation2({
                parameters: [
                  { name: 'p', in: 'header', required: true, type: 'number' }
                ],
                responses: {
                  200: { description: 'ok' }
                }
              })
              const [, error] = op.makeRequest({})
              expect(error).to.match(/Missing required header parameter: "p"/)
            })
          })

          describe('schema type array', () => {
            it('can parse a header with a singular value', () => {
              const op = new Operation2({
                parameters: [
                  { name: 'p', in: 'header', type: 'array', items: { type: 'number' } }
                ],
                responses: { 200: { description: 'ok' } }
              })
              const [req] = op.makeRequest({ header: { p: '1' } })
              expect(req.header.p).to.deep.equal([1])
            })

            it('can parse a header with an array of values', () => {
              const op = new Operation2({
                parameters: [
                  { name: 'p', in: 'header', type: 'array', items: { type: 'number' } }
                ],
                responses: { 200: { description: 'ok' } }
              })
              const [req] = op.makeRequest({ header: { p: ['1,2,3'] } })
              expect(req.header.p).to.deep.equal([1, 2, 3])
            })

            it('can parse a header with an array of values (multi format)', () => {
              const op = new Operation2({
                parameters: [
                  { name: 'p', in: 'header', collectionFormat: 'multi', type: 'array', items: { type: 'number' } }
                ],
                responses: { 200: { description: 'ok' } }
              })
              const [req] = op.makeRequest({ header: { p: ['1', '2', '3'] } })
              expect(req.header.p).to.deep.equal([1, 2, 3])
            })
          })
        })

        describe('query', () => {
          it('can parse a query string starting with a ? mark', () => {
            const op = new Operation2({
              parameters: [
                { name: 'p', in: 'query', type: 'number' }
              ],
              responses: { 200: { description: 'ok' } }
            })
            const [req] = op.makeRequest({ query: '?p=1' })
            expect(req.query.p).to.equal(1)
          })

          it('can parse a multi value input for a non-array type', () => {
            const op = new Operation2({
              parameters: [
                { name: 'p', in: 'query', type: 'number' }
              ],
              responses: { 200: { description: 'ok' } }
            })
            const [req] = op.makeRequest({ query: 'p=1&p=2' })
            expect(req.query.p).to.equal(2)
          })

          it('can parse a single comma separated value for an array type', () => {
            const op = new Operation2({
              parameters: [
                { name: 'p', in: 'query', type: 'array', items: { type: 'number' } }
              ],
              responses: { 200: { description: 'ok' } }
            })
            const [req] = op.makeRequest({ query: 'p=1,2' })
            expect(req.query.p).to.deep.equal([1, 2])
          })

          it('can parse a single pipe separated value for an array type', () => {
            const op = new Operation2({
              parameters: [
                { name: 'p', in: 'query', collectionFormat: 'pipes', type: 'array', items: { type: 'number' } }
              ],
              responses: { 200: { description: 'ok' } }
            })
            const [req] = op.makeRequest({ query: 'p=1|2' })
            expect(req.query.p).to.deep.equal([1, 2])
          })

          it('can parse a single space separated value for an array type', () => {
            const op = new Operation2({
              parameters: [
                { name: 'p', in: 'query', collectionFormat: 'ssv', type: 'array', items: { type: 'number' } }
              ],
              responses: { 200: { description: 'ok' } }
            })
            const [req] = op.makeRequest({ query: 'p=1 2' })
            expect(req.query.p).to.deep.equal([1, 2])
          })

          it('can parse a single tab separated value for an array type', () => {
            const op = new Operation2({
              parameters: [
                { name: 'p', in: 'query', collectionFormat: 'tsv', type: 'array', items: { type: 'number' } }
              ],
              responses: { 200: { description: 'ok' } }
            })
            const [req] = op.makeRequest({ query: 'p=1\t2' })
            expect(req.query.p).to.deep.equal([1, 2])
          })

          it('can parse a multi value input for an array type', () => {
            const op = new Operation2({
              parameters: [
                { name: 'p', in: 'query', collectionFormat: 'multi', type: 'array', items: { type: 'number' } }
              ],
              responses: { 200: { description: 'ok' } }
            })
            const [req] = op.makeRequest({ query: 'p=1&p=2' })
            expect(req.query.p).to.deep.equal([1, 2])
          })

          it('will produce an error is missing a required header', () => {
            const op = new Operation2({
              parameters: [
                { name: 'p', in: 'query', required: true, type: 'number' }
              ],
              responses: {
                200: { description: 'ok' }
              }
            })
            const [, error] = op.makeRequest({})
            expect(error).to.match(/Missing required query parameter: "p"/)
          })
        })
      })

      describe('v3', () => {
        describe('body', () => {
          it('can process a JSON body', () => {
            const op = new Operation3({
              requestBody: {
                content: {
                  'application/json': {
                    schema: {
                      type: 'array',
                      items: { type: 'number' }
                    }
                  }
                }
              },
              responses: {
                200: { description: 'ok' }
              }
            })
            const [req] = op.makeRequest({ body: [1, 2, 3], header: { 'content-type': 'application/json' } })
            expect(req.body).to.deep.equal([1, 2, 3])
          })
        })
      })
    })
  })

  describe('validate', () => {
    const Operations = [Operation2, Operation3]

    it('has required properties', () => {
      Operations.forEach(Operation => {
        // @ts-expect-error
        const [error] = Operation.validate({})
        expect(error).to.match(/Missing required property: "responses"/)
      })
    })

    it('allows extensions', () => {
      Operations.forEach(Operation => {
        const [, warn] = Operation.validate({ responses: { 200: { description: 'ok' } } })
        expect(warn).to.equal(undefined)
      })
    })

    it('cannot have invalid properties', () => {
      Operations.forEach(Operation => {
        const [error] = Operation.validate({
          // @ts-expect-error
          foo: 'invalid',
          responses: { 200: { description: 'ok' } }
        })
        expect(error).to.match(/Property "foo" not allowed. Property not part of the specification/)
      })
    })

    describe('property: tags', () => {
      it('can be an empty array', () => {
        Operations.forEach(Operation => {
          const [error] = Operation.validate({
            tags: [],
            responses: { 200: { description: 'ok' } }
          })
          expect(error).to.equal(undefined)
        })
      })

      it('can be an array of strings', () => {
        Operations.forEach(Operation => {
          const [error] = Operation.validate({
            tags: ['tag-1', 'tag-2'],
            responses: { 200: { description: 'ok' } }
          })
          expect(error).to.equal(undefined)
        })
      })

      it('must be an array of strings', () => {
        Operations.forEach(Operation => {
          const [error] = Operation.validate({
            // @ts-expect-error
            tags: [1],
            responses: { 200: { description: 'ok' } }
          })
          expect(error).to.match(/Expected a string/)
        })
      })
    })

    describe('property: summary', () => {
      it('can be a string', () => {
        Operations.forEach((Operation) => {
          const [error] = Operation.validate({
            summary: '',
            responses: { 200: { description: 'ok' } }
          })
          expect(error).to.equal(undefined)
        })
      })

      it('must be a string', () => {
        Operations.forEach((Operation) => {
          const [error] = Operation.validate({
            // @ts-expect-error
            summary: 5,
            responses: { 200: { description: 'ok' } }
          })
          expect(error).to.match(/Expected a string/)
        })
      })

      it('will warn if the summary is at least 120 characters', () => {
        Operations.forEach((Operation) => {
          const [, warning] = Operation.validate({
            summary: '123456789 123456789 123456789 123456789 123456789 123456789 123456789 123456789 123456789 123456789 123456789 123456789 ',
            responses: { 200: { description: 'ok' } }
          })
          expect(warning).to.match(/Summary should be less than 120 characters in length/)
        })
      })
    })

    describe('property: description', () => {
      it('can be a string', () => {
        Operations.forEach((Operation) => {
          const [error] = Operation.validate({
            description: 'description',
            responses: { 200: { description: 'ok' } }
          })
          expect(error).to.equal(undefined)
        })
      })

      it('must be a string', () => {
        Operations.forEach((Operation) => {
          const [error] = Operation.validate({
            // @ts-expect-error
            description: 5,
            responses: { 200: { description: 'ok' } }
          })
          expect(error).to.match(/Expected a string/)
        })
      })
    })

    describe('property: externalDocs', () => {
      it('can be an external document definition', () => {
        Operations.forEach((Operation) => {
          const [error] = Operation.validate({
            externalDocs: { url: 'https://fake.com' },
            responses: { 200: { description: 'ok' } }
          })
          expect(error).to.equal(undefined)
        })
      })

      it('must be an external document definition', () => {
        Operations.forEach((Operation) => {
          const [error] = Operation.validate({
            // @ts-expect-error
            externalDocs: 5,
            responses: { 200: { description: 'ok' } }
          })
          expect(error).to.match(/Expected an ExternalDocumentation object definition/)
        })
      })
    })

    describe('property: operationId', () => {
      it('can be a string', () => {
        Operations.forEach((Operation) => {
          const [error] = Operation.validate({
            operationId: 'op1',
            responses: { 200: { description: 'ok' } }
          })
          expect(error).to.equal(undefined)
        })
      })

      it('must be a string', () => {
        Operations.forEach((Operation) => {
          const [error] = Operation.validate({
            // @ts-expect-error
            operationId: 5,
            responses: { 200: { description: 'ok' } }
          })
          expect(error).to.match(/Expected a string/)
        })
      })

      it('must be unique', () => {
        [PathItem2, PathItem3].forEach(PathItem => {
          const [error] = PathItem.validate({
            get: {
              operationId: 'not-unique',
              responses: { 200: { description: 'ok' } }
            },
            post: {
              operationId: 'not-unique',
              responses: { 200: { description: 'ok' } }
            }
          })
          expect(error).to.match(/The operationId "not-unique" is not unique and must be unique/)
        })
      })
    })

    describe('property: parameters', () => {
      it('can be an empty array', () => {
        Operations.forEach(Operation => {
          const [error] = Operation.validate({
            parameters: [],
            responses: { 200: { description: 'ok' } }
          })
          expect(error).to.equal(undefined)
        })
      })

      it('can be an array of parameter definitions v2', () => {
        const [error] = Operation2.validate({
          parameters: [
            { name: 'foo', in: 'query', type: 'string' }
          ],
          responses: { 200: { description: 'ok' } }
        })
        expect(error).to.equal(undefined)
      })

      it('can be an array of parameter definitions v3', () => {
        const [error] = Operation3.validate({
          parameters: [
            { name: 'foo', in: 'query', schema: { type: 'string' } }
          ],
          responses: { 200: { description: 'ok' } }
        })
        expect(error).to.equal(undefined)
      })

      it('must be an array of parameter definitions v2', () => {
        const [error] = Operation2.validate({
          // @ts-expect-error
          parameters: [5],
          responses: { 200: { description: 'ok' } }
        })
        expect(error).to.match(/Expected a Parameter object definition/)
      })

      it('must be an array of parameter definitions v3', () => {
        const [error] = Operation3.validate({
          // @ts-expect-error
          parameters: [5],
          responses: { 200: { description: 'ok' } }
        })
        expect(error).to.match(/Expected a Parameter object definition/)
      })

      it('allows two parameters with the same name but different positions v2', () => {
        const [error] = Operation2.validate({
          parameters: [
            { name: 'foo', in: 'path', required: true, type: 'string' },
            { name: 'foo', in: 'query', type: 'string' }
          ],
          responses: { 200: { description: 'ok' } }
        })
        expect(error).to.equal(undefined)
      })

      it('allows two parameters with the same name but different positions v3', () => {
        const [error] = Operation3.validate({
          parameters: [
            { name: 'foo', in: 'path', required: true, schema: { type: 'string' } },
            { name: 'foo', in: 'query', schema: { type: 'string' } }
          ],
          responses: { 200: { description: 'ok' } }
        })
        expect(error).to.equal(undefined)
      })

      it('does not allow two parameters with the same name and position v2', () => {
        const [error] = Operation2.validate({
          parameters: [
            { name: 'foo', in: 'query', type: 'string' },
            { name: 'foo', in: 'query', type: 'string' }
          ],
          responses: { 200: { description: 'ok' } }
        })
        expect(error).to.match(/Parameter names must be unique per space/)
      })

      it('does not allow two parameters with the same name and position v3', () => {
        const [error] = Operation3.validate({
          parameters: [
            { name: 'foo', in: 'query', schema: { type: 'string' } },
            { name: 'foo', in: 'query', schema: { type: 'string' } }
          ],
          responses: { 200: { description: 'ok' } }
        })
        expect(error).to.match(/Parameter names must be unique per space/)
      })
    })

    describe('property: responses', () => {
      it('todo', () => {
        throw Error('todo')
      })
    })

    describe('property: deprecated', () => {
      it('todo', () => {
        throw Error('todo')
      })
    })

    describe('property: security', () => {
      it('todo', () => {
        throw Error('todo')
      })
    })

    describe('v2', () => {
      describe('property: consumes', () => {
        it('can be an empty array', () => {
          const [error] = Operation2.validate({
            consumes: [],
            responses: { 200: { description: 'ok' } }
          })
          expect(error).to.equal(undefined)
        })

        it('can be an array of strings', () => {
          const [error] = Operation2.validate({
            consumes: ['application/json'],
            responses: { 200: { description: 'ok' } }
          })
          expect(error).to.equal(undefined)
        })

        it('must be an array of strings', () => {
          const [error] = Operation2.validate({
            // @ts-expect-error
            consumes: [5],
            responses: { 200: { description: 'ok' } }
          })
          expect(error).to.match(/Expected a string/)
        })

        it('will warn if the string does not look like a mime type', () => {
          const [, warning] = Operation2.validate({
            consumes: ['foo'],
            responses: { 200: { description: 'ok' } }
          })
          expect(warning).to.match(/Media type appears invalid/)
        })
      })

      describe('property: produces', () => {
        it('can be an empty array', () => {
          const [error] = Operation2.validate({
            produces: [],
            responses: { 200: { description: 'ok' } }
          })
          expect(error).to.equal(undefined)
        })

        it('can be an array of strings', () => {
          const [error] = Operation2.validate({
            produces: ['application/json'],
            responses: { 200: { description: 'ok' } }
          })
          expect(error).to.equal(undefined)
        })

        it('must be an array of strings', () => {
          const [error] = Operation2.validate({
            // @ts-expect-error
            produces: [5],
            responses: { 200: { description: 'ok' } }
          })
          expect(error).to.match(/Expected a string/)
        })

        it('will warn if the string does not look like a mime type', () => {
          const [, warning] = Operation2.validate({
            produces: ['foo'],
            responses: { 200: { description: 'ok' } }
          })
          expect(warning).to.match(/Media type appears invalid/)
        })
      })

      describe('property: schemes', () => {
        it('todo', () => {
          throw Error('todo')
        })
      })
    })

    describe('v3', () => {
      describe('property: requestBody', () => {
        it('todo', () => {
          throw Error('todo')
        })
      })

      describe('property: callbacks', () => {
        it('todo', () => {
          throw Error('todo')
        })
      })

      describe('property: servers', () => {
        it('todo', () => {
          throw Error('todo')
        })
      })
    })
  })
})
