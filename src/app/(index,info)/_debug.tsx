import "@/components/runtime/local-storage";
import "@/components/runtime/clipboard";

import * as Form from "@/components/ui/form";
import Constants, { ExecutionEnvironment } from "expo-constants";

import { IconSymbol } from "@/components/ui/icon-symbol";
import * as AC from "@bacons/apple-colors";
import * as Updates from "expo-updates";
import { ActivityIndicator, Linking, View } from "react-native";

import * as Application from "expo-application";
import { router } from "expo-router";
import { useEffect, useState } from "react";

const ENV_SUPPORTS_OTA =
  process.env.EXPO_OS !== "web" &&
  typeof window !== "undefined" &&
  Constants.executionEnvironment !== ExecutionEnvironment.StoreClient;

export default function DebugRoute() {
  return (
    <Form.List navigationTitle="Debug">
      <AppStoreSection />
      <ExpoSection />

      <Form.Section title="Views">
        <Form.Link href="/_sitemap">/_sitemap</Form.Link>
        {process.env.EXPO_OS !== "web" && (
          <Form.Text
            onPress={() => Linking.openSettings()}
            hint={<IconSymbol name="gear" color={AC.secondaryLabel} />}
          >
            Open System Settings
          </Form.Text>
        )}
      </Form.Section>

      <OTADynamicSection />
      <OTASection />
    </Form.List>
  );
}

// Async function to get App Store link by bundle ID, with caching
async function getAppStoreLink(bundleId: string) {
  // Check cache first
  const cachedLink = localStorage.getItem(`appStoreLink_${bundleId}`);
  if (cachedLink) {
    console.log(`Returning cached App Store link for ${bundleId}`);
    return cachedLink;
  }

  // Make API call to iTunes Search API
  const response = await fetch(
    `https://itunes.apple.com/lookup?bundleId=${encodeURIComponent(bundleId)}`
  );

  // Check if response is OK
  if (!response.ok) {
    throw new Error(
      `Failed to query App Store URL. Status: ${response.status}`
    );
  }

  const data = await response.json();

  // Validate API response
  if (data.resultCount === 0 || !data.results[0]?.trackId) {
    throw new Error(`No app found for bundle ID on App Store: ${bundleId}`);
  }

  // Extract App ID and construct App Store link
  const appId = data.results[0].trackId;
  const appStoreLink = `https://apps.apple.com/app/id${appId}`;

  // Cache the successful result
  localStorage.setItem(`appStoreLink_${bundleId}`, appStoreLink);
  console.log(`Cached App Store link for ${bundleId}`);

  return appStoreLink;
}

async function getStoreUrlAsync() {
  if (process.env.EXPO_OS === "ios") {
    return await getAppStoreLinkAsync();
  } else if (process.env.EXPO_OS === "android") {
    return `https://play.google.com/store/apps/details?id=${Application.applicationId}`;
  }
  return null;
}

async function getAppStoreLinkAsync() {
  if (process.env.EXPO_OS !== "ios") {
    return null;
  }
  try {
    const link = await getAppStoreLink(Application.applicationId!);
    return link;
  } catch (error: any) {
    console.error("Error fetching App Store link:", error);
    alert(error.message);
    return null;
  }
}

function AppStoreSection() {
  const [canOpenStore, setCanOpenStore] = useState(true);
  if (process.env.EXPO_OS === "web") {
    return null;
  }

  return (
    <Form.Section
      title={process.env.EXPO_OS === "ios" ? "App Store" : "Play Store"}
    >
      <Form.Text
        hint={`${Application.nativeApplicationVersion} (${Application.nativeBuildVersion})`}
        onPress={async () => {
          const appStoreLink = await getStoreUrlAsync();
          setCanOpenStore(!!appStoreLink);
          console.log("App Store link:", appStoreLink);
          if (appStoreLink) {
            // @ts-ignore: external URL
            router.push(appStoreLink);
          }
        }}
        style={{ color: AC.systemBlue }}
      >
        {canOpenStore ? `Check for app updates` : "App not available"}
      </Form.Text>
      <Form.Text hint={Application.applicationId}>
        {process.env.EXPO_OS === "ios" ? `Bundle ID` : "App ID"}
      </Form.Text>
    </Form.Section>
  );
}

