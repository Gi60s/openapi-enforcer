import { IExceptionLevel } from '../Exception/IException'
import { HookGetProperty, HookSetProperty } from './Symbols'

// This is the base component interface. All other component interfaces inherit from this.
// eslint-disable-next-line @typescript-eslint/no-empty-interface
export interface IComponentInstance {
  // [HookGetProperty]: <T>(key: string, callback: (value: T) => T) => void
  // [HookSetProperty]: <T>(key: string, callback: (newValue: T, oldValue: T) => T) => void
}

// if an openapi extension of x-enforcer is found then the value will have this interface
export interface IEnforcerExtensionDefinition {
  exceptions?: Record<string, IExceptionLevel> // the key is the id to modify the level on and the value is the new level
  nullable?: boolean
}

// string (a is reference to spec) - this version is supported and you've matched the right version to the right component class
// true - this version is supported, but you're using the wrong component class
// false - this version is not supported for this component according to the spec
export type IComponentSpec = Record<IVersion, string | boolean>

export type IVersion = '2.0' | '3.0.0' | '3.0.1' | '3.0.2' | '3.0.3'
