import { Ionicons } from "@expo/vector-icons";
import AsyncStorage from "@react-native-async-storage/async-storage";
import axios from "axios";
import { useRouter } from "expo-router";
import { useState } from "react";

import {
  ActivityIndicator,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from "react-native";
import { styles } from "../assets/style/auth.styles";
import { COLORS } from "../constants/colors";

const VerifyCode = () => {
  const router = useRouter();
  const [error, setError] = useState(false);
  const [loading, setLoading] = useState(false);
  const [code, setCode] = useState("");

  const handleVerify = async () => {
    if (!code || code.length !== 6) {
      setError("Please enter a valid code (6 digits)");
      return;
    }

    setError("");
    setLoading(true);

    try {
      const token = await AsyncStorage.getItem("token");

      const response = await axios.post(
        `${process.env.EXPO_PUBLIC_BASE_URL}/api/auth/verify`,
        { code },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      router.replace("/");
    } catch (err) {
      console.log("❌ error:", err?.response?.data || err.message);
      setError(err?.response?.data || "Something went wrong");
    } finally {
      setLoading(false);
    }
  };
  return (
    <View style={styles.verificationContainer}>
      <Text style={styles.verificationTitle}>Verify your email</Text>
      {error ? (
        <View style={styles.errorBox}>
          <Ionicons name="alert-circle" size={20} color={COLORS.expense} />
          <Text style={styles.errorText}>{error}</Text>
          <TouchableOpacity onPress={() => setError("")}>
            <Ionicons name="close" size={20} color={COLORS.textLight} />
          </TouchableOpacity>
        </View>
      ) : null}
      <TextInput
        style={[styles.verificationInput, error && styles.errorInput]}
        value={code}
        placeholder="Enter your verification code..."
        onChangeText={(text) => setCode(text.trim())}
        autoFocus={false}
        maxLength={6}
        keyboardType="number-pad"
      />
      <TouchableOpacity style={styles.button} onPress={handleVerify}>
        {loading ? (
          <ActivityIndicator color="#fff" size="small" />
        ) : (
          <Text style={styles.buttonText}>Verify</Text>
        )}
      </TouchableOpacity>
    </View>
  );
};

export default VerifyCode;