function ExpoSection() {
  const sdkVersion = (() => {
    const current = Constants.expoConfig?.sdkVersion;
    if (current && current.includes(".")) {
      return current.split(".").shift();
    }
    return current ?? "unknown";
  })();

  const [envName, setEnvName] = useState<string | null>(null);
  useEffect(() => {
    getReleaseTypeAsync().then((name) => {
      setEnvName(name);
    });
  }, []);

  const hermes = getHermesVersion();

  return (
    <>
      <Form.Section title="Expo" titleHint={`SDK ${sdkVersion}`}>
        <Form.Text hint={envName}>Environment</Form.Text>
        {hermes && <Form.Text hint={hermes}>Hermes</Form.Text>}
        <Form.Text hint={__DEV__ ? "development" : "production"}>
          Mode
        </Form.Text>
      </Form.Section>
      <Form.Section>
        <Form.Link
          systemImage={"aqi.medium"}
          target="_blank"
          style={{ color: AC.systemBlue }}
          onLongPress={() => {
            navigator.clipboard.writeText(getDeploymentUrl());
            alert("Copied to clipboard");
          }}
          href={getDeploymentUrl()}
        >
          Expo Dashboard
        </Form.Link>
      </Form.Section>

      <Form.Section footer="Embedded origin URL that Expo Router uses to invoke React Server Functions. This should be hosted and available to the client.">
        <Form.Text hint={window.location?.href}>Host</Form.Text>
      </Form.Section>
    </>
  );
}

function OTADynamicSection() {
  if (process.env.EXPO_OS === "web") {
    return null;
  }
  const updates = Updates.useUpdates();

  const fetchingTitle = updates.isDownloading
    ? `Downloading...`
    : updates.isChecking
    ? `Checking for updates...`
    : updates.isUpdateAvailable
    ? "Reload app"
    : "Check again";

  const checkError = updates.checkError;
  // const checkError = new Error(
  //   "really long error name that hs sefsef sef sef sefsef sef eorhsoeuhfsef fselfkjhslehfse f"
  // ); // updates.checkError;

  const lastCheckTime = (
    updates.lastCheckForUpdateTimeSinceRestart
      ? new Date(updates.lastCheckForUpdateTimeSinceRestart)
      : new Date()
  ).toLocaleString("en-US", {
    timeZoneName: "short",
    dateStyle: "short",
    timeStyle: "short",
  });

  const isLoading = updates.isChecking || updates.isDownloading;
  return (
    <>
      <Form.Section
        title={
          !updates.availableUpdate ? "Synchronized ✓" : "Needs synchronization"
        }
        titleHint={isLoading ? <ActivityIndicator animating /> : lastCheckTime}
      >
        <Form.Text
          style={{
            color:
              updates.availableUpdate || !isLoading ? AC.systemBlue : AC.label,
          }}
          onPress={() => {
            if (__DEV__ && !ENV_SUPPORTS_OTA) {
              alert("OTA updates are not available in the Expo Go app.");
              return;
            }
            if (updates.availableUpdate) {
              Updates.reloadAsync();
            } else {
              Updates.checkForUpdateAsync();
            }
          }}
          hint={
            isLoading ? (
              <ActivityIndicator animating />
            ) : (
              <IconSymbol name="arrow.clockwise" color={AC.secondaryLabel} />
            )
          }
        >
          {fetchingTitle}
        </Form.Text>
        {checkError && (
          <Form.HStack style={{ flexWrap: "wrap" }}>
            <Form.Text style={{ color: AC.systemRed }}>
              Error checking status
            </Form.Text>
            {/* Spacer */}
            <View style={{ flex: 1 }} />
            {/* Right */}
            <Form.Text style={{ flexShrink: 1, color: AC.secondaryLabel }}>
              {checkError.message}
            </Form.Text>
          </Form.HStack>
        )}
      </Form.Section>
    </>
  );
}

