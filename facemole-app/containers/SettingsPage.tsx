import axios from "axios";
import React from "react";
import { TouchableHighlight, View, Text, Alert } from "react-native";
import Global from '../Global';
import styles from '../styles/Main.style';

export default class BasePage extends React.Component<any, any> {

    constructor(props: any) {
        super(props);
    }

    resetData() {
        axios({
            method: 'get',
            url: Global.__SERVER_PATH__ + "/api/testing",
        }).then((res: any) => {
            Alert.alert("Erfolg", "Serverdaten erfolgreich zurückgesetzt.");
        })
    }

    showLogs(){
        Alert.alert("Hinweis", "Noch nicht implementiert.")
    }

    render() {
        return (
            <View>
                <TouchableHighlight onPress={this.resetData}  style={styles.entryContainer}>
                    <Text style={styles.sidebarMenuItem}>Daten zurücksetzen</Text>
                </TouchableHighlight>
                <TouchableHighlight onPress={this.showLogs}  style={styles.entryContainer}>
                    <Text style={styles.sidebarMenuItem}>Logs anzeigen</Text>
                </TouchableHighlight>
            </View>
        )
    }
}