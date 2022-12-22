import { IExceptionLevel } from '../Exception/IException'
import { HookGetProperty, HookSetProperty, WatchProperty } from './Symbols'

// This is the base component interface. All other component interfaces inherit from this.
export interface IComponentInstance {
  [HookGetProperty]: <T>(key: string, callback: (value: T) => T) => void
  [HookSetProperty]: <T>(key: string, callback: (newValue: T, oldValue: T) => T) => void
  [WatchProperty]: <T>(key: string, handler: (newValue: T, oldValue: T) => void) => void
}

// if an openapi extension of x-enforcer is found then the value will have this interface
export interface IEnforcerExtensionDefinition {
  exceptions?: Record<string, IExceptionLevel> // the key is the id to modify the level on and the value is the new level
  nullable?: boolean
}

// string is reference to spec, true means it's supported but not by this version of the component
// false means that the component is not supported for this version
export type IComponentSpec = Record<IVersion, string | boolean>

export type IVersion = '2.0' | '3.0.0' | '3.0.1' | '3.0.2' | '3.0.3'
