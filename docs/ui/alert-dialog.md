# Alert Dialog

A modal dialog that interrupts the user with important content and expects a response. Uses native `Alert.alert()` on iOS/Android and a styled Radix UI dialog on web.

## Installation

```bash
npm install @radix-ui/react-alert-dialog
```

## Usage

```tsx
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogInput,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
```

### Basic Example

```tsx
<AlertDialog>
  <AlertDialogTrigger className="px-4 py-2 rounded-lg border border-sf-border bg-sf-bg">
    Show Dialog
  </AlertDialogTrigger>
  <AlertDialogContent>
    <AlertDialogHeader>
      <AlertDialogTitle>Are you absolutely sure?</AlertDialogTitle>
      <AlertDialogDescription>
        This action cannot be undone. This will permanently delete your
        account and remove your data from our servers.
      </AlertDialogDescription>
    </AlertDialogHeader>
    <AlertDialogFooter>
      <AlertDialogCancel>Cancel</AlertDialogCancel>
      <AlertDialogAction>Continue</AlertDialogAction>
    </AlertDialogFooter>
  </AlertDialogContent>
</AlertDialog>
```

### With Callbacks

```tsx
<AlertDialog>
  <AlertDialogTrigger>Save Changes</AlertDialogTrigger>
  <AlertDialogContent>
    <AlertDialogHeader>
      <AlertDialogTitle>Save Changes?</AlertDialogTitle>
      <AlertDialogDescription>
        Do you want to save your changes before leaving?
      </AlertDialogDescription>
    </AlertDialogHeader>
    <AlertDialogFooter>
      <AlertDialogCancel onPress={() => console.log("Cancelled")}>
        Don't Save
      </AlertDialogCancel>
      <AlertDialogAction onPress={() => console.log("Saved!")}>
        Save
      </AlertDialogAction>
    </AlertDialogFooter>
  </AlertDialogContent>
</AlertDialog>
```

### Destructive Action

Use `AlertDialogDestructive` for dangerous actions like delete operations.

```tsx
import { AlertDialogDestructive } from "@/components/ui/alert-dialog";

<AlertDialog>
  <AlertDialogTrigger>Delete Account</AlertDialogTrigger>
  <AlertDialogContent>
    <AlertDialogHeader>
      <AlertDialogTitle>Delete Account</AlertDialogTitle>
      <AlertDialogDescription>
        Are you sure you want to delete your account? This action is
        permanent and cannot be reversed.
      </AlertDialogDescription>
    </AlertDialogHeader>
    <AlertDialogFooter>
      <AlertDialogCancel>Cancel</AlertDialogCancel>
      <AlertDialogDestructive onPress={() => deleteAccount()}>
        Delete
      </AlertDialogDestructive>
    </AlertDialogFooter>
  </AlertDialogContent>
</AlertDialog>
```

### Prompt with Text Input

Add `AlertDialogInput` to collect text input from the user. On iOS, this uses the native `Alert.prompt()` API.

```tsx
<AlertDialog>
  <AlertDialogTrigger>Rename Item</AlertDialogTrigger>
  <AlertDialogContent>
    <AlertDialogHeader>
      <AlertDialogTitle>Rename</AlertDialogTitle>
      <AlertDialogDescription>
        Enter a new name for this item.
      </AlertDialogDescription>
    </AlertDialogHeader>
    <AlertDialogInput
      placeholder="Enter name..."
      defaultValue="My Item"
    />
    <AlertDialogFooter>
      <AlertDialogCancel>Cancel</AlertDialogCancel>
      <AlertDialogAction onPress={(value) => console.log("New name:", value)}>
        Rename
      </AlertDialogAction>
    </AlertDialogFooter>
  </AlertDialogContent>
</AlertDialog>
```

### Secure Text Input (Password)

Use `type="secure-text"` for password inputs.

```tsx
<AlertDialog>
  <AlertDialogTrigger>Enter Password</AlertDialogTrigger>
  <AlertDialogContent>
    <AlertDialogHeader>
      <AlertDialogTitle>Authentication Required</AlertDialogTitle>
      <AlertDialogDescription>
        Please enter your password to continue.
      </AlertDialogDescription>
    </AlertDialogHeader>
    <AlertDialogInput
      type="secure-text"
      placeholder="Password"
    />
    <AlertDialogFooter>
      <AlertDialogCancel>Cancel</AlertDialogCancel>
      <AlertDialogAction onPress={(password) => authenticate(password)}>
        Authenticate
      </AlertDialogAction>
    </AlertDialogFooter>
  </AlertDialogContent>
</AlertDialog>
```

### Controlled State

Control the dialog open state externally.

