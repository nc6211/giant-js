import { Stack } from 'expo-router';
import { StatusBar } from 'expo-status-bar';

export default function RootLayout() {
  return (
    <>
      <StatusBar style="auto" />
      <Stack
        screenOptions={{
          headerStyle: { backgroundColor: '#fff' },
          headerTintColor: '#000',
        }}
      >
        <Stack.Screen 
          name="index" 
          options={{ title: 'Giant JS' }} 
        />
      </Stack>
    </>
  );
}
