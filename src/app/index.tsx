import { Redirect } from 'expo-router';
import { StatusBar } from 'expo-status-bar';
import { StyleSheet, Text, View } from 'react-native';

export default function HomeScreen() {
    return <Redirect href={'/(home)/(tabs)'} />;
 }