```tsx
const [open, setOpen] = useState(false);

<AlertDialog open={open} onOpenChange={setOpen}>
  <AlertDialogContent>
    <AlertDialogHeader>
      <AlertDialogTitle>Controlled Dialog</AlertDialogTitle>
    </AlertDialogHeader>
    <AlertDialogFooter>
      <AlertDialogAction>OK</AlertDialogAction>
    </AlertDialogFooter>
  </AlertDialogContent>
</AlertDialog>

<Button onPress={() => setOpen(true)}>Open Dialog</Button>
```

## API Reference

### AlertDialog

The root component that provides context for the dialog.

| Prop | Type | Default | Description |
|------|------|---------|-------------|
| `open` | `boolean` | - | Controlled open state |
| `onOpenChange` | `(open: boolean) => void` | - | Callback when open state changes |
| `children` | `ReactNode` | - | Dialog content |

### AlertDialogTrigger

The button that opens the dialog.

| Prop | Type | Default | Description |
|------|------|---------|-------------|
| `asChild` | `boolean` | `false` | Merge props onto child element |
| `className` | `string` | - | CSS classes for styling |
| `children` | `ReactNode` | - | Trigger content |

### AlertDialogContent

Container for the dialog content. On native, this renders children to collect metadata. On web, this renders the actual modal.

| Prop | Type | Default | Description |
|------|------|---------|-------------|
| `className` | `string` | - | CSS classes for styling (web only) |
| `children` | `ReactNode` | - | Dialog content |

### AlertDialogHeader

Container for title and description.

| Prop | Type | Default | Description |
|------|------|---------|-------------|
| `className` | `string` | - | CSS classes for styling (web only) |
| `children` | `ReactNode` | - | Header content |

### AlertDialogFooter

Container for action buttons.

| Prop | Type | Default | Description |
|------|------|---------|-------------|
| `className` | `string` | - | CSS classes for styling (web only) |
| `children` | `ReactNode` | - | Footer content |

### AlertDialogTitle

The title of the dialog.

| Prop | Type | Default | Description |
|------|------|---------|-------------|
| `className` | `string` | - | CSS classes for styling (web only) |
| `children` | `ReactNode` | - | Title text |

### AlertDialogDescription

The description/message of the dialog.

| Prop | Type | Default | Description |
|------|------|---------|-------------|
| `className` | `string` | - | CSS classes for styling (web only) |
| `children` | `ReactNode` | - | Description text |

### AlertDialogInput

Text input field for prompt dialogs.

| Prop | Type | Default | Description |
|------|------|---------|-------------|
| `type` | `"plain-text" \| "secure-text" \| "login-password"` | `"plain-text"` | Input type |
| `defaultValue` | `string` | - | Initial value |
| `placeholder` | `string` | - | Placeholder text (web only) |
| `keyboardType` | `KeyboardTypeOptions` | - | Keyboard type (native only) |
| `className` | `string` | - | CSS classes for styling (web only) |

### AlertDialogAction

Primary action button.

| Prop | Type | Default | Description |
|------|------|---------|-------------|
| `onPress` | `(value?: string) => void` | - | Callback when pressed. Receives input value if `AlertDialogInput` is present. |
| `className` | `string` | - | CSS classes for styling (web only) |
| `children` | `ReactNode` | - | Button text |

### AlertDialogCancel

Cancel/dismiss button.

| Prop | Type | Default | Description |
|------|------|---------|-------------|
| `onPress` | `(value?: string) => void` | - | Callback when pressed. Receives input value if `AlertDialogInput` is present. |
| `className` | `string` | - | CSS classes for styling (web only) |
| `children` | `ReactNode` | - | Button text |

### AlertDialogDestructive

Destructive action button (styled in red).

| Prop | Type | Default | Description |
|------|------|---------|-------------|
| `onPress` | `(value?: string) => void` | - | Callback when pressed. Receives input value if `AlertDialogInput` is present. |
| `className` | `string` | - | CSS classes for styling (web only) |
| `children` | `ReactNode` | - | Button text |

## Platform Differences

### Native (iOS/Android)

- Uses React Native's `Alert.alert()` API
- When `AlertDialogInput` is present, uses `Alert.prompt()` on iOS
- Button styles (`cancel`, `destructive`, `default`) are rendered natively
- `className` props on content components have no effect
- Dialog appears as a native system alert

### Web

- Uses Radix UI's AlertDialog primitives
- Renders a styled modal with backdrop
- Full support for `className` styling
- `AlertDialogInput` renders as a styled HTML input
- Supports animations via Tailwind CSS

## Accessibility

- On web, the dialog traps focus and can be dismissed with Escape
- Screen readers announce the dialog title and description
- Action buttons are properly labeled
- Native alerts inherit platform accessibility features
