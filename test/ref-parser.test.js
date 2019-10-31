const Exception = require('../src/exception');
const expect = require('chai').expect;
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
        const result = await parser(path.resolve(resourcesDir, 'People.yml'), exception, warning);
        expect(result).to.haveOwnProperty('Person');
    });

    it('can load from a url', async () => {
        const result = await parser('http://localhost:18088/People.yml', exception, warning);
        expect(result).to.haveOwnProperty('Person');
    });

    it('can map internal references', async () => {
        const result = await parser(path.resolve(resourcesDir, 'Pets.yaml'), exception, warning);
        expect(result.Cat.allOf[0]).to.equal(result.Pet);
        expect(result.Dog.allOf[0]).to.equal(result.Pet);
    });

    it('can map external references', async () => {
        const result = await parser(path.resolve(resourcesDir, 'Household.json'), exception, warning);
        expect(result.People.items['x-key']).to.equal('Person');
        expect(result.Pets.items['x-key']).to.equal('Pet');
    });

    it('can map from intro object', async () => {
        const obj = {
            Pet: {
                $ref: './Pets.yaml#Pet'
            }
        };
        const result = await parser(obj, exception, warning);
        expect(result['x-key']).to.equal('Pet');
    });

    it('will produce error for missing root file', () => {
        throw Error('todo');
    });

    it('will produce error for non reachable http endpoint', () => {
        throw Error('todo');
    });

    it('will produce exception for missing nested file', () => {
        throw Error('todo');
    });

    it('will produce error for existing file with missing resource', () => {
        throw Error('todo');
    });

});
