---
name: universal-links
description: Set up and test universal links for iOS using setup-safari
---

Use `bunx setup-safari` to configure and test universal links (deep links) on iOS.

## Important: When Custom Builds Are Needed

**Universal links with custom domains require custom native builds.** Your app will no longer work in Expo Go.

However, for basic deep linking during development:

- **Expo Go supports** the `exp://` URL scheme and Expo-hosted URLs
- **Custom builds required** for your own domain's universal links (applinks:yourdomain.com)

If you only need deep linking for development/testing, try `npx expo start` with Expo Go first. Only create custom builds when you need production universal links with your own domain.

## Automated Setup (Recommended)

Run setup-safari with your Apple ID to automate credential lookup:

```bash
EXPO_APPLE_ID="your-apple-id@email.com" bunx setup-safari
```

This will:

1. Authenticate with Apple Developer Portal
2. Enable Associated Domains for your bundle ID
3. Output the AASA file content and meta tag

**After running, you must manually:**

### 1. Create the AASA file

Create `public/.well-known/apple-app-site-association` (no file extension):

```json
{
  "applinks": {
    "details": [
      {
        "appIDs": ["TEAM_ID.com.your.bundleid"],
        "components": [
          {
            "/": "*",
            "comment": "Matches all routes"
          }
        ]
      }
    ]
  },
  "activitycontinuation": {
    "apps": ["TEAM_ID.com.your.bundleid"]
  },
  "webcredentials": {
    "apps": ["TEAM_ID.com.your.bundleid"]
  }
}
```

### 2. Create src/app/+html.tsx with Smart App Banner

```tsx
import { ScrollViewStyleReset } from "expo-router/html";

export default function Root({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <head>
        <meta charSet="utf-8" />
        <meta httpEquiv="X-UA-Compatible" content="IE=edge" />
        <meta
          name="viewport"
          content="width=device-width, initial-scale=1, shrink-to-fit=no"
        />
        <meta name="apple-itunes-app" content="app-id=YOUR_ITUNES_ID" />
        <ScrollViewStyleReset />
      </head>
      <body>{children}</body>
    </html>
  );
}
```

### 3. Add Associated Domains to app.json

```json
{
  "expo": {
    "ios": {
      "associatedDomains": [
        "applinks:yourdomain.com",
        "activitycontinuation:yourdomain.com",
        "webcredentials:yourdomain.com"
      ]
    }
  }
}
```

### 4. Deploy and Rebuild

```bash
# Deploy web (AASA file must be accessible)
npx expo export -p web && npx eas-cli deploy

# Rebuild iOS app with new entitlements
npx expo run:ios
# Or for TestFlight: npx testflight
```

## Interactive Setup (Alternative)

For interactive mode (requires TTY):

```bash
bunx setup-safari
```

## How Universal Links Work

Universal links require two parts:

1. **AASA file on your server** - Tells iOS which paths your app handles
2. **Associated Domains entitlement** - Tells your app which domains to claim

## AASA File Format

Host at `https://yourdomain.com/.well-known/apple-app-site-association`:

```json
{
  "applinks": {
    "apps": [],
    "details": [
      {
        "appID": "TEAM_ID.com.example.app",
        "paths": ["*"]
      }
    ]
  }
}
```

Path patterns:

- `*` - Match all paths
- `/products/*` - Match paths starting with /products/
- `/item/???` - Match exactly 3 characters after /item/
- `NOT /admin/*` - Exclude paths

## Associated Domains Entitlement

In your `app.json` or `app.config.js`:

```json
{
  "expo": {
    "ios": {
      "associatedDomains": [
        "applinks:yourdomain.com",
        "applinks:www.yourdomain.com"
      ]
    }
  }
}
```

## Testing Universal Links

After setup, test with setup-safari:

```bash
npx setup-safari
```

Or manually test in Safari:

1. Open Safari on iOS device/simulator
2. Navigate to a URL that should open your app
3. Pull down to reveal the banner, or long-press the link

## Testing with Tunnel (No Server Required)

Test universal links without deploying a website using Expo's tunnel feature:

1. **Set a consistent tunnel subdomain:**

```bash
export EXPO_TUNNEL_SUBDOMAIN=my-app-name
```

2. **Configure associated domains with the ngrok URL:**

```json
{
  "expo": {
    "ios": {
      "associatedDomains": ["applinks:my-app-name.ngrok.io"]
    }
  }
}
```

3. **Build the development client:**

```bash
npx expo run:ios
```

4. **Start the dev server with tunnel:**

```bash
npx expo start --tunnel
```

5. **Test the link** - Type `https://my-app-name.ngrok.io` in Safari on your device. It should open your app directly.

The tunnel creates a public HTTPS URL that serves the AASA file automatically, letting you test the full universal links flow during development.

## Debugging

Check if Apple has cached your AASA:

```bash
curl "https://app-site-association.cdn-apple.com/a/v1/yourdomain.com"
```

Validate AASA file format:

```bash
curl https://yourdomain.com/.well-known/apple-app-site-association | jq
```

Common issues:

- AASA must be served with `Content-Type: application/json`
- HTTPS required (no self-signed certs)
- Apple caches AASA files - changes may take time to propagate

## Expo Router Integration

With Expo Router, handle incoming links automatically:

```tsx
// app/[...path].tsx handles all deep link paths
// app/products/[id].tsx handles /products/:id links
```

Access link parameters:

```tsx
import { useLocalSearchParams } from "expo-router";

export default function Product() {
  const { id } = useLocalSearchParams();
  return <Text>Product: {id}</Text>;
}
```
