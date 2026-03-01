import { ActivityIndicator, StyleSheet, View } from "react-native";
import { useTheme } from "../hooks/useTheme";

const PageLoader = () => {
  const { colors, isLoading: themeLoading } = useTheme();

  return (
    <View
      style={[styles.loadingContainer, { backgroundColor: colors.background }]}
    >
      <ActivityIndicator size="large" color={colors.primary} />
    </View>
  );
};

const styles = StyleSheet.create({
  loadingContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
});

export default PageLoader;
