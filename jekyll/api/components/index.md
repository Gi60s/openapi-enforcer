---
layout: page
title: Components
subtitle: API Reference
permalink: /api/components
toc: true
---

Within the Open API Enforcer, a component:

- Is directly associated with an [Open API Specification (OAS) object definition](https://github.com/OAI/OpenAPI-Specification/tree/master/versions).
- Validates that a passed in definition adheres to the Open API Specification standards.
- May add additional validations.
- May add additional functionality.

All components are [extensible]({{ "/guide/component-plugins"  | prepend:site.baseurl }}), allowing you to [add custom validation rules and additional functionality]({{ "/guide/component-plugins"  | prepend:site.baseurl }}). 

<details>
<summary bold>OAS 2.0 (formerly Swagger) Components</summary>
<div>{% include v2_0-components.html %}</div>
</details>

<details><summary bold>OAS 3.x.x Components</summary>
<div>
{% include v3_0-components.html %}
</div>
</details>
