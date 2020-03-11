const expect = require('chai').expect;
const Enforcer = require('../index');
const path = require('path');

const resourcesPath = path.resolve(__dirname, '..', 'test-resources');

describe('documented issues fixes', () => {

    it('issues 39 - cyclic reference toObject', async () => {
        const openApiDocPath = path.resolve(resourcesPath, 'issue-39', 'cyclic_reference.yaml');
        const { error } = await Enforcer(openApiDocPath, { fullResult: true });
        expect(error).to.equal(undefined)
    });

    it('issue 66 - oneOf example undefined value warning', async () => {
        const openApiDocPath = path.resolve(resourcesPath, 'issue-66', 'openapi.yml');
        const { warning } = await Enforcer(openApiDocPath, { fullResult: true });
        expect(warning).to.equal(undefined)
    });

    describe('issue 69 - oneOf additionalProperties = false', () => {
        const def = {
            oneOf: [
                {
                    properties: {
                        one: { type: "string" }
                    },
                    required: [ "one" ],
                    additionalProperties: false,
                    type: "object"
                },
                {
                    properties: {
                        one: { type: "string" },
                        two: { type: "string" }
                    },
                    required: [ "one", "two" ],
                    additionalProperties: false,
                    type: "object"
                }
            ]
        };

        let schema;
        before(() => {
            const result = new Enforcer.v3_0.Schema(def);
            schema = result.value;
        });

        it('can identify schema with one value', () => {
            const [ value, err, warn ] = schema.deserialize({ one: "value" });
            expect(err).to.equal(undefined);
            expect(value).to.deep.equal({ one: 'value' });
        });

        it('can identify schema with two values', () => {
            const [ value, err, warn ] = schema.deserialize({ one: 'one', two: 'two' });
            expect(err).to.equal(undefined);
            expect(value).to.deep.equal({ one: 'one', two: 'two' });
        });

        it('can identify invalid input', () => {
            const [ value, err, warn ] = schema.deserialize({ one: 1 });
            expect(err).to.match(/Expected a string/);
        });

    })

});
