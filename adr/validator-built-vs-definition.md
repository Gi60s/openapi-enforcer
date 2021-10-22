# Validator Built vs Defined

## Status

Proposed

## Context

Validator functions `before` and `after` can perform custom validations based on either the `definition` or `built` data.

The `definition` value will represent the unaltered definition provided by the user of the library. The `built` value represents the value after having already been processed.

When performing a custom validation, which value (`defintion` or `built`) should be used?

## Decision

For the `before` validators the `definition` should be used because we don't know how complete the `built` object is.

For the `after` validators the `built` should be used because it will include values that were set by defaults or plugins.

When generating exceptions the `definition` value should always be used, never the `built` value.

## Consequences

### Potentially Confusing Exceptions

Exceptions produced in the `after` validator may include messaging that is misleading to the user who wrote the definition.

For example:

1) if a user does not set a property and
2) the property is assigned a value by a plugin and
3) an exception is produced based on the built value (assigned by the plugin) then
4) messaging needs to be careful not to say something like "You can't set the value to X" when the user did not set the value to X, rather it was the plugin.
