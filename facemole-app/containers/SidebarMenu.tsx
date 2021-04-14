import React from 'react';
import { View, Text, TouchableHighlight, Image } from 'react-native';
import { Actions } from 'react-native-router-flux';

import styles from '../styles/Main.style';

export default class SidebarMenu extends React.Component<any, any> {

    constructor(props: any){
        super(props);
    }

    render() {
        return (
            <View>
                <View style={styles.sidebarTop}>
                    <Image style={styles.sidebarLogo} source={require('../assets/icon.png')}></Image>
                    <Text style={styles.sidebarLogoText}>FaceMole</Text>
                </View>
                <View style={styles.sidebarBottom}>
                    <TouchableHighlight onPress={() => Actions.frontPage()} >
                        <Text style={styles.sidebarMenuItem}>Startseite</Text>
                    </TouchableHighlight>

                    <TouchableHighlight onPress={() => Actions.personsPage()} >
                        <Text style={styles.sidebarMenuItem}>Personen verwalten</Text>
                    </TouchableHighlight>

                    <TouchableHighlight onPress={() => Actions.accountPage()} >
                        <Text style={styles.sidebarMenuItem}>Konto verwalten</Text>
                    </TouchableHighlight>

                    <TouchableHighlight onPress={() => Actions.settingsPage()} >
                        <Text style={styles.sidebarMenuItem}>Einstellungen</Text>
                    </TouchableHighlight>
                </View>
            </View>

        );
    }
}