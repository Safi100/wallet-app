import { Ionicons } from "@expo/vector-icons";
import { useRouter } from "expo-router";
import { useEffect, useState } from "react";
import { ScrollView, Text, TouchableOpacity, View } from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { THEMES } from "../../constants/colors";
import { useTheme } from "../../hooks/useTheme";

export default function Settings() {
  const router = useRouter();
  const insets = useSafeAreaInsets();
  const { currentTheme, changeTheme, availableThemes, colors } = useTheme();
  const [themes, setThemes] = useState([]);

  useEffect(() => {
    // Map theme names to display format
    const themeList = availableThemes.map((theme) => ({
      name: theme,
      displayName: theme.charAt(0).toUpperCase() + theme.slice(1),
    }));
    setThemes(themeList);
  }, [availableThemes]);

  const handleThemeSelect = (themeName) => {
    changeTheme(themeName);
  };

  const styles = {
    container: {
      flex: 1,
      backgroundColor: colors.background,
      paddingHorizontal: 16,
      paddingVertical: 20,
    },
    header: {
      flexDirection: "row",
      alignItems: "center",
      marginBottom: 24,
      gap: 12,
    },
    title: {
      fontSize: 24,
      fontWeight: "bold",
      color: colors.text,
    },
    section: {
      marginBottom: 24,
    },
    sectionTitle: {
      fontSize: 16,
      fontWeight: "600",
      color: colors.text,
      marginBottom: 12,
    },
    themeGrid: {
      flexDirection: "row",
      flexWrap: "wrap",
      gap: 12,
    },
    themeCard: (isSelected) => ({
      flex: 1,
      minWidth: "45%",
      padding: 16,
      borderRadius: 12,
      borderWidth: 2,
      borderColor: isSelected ? colors.primary : colors.border,
      backgroundColor: colors.card,
      alignItems: "center",
      justifyContent: "center",
      gap: 8,
    }),
    themeName: {
      fontSize: 14,
      fontWeight: "600",
      color: colors.text,
      textAlign: "center",
    },
    colorPreview: (bgColor) => ({
      width: 40,
      height: 40,
      borderRadius: 20,
      backgroundColor: bgColor,
      borderWidth: 2,
      borderColor: colors.border,
    }),
    checkmark: {
      position: "absolute",
      top: 8,
      right: 8,
    },
  };

  return (
    <View
      style={{
        paddingTop: insets.top,
        paddingBottom: insets.bottom,
        flex: 1,
        backgroundColor: colors.background,
      }}
    >
      <View style={styles.container}>
        {/* Header */}
        <View style={styles.header}>
          <TouchableOpacity onPress={() => router.back()}>
            <Ionicons name="arrow-back" size={24} color="#FFF" />
          </TouchableOpacity>
          <Text style={styles.title}>Settings</Text>
        </View>

        {/* Theme Selection Section */}
        <ScrollView showsVerticalScrollIndicator={false}>
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>🎨 Choose Theme</Text>
            <View style={styles.themeGrid}>
              {themes.map((theme) => (
                <TouchableOpacity
                  key={theme.name}
                  style={styles.themeCard(currentTheme === theme.name)}
                  onPress={() => handleThemeSelect(theme.name)}
                >
                  {currentTheme === theme.name && (
                    <View style={styles.checkmark}>
                      <Ionicons
                        name="checkmark-circle"
                        size={20}
                        color="#FFF"
                      />
                    </View>
                  )}
                  <View
                    style={styles.colorPreview(THEMES[theme.name]?.primary)}
                  />
                  <Text style={styles.themeName}>{theme.displayName}</Text>
                </TouchableOpacity>
              ))}
            </View>
          </View>
        </ScrollView>
      </View>
    </View>
  );
}
