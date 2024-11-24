import React from 'react';
import { StyleSheet, TextInput, Button, View } from 'react-native';

import { SafeAreaProvider, SafeAreaView } from 'react-native-safe-area-context';
import { useRouter } from 'expo-router';
import Toast from 'react-native-toast-message';
import * as SecureStore from 'expo-secure-store';

export default function HomeScreen() {
  const [login, onChangeLogin] = React.useState('');
  const [password, onChangePassword] = React.useState('');
  const router = useRouter();

  const showToast = (success: boolean, message: string) => {
    const status = success?'success':'error';
    
    Toast.show({
      type: status,
      text1: message,
      position: 'bottom'
    });
  };

  const register = async () => {
    if (!login || login.trim().length === 0) {
      return alert("Podaj login");
    }
    if (!password || password.trim().length === 0) {
      return alert("Podaj hasło");
    }

    try {
      const response = await fetch('https://local.test:8000/register', {
        method: 'POST',
        headers: {
          Accept: 'application/json',
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          login: login,
          password: password,
        }),
      });
      const data = await response.json()
      showToast(data.success, data.message);
    } catch (error) {
      alert(error);
    }
  }
  
  const logIn = async () => {
    if (!login || login.trim().length === 0) {
      return showToast(false, "Podaj login");
    }
    if (!password || password.trim().length === 0) {
      return showToast(false, "Podaj hasło");
    }
  
    try {
      const response = await fetch('https://localhost:8000/login', {
        method: 'POST',
        headers: {
          Accept: 'application/json',
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          login: login,
          password: password,
        }),
      });
      const data = await response.json()
      showToast(data.success, data.message);
      if (data.success == true) {
        SecureStore.setItem('login', data.login)
        router.push('/notes');
      }
    } catch (error) {
      alert(error);
    }
  }

  return (
    <SafeAreaProvider>
      <SafeAreaView>
        <TextInput
          value={login}
          onChangeText={onChangeLogin}
          placeholder="Login"
          style={styles.input}
        />
        <TextInput
          value={password}
          onChangeText={onChangePassword}
          placeholder="Hasło"
          style={styles.input}
          secureTextEntry={true}
        />
        <View style={styles.buttonContainer}>
          <Button
            title="Zaloguj"
            onPress={logIn}
          />
        </View>
        <View style={styles.buttonContainer}>
          <Button
            title="Zarejestruj"
            onPress={register}
          />
        </View>
      </SafeAreaView>
      <Toast />
    </SafeAreaProvider>
  );
}

const styles = StyleSheet.create({
  input: {
    height: 40,
    margin: 12,
    borderWidth: 1,
    padding: 10,
  },
  buttonContainer: {
    margin: 10,
  },
});