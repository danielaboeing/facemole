import React from 'react';
import { View, Text, TouchableHighlight, Image } from 'react-native';
import { Actions } from 'react-native-router-flux';

import styles from '../styles/Main.style';

export default class NavigationBar extends React.Component<any, any> {

    constructor(props: any){
        super(props);

    }

    render(){
        return (
            <View style={styles.navigationBar}>
            <Text style={styles.navbarText}>{this.props.title}</Text>
            <TouchableHighlight style={styles.hamburger}  onPress={() => Actions.drawerOpen()} >
            <Image style={styles.hamburgerPic} source={require('../assets/menu.png')} />

            </TouchableHighlight>
        </View>
        )
    }
}