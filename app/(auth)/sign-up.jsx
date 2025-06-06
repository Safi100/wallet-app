import { Ionicons } from "@expo/vector-icons";
import axios from "axios";
import { Image } from "expo-image";
import { Link, useRouter } from "expo-router";
import { useState } from "react";

import AsyncStorage from "@react-native-async-storage/async-storage";
import {
  ActivityIndicator,
  Dimensions,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from "react-native";
import { KeyboardAwareScrollView } from "react-native-keyboard-aware-scroll-view";
import { styles } from "../../assets/style/auth.styles";
import VerifyCode from "../../components/VerifyCode";
import { COLORS } from "../../constants/colors";

export default function SignUp() {
  const router = useRouter();

  const [error, setError] = useState(false);
  const [loading, setLoading] = useState(false);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [ShowVerify, setShowVerify] = useState(false);

  const { width } = Dimensions.get("window");

  const handleSignUp = () => {
    if (!email || !password) {
      setError("Please fill in all fields");
      return;
    }
    // TODO: Sign up user
    setError("");
    setLoading(true);
    console.log(process.env.EXPO_PUBLIC_BASE_URL);
    axios
      .post(`${process.env.EXPO_PUBLIC_BASE_URL}/api/auth/register`, {
        email,
        password,
      })
      .then(async (res) => {
        const { token, user } = res.data;
        console.log(res.data);

        await AsyncStorage.setItem("token", token);
        await AsyncStorage.setItem("user", JSON.stringify(user));
        setShowVerify(true);
      })
      .catch((err) => {
        console.log(err.response.data);
        setError(err.response.data);
      })
      .finally(() => {
        setLoading(false);
      });
  };

  if (ShowVerify) {
    return <VerifyCode />;
  }

  return (
    <KeyboardAwareScrollView
      style={{ flex: 1 }}
      contentContainerStyle={{ flexGrow: 1 }}
      enableOnAndroid={true}
      enableAutomaticScrolling={true}
      extraScrollHeight={30}
    >
      <View style={styles.container}>
        <Image
          source={require("../../assets/images/revenue-i1.png")}
          style={{ width, height: 310, maxWidth: 300, margin: "auto" }}
          contentFit="contain"
        />
        <Text style={styles.title}>Create Account</Text>
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
          style={[styles.input, error && styles.errorInput]}
          autoCapitalize="none"
          value={email}
          placeholderTextColor="#9A8478"
          placeholder="Enter your email..."
          onChangeText={(text) => setEmail(text)}
          autoFocus={false}
        />
        <TextInput
          style={[styles.input, error && styles.errorInput]}
          autoCapitalize="none"
          value={password}
          placeholderTextColor="#9A8478"
          placeholder="Enter your password..."
          secureTextEntry={true}
          onChangeText={(text) => setPassword(text)}
          autoFocus={false}
        />
        <TouchableOpacity
          style={styles.button}
          onPress={handleSignUp}
          disabled={loading}
        >
          {loading ? (
            <ActivityIndicator color="#fff" size="small" />
          ) : (
            <Text style={styles.buttonText}>Sign up</Text>
          )}
        </TouchableOpacity>
        <View style={styles.footerContainer}>
          <Text style={styles.footerText}>Already have an account?</Text>
          <Link style={styles.linkText} href={"./sign-in"} asChild>
            <Text>Sign in</Text>
          </Link>
        </View>
      </View>
    </KeyboardAwareScrollView>
  );
}
