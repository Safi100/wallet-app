import { Ionicons } from "@expo/vector-icons";
import AsyncStorage from "@react-native-async-storage/async-storage";
import axios from "axios";
import { useRouter } from "expo-router";
import { Alert, TouchableOpacity } from "react-native";
import { createHomeStyles } from "../assets/style/home.styles";
import { useTheme } from "../hooks/useTheme";

const SignOutButton = () => {
  const router = useRouter();
  const { colors } = useTheme();
  const styles = createHomeStyles(colors);

  const handleSignOut = async () => {
    try {
      const token = await AsyncStorage.getItem("token");

      const response = await axios.post(
        `${process.env.EXPO_PUBLIC_BASE_URL}/api/auth/logout`,
        {},
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        },
      );
      await AsyncStorage.removeItem("token");
      await AsyncStorage.removeItem("user");
      router.replace("/sign-in");
    } catch (err) {
      console.log("❌ Logout error:", err.response?.data || err.message);
    }
  };

  const SignOutAlert = () => {
    Alert.alert("Logout", "Are you sure you want to logout?", [
      {
        text: "Cancel",
        style: "cancel",
      },
      {
        text: "Logout",
        style: "destructive",
        onPress: handleSignOut,
      },
    ]);
  };

  return (
    <TouchableOpacity style={styles.logoutButton} onPress={SignOutAlert}>
      <Ionicons name="log-out-outline" size={22} color={colors.text} />
    </TouchableOpacity>
  );
};

export default SignOutButton;
