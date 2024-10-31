import React from 'react';
import { StyleSheet, TextInput, Button, Alert, Text } from 'react-native';

import { SafeAreaProvider, SafeAreaView } from 'react-native-safe-area-context';

export default function HomeScreen() {
  const [login, onChangeLogin] = React.useState('');
  const [password, onChangePassword] = React.useState('');

  const logIn = async () => {
    if (!login || login.trim().length === 0) {
      return alert("Podaj login");
    }
    if (!password || password.trim().length === 0) {
      return alert("Podaj hasło");
    }

    try {
      const response = await fetch('http://10.0.2.2:3000/login', {
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
      alert(data.message);
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
        />
        <Button
          title="Zaloguj"
          onPress={logIn}
        />
      </SafeAreaView>
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
});