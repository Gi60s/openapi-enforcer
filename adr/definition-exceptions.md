# Definition Exceptions

## Context

Definition exceptions need a level of consistency.

## Decision

1. Each definition exception that is part of the OpenAPI Enforcer will have a code that is prefixed with `OAE-D` followed by a unique code.
 
3. Exception messages with values injected into the string should wrap the value with quotation marks if the value is a string. If the value is not a string (object, null, number, date, etc.) it will not be wrapped in quotation marks.
  
   Example: `Property "foo" is not allowed. Allowed properties: "food", "drink"`

   Example: `Property "num" must be less than 10. Received: 15`

   Example: `The value must be a number. Received: "hello"`

## Consequences
