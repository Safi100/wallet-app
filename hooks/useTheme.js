import AsyncStorage from "@react-native-async-storage/async-storage";
import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
} from "react";
import { THEMES } from "../constants/colors";

// Create Theme Context
const ThemeContext = createContext(undefined);

// Theme Provider Component
export const ThemeProvider = ({ children }) => {
  const [currentTheme, setCurrentTheme] = useState("dark");
  const [colors, setColors] = useState(THEMES.dark);
  const [isLoading, setIsLoading] = useState(true);

  // Load theme from storage on mount
  useEffect(() => {
    const loadTheme = async () => {
      try {
        const savedTheme = await AsyncStorage.getItem("selectedTheme");
        if (savedTheme && THEMES[savedTheme]) {
          setCurrentTheme(savedTheme);
          setColors(THEMES[savedTheme]);
          console.log("✅ Theme loaded:", savedTheme);
        }
      } catch (err) {
        console.log("Error loading theme:", err);
      } finally {
        setIsLoading(false);
      }
    };
    loadTheme();
  }, []);

  // Change theme and save to storage
  const changeTheme = useCallback(async (themeName) => {
    try {
      if (THEMES[themeName]) {
        setCurrentTheme(themeName);
        setColors(THEMES[themeName]);
        await AsyncStorage.setItem("selectedTheme", themeName);
        console.log("✅ Theme changed to:", themeName);
      }
    } catch (err) {
      console.log("Error saving theme:", err);
    }
  }, []);

  const value = useMemo(
    () => ({
      currentTheme,
      colors,
      changeTheme,
      isLoading,
      availableThemes: Object.keys(THEMES),
    }),
    [currentTheme, colors, changeTheme, isLoading],
  );

  return (
    <ThemeContext.Provider value={value}>{children}</ThemeContext.Provider>
  );
};

// Hook to use theme context
export const useTheme = () => {
  const context = useContext(ThemeContext);
  if (context === undefined) {
    throw new Error("useTheme must be used within a ThemeProvider");
  }
  return context;
};
