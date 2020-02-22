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
    })

});
