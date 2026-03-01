import { Ionicons } from "@expo/vector-icons";
import AsyncStorage from "@react-native-async-storage/async-storage";
import axios from "axios";
import { useRouter } from "expo-router";
import { useEffect, useState } from "react";
import {
  FlatList,
  Image,
  RefreshControl,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import { styles } from "../../assets/style/home.styles";
import BalanceCard from "../../components/BalanceCard";
import NoTransactionsFound from "../../components/NoTransactionsFound";
import PageLoader from "../../components/PageLoader";
import SignOutButton from "../../components/SignOutButton";
import TransactionList from "../../components/TransactionList";
import { useTransaction } from "../../hooks/useTransaction";
const Index = () => {
  const router = useRouter();
  const [user, setUser] = useState(null);
  const [refreshing, setRefreshing] = useState(false);
  const [categoriesCount, setCategoriesCount] = useState(0);

  // Check authentication on mount
  useEffect(() => {
    const checkAuth = async () => {
      const token = await AsyncStorage.getItem("token");

      if (!token) {
        router.replace("(auth)/sign-in");
      }
    };
    checkAuth();
  }, [router]);

  // Handle token expiration
  const handleTokenExpired = async () => {
    console.log("🔐 Token expired - logging out...");
    await AsyncStorage.removeItem("token");
    await AsyncStorage.removeItem("user");
    router.replace("(auth)/sign-in");
  };

  useEffect(() => {
    const getUser = async () => {
      const user = await AsyncStorage.getItem("user");
      setUser(JSON.parse(user));
    };

    const fetchCategoriesCount = async () => {
      try {
        const token = await AsyncStorage.getItem("token");
        console.log("Token for categories:", token);
        const response = await axios.get(
          `${process.env.EXPO_PUBLIC_BASE_URL}/api/category`,
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          },
        );
        setCategoriesCount(response.data.length || 0);
      } catch (err) {
        const errorMsg = err.response?.data || err.message;
        console.log("Error fetching categories count:", errorMsg);

        // Check if token is invalid or expired
        if (
          err.response?.status === 401 ||
          errorMsg.toString().includes("Invalid or expired token")
        ) {
          handleTokenExpired();
        }
      }
    };

    getUser();
    fetchCategoriesCount();
  }, []);

  const { transactions, summary, isLoading, loadData, deleteTransaction } =
    useTransaction();

  const onRefresh = async () => {
    setRefreshing(true);
    await loadData();
    setRefreshing(false);
  };

  useEffect(() => {
    loadData();
  }, [loadData]);

  if (isLoading && !refreshing) {
    return <PageLoader />;
  }

  return (
    <View style={styles.container}>
      <View style={styles.content}>
        {/* HEADER */}
        <View style={styles.header}>
          {/* LEFT */}
          <View style={styles.headerLeft}>
            <Image
              source={require("../../assets/images/logo.png")}
              style={styles.headerLogo}
              resizeMode="contain"
            />
            <View style={styles.welcomeContainer}>
              <Text style={styles.welcomeText}>Welcome,</Text>
              <Text style={styles.usernameText}>
                {user?.email?.split("@")[0]}
              </Text>
            </View>
          </View>
          {/* RIGHT */}
          <View style={styles.headerRight}>
            <TouchableOpacity
              style={styles.addButton}
              onPress={() => router.push("/create")}
            >
              <Ionicons name="add" size={20} color="#FFF" />
              <Text style={styles.addButtonText}>Add</Text>
            </TouchableOpacity>
            <SignOutButton />
          </View>
        </View>
        {/* CATEGORIES SECTION */}
        <TouchableOpacity
          style={styles.categoriesSection}
          onPress={() => router.push("/categories")}
        >
          <View style={styles.categoriesSectionLeft}>
            <Ionicons name="grid" size={22} color="#FFF" />
            <Text style={styles.categoriesSectionText}>Categories</Text>
          </View>
          <View style={styles.categoriesSectionRight}>
            <Text style={styles.categoriesCount}>{categoriesCount}</Text>
            <Ionicons name="chevron-forward" size={20} color="#FFF" />
          </View>
        </TouchableOpacity>
        <BalanceCard summary={summary} />
        <View style={styles.transactionsHeaderContainer}>
          <Text style={styles.sectionTitle}>Recent Transactions</Text>
        </View>
      </View>
      <FlatList
        style={styles.transactionsList}
        contentContainerStyle={styles.transactionsListContent}
        data={transactions}
        keyExtractor={(item) => item.date}
        renderItem={({ item }) => (
          <TransactionList list={item} onDelete={deleteTransaction} />
        )}
        ListEmptyComponent={<NoTransactionsFound />}
        showsVerticalScrollIndicator={false}
        refreshControl={
          <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
        }
      />
    </View>
  );
};

export default Index;
