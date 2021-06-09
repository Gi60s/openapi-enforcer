import { server } from '../test-utils'

before(async () => {
  await server.start()
})
after(() => {
  server.stop()
})