function OTASection() {
  return (
    <>
      <Form.Section title="Current Update">
        <Form.Text hint={Updates.runtimeVersion}>Runtime version</Form.Text>
        <Form.Text hint={Updates.channel}>Channel</Form.Text>
        <Form.Text
          hint={(Updates.createdAt ?? new Date()).toLocaleString("en-US", {
            timeZoneName: "short",
          })}
        >
          Created
        </Form.Text>
        <Form.Text hintBoolean={Updates.isEmbeddedLaunch}>Embedded</Form.Text>
        <Form.Text hintBoolean={Updates.isEmergencyLaunch}>
          Emergency Launch
        </Form.Text>
        <Form.Text hint={String(Updates.launchDuration?.toFixed(0)) + "ms"}>
          Launch Duration
        </Form.Text>
        <Form.Text hint={Updates.updateId ?? "[none]"}>ID</Form.Text>
      </Form.Section>
    </>
  );
}

function getHermesVersion() {
  // @ts-expect-error
  const HERMES_RUNTIME = global.HermesInternal?.getRuntimeProperties?.() ?? {};
  const HERMES_VERSION = HERMES_RUNTIME["OSS Release Version"];
  const isStaticHermes = HERMES_RUNTIME["Static Hermes"];

  if (!HERMES_RUNTIME) {
    return null;
  }

  if (isStaticHermes) {
    return `${HERMES_VERSION} (shermes)`;
  }
  return HERMES_VERSION;
}

async function getReleaseTypeAsync() {
  if (process.env.EXPO_OS === "ios") {
    const releaseType = await Application.getIosApplicationReleaseTypeAsync();

    const suffix = (() => {
      switch (releaseType) {
        case Application.ApplicationReleaseType.AD_HOC:
          return "Ad Hoc";
        case Application.ApplicationReleaseType.ENTERPRISE:
          return "Enterprise";
        case Application.ApplicationReleaseType.DEVELOPMENT:
          return "Development";
        case Application.ApplicationReleaseType.APP_STORE:
          return "App Store";
        case Application.ApplicationReleaseType.SIMULATOR:
          return "Simulator";
        case Application.ApplicationReleaseType.UNKNOWN:
        default:
          return "unknown";
      }
    })();
    return `${Application.applicationName} (${suffix})`;
  } else if (process.env.EXPO_OS === "android") {
    return `${Application.applicationName}`;
  }

  return null;
}

// Get the linked server deployment URL for the current app. This makes it easy to open
// the Expo dashboard and check errors/analytics for the current version of the app you're using.
function getDeploymentUrl(): any {
  const deploymentId = (() => {
    // https://expo.dev/accounts/bacon/projects/expo-ai/hosting/deployments/o70t5q6t0r/requests
    const origin = Constants.expoConfig?.extra?.router?.origin;
    if (!origin) {
      return null;
    }
    try {
      const url = new URL(origin);
      // Should be like: https://exai--xxxxxx.expo.app
      // We need to extract the `xxxxxx` part if the URL matches `[\w\d]--([])`.
      return url.hostname.match(/(?:[^-]+)--([^.]+)\.expo\.app/)?.[1] ?? null;
    } catch {
      return null;
    }
  })();

  const dashboardUrl = (() => {
    // TODO: There might be a better way to do this, using the project ID.
    const projectId = Constants.expoConfig?.extra?.eas?.projectId;
    if (projectId) {
      // https://expo.dev/projects/[uuid]
      return `https://expo.dev/projects/${projectId}`;
    }
    const owner = Constants.expoConfig?.owner ?? "[account]";
    const slug = Constants.expoConfig?.slug ?? "[project]";

    return `https://expo.dev/accounts/${owner}/projects/${slug}`;
  })();

  let deploymentUrl = `${dashboardUrl}/hosting/deployments`;
  if (deploymentId) {
    deploymentUrl += `/${deploymentId}/requests`;
  }
  return deploymentUrl;
}
