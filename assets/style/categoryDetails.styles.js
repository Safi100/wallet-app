import { StyleSheet } from "react-native";

export const createCategoryDetailsStyles = (colors) =>
  StyleSheet.create({
    container: {
      flex: 1,
      backgroundColor: colors.background,
    },
    header: {
      flexDirection: "row",
      justifyContent: "space-between",
      alignItems: "center",
      padding: 20,
      borderBottomWidth: 1,
      borderBottomColor: colors.border,
      backgroundColor: colors.card,
    },
    headerTitle: {
      fontSize: 20,
      fontWeight: "700",
      color: colors.text,
    },
    backButton: {
      padding: 5,
    },
    summaryCard: {
      backgroundColor: colors.card,
      margin: 16,
      borderRadius: 16,
      padding: 20,
      flexDirection: "row",
      alignItems: "center",
      shadowColor: colors.shadow,
      shadowOffset: {
        width: 0,
        height: 2,
      },
      shadowOpacity: 0.1,
      shadowRadius: 4,
      elevation: 3,
      borderWidth: 1,
      borderColor: colors.border,
    },
    summaryItem: {
      flex: 1,
      alignItems: "center",
    },
    summaryDivider: {
      width: 1,
      height: 40,
      backgroundColor: colors.border,
      marginHorizontal: 16,
    },
    summaryLabel: {
      fontSize: 14,
      color: colors.textLight,
      marginBottom: 8,
    },
    summaryValue: {
      fontSize: 22,
      fontWeight: "700",
      color: colors.text,
    },
    content: {
      paddingHorizontal: 16,
    },
    sectionTitle: {
      fontSize: 18,
      fontWeight: "600",
      color: colors.text,
      marginBottom: 12,
    },
    list: {
      flex: 1,
      marginHorizontal: 16,
    },
    listContent: {
      paddingBottom: 20,
    },
  });
