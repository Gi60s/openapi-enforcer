
export interface ISecurityRequirement {
  extensions: Record<string, any>
  name: {
    [name: string]: string[]
  }
}
