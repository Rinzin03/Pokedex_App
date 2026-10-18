// App.js
import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { Ionicons } from '@expo/vector-icons';

import PokedexScreen from './src/screens/PokedexScreen';
import DetailScreen from './src/screens/DetailScreen';
import TeamScreen from './src/screens/TeamScreen';
import GameScreen from './src/screens/GameScreen';
import { TeamProvider } from './src/context/TeamContext';

const Stack = createNativeStackNavigator();
const Tab = createBottomTabNavigator();

function PokedexStack() {
  return (
    <Stack.Navigator screenOptions={{ headerStyle: { backgroundColor: '#0284c7' }, headerTintColor: '#fff' }}>
      <Stack.Screen name="PokedexMain" component={PokedexScreen} options={{ headerShown: false }} />
      <Stack.Screen name="Detail" component={DetailScreen} options={({ route }) => ({ title: route.params.name ? route.params.name.toUpperCase() : 'Details' })} />
    </Stack.Navigator>
  );
}

function TeamStack() {
  return (
    <Stack.Navigator screenOptions={{ headerStyle: { backgroundColor: '#0284c7' }, headerTintColor: '#fff' }}>
      <Stack.Screen name="TeamMain" component={TeamScreen} options={{ headerShown: false }} />
      <Stack.Screen name="Detail" component={DetailScreen} options={({ route }) => ({ title: route.params.name ? route.params.name.toUpperCase() : 'Details' })} />
    </Stack.Navigator>
  );
}

export default function App() {
  return (
    <TeamProvider>
      <NavigationContainer>
        <Tab.Navigator
          screenOptions={({ route }) => ({
            headerShown: false,
            tabBarActiveTintColor: '#0284c7',
            tabBarInactiveTintColor: 'gray',
            tabBarIcon: ({ color, size }) => {
              let iconName;
              if (route.name === 'Pokédex') iconName = 'list';
              else if (route.name === 'My Team') iconName = 'people';
              else if (route.name === 'Game') iconName = 'game-controller';
              return <Ionicons name={iconName} size={size} color={color} />;
            },
          })}
        >
          <Tab.Screen name="Pokédex" component={PokedexStack} />
          <Tab.Screen name="My Team" component={TeamStack} />
          <Tab.Screen name="Game" component={GameScreen} />
        </Tab.Navigator>
      </NavigationContainer>
    </TeamProvider>
  );
}