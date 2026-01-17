# Bacon UI

Personal component library for building iOS-style universal apps with Expo Router. Extends the beautiful components that are built-in to Expo Router for iOS and adds customizable fallbacks for web and Android.

## TODO

- [ ] Convert into more of a docs / gallery for different components.
- [ ] Add web components that mostly noop on native (add desktop later): tooltip, hover-card
- [ ] Fork stack on web to add support for new toolbar API in Expo Router v7. Stack should coordinate with custom tabs automatically to work like the ipad.
- [ ] Add ability for tab bar to group extra links together.
- [ ] Build out gallery + easy copy paste code snippets pages for things like segments.
- [x] Dialog component that is a component API around `alert()`.
- [ ] `popover` which uses a form-sheet on native.
- [ ] Components that are mostly just context menus on native: context-menu, dropdown-menu
- [ ] Echo components: anchor avatar badge button-group button card collapsible drawer label select separator skeleton
- [ ] Input-based components: form input-group input-otp input textarea
- [ ] Expo Router fallbacks: context-menu, sheet, toolbar
- [ ] Chat components: conversation, message, prompt-input, preview, speech to text, image-picker.
- [ ] Add prebuilt UIs as examples: AI chat page, dashboard, commerce page.
- [ ] Create complex `command` palette component.
- [ ] Make something like navigation-menu for web and toolbar + menu items for native.
- [ ] `sonner` component.
- [ ] `map` component.
- [ ] merge themes stuff into expo-router (?)

## Stack

- **Framework**: Expo SDK 54 with Expo Router 6
- **Styling**: Tailwind CSS v4 + react-native-css + NativeWind v5 preview
- **Icons**: expo-symbols (SF Symbols) with fallback to @expo/vector-icons

## Project Structure

```
src/
├── app/              # Expo Router file-based routes
├── components/
│   ├── ui/           # Core UI components (form, switch, segments, etc.)
│   ├── layout/       # Layout components (tabs, stack, modal)
│   ├── runtime/      # Platform utilities (clipboard, local-storage)
│   └── example/      # Example/demo components
├── tw/               # CSS-wrapped primitives (View, Text, Image, etc.)
├── hooks/            # Custom hooks
├── css/              # CSS files (sf.css for Apple system colors)
├── lib/              # Utilities (cn helper)
└── constants/        # Font definitions per platform
```

## Key Patterns

### CSS-Wrapped Components (`src/tw/`)

All base RN components are wrapped with `useCssElement` from react-native-css to enable className support:

```tsx
import { View, Text, TextInput } from "@/tw";
```

### Form Components (`src/components/ui/form.tsx`)

SwiftUI-style List/Section/Item components:

```tsx
<List>
  <Section title="Settings">
    <Text>Label</Text>
    <Toggle value={on} onValueChange={setOn}>
      Toggle
    </Toggle>
    <Link href="/page">Navigate</Link>
  </Section>
</List>
```

### Apple System Colors

Use `sf-` prefixed Tailwind classes that map to iOS system colors:

- `text-sf-text`, `text-sf-text-2`, `text-sf-text-3` - Label hierarchy
- `bg-sf-bg`, `bg-sf-grouped-bg` - Backgrounds
- `text-sf-blue`, `text-sf-red`, etc. - Accent colors
- `border-sf-border` - Separators

Colors use `light-dark()` CSS function and `platformColor()` on iOS for native dynamic colors.

### SF Symbols

```tsx
import { SFIcon } from "@/components/ui/sf-icon";

<SFIcon name="gear" className="text-sf-blue" />;
```

### Platform-Specific Files

Use `.ios.tsx`, `.web.tsx`, `.android.ts` extensions for platform code. Examples:

- `switch.tsx` / `switch.web.tsx`
- `skeleton.tsx` / `skeleton.web.tsx`
- `fonts.ts` / `fonts.web.ts` / `fonts.android.ts`

### Theme Handling

Theme controlled via `color-scheme` CSS property. Add `.light` or `.dark` class to force theme, otherwise follows system preference.

### Path Aliases

```tsx
import { something } from "@/components/ui/something"; // src/components/ui/something
```

## Adding New Components

Follow these guidelines when creating new UI components to ensure consistency across the library.

### File Structure

Each component should have:

1. **Native implementation**: `src/components/ui/{component}.tsx` - Default/native behavior
2. **Web implementation**: `src/components/ui/{component}.web.tsx` - Web-specific with Radix UI primitives
3. **Example page**: `src/app/(index,info)/{component}.tsx` - Demo page with usage examples
4. **Documentation**: `docs/ui/{component}.md` - API reference and usage guide

### Platform Implementation Strategy

| Pattern | Native | Web |
|---------|--------|-----|
| Alerts/Dialogs | `Alert.alert()`, `Alert.prompt()` | Radix UI primitives |
| Tabs/Segments | `@react-native-segmented-control` | Radix Tabs |
| Context Menus | Native context menu APIs | Radix Context Menu |
| Switches | React Native `Switch` | Custom styled component |
| Simple components | Direct implementation | Same or enhanced with hover states |

### Compound Component Pattern

Use React Context for compound components that share state:

