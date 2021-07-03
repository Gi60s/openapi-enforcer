import { server } from './helpers'

// These hooks will be picked up by mocha and run before/after all other tests
export const mochaHooks = {
  async beforeAll () {
    await server.start()
  },
  afterAll () {
    server.stop()
  }
}
