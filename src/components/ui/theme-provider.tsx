import {
  DarkTheme,
  DefaultTheme,
  ThemeProvider as RNTheme,
} from "@react-navigation/native";
import { useColorScheme } from "react-native";

export default function ThemeProvider(props) {
  const scheme = useColorScheme();
  return (
    <RNTheme value={scheme === "dark" ? DarkTheme : DefaultTheme} {...props} />
  );
}
