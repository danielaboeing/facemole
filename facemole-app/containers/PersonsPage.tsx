import React from 'react';
import { Alert, View, FlatList, Text, TouchableHighlight } from 'react-native';
import axios from 'axios';
import Global from '../Global';
import { Ionicons } from '@expo/vector-icons';
import { Actions } from 'react-native-router-flux';

import styles from '../styles/Main.style';


export default class PersonsPage extends React.Component<any, any> {

    constructor(props: any) {
        super(props);
        this.state = {
            userID: Global.__USER_ID__,
            persons: []
        }
        this.deleteItem = this.deleteItem.bind(this)
    }

    componentDidMount() {
        this.setState({
            persons: []
        })
        axios({
            method: 'get',
            url: Global.__SERVER_PATH__ + "/api/" + this.state.userID + "/persons",
        }).then((res: any) => {
            res.data.map((item: any) => JSON.parse(item))
                .forEach((item: any) => this.setState((currentState: any) => {
                    return {
                        persons: [...currentState.persons, item]
                    }
                }))
        }).catch((reason: any) => {
            console.log(reason);
            Alert.alert("Fehler", "Es ist ein Fehler aufgetreten. Bitte versuchen Sie es erneut.");
        })
    }

    deleteItem(item: any) {
        axios({
            method: 'delete',
            url: Global.__SERVER_PATH__ + "/api/" + this.state.userID + "/persons/" + item._id.$oid
        }).then((res: any) => {
            this.setState((currentState: any) => {
                return {
                    persons: currentState.persons.filter((element: any) => element._id.$oid !== item._id.$oid)
                }
            })
        }).catch((reason: any) => {
            console.log(reason);
            Alert.alert("Fehler", "Es ist ein Fehler aufgetreten. Bitte versuchen Sie es erneut.");
        })
    }

    render() {
        return (
            <View>
                <FlatList
                    style={styles.listContainer}
                    data={this.state.persons}
                    renderItem={({ item }: any) => (
                        <View style={styles.entryContainer}>
                            <Text style={styles.nameEntry}>{item.givenName}</Text>
                            <TouchableHighlight
                                onPress={() => this.deleteItem(item)}
                            >
                                <Ionicons name="trash" size={30} style={styles.iconEntry} />
                            </TouchableHighlight>
                            <TouchableHighlight
                                onPress={() => Actions.singlePersonPage({ person: item })}
                            >
                                <Ionicons name="brush" size={30} style={styles.iconEntry} />
                            </TouchableHighlight>
                        </View>
                    )}
                    keyExtractor={(item: any) => item.id}
                />
            </View>
        )
    }

}