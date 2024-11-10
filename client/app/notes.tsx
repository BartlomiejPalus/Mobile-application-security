import React, { useState } from 'react';
import { StyleSheet, TextInput, Button, Alert } from 'react-native';
import * as SecureStore from 'expo-secure-store';
import CryptoES from 'crypto-es';
import { SafeAreaProvider, SafeAreaView } from 'react-native-safe-area-context';
import Dialog from 'react-native-dialog';
import Config from "react-native-config";

export default function NotesScreen() {
  const encryptionKey = Config.ENCRYPTION_KEY ?? '';
  const [note, onChangeNote] = useState('');
  const [modalVisible, setModalVisible] = useState(false);
  const [password, setPassword] = useState('');
  const [operation, setOperation] = useState('');

  const addNote = async () => {
    try {
      const encrypted = CryptoES.AES.encrypt(note, encryptionKey).toString();
      console.log('Zaszyfrowana notatka: ' + encrypted);
      await SecureStore.setItemAsync('note', encrypted);
    } catch (error) {
      alert(error);
    }
  };

  const showNote = async () => {
    const result = await SecureStore.getItemAsync('note');
    if (result) {
      const decrypted = CryptoES.AES.decrypt(result, "KeJ6dQZgKtgT6yNY").toString(CryptoES.enc.Utf8);
      Alert.alert("Notatka:", decrypted);
    } else {
      Alert.alert('Brak zapisanej notatki');
    }
  };

  const auth = async () => {
    const login = await SecureStore.getItemAsync('login');

    if (!password || password.trim().length === 0) {
      return alert("Podaj hasło");
    }

    try {
      const response = await fetch('http://10.0.2.2:3000/notes/auth', {
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
      const data = await response.json();
      return data.success;
    } catch (error) {
      alert(error);
    }
  };

  const handleAuth = async () => {
    const authorized = await auth();
    if (authorized) {
      setModalVisible(false);
      if (operation == 'addNote') {
        addNote();
      } else if (operation == 'showNote') {
        showNote();
      }
    } else {
      alert("Błędne hasło");
      setModalVisible(false);
    }
  };

  return (
    <SafeAreaProvider>
      <SafeAreaView>
        <TextInput
          value={note}
          onChangeText={onChangeNote}
          placeholder="Notatka"
          style={styles.input}
        />
        <Button
          title="Zapisz notatkę"
          onPress={() => {
            setOperation('addNote');
            setModalVisible(true);
          }}
        />
        <Button
          title="Wyświetl notatkę"
          onPress={() => {
            setOperation('showNote');
            setModalVisible(true);
          }}
        />

        <Dialog.Container visible={modalVisible}>
          <Dialog.Title>Potwierdź operację</Dialog.Title>
          <Dialog.Description>
            Podaj hasło:
          </Dialog.Description>
          <TextInput
            value={password}
            onChangeText={setPassword}
            placeholder="Hasło"
            style={styles.input}
          />
          <Dialog.Button label="Anuluj" onPress={() => setModalVisible(false)} />
          <Dialog.Button label="Wykonaj" onPress={handleAuth} />
        </Dialog.Container>
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