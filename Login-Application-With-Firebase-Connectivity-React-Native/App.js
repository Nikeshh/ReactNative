import React, { Component, useState } from 'react';
import { StyleSheet, ActivityIndicator,  TextInput, View, Alert, Text } from 'react-native';
import { NavigationContainer } from '@react-navigation/native';
import { Button, Input, Icon } from 'react-native-elements';
import { createStackNavigator } from '@react-navigation/stack';
import auth from '@react-native-firebase/auth';

function LoginActivity({ route, navigation }) {

    const [UserEmail, setUserEmail] = useState('');
    const [UserPassword, setUserPassword] = useState('');

    UserLoginFunction = async() => {

        if(UserEmail === ""){
            Alert.alert("User email is empty");
            return false;
        }

        if(UserPassword === ""){
            Alert.alert("User password is empty");
            return false;
        }

        if (/^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/.test(UserEmail.UserEmail.toString().trim()) === false)
        {
            Alert.alert("UserEmail is not valid");
            return false;
        }

        try {
            const doLogin = await auth().signInWithEmailAndPassword(UserEmail.UserEmail.toString().trim(), UserPassword.UserPassword.toString().trim());
            if(doLogin.user) {
                navigation.navigate('Second', { Email: UserEmail });
            }
        } catch (e) {
            Alert.alert(
                e.message
            );
        }
    }

    return (
        <View style={styles.MainContainer}>
            <Text style={styles.TextComponentStyle}>User Login Form</Text>

            <TextInput
                placeholder="Enter User Email"
                underlineColorAndroid='transparent'
                onChange={(event) => setUserEmail({ UserEmail: event.nativeEvent.text })}
                value={UserEmail}
                autoCapitalize = 'none'
                style={styles.TextInputStyleClass}
            />

            <TextInput
                placeholder="Enter User Password"
                underlineColorAndroid='transparent'
                onChange={(event) => setUserPassword({ UserPassword: event.nativeEvent.text })}
                value={UserPassword}
                style={styles.TextInputStyleClass}
                autoCapitalize = 'none'
                secureTextEntry={true}
            />

            <Button title="Click Here To Login" onPress={this.UserLoginFunction} color="#2196F3" />

        </View>
    );
}

function ProfileActivity({ route, navigation }) {
    const emailid = route.params.Email;
    return (
        <View style={styles.MainContainer}>
            <Text style={styles.TextComponentStyle}>
                {emailid.UserEmail}
            </Text>
            <Button title="Click here to Logout" onPress={() => navigation.goBack()}>
            </Button>
        </View>
    );
}

const Stack = createStackNavigator();

function MyStack() {
    return (
        <Stack.Navigator initialRouteName="First">
            <Stack.Screen name="First" component={LoginActivity} />
            <Stack.Screen name="Second" component={ProfileActivity} />
        </Stack.Navigator>
    );
}

export default function App() {
    return (
        <NavigationContainer>
            <MyStack />
        </NavigationContainer>
    );
}

// Styles
const styles = StyleSheet.create({

    MainContainer: {
        justifyContent: 'center',
        flex: 1,
        margin: 10,
    },

    TextInputStyleClass: {
        textAlign: 'center',
        marginBottom: 7,
        height: 40,
        borderWidth: 1,
        borderColor: '#2196F3',
        borderRadius: 5,
    },

    TextComponentStyle: {
        fontSize: 20,
        color: "#000",
        textAlign: 'center',
        marginBottom: 15
    }

});