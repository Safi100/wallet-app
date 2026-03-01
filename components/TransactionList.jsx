import { Alert, Text, View } from "react-native";
import { createHomeStyles } from "../assets/style/home.styles";
import { useTheme } from "../hooks/useTheme";
import { formatDate } from "../lib/utils";
import TransactionItem from "./TransactionItem";

const TransactionList = ({ list, onDelete }) => {
  const { colors } = useTheme();
  const styles = createHomeStyles(colors);
  const handleDelete = (id) => {
    const deleteAction = onDelete || (() => {});

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
          onPress: () => deleteAction(id),
        },
      ],
    );
  };

  // حساب المجموع الكلي للمعاملات في هذا اليوم
  const totalAmount =
    list.transactions?.reduce((sum, item) => {
      return sum + parseFloat(item.amount);
    }, 0) || 0;

  const isPositive = totalAmount > 0;

  return (
    <View style={styles.transactionsParent}>
      <View style={styles.dateHeaderContainer}>
        <Text style={styles.dateHeader}>{formatDate(list.date)}</Text>
        {list.transactions?.length > 1 && (
          <Text
            style={[
              styles.dateTotalAmount,
              { color: isPositive ? colors.income : colors.expense },
            ]}
          >
            {isPositive ? "+" : ""}₪{Math.abs(totalAmount).toFixed(2)}
          </Text>
        )}
      </View>
      <View style={styles.transactionsContainer}>
        {list.transactions?.length > 0 &&
          list.transactions?.map((item, index) => (
            <TransactionItem
              key={item._id}
              item={item}
              isLastIndex={index === list.transactions.length - 1}
              onDelete={handleDelete}
            />
          ))}
      </View>
    </View>
  );
};

export default TransactionList;
