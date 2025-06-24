# Expo Router Form components

Template and components that I use in Expo Router apps that are generally optimized for iOS, dark mode, and servers. Main part is the forms which look like Apple's settings app. These should be replaced with proper SwiftUI/Jetpack Compose in the future, but it's still useful to have JS versions for platforms that don't have native support.

https://github.com/user-attachments/assets/e4f007a3-9316-4f3a-a1fd-352d3af60d11

<img src="https://github.com/user-attachments/assets/00903906-c8bf-42d2-81b7-337ba76ea890" width="256px">

<img src="https://github.com/user-attachments/assets/b550f9c1-2e01-4ec3-8050-450c33bfcce7" width="256px">

For best results, just copy the files to another project. Here are the other deps:

```
bunx expo install expo-haptics expo-symbols expo-blur expo-web-browser @bacons/apple-colors vaul @react-native-segmented-control/segmented-control @react-native-community/datetimepicker
```

You can also just bootstrap a project with this repo:

```
bunx create-expo -t https://github.com/EvanBacon/expo-router-forms-components
```

## Stack

Use the correct stack header settings for peak iOS defaults:

```tsx
import Stack from "@/components/ui/Stack";
import ThemeProvider from "@/components/ui/ThemeProvider";

export default function Layout() {
  return (
    <ThemeProvider>
      <Stack
        screenOptions={{
          title: "🥓 Bacon",
        }}
      />
    </ThemeProvider>
  );
}
```

Use `headerLargeTitle: true` to get the large header title.

Use `<Form.Link headerRight>` to add a link to the right side of the header with correct hit size and padding for Forms. The default color will be system blue.

```tsx
<Stack
  screenOptions={{
    title: "🥓 Bacon",
    headerRight: () => (
      <Form.Link headerRight href="/info">
        Info
      </Form.Link>
    ),
  }}
/>
```

This stack uses `vaul` on web to make `modal` look like a native modal.

## Bottom sheet

> Works on web too!

<img src="https://github.com/user-attachments/assets/ff07e563-6802-429f-9cb0-891f0070ec03" width="256px">
<img src="https://github.com/user-attachments/assets/e6c6200f-e03a-41be-99e4-d131a63c1464" width="256px">

You can open routes as a bottom sheet on iOS:

```tsx
<Stack.Screen name="info" sheet />
```

