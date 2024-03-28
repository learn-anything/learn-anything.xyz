import { StatusBar } from "expo-status-bar"
import { Platform, Text, View } from "react-native"

import EditScreenInfo from "../components/edit-screen-info"

export default function ModalScreen() {
  return (
    <View className={styles.container}>
      <StatusBar style={Platform.OS === "ios" ? "light" : "auto"} />
      <Text className={styles.title}>Modal</Text>
      <View className={styles.separator} />
      <EditScreenInfo path="app/modal.tsx" />
    </View>
  )
}

const styles = {
  container: `items-center flex-1 justify-center`,
  separator: `h-[1px] my-7 w-4/5 bg-gray-200`,
  title: `text-xl font-bold`,
}
