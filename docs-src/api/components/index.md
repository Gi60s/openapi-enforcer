---
title: Components
subtitle: API Reference
---

Within the Open API Enforcer, a component:

- Is directly associated with an [Open API Specification (OAS) object definition](https://github.com/OAI/OpenAPI-Specification/tree/master/versions).
- Validates that a passed in definition adheres to the Open API Specification standards.
- May add additional validations.
- May add additional functionality.

All components are [extensible](../../guide/component-plugins.md), allowing you to [add custom validation rules and additional functionality](../../guide/component-plugins.md). 

<details>
<summary bold>OAS 2.0 (formerly Swagger) Components</summary>
<div>{% import ./v2_0-components.md %}</div>
</details>

<details><summary bold>OAS 3.x.x Components</summary>
<div>
{% import ./v3_0-components.md %}
</div>
</details>
