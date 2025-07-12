import React from "react";
import { NavigationContainer } from "@react-navigation/native";
import AuthNavigator from "./navigator/navigator";

export default function App() {
  return (
    <NavigationContainer>
      <AuthNavigator />
    </NavigationContainer>
  );
}
