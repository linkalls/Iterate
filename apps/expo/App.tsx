import React from 'react'
import { StatusBar } from 'expo-status-bar'
import { NavigationContainer } from '@react-navigation/native'
import { createNativeStackNavigator } from '@react-navigation/native-stack'
import { TamaguiProvider } from 'tamagui'
import { Provider as JotaiProvider } from 'jotai'
import config from './tamagui.config'
import { HomeScreen, DeckListScreen, StudyScreen, AddCardScreen, AddDeckScreen, EditDeckScreen } from 'app'

const Stack = createNativeStackNavigator()

export default function App() {
  return (
    <JotaiProvider>
      <TamaguiProvider config={config} defaultTheme="light">
        <NavigationContainer>
          <Stack.Navigator
            initialRouteName="Home"
            screenOptions={{
              headerShown: false,
            }}
          >
            <Stack.Screen name="Home" component={HomeScreen} />
            <Stack.Screen name="DeckList" component={DeckListScreen} />
            <Stack.Screen name="Study" component={StudyScreen} />
            <Stack.Screen name="AddCard" component={AddCardScreen} />
            <Stack.Screen name="AddDeck" component={AddDeckScreen} />
            <Stack.Screen name="EditDeck" component={EditDeckScreen} />
          </Stack.Navigator>
        </NavigationContainer>
        <StatusBar style="auto" />
      </TamaguiProvider>
    </JotaiProvider>
  )
}
