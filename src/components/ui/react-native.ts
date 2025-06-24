import Animated from "react-native-reanimated";
import {
  ScrollView as RNGHScrollView,
  Pressable as RNGHPressable,
  TextInput as RNGHTextInput,
} from "react-native-gesture-handler";

import {
  LegendList as List,
  LegendListRef as ListRef,
  LegendListRenderItemProps as ListRenderItemProps,
} from "@legendapp/list";
export { List, ListRef, ListRenderItemProps };
export const { View, Text, Image } = Animated;

export const ScrollView = Animated.createAnimatedComponent(RNGHScrollView);
export const Pressable = Animated.createAnimatedComponent(RNGHPressable);
export const TextInput = Animated.createAnimatedComponent(RNGHTextInput);

export { SafeAreaView } from "react-native-safe-area-context";

export { StatusBar } from "expo-status-bar";

export { Switch } from "./Switch";
import * as Clipboard from "expo-clipboard";

export { Clipboard };

//  Native views from React Native
export {
  ActivityIndicator,
  Button,

  //   TODO: Replace modal with Expo Router modal.
  Modal,
  RefreshControl,
  InputAccessoryView,
} from "react-native";

// Native APIs from React Native
export {
  Alert,
  Appearance,
  AppState,
  BackHandler,
  Dimensions,
  Keyboard,
  PixelRatio,
} from "react-native";

// Random non-native Views from React Native
export {
  FlatList,
  TouchableHighlight,
  TouchableNativeFeedback,
  TouchableOpacity,
  TouchableWithoutFeedback,
} from "react-native-gesture-handler";
export { SectionList, VirtualizedList, Touchable } from "react-native";

import * as Linking from "expo-linking";
export { Linking };

export { Animated };

// Bad APIs
export {
  KeyboardAvoidingView,
  DrawerLayoutAndroid,
  ProgressBarAndroid,
  ActionSheetIOS,
  ToastAndroid,
  findNodeHandle,
} from "react-native";

// All Meta gives us for "responsive" design:
export { StyleSheet, useColorScheme, useWindowDimensions } from "react-native";

export { Platform } from "expo-modules-core";

export { WebView } from "react-native-webview";

// Platform -- process.env.EXPO_OS
// NativeModules -- expo.modules.<module>

/// Deprecated / Lean core ----
// ListView - deprecated-react-native-listview
// SwipeableListView - deprecated-react-native-swipeable-listview
// WebView - react-native-webview
// NetInfo - @react-native-community/netinfo
// CameraRoll - @react-native-camera-roll/camera-roll
// ImageEditor - @react-native-community/image-editor
// ToolbarAndroid - @react-native-community/toolbar-android
// ViewPagerAndroid - react-native-pager-view
// CheckBox - @react-native-community/checkbox
// SegmentedControlIOS - @react-native-segmented-control/segmented-control
// Picker - @react-native-picker/picker
// TimePickerAndroid - @react-native-community/datetimepicker
// DatePickerAndroid - @react-native-community/datetimepicker
// MaskedViewIOS - @react-native-masked-view/masked-view
// AsyncStorage - @react-native-async-storage/async-storage
// ImagePickerIOS  - expo-image-picker
// ProgressViewIOS - @react-native-community/progress-view
// DatePickerIOS - @react-native-community/datetimepicker
// Slider - @react-native-community/slider

import DateTimePicker from "@react-native-community/datetimepicker";
export { DateTimePicker };

import Slider from "@react-native-community/slider";
export { Slider };

import MaskedView from "@react-native-masked-view/masked-view";
export { MaskedView };

// Similar APIs

export { useAnimatedKeyboard as useKeyboard } from "react-native-reanimated";
import * as Haptics from "expo-haptics";
export { Haptics };
export { shareAsync } from "expo-sharing";

import * as Colors from "@bacons/apple-colors";
export { Colors };
import * as Fonts from "@/constants/fonts";
export { Fonts };

// Types
export { OpaqueColorValue } from "react-native";
