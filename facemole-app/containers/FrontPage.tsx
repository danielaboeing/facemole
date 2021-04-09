import axios from 'axios';
import Constants from 'expo-constants';
import React from 'react';
import { View, Image, TouchableHighlight, Text, Alert } from 'react-native';
import { Actions } from 'react-native-router-flux';
import Global from '../Global';

import styles from '../styles/Main.style';

export default class FrontPage extends React.Component<any, any> {

    constructor(props: any) {
        super(props);
        this.state = {
            debugMode: Global.__DEBUG_MODE__
        }
    }

    resetData() {
        // to be removed
        axios({
            method: 'get',
            url: Global.__SERVER_PATH__ + "/api/testing",
        }).then((res: any) => {
            Alert.alert("Erfolg", "Serverdaten erfolgreich zurückgesetzt.");
        })
    }

    render() {
        return (
            <View style={{ flex: 1 }}>
                <TouchableHighlight style={styles.frontButton} onPress={() => Actions.livePage()}>
                    <Image style={styles.innerImage} source={require('../assets/live.jpg')} />
                </TouchableHighlight>

                <TouchableHighlight style={styles.frontButton} onPress={() => Actions.addPersonPage()}>
                    <Image style={styles.innerImage} source={require('../assets/addPerson.png')} />
                </TouchableHighlight>

                <View style={styles.versionText}>
                    {this.state.debugMode===true ?
                        <TouchableHighlight onPress={this.resetData}>
                            <Text>FaceMole v{Constants.nativeAppVersion}</Text>
                        </TouchableHighlight>
                        :
                        <Text>FaceMole v{Constants.nativeAppVersion}</Text>
                    }
                </View>
            </View>
        )
    }
}
