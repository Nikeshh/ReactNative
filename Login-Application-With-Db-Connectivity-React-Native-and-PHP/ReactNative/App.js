import React, { Component, useState } from 'react';
import { StyleSheet, TextInput, View, Alert, Button, Text } from 'react-native';
import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';


function LoginActivity({ route, navigation }) {

    const [UserEmail, setUserEmail] = useState("");
    const [UserPassword, setUserPassword] = useState("");

    UserLoginFunction = () => {

        if(UserEmail === ""){
            Alert.alert("User email is empty");
            return false;
        }

        if(UserPassword === ""){
            Alert.alert("User password is empty");
            return false;
        }

        fetch('http://localhost:8080/user_login/User_Login.php', {
            method: 'POST',
            headers: {
                'Accept': 'application/json',
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({
                username: UserEmail,
                password: UserPassword
            })
        }).then((response) => response.json())
            .then((responseJson) => {
                Alert.alert(responseJson);
                if (responseJson === 'Data Matched') {
                    navigation.navigate('Second', { Email: UserEmail });
                }
                else {
                    Alert.alert(responseJson);
                }

            }).catch((error) => {
                Alert.alert(error);
                console.error(error);
            });
    }

    return (
        <View style={styles.MainContainer}>
            <Text style={styles.TextComponentStyle}>User Login Form</Text>

            <TextInput
                placeholder="Enter User Email"
                underlineColorAndroid='transparent'
                onChange={(event) => setUserEmail({ UserEmail: event.nativeEvent.text })}
                value={UserEmail}
                style={styles.TextInputStyleClass}
            />

            <TextInput
                placeholder="Enter User Password"
                underlineColorAndroid='transparent'
                onChange={(event) => setUserPassword({ UserPassword: event.nativeEvent.text })}
                value={UserPassword}
                style={styles.TextInputStyleClass}
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