# MDX Documentation Patterns

This document covers patterns and limitations when writing MDX documentation files in `docs/ui/`.

## File Location

Documentation files go in `docs/ui/{component}.mdx` and are auto-discovered by the `[ui].tsx` dynamic route.

## Basic Structure

```mdx
---
title: Component Name
---

import { Component } from "@/components/ui/component";
import { InstallBlock, ComponentPreview, PropsTable } from "@/components/docs";
import { html as xhtml } from "@/html";
import { View, Text } from "@/tw";

Description of the component.

## Installation

<InstallBlock packages="@radix-ui/react-component" />

## Usage

\`\`\`tsx
import { Component } from "@/components/ui/component";
\`\`\`

## Examples

### Example Name

<ComponentPreview
  title="Example"
  code={\`<Component>Example</Component>\`}
>
  <xhtml.div className="w-full">
    <Component>Example</Component>
  </xhtml.div>
</ComponentPreview>

## API Reference

### Component

<PropsTable
  data={[
    { name: "prop", type: "string", description: "Description" },
  ]}
/>
```

## MDX Limitations

### No Expression Statements

MDX only supports `import` and `export` statements at the top level. Regular JavaScript expressions will cause errors.

**Error:**
```mdx
import { Component } from "@/components/ui/component";

// This causes: "Unexpected ExpressionStatement in code"
Component.subComponent = SubComponent;
```

**Solution:** Only use imports/exports, no assignments or expressions.

### Export Functions for Reusable Components

You can export functions to define reusable components within MDX:

```mdx
export function CustomExample() {
  return <View><Text>Custom content</Text></View>;
}

<CustomExample />
```

### Context-Dependent Components Don't Work at Top Level

Components that require React Context (like hooks) cannot be defined at the MDX top level if the context provider is inside the preview.

**Problem:**
```mdx
// This won't work - useAccordionItem needs to be inside Accordion.Item
export function CustomIndicator() {
  const { isExpanded } = useAccordionItem(); // Error: not in context
  return <SFIcon name={isExpanded ? "minus" : "plus"} />;
}

<Accordion>
  <Accordion.Item>
    <Accordion.Trigger indicator={<CustomIndicator />} />
  </Accordion.Item>
</Accordion>
```

**Solution:** Show hook-based code in a code block, use static examples for live preview:

```mdx
Show the hook usage in a code block:

\`\`\`tsx
function CustomIndicator() {
  const { isExpanded } = useAccordionItem();
  return <SFIcon name={isExpanded ? "minus" : "plus"} />;
}
\`\`\`

For live preview, use a static indicator:

<ComponentPreview>
  <Accordion.Trigger indicator={<SFIcon name="info" />}>
    Example
  </Accordion.Trigger>
</ComponentPreview>
```

## ComponentPreview

Wrap live examples in `ComponentPreview` with a code string:

```mdx
<ComponentPreview
  title="Example Title"
  code={\`<Component prop="value">
  Children
</Component>\`}
>
  <xhtml.div className="w-full">
    <Component prop="value">
      Children
    </Component>
  </xhtml.div>
</ComponentPreview>
```

### Using xhtml.div

For web compatibility, wrap preview content in `xhtml.div`:

```mdx
import { html as xhtml } from "@/html";

<ComponentPreview>
  <xhtml.div className="w-full">
    {/* Component here */}
  </xhtml.div>
</ComponentPreview>
```

## PropsTable

Document component props with structured data:

```mdx
<PropsTable
  data={[
    {
      name: "value",
      type: "string",
      required: true,
      description: "The controlled value",
    },
    {
      name: "defaultValue",
      type: "string",
      default: '""',
      description: "Initial value for uncontrolled mode",
    },
    {
      name: "onValueChange",
      type: "(value: string) => void",
      description: "Callback when value changes",
    },
  ]}
/>
```

## InstallBlock

Show required npm packages:

```mdx
<InstallBlock packages="@radix-ui/react-accordion" />

// Multiple packages
<InstallBlock packages="@radix-ui/react-accordion lucide-react" />
```

## Code Blocks

Use triple backticks with language for syntax highlighting:

````mdx
```tsx
import { Component } from "@/components/ui/component";

function Example() {
  return <Component />;
}
```
````

## Text Content

Always wrap text in `<Text>` components inside previews:

```mdx
// Wrong - will error on native
<Accordion.Content>
  Plain text here
</Accordion.Content>

// Correct
<Accordion.Content>
  <Text className="text-sf-text-2">
    Text wrapped in Text component
  </Text>
</Accordion.Content>
```
