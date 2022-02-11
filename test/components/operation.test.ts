import { expect } from 'chai'
import { Operation as Operation2, Parameter as Parameter2, PathItem as PathItem2 } from '../../src/v2'
import { Operation as Operation3, Parameter as Parameter3, PathItem as PathItem3 } from '../../src/v3'

describe('Component: Operation', () => {
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
            const [req] = op.request({ body: '1' })
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
            const [req] = op.request({ body: { p: ['1', '2', '3'] } })
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
            const [req] = op.request({ body: { p: ['1,2,3'] } })
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
            const [req] = op.request({ body: { p: ['1', '2', '3'] } })
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
            const [req] = op.request({ path: { p: '2000-01-01' } })
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
            const [req] = op.request({ path: { p: '1,2,3' } })
            expect(req.path.p).to.deep.equal([1, 2, 3])
          })

          it.only('will not accept an array of values as input', () => {
            const op = new Operation2({
              parameters: [
                { name: 'p', in: 'path', required: true, type: 'array', items: { type: 'number' } }
              ],
              responses: {
                200: { description: 'ok' }
              }
            })
            const [, error] = op.request({
              path: {
                // @ts-expect-error
                p: ['1', '2', '3']
              }
            })
            expect(error?.hasCode('PARAMETER_PARSE_INVALID_INPUT')).to.equal(true)
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
            const [, error] = op.request({})
            expect(error).to.match(/Missing required path parameter: "p"/)
            expect(error?.hasCode('OAE-EOPRMRP')).to.equal(true)
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
              const [req] = op.request({ header: { p: '2000-01-01' } })
              expect(req.header.p).to.be.instanceof(Date)
            })

            it('can parse a header with an array of string values', () => {
              const op = new Operation2({
                parameters: [
                  { name: 'p', in: 'header', type: 'string', format: 'date' }
                ],
                responses: { 200: { description: 'ok' } }
              })
              const [req] = op.request({ header: { p: ['2000-01-01'] } })
              expect(req.header.p).to.be.instanceof(Date)
            })

            it('can parse a header with an undefined value', () => {
              const op = new Operation2({
                parameters: [
                  { name: 'p', in: 'header', type: 'string', format: 'date', allowEmptyValue: true }
                ],
                responses: { 200: { description: 'ok' } }
              })
              const [req] = op.request({ header: { p: undefined } })
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
              const [, err] = op.request({
                header: {
                  // @ts-expect-error
                  p: 1
                }
              })
              expect(err?.report.hasCode('PARAMETER_PARSE_INVALID_INPUT')).to.equal(true)
            })

            it('cannot parse an array of numbers', () => {
              const op = new Operation2({
                parameters: [
                  { name: 'p', in: 'header', type: 'array', items: { type: 'number' } }
                ],
                responses: { 200: { description: 'ok' } }
              })
              const [, err] = op.request({
                header: {
                  // @ts-expect-error
                  p: [1, 2, 3]
                }
              })
              expect(err?.report.hasCode('PARAMETER_PARSE_INVALID_INPUT')).to.equal(true)
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
              const [, err] = op.request({})
              expect(err).to.match(/required header parameters are missing/)
              expect(err?.report.hasCode('OPERATION_REQUEST_MISSING_REQUIRED_PARAMETERS')).to.equal(true)
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
              const [req] = op.request({ header: { p: '1' } })
              expect(req.header.p).to.deep.equal([1])
            })

            it('can parse a header with an array of values', () => {
              const op = new Operation2({
                parameters: [
                  { name: 'p', in: 'header', type: 'array', items: { type: 'number' } }
                ],
                responses: { 200: { description: 'ok' } }
              })
              const [req] = op.request({ header: { p: ['1,2,3'] } })
              expect(req.header.p).to.deep.equal([1, 2, 3])
            })

            it('can parse a header with an array of values (multi format)', () => {
              const op = new Operation2({
                parameters: [
                  { name: 'p', in: 'header', collectionFormat: 'multi', type: 'array', items: { type: 'number' } }
                ],
                responses: { 200: { description: 'ok' } }
              })
              const [req] = op.request({ header: { p: ['1', '2', '3'] } })
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
            const [req] = op.request({ query: '?p=1' })
            expect(req.query.p).to.equal(1)
          })

          it('can parse a multi value input for a non-array type', () => {
            const op = new Operation2({
              parameters: [
                { name: 'p', in: 'query', type: 'number' }
              ],
              responses: { 200: { description: 'ok' } }
            })
            const [req] = op.request({ query: 'p=1&p=2' })
            expect(req.query.p).to.equal(2)
          })

          it('can parse a single comma separated value for an array type', () => {
            const op = new Operation2({
              parameters: [
                { name: 'p', in: 'query', type: 'array', items: { type: 'number' } }
              ],
              responses: { 200: { description: 'ok' } }
            })
            const [req] = op.request({ query: 'p=1,2' })
            expect(req.query.p).to.deep.equal([1, 2])
          })

          it('can parse a single pipe separated value for an array type', () => {
            const op = new Operation2({
              parameters: [
                { name: 'p', in: 'query', collectionFormat: 'pipes', type: 'array', items: { type: 'number' } }
              ],
              responses: { 200: { description: 'ok' } }
            })
            const [req] = op.request({ query: 'p=1|2' })
            expect(req.query.p).to.deep.equal([1, 2])
          })

          it('can parse a single space separated value for an array type', () => {
            const op = new Operation2({
              parameters: [
                { name: 'p', in: 'query', collectionFormat: 'ssv', type: 'array', items: { type: 'number' } }
              ],
              responses: { 200: { description: 'ok' } }
            })
            const [req] = op.request({ query: 'p=1 2' })
            expect(req.query.p).to.deep.equal([1, 2])
          })

          it('can parse a single tab separated value for an array type', () => {
            const op = new Operation2({
              parameters: [
                { name: 'p', in: 'query', collectionFormat: 'tsv', type: 'array', items: { type: 'number' } }
              ],
              responses: { 200: { description: 'ok' } }
            })
            const [req] = op.request({ query: 'p=1\t2' })
            expect(req.query.p).to.deep.equal([1, 2])
          })

          it('can parse a multi value input for an array type', () => {
            const op = new Operation2({
              parameters: [
                { name: 'p', in: 'query', collectionFormat: 'multi', type: 'array', items: { type: 'number' } }
              ],
              responses: { 200: { description: 'ok' } }
            })
            const [req] = op.request({ query: 'p=1&p=2' })
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
            const [, err] = op.request({})
            expect(err).to.match(/required query parameters are missing/)
            expect(err?.report.hasCode('OPERATION_REQUEST_MISSING_REQUIRED_PARAMETERS')).to.equal(true)
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
            const [req] = op.request({ body: [1, 2, 3], header: { 'content-type': 'application/json' } })
            expect(req.body).to.deep.equal([1, 2, 3])
          })
        })
      })
    })
  })

  describe('validate', () => {

  })
})
