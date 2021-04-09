import React from 'react';
import Global from '../Global';
import { Ionicons } from '@expo/vector-icons';
import axios from 'axios';

import styles from '../styles/Main.style';
import { Alert, View, Text } from 'react-native';
import { TextInput, TouchableHighlight } from 'react-native-gesture-handler';

export default class AccountPage extends React.Component<any, any> {

    constructor(props: any) {
        super(props);
        this.state = {
            userID: Global.__USER_ID__,
            fullName: "",
        }
        this.updateUserInfo = this.updateUserInfo.bind(this);
        this.setFullName = this.setFullName.bind(this);
    }

    componentDidMount() {
        axios({
            method: 'get',
            url: Global.__SERVER_PATH__ + "/api/" + this.state.userID,
        }).then((res: any) => {
            let userObject = JSON.parse(res.data);
            this.setState({
                fullName: userObject.fullName
            })
        }).catch((reason: any) => {
            console.log(reason);
            Alert.alert("Fehler", "Es ist ein Fehler aufgetreten. Bitte versuchen Sie es erneut.");
        })
    }

    updateUserInfo() {
        let formData = new FormData();
        formData.append('fullName', this.state.fullName)
        axios({
            method: 'post',
            url: Global.__SERVER_PATH__ + "/api/" + this.state.userID,
            data: formData
        }).then((res: any) => {
            if (res.status === 201) {
                Alert.alert("Erfolg", "Änderungen wurden gespeichert");
            }
            /* not needed yet
            let userObject = JSON.parse(res.data);
            this.setState({
                fullName: userObject.fullName
            })*/
        }).catch((reason: any) => {
            console.log(reason);
            Alert.alert("Fehler", "Es ist ein Fehler aufgetreten. Bitte versuchen Sie es erneut.");
        })
    }

    setFullName(text: string) {
        this.setState({
            fullName: text
        })
    }

    render() {
        return (
            <View>
                <Text>Infos:</Text>
                <Text>Vollständiger Name: </Text>
                <TextInput
                    style={styles.givenNameInput}
                    onChangeText={this.setFullName}
                    value={this.state.fullName}
                ></TextInput>
                <TouchableHighlight
                    onPress={this.updateUserInfo}
                >
                    <Text>Hier</Text>
                </TouchableHighlight>
            </View>
        )
    }
}