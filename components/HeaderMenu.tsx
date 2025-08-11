import { deleteToken } from "@/api";
import MaterialIcons from "@expo/vector-icons/MaterialIcons";
import { useRouter } from "expo-router";
import { useState } from "react";
import { Alert, Modal, Pressable, StyleSheet, Text } from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";

import { Colors } from "@/constants/Colors";
import { useColorScheme } from "@/hooks/useColorScheme";

export function HeaderMenu() {
  const colorScheme = useColorScheme();
  const router = useRouter();
  const [menuVisible, setMenuVisible] = useState(false);
  const insets = useSafeAreaInsets();

  const handleLogout = () => {
    setMenuVisible(false);
    // Add a confirmation dialog to prevent accidental log-outs.
    console.log("Logging out...");

    try {
      deleteToken();
      router.replace("/");
    } catch (error) {
      console.error("Failed to log out:", error);
      Alert.alert("Logout Failed", "Could not log out. Please try again.");
    }
  };

  const menuContainerStyle = {
    backgroundColor: Colors[colorScheme ?? "light"].background,
    borderColor: Colors[colorScheme ?? "light"].icon,
    top: insets.top + 10,
  };
  const menuItemTextStyle = {
    color: Colors[colorScheme ?? "light"].text,
  };

  return (
    <>
      <Pressable
        onPress={() => setMenuVisible(true)}
        style={styles.trigger}
        hitSlop={20}
      >
        <MaterialIcons
          name="more-vert"
          size={24}
          color={Colors[colorScheme ?? "light"].text}
        />
      </Pressable>

      <Modal
        transparent
        visible={menuVisible}
        animationType="fade"
        onRequestClose={() => setMenuVisible(false)}
      >
        <Pressable style={styles.overlay} onPress={() => setMenuVisible(false)}>
          <Pressable style={[styles.menuContainer, menuContainerStyle]}>
            <Pressable onPress={handleLogout} style={styles.menuItem}>
              <Text style={menuItemTextStyle}>Log out</Text>
            </Pressable>
          </Pressable>
        </Pressable>
      </Modal>
    </>
  );
}

const styles = StyleSheet.create({
  trigger: {
    marginRight: 15,
  },
  overlay: {
    flex: 1,
  },
  menuContainer: {
    position: "absolute",
    right: 10,
    borderRadius: 8,
    borderWidth: 1,
    minWidth: 120,
  },
  menuItem: {
    paddingVertical: 12,
    paddingHorizontal: 16,
  },
});
