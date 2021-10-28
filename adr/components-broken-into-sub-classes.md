# Components Broken Into Subclasses

## Context

Classes are used to represent the different schema objects defined in the OpenAPI specification.

A more generic class structure would combine all possible properties and variations into a single class per OAS object.
This simplifies the class structure, but reduces the friendliness of auto complete.

If the decision is made to separate into subclasses but those subclasses had different names
(ex: Header has Header2 and Header 3 to represent each version) then each subclass has a name that is
different from the OAS equivalent schema object.

## Decision

## Consequences
