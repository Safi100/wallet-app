import { Slot } from "expo-router";
import { StatusBar } from "expo-status-bar";
import SafeScreen from "../components/SafeScreen";

export default function RootLayout() {
  return (
    <>
      <SafeScreen>
        <Slot />
      </SafeScreen>
      <StatusBar style="dark" />
    </>
  );
}
