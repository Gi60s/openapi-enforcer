# Adapter

The adapter defines the interfaces for using this library in the browser,
in nodejs, or in other future environments.

When the build process happens, the name of the file that matches
the environment being built for is used as the entrypoint for
the library. For example, if building for the browser then the
file `src/Adapter/index.browser.ts` is the entrypoint to the library.
