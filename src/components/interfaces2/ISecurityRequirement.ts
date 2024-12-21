import { IEnforcerExtensionDefinition } from './IIndex'

interface ISecurityRequirementBase {
  extensions: Record<string, any>
  name: {
    [name: string]: string[]
  }
}

export interface ISecurityRequirement2 extends ISecurityRequirementBase {}
export interface ISecurityRequirement3 extends ISecurityRequirementBase {}

interface ISecurityRequirementDefinitionBase {
  [key: `x-${string}`]: any
  [name: string]: string[]
}

export interface ISecurityRequirement2Definition extends ISecurityRequirementDefinitionBase {}
export interface ISecurityRequirement3Definition extends ISecurityRequirementDefinitionBase {}
