const esbuild = require('esbuild')
const fs = require('fs/promises')
const path = require('path')

// Automatically exclude all node_modules from the bundled version
const { nodeExternalsPlugin } = require('esbuild-node-externals')

const testDir = path.resolve(__dirname, 'test')
const directive = process.argv[2] ?? ''

const start = Date.now()
;(async () => {
  // nodejs build
  if (directive !== 'browser') {
    await esbuild.build({
      outdir: './dist/node',
      entryPoints: ['./src/Adapter/index.node.ts'],
      bundle: true,
      minify: false,
      keepNames: true,
      platform: 'node',
      sourcemap: true,
      target: 'node16',
      plugins: [nodeExternalsPlugin()]
    })

    // tests build
    await buildTestFiles(testDir)
  }

  // browser build
  if (directive !== 'node') {
    await esbuild.build({
      outdir: './dist/browser',
      entryPoints: ['./src/Adapter/index.browser.ts'],
      external: ['http', 'https', 'os', 'path', 'util'],
      bundle: true,
      minify: true,
      keepNames: true,
      platform: 'browser',
      sourcemap: true,
      target: 'es2020',
      plugins: [nodeExternalsPlugin()]
    })
  }
})()
  .then(() => {
    console.log('Build in ' + (Date.now() - start) + ' milliseconds')
  })
  .catch(e => {
    console.error(e)
    process.exit(1)
  })

async function buildTestFiles (dirPath) {
  const filePaths = await fs.readdir(dirPath)
  const promises = filePaths.map(async filePath => {
    const fullPath = path.resolve(dirPath, filePath)
    const stats = await fs.stat(fullPath)
    if (stats.isDirectory()) {
      await buildTestFiles(fullPath)
    } else if (stats.isFile()) {
      await esbuild.build({
        outfile: path.resolve(__dirname, 'dist/tests', path.relative(testDir, fullPath)),
        entryPoints: [fullPath],
        bundle: true,
        minify: false,
        keepNames: true,
        platform: 'node',
        sourcemap: true,
        target: 'node16',
        plugins: [nodeExternalsPlugin()]
      })
    }
  })
  await Promise.all(promises)
}
