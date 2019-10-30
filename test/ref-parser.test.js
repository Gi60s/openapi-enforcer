const Exception = require('../src/exception');
const parser = require('../src/json-schema-ref-parser');
const path = require('path');
const server = require('../test-resources/ref-parser/server');

const resourcesDir = path.resolve(__dirname, '..', 'test-resources', 'ref-parser');

describe.only('ref-parser', () => {
    let close;
    let exception;
    let warning;

    before(async () => {
        close = await server()
    });

    beforeEach(() => {
        exception = new Exception('Error');
        warning = new Exception('Warning');
    });

    after(() => {
        close()
    });

    it('can load file', async () => {
        const result = await parser(path.resolve(resourcesDir, 'Pets.yaml'), exception, warning);
        console.log(result);
    });

    // it('can load from a url', () => {
    //
    // });
    //
    // it('can map internal references', () => {
    //
    // });

});
