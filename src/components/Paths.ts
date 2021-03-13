import { ComponentDefinition } from '../component-registry'
import { Data, SchemaObject } from '../definition-validator'
import { EnforcerComponent, Statics } from './'
import * as PathItem from './PathItem'
import { edgeSlashes } from '../util'

export interface Class extends Statics<Definition, Object> {
  new (definition: Definition): Object
}

export interface Definition {
  [pathOrExtension: string]: PathItem.Definition | any
}

export interface Object {
  [pathOrExtension: string]: PathItem.Object | any
}

export const versions = Object.freeze({
  '2.0': 'http://spec.openapis.org/oas/v2.0#paths-object',
  '3.0.0': 'http://spec.openapis.org/oas/v3.0.0#paths-object',
  '3.0.1': 'http://spec.openapis.org/oas/v3.0.1#paths-object',
  '3.0.2': 'http://spec.openapis.org/oas/v3.0.2#paths-object',
  '3.0.3': 'http://spec.openapis.org/oas/v3.0.3#paths-object'
})

export const Component = class Paths extends EnforcerComponent<Definition, Object> implements Object {
  // constructor (definition: Definition) {
  //   super(definition)
  // }
}

export function validator (data: Data<Definition, Object>): SchemaObject {
  return {
    type: 'object',
    allowsSchemaExtensions: true,
    after ({ alert, definition, options }) {
      const paths = Object.keys(definition)
      const map: { [key: string]: string } = {}
      const includesTrailingSlashes = []
      const omitsTrainingSlashes = []

      paths.forEach(key => {
        if (!options.disablePathNormalization) {
            const normalizedKey = edgeSlashes(key, true, false);
            if (map[normalizedKey]) normalizeException.message(key + ' --> ' + normalizedKey);
            if (normalizedKey !== key && !skipCodes.WPAS001) {
                (escalateCodes.WPAS001 ? exception : warn).at(key).message('Path normalized from ' + key + ' to ' + normalizedKey + '. [WPAS001]');
            }
            map[key] = normalizedKey;
        }

        if (key !== '/') {
            if (key[key.length - 1] === '/') {
                includesTrailingSlashes.push(key);
            } else {
                omitsTrainingSlashes.push(key);
            }
        }
      });
    },
    additionalProperties: {
      type: 'component',
      allowsRef: false,
      component: PathItem.Component,
      after ({ alert, key, options }) {

        if (key[0] !== '/' || key[1] === '/') {
          alert('PTHSSH')
        }

        


        const normalizeException = exception.nest('These paths are defined more than once exist due to path normalization:')
        const paths = Object.keys(definition)

        



        // TODO: add path validation from https://github.com/byu-oit/openapi-enforcer/blob/master/src/enforcers/Paths.js
      }
    }
  }
}

export const register: ComponentDefinition = {
  component: Component,
  validator,
  versions
}
