import { Tabs } from "expo-router";
import { FontAwesome, FontAwesome5 } from '@expo/vector-icons';

export default function TabsNavigator() {
    return (
        <Tabs>
            <Tabs.Screen 
            name="index" 
            options={{
                title: 'Conversas',
                tabBarIcon: ({size, color}) => (
                    <FontAwesome name="home" size={size} color={color} />    
                ),
                }} 
            />
            <Tabs.Screen 
            name="profile" 
            options={{
                title: 'Perfil',
                tabBarIcon: ({size, color}) => (
                    <FontAwesome5 name="user-alt" size={size} color={color} />    
                ),
                }} 
            />
        
        </Tabs>
        
    );
}