const expect = require('chai').expect;
const RefParser = require('../src/ref-parser');
const path = require('path');
const server = require('../test-resources/ref-parser/server');

const resourcesDir = path.resolve(__dirname, '..', 'test-resources', 'ref-parser');

// TODO: add a message to discriminator not found mapping at root document message indicating that experimental parser should be used

describe('ref-parser', () => {
    let close;

    before(async () => {
        close = await server()
    });

    after(() => {
        close()
    });

    it('can load file', async () => {
        const parser = new RefParser(path.resolve(resourcesDir, 'People.yml'));
        const [ result ] = await parser.dereference();
        expect(result).to.haveOwnProperty('Person');
        expect(result.Person['x-key']).to.equal('Person');
    });

    it('can load from a url', async () => {
        const parser = new RefParser('http://localhost:18088/People.yml');
        const [ result ] = await parser.dereference();
        expect(result).to.haveOwnProperty('Person');
        expect(result.Person['x-key']).to.equal('Person');
    });

    it('can map internal references', async () => {
        const parser = new RefParser(path.resolve(resourcesDir, 'Pets.yaml'));
        const [ result ] = await parser.dereference();
        expect(result.Cat.allOf[0]).to.equal(result.Pet);
        expect(result.Dog.allOf[0]).to.equal(result.Pet);
    });

    it('can map external references', async () => {
        const parser = new RefParser(path.resolve(resourcesDir, 'Household.json'));
        const [ result ] = await parser.dereference();
        expect(result.People.items['x-key']).to.equal('Person');
        expect(result.Pets.items['x-key']).to.equal('Pet');
    });

    it('can map from intro object', async () => {
        const obj = {
            MyPet: {
                $ref: path.resolve(resourcesDir, './Pets.yaml') + '#/Pet'
            }
        };
        const parser = new RefParser(obj);
        const [ result ] = await parser.dereference();
        expect(result.MyPet['x-key']).to.equal('Pet');
    });

    it('can map to root element', async () => {
        const obj = {
            MyPet: {
                $ref: path.resolve(resourcesDir, './Pets.yaml')
            }
        };
        const parser = new RefParser(obj);
        const [ result ] = await parser.dereference();
        expect(result.MyPet.Pet['x-key']).to.equal('Pet');
    });

    it('can map from root element', async () => {
        const obj = {
            $ref: path.resolve(resourcesDir, './Pets.yaml')
        };
        const parser = new RefParser(obj);
        const [ result ] = await parser.dereference();
        expect(result.Pet['x-key']).to.equal('Pet');
    });

    it('can map from root element file', async () => {
        const parser = new RefParser(path.resolve(resourcesDir, './FromRoot.yml'));
        const [ result ] = await parser.dereference();
        expect(result.Pet['x-key']).to.equal('Pet');
    });

    it('can load a non object', async () => {
        const parser = new RefParser(path.resolve(resourcesDir, 'Value.yaml'));
        const [ result ] = await parser.dereference();
        expect(result.Value['x-key']).to.equal('Value');
        expect(result.Value.properties.value.type).to.equal('integer');
    });

    it('can handle circular references in same document', async () => {
        const obj = {
            A: {
                title: 'A',
                pair: {
                    $ref: '#/B/title'
                },
            },
            B: {
                title: 'B',
                pair: {
                    $ref: '#/A/title'
                },
            },
            Aa: {
                $ref: '#/A'
            }
        };
        const parser = new RefParser(obj);
        const [ result ] = await parser.dereference();
        expect(result.A.pair).to.equal('B');
        expect(result.B.pair).to.equal('A');
        expect(result.Aa).to.equal(result.A);
    });

    it('can handle circular references in file', async () => {
        const parser = new RefParser(path.resolve(resourcesDir, './CircleA.yml'));
        const [ result ] = await parser.dereference();
        expect(result.A.y.B.x).to.equal('B');
        expect(result.A.y.B.y).to.equal(result);
    });

    it('can handle circular reference to reference', async () => {
        const parser = new RefParser(path.resolve(resourcesDir, './RefReplaceA.yml'));
        const [ result ] = await parser.dereference();
        expect(result.A.a).to.equal(result);
        expect(result).to.equal(result.A.b.B.a);
        expect(result.A.b).to.equal(parser.$refs[path.resolve(resourcesDir, './RefReplaceB.yml')]);
    });

    it('will produce error for reference to self', async () => {
        const obj = {
            A: {
                $ref: '#/A'
            }
        };
        const parser = new RefParser(obj);
        const [ , err ] = await parser.dereference();
        expect(err).to.match(/Unresolvable infinite loop/);
    });

    it('will produce error for missing root file', async () => {
        const parser = new RefParser(path.resolve(resourcesDir, './dne.yml'));
        const [ , exception ] = await parser.dereference();
        expect(exception).to.match(/Unable to find referenced file.+dne\.yml$/);
    });

    it('will produce error for non reachable http endpoint', async () => {
        const parser = new RefParser('http://localhost:18088/dne.yml');
        const [ , err ] = await parser.dereference();
        expect(err).to.match(/Request failed with status code 404$/);
    });

    it('will produce exception for missing nested file', async () => {
        const obj = {
            Pet: {
                $ref: path.resolve(resourcesDir, './dne.yml#/Foo')
            }
        };
        const parser = new RefParser(obj);
        const [ , err ] = await parser.dereference();
        expect(err).to.match(/Unable to find referenced file.+dne\.yml$/);
    });

    it('will produce error for existing file with missing resource', async () => {
        const obj = {
            Pet: {
                $ref: path.resolve(resourcesDir, './Pets.yaml') + '#/Dne'
            }
        };
        const parser = new RefParser(obj);
        const [ , err ] = await parser.dereference();
        expect(err).to.match(/Cannot resolve reference: #\/Dne$/);
    });

    describe('getSourcePath', () => {
        let parser;
        let result;

        it('will throw an error if not dereferenced', () => {
            parser = new RefParser(path.resolve(resourcesDir, 'Household.json'));
            expect(() => parser.getSourcePath(null)).to.throw(/You must first call the dereference function/);
        });

        it('will throw an error if dereference failed', async () => {
            parser = new RefParser(path.resolve(resourcesDir, 'Dne.json'));
            await parser.dereference();
            expect(() => parser.getSourcePath(null)).to.throw(/dereference has failed/);
        });

        describe('from file input', () => {
            before(async () => {
                parser = new RefParser(path.resolve(resourcesDir, 'Household.json'));
                result = (await parser.dereference()).value;
            });

            it('can identify root node source', async () => {
                const source = parser.getSourcePath(result);
                expect(source).to.equal(path.resolve(resourcesDir, 'Household.json'));
            });

            it('can identify node source for child http resource', async () => {
                const source = parser.getSourcePath(result.People.items.property);
                expect(source).to.equal('http://localhost:18088/People.yml');
            });

            it('can identify node source for child file', () => {
                const source = parser.getSourcePath(result.Pets.items.properties);
                expect(source).to.equal(path.resolve(resourcesDir, 'Pets.yaml'));
            });

            it('cannot identify source from leaf', () => {
                const source = parser.getSourcePath(result.People.type);
                expect(source).to.equal(undefined);
            });
        });

        describe('from object input', () => {

            before(async () => {
                parser = new RefParser({
                    a: {
                        b: 1
                    },
                    file: {
                        $ref: path.resolve(resourcesDir, 'People.yml')
                    },
                    http: {
                        $ref: 'http://localhost:18088/People.yml#/Person'
                    }
                });
                result = (await parser.dereference()).value;
            });

            it('can identify root node source', async () => {
                const source = parser.getSourcePath(result.a);
                expect(source).to.equal('');
            });

            it('can identify node source for child http resource', async () => {
                const source = parser.getSourcePath(result.http);
                expect(source).to.equal('http://localhost:18088/People.yml');
            });

            it('can identify node source for child file', () => {
                const source = parser.getSourcePath(result.file);
                expect(source).to.equal(path.resolve(resourcesDir, 'People.yml'));
            });

            it('cannot identify source from leaf', () => {
                const source = parser.getSourcePath(result.a.b);
                expect(source).to.equal(undefined);
            });
        });
    });

    describe('getSourceNode', () => {

        it('can get the root node from file source', async () => {
            const parser = new RefParser(path.resolve(resourcesDir, 'Household.json'));
            const [ value ] = await parser.dereference();
            const source = parser.getSourceNode(value.People);
            expect(source).to.equal(value);
        });

        it('can get the child root node from file source', async () => {
            const parser = new RefParser(path.resolve(resourcesDir, 'Household.json'));
            const [ value ] = await parser.dereference();
            const source = parser.getSourceNode(value.People.items.property);
            expect(source).to.haveOwnProperty('Person');
            expect(source.Person['x-key']).to.equal('Person');
        });

    });

    describe('resolvePath', () => {

        it('can resolve internal path to value', async () => {
            const parser = new RefParser(path.resolve(resourcesDir, 'Household.json'));
            const [ value ] = await parser.dereference();
            const result = parser.resolvePath(value, '#/Pets/type');
            expect(result).to.equal('array');
        });

        it('can resolve internal path to node', async () => {
            const parser = new RefParser(path.resolve(resourcesDir, 'Household.json'));
            const [ value ] = await parser.dereference();
            const result = parser.resolvePath(value, '#/Pets/items');
            expect(result).to.equal(value.Pets.items);
        });

        it('can resolve to external relative local path', async () => {
            const parser = new RefParser(path.resolve(resourcesDir, 'Household.json'));
            const [ value ] = await parser.dereference();
            const result = parser.resolvePath(value, './Pets.yaml#/Pet');
            expect(result).to.equal(value.Pets.items);
        });

        it('can resolve to external absolute local path', async () => {
            const parser = new RefParser(path.resolve(resourcesDir, 'Household.json'));
            const [ value ] = await parser.dereference();
            const result = parser.resolvePath(value, path.resolve(resourcesDir, 'Pets.yaml') + '#/Pet');
            expect(result).to.equal(value.Pets.items);
        });

        it('can resolve relative http path', async () => {
            const parser = new RefParser('http://localhost:18088/Household.json');
            const [ value ] = await parser.dereference();
            const result = parser.resolvePath(value, './People.yml#/Person');
            expect(result).to.equal(value.People.items);
        });

        it('can resolve base http path', async () => {
            const parser = new RefParser('http://localhost:18088/Household.json');
            const [ value ] = await parser.dereference();
            const result = parser.resolvePath(value, '/People.yml#/Person');
            expect(result).to.equal(value.People.items);
        });

        it('can resolve absolute http path', async () => {
            const parser = new RefParser('http://localhost:18088/Household.json');
            const [ value ] = await parser.dereference();
            const result = parser.resolvePath(value, 'http://localhost:18088/People.yml#/Person');
            expect(result).to.equal(value.People.items);
        });

        it('cannot resolve path that was not part of deref', async () => {
            const parser = new RefParser('http://localhost:18088/Household.json');
            const [ value ] = await parser.dereference();
            expect(() => parser.resolvePath(value, 'http://localhost:18088/Value.yml')).to.throw(/paths that were not already resolved/);
        });
    });

    describe('bundle', () => {
        it('can bundle multiple files', async function () {
            const parser = new RefParser(path.resolve(resourcesDir, 'Bundle1.yml'));
            const [ bundled ] = await parser.bundle();
            expect(bundled.b.a.$ref).to.equal('#/a');
            expect(bundled.c.a.$ref).to.equal('#/a');
            expect(bundled.c.b.$ref).to.equal('#/b');
            expect(bundled.d.c.$ref).to.equal('#/c/c');
        })

        // this test proves that bundling will prioritize references
        // to follow the OpenAPI specification
        it('will smartly reference duplicates', async function () {
            const doc = {
                openapi: '3.0.0',
                info: { title: '', version: '' },
                paths: {
                    '/': {
                        responses: {
                            '200': {
                                description: '',
                                content: {
                                    'application/json': {
                                        schema: {
                                            $ref: '#/components/schemas/x'
                                        }
                                    }
                                }
                            }
                        }
                    }
                },
                components: {
                    schemas: {
                        x: {
                            $ref: '#/schemas/x'
                        }
                    }
                },
                schemas: {
                  x: {
                      type: 'string'
                  }
                }
            }

            const parser = new RefParser(doc);
            const [ bundled ] = await parser.bundle();
            expect(bundled.components.schemas.x).to.deep.equal({ type: 'string' })
        });
    })
});
