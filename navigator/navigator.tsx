import React from "react";
import { Image } from "react-native";
import { createNativeStackNavigator } from "@react-navigation/native-stack";
import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";
import { AuthStackParamList } from "../model/model";

import LoginScreen from "../screen/auth/LoginScreen";
import SignUpScreen from "../screen/auth/SignupScreen";
import HomeScreen from "../screen/home/HomeScreen";
import ProfileScreen from "../screen/profile/ProfileScreen";
import PostScreen from "../screen/post/PostScreen";

const Stack = createNativeStackNavigator<AuthStackParamList>();
const Tab = createBottomTabNavigator();

export function AuthNavigator() {
  return (
    <Stack.Navigator
      initialRouteName="Login"
      screenOptions={{ headerShown: false }}
    >
      <Stack.Screen
        name="Login"
        component={LoginScreen}
        options={{ title: "로그인" }}
      />
      <Stack.Screen
        name="SignUp"
        component={SignUpScreen}
        options={{ title: "회원가입" }}
      />
    </Stack.Navigator>
  );
}

function HomeStack() {
  return (
    <Stack.Navigator
      initialRouteName="Home"
      screenOptions={{ headerShown: false }}
    >
      <Stack.Screen name="Home" component={HomeScreen} />
    </Stack.Navigator>
  );
}

function PostStack() {
  return (
    <Stack.Navigator
      initialRouteName="Post"
      screenOptions={{ headerShown: false }}
    >
      <Stack.Screen name="Post" component={PostScreen} />
    </Stack.Navigator>
  );
}

function ProfileStack() {
  return (
    <Stack.Navigator
      initialRouteName="Profile"
      screenOptions={{ headerShown: false }}
    >
      <Stack.Screen name="Profile" component={ProfileScreen} />
    </Stack.Navigator>
  );
}

export function MainBottomTabNavigator() {
  return (
    <Tab.Navigator screenOptions={{ tabBarShowLabel: false }}>
      <Tab.Screen
        name="HomeStack"
        component={HomeStack}
        options={{
          tabBarIcon: ({ color, size }) => (
            <Image
              source={require("../assets/images/home.png")}
              style={{ width: 30, height: 30, tintColor: color }}
            />
          ),
        }}
      />
      <Tab.Screen
        name="PostStack"
        component={PostStack}
        options={{
          tabBarIcon: ({ color, size }) => (
            <Image
              source={require("../assets/images/plus.png")}
              style={{ width: 25, height: 25, tintColor: color }}
            />
          ),
        }}
      />
      <Tab.Screen
        name="ProfileStack"
        component={ProfileStack}
        options={{
          tabBarIcon: ({ color, size }) => (
            <Image
              source={require("../assets/images/profile.png")}
              style={{ width: 30, height: 30, tintColor: color }}
            />
          ),
        }}
      />
    </Tab.Navigator>
  );
}
