# Change Log
All notable changes to this project will be documented in this file.

The format is based on [Keep a Changelog](http://keepachangelog.com/)
and this project adheres to [Semantic Versioning](http://semver.org/).

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
