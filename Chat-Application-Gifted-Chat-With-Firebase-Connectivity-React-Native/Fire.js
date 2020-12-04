import firebase from "firebase";
import { Alert } from 'react-native';

class Fire {

    constructor() {
        this.init();
    }

    init = () => {
        const firebaseConfig = {
            apiKey: "AIzaSyAozxX3p9OKX2AWertjzUEdSPP5pFBGaik",
            authDomain: "loginapplication-efd2c.firebaseapp.com",
            databaseURL: "https://loginapplication-efd2c.firebaseio.com",
            projectId: "loginapplication-efd2c",
            storageBucket: "loginapplication-efd2c.appspot.com",
            messagingSenderId: "457777169220",
            appId: "1:457777169220:web:bc8f0f665f6a78ebe2cd11",
            measurementId: "G-5XXNE5TW6V"
        };
        firebase.initializeApp(firebaseConfig)
    };

    send = messages => {
        messages.forEach(item => {
            const message = {
                text: item.text,
                timestamp: firebase.database.ServerValue.TIMESTAMP,
                user: item.user
            }

            this.db.push(message);
        });
    };

    parse = message => {
        const { user, text, timestamp } = message.val();
        const { key: _id } = message;
        const createdAt = new Date(timestamp);

        return {
            _id,
            createdAt,
            text,
            user
        }
    }

    get = callback => {
        this.db.on("child_added", snapshot => callback(this.parse(snapshot)));
    };

    off() {
        this.db.off();
    }

    get db() {
        return firebase.database().ref("messages");
    }

    get uid() {
        return firebase.auth().currentUser.uid;
    }

    auth = async (email, password, props) => {
        try {
            const doLogin = await firebase.auth().signInWithEmailAndPassword(email, password);
            if (doLogin.user) {
                props.navigation.navigate('Chat', { email: email });
            } else {
                Alert.alert("Invalid user email / user password");
            }        } catch (e) {
            Alert.alert(
                e.message
            );
        }
    }
}

export default new Fire();