This sets custom options for [React Native Screens](https://github.com/software-mansion/react-native-screens/blob/main/native-stack/README.md#sheetalloweddetents):

```js
{
  presentation: "formSheet",
  gestureDirection: "vertical",
  animation: "slide_from_bottom",
  sheetGrabberVisible: true,
  sheetInitialDetentIndex: 0,
  sheetAllowedDetents: [0.5, 1.0],
}
```

- Use `sheetAllowedDetents` to change the snap points of the sheet.
- Change the corder radius with `sheetCornerRadius: 48`.

## Tabs

The custom tabs adds blurry backgrounds and haptics on iOS. You can also use the shortcut `systemImage` to set the icon.

```tsx
import ThemeProvider from "@/components/ui/ThemeProvider";

import Tabs from "@/components/ui/Tabs";

export default function Layout() {
  return (
    <ThemeProvider>
      <Tabs>
        <Tabs.Screen name="(index)" systemImage="house.fill" title="Home" />
        <Tabs.Screen name="(info)" systemImage="brain.fill" title="Info" />
      </Tabs>
    </ThemeProvider>
  );
}
```

## Forms

Start lists with a `<Form.List>` and add sections with `<Form.Section>`. Setting `navigationTitle="Settings"` will update the title of the stack header.

```tsx
<Form.List navigationTitle="Settings">
  <Form.Section title="Developer">
    <Form.Link target="_blank" href="https://evanbacon.dev">
      Evan Bacon
    </Form.Link>
    <Form.Link href="https://evanbacon.dev">Evan Bacon in browser</Form.Link>
  </Form.Section>
</Form.List>
```

<details>
  <summary>Internals</summary>

Form list is a wrapper around a scroll view with some extra styles and helpers.

```tsx
<BodyScrollView
  contentContainerStyle={{
    padding: 16,
    gap: 24,
  }}
>
  <Form.Section title="Developer">
    <Form.Link target="_blank" href="https://evanbacon.dev">
      Evan Bacon
    </Form.Link>
    <Form.Link href="https://evanbacon.dev">Evan Bacon in browser</Form.Link>
  </Form.Section>
</BodyScrollView>
```

</details>

## Form Sections

All top-level children will become items.

Add `title` and `footer` to a section. These can be strings or React nodes.

```tsx
import * as AC from "@bacons/apple-colors";

<Form.Section
  title="Header"
  footer={
    <Text>
      Help improve Search by allowing Apple to store the searches you enter into
      Safari, Siri, and Spotlight in a way that is not linked to you.{"\n\n"}
      Searches include lookups of general knowledge, and requests to do things like
      play music and get directions.{"\n"}
      <Link style={{ color: AC.link }} href="/two">
        About Search & Privacy...
      </Link>
    </Text>
  }
>
  <Text>Default</Text>
</Form.Section>;
```

## Form Items

- `Form.Text` has extra types for `hint` and custom styles to have adaptive colors for dark mode. The font size is also larger to match the Apple defaults.
- Adds the `systemImage` prop to append an SF Symbol icon before the text. The color of this icon will adopt the color of the text style.

```tsx
<Form.Text>Hey</Form.Text>
```

Add a hint to the right-side of the form item:

```tsx
<Form.Text hint="right">Left</Form.Text>
```

Add a custom press handler to the form item:

```tsx
<Form.Text
  onPress={() => {
    console.log("Pressed");
  }}
>
  Press me
</Form.Text>
```

You can also use `<Button />` from React Native similar to SwiftUI:

```tsx
<Button title="Open" onPress={() => console.log("Pressed")} />
```

## Form Link

Open with in-app browser using `target="_blank"` (only works when the `href` is an external URL):

```tsx
<Form.Link target="_blank" href="https://evanbacon.dev">
  Evan Bacon
</Form.Link>
```

Add a hint to the right-side of the form item:

```tsx
<Form.Link hint="123" href="/foo">
  Evan Bacon
</Form.Link>
```

Alternatively, use an HStack-type system instead of the `hint` hack:

```tsx
<Form.HStack>
  <Form.Text>Foo</Form.Text>
  <View style={{ flex: 1 }} />
  <Form.Text style={Form.FormFont.secondary}>Bar</Form.Text>
</Form.HStack>
```

Add a quick icon before the text:

```tsx
<Form.Link href="/two" systemImage="person.fill.badge.plus">
  Evan Bacon
</Form.Link>
```

Customize the color, size, etc:

```tsx
<Form.Link
  href="/two"
  systemImage={{
    name: "person.fill.badge.plus",
    color: AC.systemBlue,
    size: 128,
  }}
>
  Evan Bacon
</Form.Link>
```

## Hint and wrapping

Beautifully display a key/value pair with the `hint=""` property. This can also be created manually for extra customization.

<img width="409" alt="Screenshot 2025-02-02 at 9 37 09 PM" src="https://github.com/user-attachments/assets/fd057783-1b76-4317-9425-cc0aae0baf97" />

The key here is to use `flexShrink` to support floating to the right, then wrapping correctly when the text gets too long.

Use `flexWrap` to position the text below the title when it gets too long instead of shifting the title down vertically.

```tsx
<Form.Section title="Right text">
  <Form.Text hint="Long hint with extra content that should float below the content">
    Hint
  </Form.Text>

  {/* Custom */}
  <Form.HStack>
    <Form.Text>Opening</Form.Text>
    {/* Spacer */}
    <View style={{ flex: 1 }} />
    {/* Right */}
    <Form.Text style={{ flexShrink: 1, color: AC.secondaryLabel }}>
      Long list of text that should wrap around when it gets too long
    </Form.Text>
  </Form.HStack>

  {/* Custom with wrap-below */}
  <Form.HStack style={{ flexWrap: "wrap" }}>
    <Form.Text>Opening</Form.Text>
    {/* Spacer */}
    <View style={{ flex: 1 }} />
    {/* Right */}
    <Form.Text style={{ flexShrink: 1, color: AC.secondaryLabel }}>
      Long list of text that should wrap around when it gets too long
    </Form.Text>
  </Form.HStack>
</Form.Section>
```

## Form Description and Item

Add a list item with an image and text + description combo:

```tsx
<Form.HStack style={{ gap: 16 }}>
  <Image
    source={{ uri: "https://github.com/evanbacon.png" }}
    style={{
      aspectRatio: 1,
      height: 48,
      borderRadius: 999,
    }}
  />
  <View style={{ gap: 4 }}>
    <Form.Text>Evan's iPhone</Form.Text>
    <Form.Text style={Form.FormFont.caption}>This iPhone 16 Pro Max</Form.Text>
  </View>

  {/* Spacer */}
  <View style={{ flex: 1 }} />

  <Image source="sf:person.fill.badge.plus" size={24} />
</Form.HStack>
```

Create a linkable version like this:

```tsx
<Form.Link href="/two">
  <View style={{ gap: 4 }}>
    <Form.Text>Evan's iPhone</Form.Text>
    <Form.Text style={Form.FormFont.caption}>This iPhone 16 Pro Max</Form.Text>
  </View>
</Form.Link>
```

## Toggle

You can add a toggle/switch item using the `Form.Toggle` component (extends `Form.Text`):

```tsx
const [on, setOn] = useState(false);

return (
  <Form.Toggle value={on} onValueChange={setOn}>
    Wi-Fi
  </Form.Toggle>
);
```

This is similar to using the `Switch` component as a `hint` on text but with reduced padding:

```tsx
<Form.Section itemStyle={{ paddingVertical: 8 }}>
  <Form.Text hint={<Switch value={on} onValueChange={setOn} />}>
    Wi-Fi
  </Form.Text>
</Form.Section>
```

I've added a fork of React Native Web's `Switch` which looks more like iOS than the old Material design. This makes it a bit easier to change the theme.

```tsx
import { Switch } from "@components/ui/Switch";
```

## Date picker

> Web not supported.

Select dates and time using the `Form.DatePicker` component (extends `Form.Text`):

```tsx
<Form.DatePicker value={new Date()} onChange={(e) => e.nativeEvent.timestamp}>
  Birthday
</Form.DatePicker>
```

Select time:

```tsx
<Form.DatePicker value={new Date()} mode="time">
  Schedule a time
</Form.DatePicker>
```

Select both date and time (iOS only):

```tsx
<Form.DatePicker value={new Date()} mode="datetime">
  Schedule a time
</Form.DatePicker>
```

Make it look cool and monochrome with: `accentColor={AC.label}`

## Text Input

Both of the following yield similar results. Dark/light theme, correct padding and font sizes for text inputs.

```tsx
<Form.Section>
  <TextInput placeholder="First name" />
  <Form.TextField placeholder="Last name" />
</Form.Section>
```

## List Style

The default `listStyle` is `"auto"` but you can access the old-style with `"grouped"`:

```tsx
<Form.List listStyle="grouped">
  <Form.Section title="Developer">
    <Form.Link target="_blank" href="https://evanbacon.dev">
      Evan Bacon
    </Form.Link>
  </Form.Section>
</Form.List>
```

![Simulator Screenshot - iPhone 16 - 2025-02-02 at 22 12 25](https://github.com/user-attachments/assets/30ce1836-117c-4989-ac59-f4359766ba8b)

## Refreshing

Data fetching can be done by using the nearest `Form.List` for pull-to-refresh functionality.

```tsx
function App() {
  return (
    <Form.List>
      <Data />
    </Form.List>
  );
}

function Data() {
  const [data, setData] = useState(
    // Read some cached data if any exists.
    () => localStorage.getItem("data")
  );

  // This will be called when the user pulls to refresh.
  Form.useListRefresh(async () => {
    // Perform data fetching...
    const data = await fetchData();
    localStorage.setItem("data", data);
    setData(data);
  });

  return <Text>Data</Text>;
}
```

You can trigger the refresh programmatically with the callback from `Form.useListRefresh()`:

```tsx
const refresh = Form.useListRefresh();

// Register a button to refresh the list...
<Stack.Screen
  options={{
    headerRight: () => (
      <Form.Text bold onPress={refresh}>
        Refresh
      </Form.Text>
    ),
  }}
/>;
```

This primitive can be extended to create comprehensive refreshing per-list.

## Colors

Be sure to use `@bacons/apple-colors` for high-quality P3 colors.

## Icons

Use the `Image` component to use Apple's SF Symbols.

```tsx
import { Image } from "@/components/ui/img";

<Image source="sf:star" size={24} tintColor={AC.systemBlue} />;
```

The `<Image />` component is a wrapper around the `expo-image` package which supports SF Symbols and SVGs. The SF symbols must be prefixed with `sf:` to load them correctly. Use `size` to set the font size of the symbol, and `tintColor` to set the color of the symbol.

## Status Bar

Avoid using `<StatusBar>` on iOS as the system has built-in support for changing the color better than most custom solutions. Enable OS-changing with:

```js
{
  "expo": {
    "userInterfaceStyle": "automatic",
    "ios": {
      "infoPlist": {
        "UIViewControllerBasedStatusBarAppearance": true,
      }
    }
  }
}
```

> This won't work as expected in Expo Go. Use a dev client to understand the behavior better.

## Segments

<img src="https://github.com/user-attachments/assets/9d8990a9-2852-48c2-9097-50e8632d9704" width="256px"> 
<img src="https://github.com/user-attachments/assets/4677a69e-4ec7-4f2f-b539-babc9d907998" width="256px">

> `npx expo install @react-native-segmented-control/segmented-control`

For tabbed content that doesn't belong in the router, use the `Segment` component:

```tsx
import {
  Segments,
  SegmentsList,
  SegmentsContent,
  SegmentsTrigger,
} from "@/components/ui/Segments";

export default function Page() {
  return (
    <Segments defaultValue="account">
      <SegmentsList>
        <SegmentsTrigger value="account">Account</SegmentsTrigger>
        <SegmentsTrigger value="password">Password</SegmentsTrigger>
      </SegmentsList>

      <SegmentsContent value="account">
        <Text>Account Section</Text>
      </SegmentsContent>
      <SegmentsContent value="password">
        <Text>Password Section</Text>
      </SegmentsContent>
    </Segments>
  );
}
```

This can be used with React Server Components as the API is entirely declarative.

## Toggle

<img src="https://github.com/user-attachments/assets/d5e3f9b4-2fdb-453e-9acb-0d77539ca1ed" width="256px"> 
<img src="https://github.com/user-attachments/assets/ad13d3a8-0c51-4408-8890-3bb3b5444f80" width="256px">

Add a toggle switch item using `hint` and `Switch` from React Native:

```tsx
<Form.Text hint={<Switch />}>Label</Form.Text>
```

You can also build the item manually for more customization:

```tsx
<Form.HStack>
  <Form.Text>Label</Form.Text>
  <View style={{ flex: 1 }} />
  <Switch />
</Form.HStack>
```

## Content Unavailable

> Similar to SwiftUI's [`ContentUnavailableView`](https://developer.apple.com/documentation/swiftui/contentunavailableview).

https://github.com/user-attachments/assets/6f3b7baa-3c65-4959-8b84-b585045ef03e

For empty states, use the `<ContentUnavailable />` component.

There are three main uses:

1. No search results: `<ContentUnavailable search />`. Use search as a string to show the invalid query `<ContentUnavailable search="my query" />`.
2. No internet connection: `<ContentUnavailable internet />`. This shows an animated no connection screen.
3. Everything else. Use `title`, `description`, and `systemImage` to customize the message. `<ContentUnavailable title="No content" systemImage="car" description="Could not find car" />`

Other info:

- The `systemImage` can be the name of an SF Symbol or a React node. This is useful for custom/animated icons.
- `actions` can be provided for a list of buttons to render under the content, e.g. `<ContentUnavailable internet actions={<Button title="Refresh" />} />`

## Font Loading

This project uses a custom suspensy font loading system to show a fallback screen while the fonts are loading. Fonts are only async in development when connected to a server, in production they are embedded in the app.

```tsx
<Suspense fallback={<SplashFallback />}>
  <AsyncFont src={SourceCodePro_400Regular} fontFamily="Source Code Pro" />
  <Stack />
</Suspense>
```

## SVG Loading

The `metro.config.js` is configured to load SVGs as React components. This ensures they are optimized for web / native / React Server Components. I'd prefer if Metro had support for import qualifiers like `import SVGImage from "./image.svg?jsx"`, so we could still use SVGs as assets for `expo-image`, but this is a good workaround for now.