```tsx
// 1. Create context
const ComponentContext = createContext<ContextValue | undefined>(undefined);

// 2. Root component provides context
function Component({ children }) {
  const [state, setState] = useState();
  return (
    <ComponentContext value={{ state, setState }}>
      {children}
    </ComponentContext>
  );
}

// 3. Sub-components consume context
function ComponentItem({ children }) {
  const context = use(ComponentContext);
  if (!context) throw new Error("ComponentItem must be used within Component");
  // ...
}

// 4. Attach sub-components as static properties
Component.Item = ComponentItem;
```

### Props Conventions

| Prop | Type | Usage |
|------|------|-------|
| `className` | `string` | Tailwind classes (web styling, use `cn()` helper) |
| `onPress` | `(value?) => void` | Action callbacks (not `onClick`) |
| `asChild` | `boolean` | Radix-style prop merging onto child element |
| `children` | `ReactNode` | Content |
| `value` / `onValueChange` | varies | Controlled component state |
| `defaultValue` | varies | Uncontrolled initial state |

### Styling Guidelines

1. **Use Apple system colors** with `sf-` prefix:
   - Text: `text-sf-text`, `text-sf-text-2`, `text-sf-text-3`
   - Backgrounds: `bg-sf-bg`, `bg-sf-grouped-bg`, `bg-sf-fill`
   - Accents: `text-sf-blue`, `bg-sf-red`, etc.
   - Borders: `border-sf-border`

2. **Web-only styles** use `web:` prefix or only apply in `.web.tsx` files

3. **Use `cn()` helper** for conditional class merging:
   ```tsx
   import { cn } from "@/lib/utils";
   className={cn("base-classes", conditional && "conditional-class", props.className)}
   ```

4. **Import primitives from `@/tw`**:
   ```tsx
   import { View, Text, TextInput } from "@/tw";
   import { Pressable } from "@/tw/touchable";
   ```

### Native Implementation Checklist

- [ ] Use native APIs where available (`Alert`, `SegmentedControl`, etc.)
- [ ] Components render nothing or minimal UI (let native handle presentation)
- [ ] Use `useEffect` to register metadata with parent context
- [ ] Support both controlled (`value`/`onValueChange`) and uncontrolled (`defaultValue`) patterns
- [ ] Extract text from children for native APIs: `extractTextFromChildren()`

### Web Implementation Checklist

- [ ] Use Radix UI primitives for accessibility and behavior
- [ ] Add `data-slot` attributes for styling hooks
- [ ] Include focus-visible styles: `focus-visible:ring-2 focus-visible:ring-sf-blue`
- [ ] Add hover states: `hover:bg-sf-fill`
- [ ] Support animations: `data-[state=open]:animate-in`
- [ ] Use semantic HTML elements

### Documentation Template

Each component's `docs/ui/{component}.md` should include:

1. **Title and description**
2. **Installation** (any required dependencies)
3. **Usage examples** (basic, with callbacks, variants)
4. **API Reference** (table of all props for each sub-component)
5. **Platform Differences** (native vs web behavior)
6. **Accessibility** notes

### Example Page Template

```tsx
export default function ComponentExample() {
  return (
    <ScrollView>
      <View className="mx-auto flex w-full max-w-2xl min-w-0 flex-1 flex-col gap-8 px-4 py-6 md:px-0 lg:py-8">
        <View className="gap-2">
          <Text className="hidden web:visible text-2xl text-sf-text font-bold">
            Component Name
          </Text>
          <Text className="text-sf-text-2">
            Brief description of the component.
          </Text>
        </View>

        {/* Example sections */}
        <View className="gap-4">
          <Text className="text-lg text-sf-text font-semibold">Example Title</Text>
          <View className="flex w-full justify-center items-center p-10 border border-sf-border rounded-lg bg-sf-grouped-bg">
            {/* Component demo */}
          </View>
        </View>
      </View>
    </ScrollView>
  );
}
```

### Dependencies

- **Radix UI**: Install component-specific packages for web implementations
  ```bash
  bun install @radix-ui/react-{component} --legacy-peer-deps
  ```

## Important Notes

- ONLY use bun when installing dependencies. Never use npm.
- Uses React 19 with React Compiler enabled
- New Architecture enabled (`newArchEnabled: true`)
- SVG files are transformed via custom metro transformer (`metro.transformer.js`)
- Web output uses server rendering (`web.output: "server"`)
- Typed routes enabled (`experiments.typedRoutes: true`)

## Browser Automation

Use `agent-browser` for web automation. Run `bunx agent-browser --help` for all commands.

Core workflow:
1. `bunx agent-browser open <url>` - Navigate to page
2. `bunx agent-browser snapshot -i` - Get interactive elements with refs (@e1, @e2)
3. `bunx agent-browser click @e1` / `fill @e2 "text"` - Interact using refs
4. Re-snapshot after page changes

## References

Read these documents when working on specific topics:

| Topic | Document | When to Read |
|-------|----------|--------------|
| CSS/Styling Issues | `docs/references/react-native-css-differences.md` | When Tailwind classes don't work on native, layout issues, sizing problems |
| Testing Native Views | `docs/references/testing-native-views.md` | When debugging native layouts, verifying component dimensions, using xcobra |
