import { Ionicons } from "@expo/vector-icons";
import AsyncStorage from "@react-native-async-storage/async-storage";
import axios from "axios";
import { useLocalSearchParams, useRouter } from "expo-router";
import { useEffect, useState } from "react";
import {
  Alert,
  FlatList,
  RefreshControl,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import { styles } from "../../assets/style/categoryDetails.styles";
import NoTransactionsFound from "../../components/NoTransactionsFound";
import PageLoader from "../../components/PageLoader";
import TransactionList from "../../components/TransactionList";
import { COLORS } from "../../constants/colors";

const CategoryDetailsScreen = () => {
  const router = useRouter();
  const { categoryId, categoryName } = useLocalSearchParams();
  const [transactions, setTransactions] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [summary, setSummary] = useState({ total: 0, count: 0 });

  const fetchCategoryTransactions = async () => {
    try {
      const token = await AsyncStorage.getItem("token");
      const response = await axios.get(
        `${process.env.EXPO_PUBLIC_BASE_URL}/api/transaction/category/${categoryId}`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
      setTransactions(response.data.transactions || []);
      setSummary(response.data.summary || { total: 0, count: 0 });
    } catch (err) {
      console.log("Error fetching category transactions:", err);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchCategoryTransactions();
  }, [categoryId]);

  const onRefresh = async () => {
    setRefreshing(true);
    await fetchCategoryTransactions();
    setRefreshing(false);
  };

  const handleDelete = async (id) => {
    Alert.alert(
      "Delete Transaction",
      "Are you sure you want to delete this transaction?",
      [
        {
          text: "Cancel",
          style: "cancel",
        },
        {
          text: "Delete",
          style: "destructive",
          onPress: async () => {
            try {
              const token = await AsyncStorage.getItem("token");
              await axios.delete(
                `${process.env.EXPO_PUBLIC_BASE_URL}/api/transaction/${id}`,
                {
                  headers: {
                    Authorization: `Bearer ${token}`,
                  },
                }
              );
              await fetchCategoryTransactions();
              Alert.alert("Success", "Transaction deleted successfully!");
            } catch (err) {
              Alert.alert("Error", "Failed to delete transaction");
              console.log("Error deleting transaction:", err);
            }
          },
        },
      ]
    );
  };

  if (isLoading && !refreshing) {
    return <PageLoader />;
  }

  return (
    <View style={styles.container}>
      {/* HEADER */}
      <View style={styles.header}>
        <TouchableOpacity
          style={styles.backButton}
          onPress={() => router.back()}
        >
          <Ionicons name="arrow-back" size={24} color={COLORS.text} />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>{categoryName}</Text>
        <View style={{ width: 40 }} />
      </View>

      {/* SUMMARY CARD */}
      <View style={styles.summaryCard}>
        <View style={styles.summaryItem}>
          <Text style={styles.summaryLabel}>Total Amount</Text>
          <Text
            style={[
              styles.summaryValue,
              { color: summary.total >= 0 ? COLORS.income : COLORS.expense },
            ]}
          >
            {summary.total >= 0 ? "+" : ""}₪{Math.abs(summary.total).toFixed(2)}
          </Text>
        </View>
        <View style={styles.summaryDivider} />
        <View style={styles.summaryItem}>
          <Text style={styles.summaryLabel}>Transactions</Text>
          <Text style={styles.summaryValue}>{summary.count}</Text>
        </View>
      </View>

      {/* TRANSACTIONS LIST */}
      <View style={styles.content}>
        <Text style={styles.sectionTitle}>Transactions</Text>
      </View>
      <FlatList
        style={styles.list}
        contentContainerStyle={styles.listContent}
        data={transactions}
        keyExtractor={(item) => item.date}
        renderItem={({ item }) => (
          <TransactionList list={item} onDelete={handleDelete} />
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

export default CategoryDetailsScreen;
