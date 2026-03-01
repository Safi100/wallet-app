import { Slot } from "expo-router";
import { StatusBar } from "expo-status-bar";
import SafeScreen from "../components/SafeScreen";
import { ThemeProvider } from "../hooks/useTheme";

export default function RootLayout() {
  return (
    <ThemeProvider>
      <StatusBar style="light" />
      <SafeScreen>
        <Slot />
      </SafeScreen>
    </ThemeProvider>
  );
}
