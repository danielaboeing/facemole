import Constants from 'expo-constants';
import React from 'react';
import { View, Image, TouchableHighlight, Text } from 'react-native';
import { Actions } from 'react-native-router-flux';

import styles from '../styles/Main.style';

export default class FrontPage extends React.Component<any, any> {

    constructor(props: any) {
        super(props);
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

            </View>
        )
    }
}
