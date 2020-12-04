import React, { Component, useState }from 'react';
import { StyleSheet, ActivityIndicator, TextInput, View, Alert, Text, ScrollView } from 'react-native';
import { NavigationContainer } from '@react-navigation/native';
import { Button, Input, Icon } from 'react-native-elements';
import { createStackNavigator } from '@react-navigation/stack';
import auth from '@react-native-firebase/auth';
import CheckBox from 'react-native-check-box';
import {db} from './src/config';

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
            const doLogin = await auth().signInWithEmailAndPassword(UserEmail.trim(), UserPassword.trim());
            if (doLogin.user) {
                this.props.navigation.navigate('Profile', { email: UserEmail });
            }
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

class ProfileActivity extends Component {

    constructor(props) {
        super(props);

        this.state = {
            todos: {},
            presentToDo: ''
        }
        this.addNewTodo = this.addNewTodo.bind(this);
    }

    componentDidMount() {
        db.ref('/todos').on('value', querySnapShot => {
            let data = querySnapShot.val() ? querySnapShot.val() : {};
            let todoItems = {...data};
            this.setState({
              todos: todoItems
            });
          });
    }

    addNewTodo() {
        const toDo = this.state.presentToDo;
        db.ref('/todos').push({
            done: false,
            todoItem: toDo
          });
          Alert.alert('Action!', 'A new To-do item was created');
          this.setState({
            presentToDo: '',
          });
    }

    clearTodos() {
        db.ref('/todos').remove();
    }

    render() {
        let todosKeys = Object.keys(this.state.todos);

        return (
            <ScrollView
                style={styles.container}
                contentContainerStyle={styles.contentContainerStyle}>
                <View style={styles.MainContainer}>
                    <Text style={styles.TextComponentStyle}>
                        {this.props.route.params.email}
                    </Text>
                    <Button title="Click here to Logout" onPress={() => this.props.navigation.goBack()}>
                    </Button>
                </View>
                <View>
                    {todosKeys.length > 0 ? (
                        todosKeys.map(key => (
                        <ToDoItem
                            key={key}
                            id={key}
                            todoItem={this.state.todos[key]}
                        />
                        ))
                    ) : (
                            <Text style={styles.TextInputStyleClass}>No todo item</Text>
                    )}
                </View>
                <TextInput
                    placeholder="Add new Todo"
                    underlineColorAndroid='transparent'
                    onChange={(event) => this.setState({ presentToDo: event.nativeEvent.text })}
                    value={this.state.presentToDo}
                    style={styles.TextInputStyleClass}
                    autoCapitalize='none'
                />
                <Button
                title="Add new To do item"
                onPress={this.addNewTodo}
                color="lightgreen"
                />
                <View style={{marginTop: 20}}>
                <Button title="Clear todos" onPress={this.clearTodos} color="red" />
                </View>
            </ScrollView>
        );
    }
}

const Stack = createStackNavigator();

function MyStack() {
    return (
        <Stack.Navigator initialRouteName="Login">
            <Stack.Screen name="Login" component={LoginActivity} />
            <Stack.Screen name="Profile" component={ProfileActivity} />
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

const ToDoItem = ({todoItem: {todoItem: name, done}, id}) => {
    const [doneState, setDone] = useState(done);
    const onCheck = () => {
        setDone(!doneState);
        db.ref('/todos').update({
          [id]: {
            todoItem: name,
            done: !doneState,
          },
        });
      };
    return (
      <View style={styles.todoItem}>
        <CheckBox
            checkBoxColor="skyblue"
            onClick={onCheck}
            isChecked={doneState}
            disabled={doneState}
        />
        <Text style={[styles.todoText, {opacity: doneState ? 0.2 : 1}]}>
          {name}
        </Text>
      </View>
    );
};

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
    },

    todoItem: {
        flexDirection: 'row',
        marginVertical: 10,
        alignItems: 'center',
    
      },
      todoText: {
        borderColor: '#afafaf',
        paddingHorizontal: 5,
        paddingVertical: 7,
        borderWidth: 1,
        borderRadius: 5,
        marginRight: 10,
        minWidth: "50%",
        textAlign: "center"
      }

});