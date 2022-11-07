
export interface IAdapter {
  context: 'browser' | 'nodejs'
  cwd: string
  eol: string
  inspect: any
  path: {
    dirname: (path: string) => string
    resolve: (...path: string[]) => string
  }
  request: (url: string) => Promise<{ data: string, headers: Record<string, string | string[]>, status: number }>
  sep: string
}
