import React, { Component } from 'react';
import { StyleSheet, TextInput, View, Alert, Text, Platform, KeyboardAvoidingView, SafeAreaView } from 'react-native';
import { NavigationContainer } from '@react-navigation/native';
import { Button } from 'react-native-elements';
import { createStackNavigator } from '@react-navigation/stack';
import { GiftedChat } from 'react-native-gifted-chat';
import Fire from './Fire';

class LoginActivity extends Component {

    constructor(props) {
        super(props);

        this.state = {
            UserEmail: '',
            UserPassword: ''
        }
    }

    UserLoginFunction = async () => {

        const UserEmail = this.state.UserEmail;
        const UserPassword = this.state.UserPassword;

        if (UserEmail === "") {
            Alert.alert("User email is empty");
            return false;
        }

        if (UserPassword === "") {
            Alert.alert("User password is empty");
            return false;
        }

        if (/^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/.test(UserEmail.trim()) === false) {
            Alert.alert("UserEmail is not valid");
            return false;
        }

        try {
            Fire.auth(UserEmail.trim(), UserPassword.trim(), this.props);
        } catch (e) {
            Alert.alert(
                e.message
            );
        }
    }
    render() {
        return (
            <View style={styles.MainContainer}>
                <Text style={styles.TextComponentStyle}>User Login Form</Text>

                <TextInput
                    placeholder="Enter User Email"
                    underlineColorAndroid='transparent'
                    onChange={(event) => this.setState({ UserEmail: event.nativeEvent.text })}
                    value={this.props.UserEmail}
                    autoCapitalize='none'
                    style={styles.TextInputStyleClass}
                />

                <TextInput
                    placeholder="Enter User Password"
                    underlineColorAndroid='transparent'
                    onChange={(event) => this.setState({ UserPassword: event.nativeEvent.text })}
                    value={this.props.UserPassword}
                    style={styles.TextInputStyleClass}
                    autoCapitalize='none'
                    secureTextEntry={true}
                />

                <Button title="Click Here To Login" onPress={this.UserLoginFunction} color="#2196F3" />

            </View>
        );
    }
}

class ChatActivity extends Component {
    state = {
        messages: []
    }

    get user() {
        return {
            _id: Fire.uid,
            name: this.props.route.params.email
        }
    }

    componentDidMount() {
        Fire.get(message =>
            this.setState(previous => ({
                messages: GiftedChat.append(previous.messages, message)
            }))
        );
    }

    componentWillUnmount() {
        Fire.off();
    }

    render() {
        const chat = <GiftedChat messages={this.state.messages} onSend={Fire.send} user={this.user} />

        if (Platform.OS === "android") {
            return (
                <KeyboardAvoidingView style={{ flex: 1 }} behavior="padding" keyboardVerticalOffset={30} enabled>
                    {chat}
                </KeyboardAvoidingView>
            );
        }

        return <SafeAreaView style={{ flex: 1 }}>{chat}</SafeAreaView>
    }
}

const Stack = createStackNavigator();

function MyStack() {
    return (
        <Stack.Navigator initialRouteName="Login">
            <Stack.Screen name="Login" component={LoginActivity} />
            <Stack.Screen name="Chat" component={ChatActivity} />
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

    container: {
        flex: 1,
        backgroundColor: '#F4F5F7'
    },

    circle: {
        width: 500,
        height: 500,
        borderRadius: 500 / 2,
        backgroundColor: '#FFFF',
        position: 'absolute',
        left: -120,
        top: -20
    },

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
    },

    header: {
        fontWeight: "800",
        fontSize: 30,
        color: "#514E5A",
        marginTop: 32
    },
    input: {
        marginTop: 32,
        height: 50,
        borderWidth: StyleSheet.hairlineWidth,
        borderColor: "#BAB7C3",
        borderRadius: 30,
        paddingHorizontal: 16,
        color: "#514E5A",
        fontWeight: "600"
    },

    continue: {
        width: 79,
        height: 79,
        borderRadius: 79 / 2,
        backgroundColor: "#9075E3",
        alignItems: "center",
        justifyContent: "center"
    }

});