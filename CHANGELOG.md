# Change Log
All notable changes to this project will be documented in this file.

The format is based on [Keep a Changelog](http://keepachangelog.com/)
and this project adheres to [Semantic Versioning](http://semver.org/).

## 1.22.2

### Fixed

- **Fix Validation of `not` Sub Schema**

  Any time a schema had the property `not`, it was not validating correctly.
  This code for this fix, including tests, is thanks to 
  [gaetano-guerriero](https://github.com/gaetano-guerriero).

## 1.22.1

### Fixed

- **Exception Skip Codes Bug Fix**

  The exception skip codes that were defined via the options were not being carried through to child components. This
  fix allows those settings to be carried. Exception skip codes defined by an instance (see change 1.22.0) are still
  limited to just the component.

## 1.22.0

### Added

- **You Can Now Skip Instances of an Exception**

  Being able to skip a specific type of exception has been around for a while, but if you want to skip just a single
  instance of an exception, that is now possible. Find the nearest component to where your exception is occurring and
  add the extension `x-enforcer-exception-skip-codes` followed by a space seperated list of all exceptions that should
  be skipped in that component. This will not affect child components of this component, only the exceptions that 
  specifically belong to this component.

  ```yaml
  MySchema:
    x-enforcer-exception-skip-codes: WSCH001 WSCH002
    type: string
    format: tacos
  ```

## 1.21.1

### Fixed

- **Default Values Can Be Specified with allOf and anyOf Schemas**

  Schemas that use the `allOf` or `anyOf` property can now specify a default value at the shared schema level. For example:

  ```yaml
  MySchema:
    default: false
    anyOf:
      - type: boolean
      - type: number
  ```

## 1.21.0

### Added

- **You Can Use Non-Spec Properties and Skip Exception**

  Using a property that is not defined in the OpenAPI specification will generally result in an exception. Now there is an 
  [exceptionSkipCode](https://openapi-enforcer.com/api/#enforcer) `EDEV001` that will allow you to use properties
  that are not part of the OpenAPI specification.

### Changed

- **Warn of Required Properties that are Not Specified**

  In the scenario where you define an object with a required property but do not include that property
  in the `properties` list, the object is valid, according to the OpenAPI specification because `additionalProperties`
  defaults to `true`.

  ```yml
  MySchema:
    type: object
    required:
      - "a"
      - "b"
    properties:
      a:
        type: string
        description: field a
      c:
        type: string
        description: field c  
  ```

  With this change, when you specify a required property without also specifying the schema attached
  to that property a warning will now be produced that can either be escalated or skipped using
  [exceptionSkipCode](https://openapi-enforcer.com/api/#enforcer) `WSCH007`.

## 1.20.0

### Changed

- **Replaced Dynamic Imports with Static Imports**

  The `index.js` file was using dynamic imports via the `Super` function. That has been replaced with static imports
  which may allow this library to run on Deno. Thanks to [mattiasrunge](https://github.com/mattiasrunge) for the PR.

## 1.19.0

### Added

- **exceptionSkipCodes and exceptionEscalateCodes for Invalid Example**

  Add the escalate / skip code WSCH006 to better manage invalid examples that don't match schemas.

### Fixed

- **Normalized Invalid Example Severity**

  Previously invalid examples would be warnings in some cases and errors in other places. Now all invalid examples are
  warnings, but you can convert those to errors or ignore them entirely now by using
  exceptionSkipCodes and exceptionEscalateCodes. See documentation on **Component Options** in the
  [documentation](https://openapi-enforcer.com/api/#enforcer).

## 1.18.0

### Added

- **Case Sensitivity Optional For Paths**

  The default behavior is for paths to be case sensitive. There is now an option `Enforcer.config.useCaseSensitivePaths` (defaulting to `true`) that when set to `false` will change how paths duplicates are validated and how paths are looked up when attempting to match a path to a request.

## 1.17.2

### Fixed

- **Allow Two Similar Yet Distinct Paths When Methods Do Not Collide**

  Before this fix you could define two OpenAPI paths with the same path parameter location and different methods, but when attempting to match a path to a request the second path would be unreachable. This fix resolves the issue, allowing both paths to be found.

## 1.17.1

### Fixed

- **Lookup $ref Value Only When $ref is a string**

  Previously any objects with a `$ref` property would treat the value of the `$ref` as a reference to resolve regardless of the value assigned to the `$ref` property. Now there is a check that makes sure that the value assigned to the `$ref` property is a string prior to attempting to look up the reference.

## 1.17.0

### Added

- **Examples Warn of Additional Properties**

  For a schema, the default behavior of an object is to allow additional properties. This can be problematic when examples have additional properties that the schema does not define. Now there is a global config option `Enforcer.config.examplesWarnAdditionalProperty` that defaults to `true` and will warn of examples with additional properties. To disable this behavior set the global config property to `false`.

## 1.16.1

### Changed

- **Improved README**

  The README now includes a few common usage examples and has the website link more prominent.

## 1.16.0

All functionality should be the same as before, but due to the types of changes we're making this a minor release instead of a patch.

### Changed

- **Improved JSON Ref Resolution**

  There has been a built-in JSON schema ref resolver for some time now, but it has not been the default. This has now been made both the default and the only option for ref resolution allowing the `json-schema-ref-parser` dependency to be removed.

  This ref resolver is slightly better than the generic `json-schema-ref-parser` because it recognizes references in OpenAPI (and Swagger) documents that are not identified by the `$ref` property. As an example, discriminators have non `$ref` references.

- **Removed axios Dependency**

  This dependency was only used for HTTP/S GET requests. Now the core NodeJS `http` or `https` library is being used instead.

- **Remove json-schema-ref-parser Dependency**

  See the first bullet point of this change entry.

- **Added js-yaml Dependency**

  The built-in json schema reference parser uses js-yaml. Previously it was using the js-yaml dependency that was included by the json-schema-ref-parse, but with that gone we had to add it in as a dependency.

## 1.15.5

### Fixed

- **Deserialized Byte Examples Cannot Be Frozen**

  If an example was given for format type "byte" then when the enforcer would deserialize that value to a Buffer. One deserialized it would attempt to freeze the object, but Buffers cannot be frozen and this would throw an error. Now Buffers will not attempt to be frozen.

## 1.15.4

### Fixed

- **Fixed Case-Sensitivity Issue with Response Headers**

  Response headers that had anything except lowercase values would incorrectly not run through validation. Thanks to @dziegelbein for the PR that included the issue, fix, and tests.

## 1.15.2

### Fixed

- **TypeScript Types Issues**

  TypeScript definition still had some issues, so I've simplified it for now. Looking forward to OpenAPI Enforcer version 2 which is being built with TypeScript.

## 1.15.2

### Fixed

- **TypeScript Types Issues**

  TypeScript definition had some issues.

## 1.15.1

### Added

- **Minimal TypeScript Support**

  Added some typings for TypeScript support.

## 1.15.0

### Added

- **Partial TypeScript Support**

  Added some type support for the enforcer. It's a start.

- **Added Schema Hooks**

  Developers can now add hooks before and after serialization, deserialization, and validation. See the documentation on the [schema component](https://byu-oit.github.io/openapi-enforcer/api/components/schema).

## 1.14.3

### Fixed

- **Reporting for Equivalent Paths**

  A bug was identified that could incorrectly report the wrong paths when equivalent paths were identified.

## 1.14.2

### Fixed

- **Example Validation with One Of Schema**

  There were several problems with validating examples against schemas with `oneOf`. This has been fixed.

## 1.14.1

### Fixed

- **Security Requirement OpenID Allowed Scopes**

  The OpenID security requirement incorrectly did not allow scopes. This has been fixed in this release.

## 1.14.0

### Added

- **Create Random String with Pattern**

  - Schemas of type string with a defined pattern did not allow for values to be generated. Now schema's with patterns can be randomly generated.

### Fixed

- **Random Number Generator**

  When generating a random number from a schema it was possible that the randomly generated value would not fall within the expected minimum / maximum range. This is fixed.


## 1.13.3

### Fixed

- **Discriminator Bugs**

  Various bugs were found for serializing, deserializing, randomly generating, and populating values off of a schema that included a discriminator. Some of these bugs were related to not following the OpenAPI specification closely enough.

  Now if a discriminator is specified then it will not attempt to find other matches when the discriminator does not resolve the schema.

## 1.13.2

### Fixed

- **Read / Write Required Property May Not Exist**

  Fixed an error when checking for required schema properties that should not be included due to being read-only or write only.

## 1.13.1

### Fixed

- **Function operation.response Supports Wildcard Codes**

  OpenAPI spec 3.0.0 and newer support wildcard response codes. Examples: `1XX`, `2XX`, `3XX`, `4XX`, `5XX`. The document validator has supported this, but the Operation.prototype.response function did not support that until now.

## 1.13.0

### Added

- **Add getBundledDefinition**

  The ref parser already has a bundler function, but now when creating an OpenAPI or Swagger component using the [Enforcer function](https://byu-oit.github.io/openapi-enforcer/api/openapi-enforcer#enforcer) an additional property will be added to get the bundled definition.

## 1.12.8

### Fixed

- **Operation Response Now Validates for Write Only Properties**

  The operation response function now checks that write only properties are not being sent to the client.

## 1.12.7

### Fixed

- **ReadOnly and WriteOnly Error Message Fix**

  Although readOnly and writeOnly errors were being caught correctly, the messaging was negative. For example, it would say "Cannot write to read only" when it meant "Cannot read from write only" and vice versa.

## 1.12.6

### Fixed

- **ReadOnly and WriteOnly**

  The library was incorrectly not accounting for readOnly and writeOnly when using schema validation. This functionality has been added.

## 1.12.5

### Changed

- **Fixed Vulnerability**

  Updated Axios library to fix critical vulnerability.

## 1.12.4

### Fixed

- **Bundle Paths with / or ~**

  Bundled paths that included a `/` or `~` were incorrectly being converted when generating $ref values.


## 1.12.3

### Fixed

- **Dereference Path Resolution**

  Path resolution was not always correctly determining the source path.

## 1.12.2

### Fixed

- **OpenAPI component path and request details**

  The `request` and `path` did not always add `pathItem`, `operation`, and `pathKeys` properties that were added in `1.12.1`.

## 1.12.1

### Added

- **OpenAPI component path and request details**

    The `request` and `path` functions may produce an exception if an invalid request is made. This code adds either the `pathItem` component or `operation` component and `pathKey` properties to the exception object when possible. 

## 1.12.0

### Changed

- **Schema type not required**

    Previous versions have required the `type` property to be specified for schemas (except in the case where one of `allOf`, `anyOf`, `oneOf`, and `not` are defined).
    
    This update no longer requires `type` to be specified. If `type` is not specified then the OpenAPI Enforcer will attempt to auto determine type. If the type cannot be determined and should exist then warning `WSCH005` ("Schemas with an indeterminable type cannot serialize, deserialize, or validate values.") will be generated.

## 1.11.2

### Fixed

- **Bundler**

    Bundler had a few bugs that made it not work in most cases. Oops. Now fixed to work much better.

## 1.11.1

### Fixed

- **Date-time numoffset optional colon**

    Fixed the date-time regular expression to allow the colon to be optional per [RFC3339 Appendix-A](https://tools.ietf.org/html/rfc3339#appendix-A).

## 1.11.0

### Added

- **Definition Bundler**

    Created a custom-built bundler that bundles and references nodes in a format that follows the OpenAPI specification.
    
### Fixed

- **Custom Ref Parser**

    The custom ref parser had a bug where is failed to check for null values when processing objects. That has been resolved.

## 1.10.8

### Changed

- **Validate enums, defaults, and examples after discriminator dereference.**

    When using an example in a discriminator a error would occur because discriminator references weren't being resolved until later in the process. You can't validate a value against a schema that has not yet been resolved.

## 1.10.7

### Changed

- **Same paths with different verbs should not be considered in conflict.**

    If you have two paths that define the same endpoint then this is identified as a conflict. Previously, this applied across HTTP methods too. This patch fixes misidentifying conflicting paths that use different HTTP methods.
    
    Thanks to [ideadapt](https://github.com/ideadapt) for the PR fix and tests.

## 1.10.6

### Changed

- **Use valueOf evaluation for minimum and maximum comparison.**

    Previously this was casting to number using `+value`, but that leads to casting failures in some instances. Using `valueOf()` will provide more flexibility while also providing proper consistency.

## 1.10.5

### Removed

- **Removed Buffer constructors**

   Adjusted for the deprecation of Buffer constructors. https://nodejs.org/en/docs/guides/buffer-constructor-deprecation/
   
   This change removes support for NodeJS versions 5.9.x and earlier.

## 1.10.4

### Changed

- **OpenAPI#request can accept query object.**

    The OpenAPI `request` function will now also accept a separate `query` property as input.

## 1.10.3

### Changed

- **Passed in options no longer modified.**

    When creating an Enforcer instance options can be provided. The options object was being altered. This has been fixed to now create a copy of the options prior to altering.

## 1.10.2

### Changed

- **Fixed bug discriminator mapping with examples.**

    Examples were being validated before discriminator mappings were resolved. This fix ensures that examples are validated after discriminator mappings are resolved.

## 1.10.1

### Changed

- **Fixed bug with oneOf discriminator.**

    The serialize and deserialize through the `oneOf` or `anyOf` was not providing sufficient validations. This has been fixed.

## 1.10.0

### Added

- **A custom ref parser to provide sufficient context to OpenAPI v3 discriminator mappings.**

    The previous parser had limitations when discriminators existed outside the primary OpenAPI definition file.
    
- **A production option to improve load times for production.**

    This is accomplished by performing fewer validations on your OpenAPI definition, but your definition must still be valid otherwise runtime errors will occur.
    
## 1.9.0

### Added

- **Default values to request inputs.**

    Previous versions incorrectly forgot to add default data to the request object. For example, now:
     
     1. If you OpenAPI document specified a query parameter with a default value and...
     2. the client's request did not include that query parameter...
     3. then producing a request object with the [OpenAPI#request function](https://byu-oit.github.io/openapi-enforcer/api/components/openapi#request) will return a processed request object will have the default value added automatically.
