import React from "react";
import { Provider as AuthProvider } from "./src/context/AuthContext";
import { SafeAreaProvider, useSafeArea } from "react-native-safe-area-context";
import RouteScreen from "./RouteScreen";

export default () => {
  return (
    <SafeAreaProvider>
      <AuthProvider>
        <RouteScreen />
      </AuthProvider>
    </SafeAreaProvider>
  );
};
