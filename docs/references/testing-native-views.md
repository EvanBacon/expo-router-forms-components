# Testing and Verifying Native Views

This document covers how to test and debug native view layouts using xcobra and the iOS Simulator.

## Using xcobra

xcobra is a CLI tool for inspecting the view hierarchy in the iOS Simulator.

### Get Full View Hierarchy

```bash
bunx xcobra sim xml
```

This outputs the complete XML view hierarchy of the currently running app in the simulator.

### Common Patterns

#### Check Specific View Dimensions

Search for views by their content or component type:

```bash
# Find views containing specific text
bunx xcobra sim xml 2>&1 | grep -A5 "Avatar"

# Find ExpoImage views and their frames
bunx xcobra sim xml 2>&1 | grep "ExpoImage.*frame"

# Find views with specific dimensions
bunx xcobra sim xml 2>&1 | grep "frame=\".*40,40"
```

#### Get Context Around a View

```bash
# Show 5 lines before and after matches
bunx xcobra sim xml 2>&1 | grep -B5 -A5 "ExpoImage"

# Show parent views of a specific element
bunx xcobra sim xml 2>&1 | grep -B10 "frame=\"206,93"
```

### Understanding Frame Values

Frames are formatted as `frame="x,y,width,height"`:

```
frame="186,73.6667,40,40"
       │   │      │  └── height: 40
       │   │      └───── width: 40
       │   └──────────── y position: 73.6667
       └──────────────── x position: 186
```

### Common Issues to Look For

#### Zero Dimensions
```
frame="206,93.6667,0,0"
```
This indicates a view with no size - likely a CSS/styling issue.

#### Massive Dimensions
```
frame="-10755.7,54.6667,21923.3,21923.3"
```
This indicates layout explosion - usually caused by percentage sizing with aspect-ratio.

#### Views Not Nested Correctly
If a child view appears as a sibling in the hierarchy, check if view flattening is occurring.

## Deep Linking to Test Pages

Navigate directly to a specific route in the simulator:

```bash
xcrun simctl openurl booted "exp://127.0.0.1:8081/--/ui/avatar"
```

Replace `/ui/avatar` with your target route.

## Debugging Workflow

1. **Navigate to the page** - Use deep linking or manual navigation
2. **Capture view hierarchy** - Run `bunx xcobra sim xml`
3. **Search for your component** - Grep for component name or expected text
4. **Check dimensions** - Verify frames have expected width/height
5. **Check nesting** - Ensure parent-child relationships are correct
6. **Compare positions** - For overlapping elements, verify x/y positions

## Example: Verifying Avatar Component

```bash
# Check all avatar images have correct 40x40 size
bunx xcobra sim xml 2>&1 | grep "ExpoImage.*frame" | head -10

# Expected output:
# <ExpoImage.ImageView address="0x..." frame="0,0,40,40" layer="CALayer">

# Check avatar group overlaps (8px overlap = 32px spacing for 40px avatars)
bunx xcobra sim xml 2>&1 | grep -A30 "Avatar Group" | grep "RCTViewComponentView.*frame"

# Expected: x positions should differ by 32 (e.g., 154, 186, 218)
```

## Tips

- **Save output to file** for complex analysis:
  ```bash
  bunx xcobra sim xml > /tmp/hierarchy.xml
  ```

- **Use sleep** after navigation before capturing:
  ```bash
  sleep 2 && bunx xcobra sim xml
  ```

- **Filter by component type**:
  ```bash
  bunx xcobra sim xml 2>&1 | grep "RCTViewComponentView\|ExpoImage\|RCTParagraph"
  ```
