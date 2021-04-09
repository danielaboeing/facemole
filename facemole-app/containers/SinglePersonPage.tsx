import React from 'react';
import { View, Text, Dimensions, Image, Alert } from 'react-native';
import { TextInput, TouchableHighlight } from 'react-native-gesture-handler';
import Global from '../Global';
import axios from 'axios';
import * as FileSystem from 'expo-file-system';

import styles from '../styles/Main.style';
import TakePhoto from './TakePhoto';

export default class SinglePersonPage extends React.Component<any, any> {

    constructor(props: any) {
        super(props);
        this.state = {
            userID: Global.__USER_ID__,
            givenName: "",
            image: null,
            imageFileType: 'png',
            takePhoto: false,
        }
        this.setGivenName = this.setGivenName.bind(this);
        this.updatePersonInfo = this.updatePersonInfo.bind(this);
        this.updatePhoto = this.updatePhoto.bind(this);
    }

    componentDidMount() {
        axios({
            method: 'get',
            url: Global.__SERVER_PATH__ + "/api/" + this.state.userID + "/persons/" + this.props.personID,

        }).then((res: any) => {
            let personObject = JSON.parse(res.data);
            this.setState({
                givenName: personObject.givenName,
                imageFileType: personObject.imageFileType
            })
            FileSystem.downloadAsync(
                Global.__SERVER_PATH__ + "/api/" + this.state.userID + "/persons/" + this.props.personID + "/photo",
                FileSystem.cacheDirectory + "currentPerson" + this.state.imageFileType
            ).then((resPhoto: any) => {
                this.setState({
                    image: resPhoto
                })
            }).catch((reason: any) => {
                console.log(reason);
                Alert.alert("Fehler", "Das Bild konnte nicht geladen werden. Bitte versuchen Sie es erneut.");
            })

        }).catch((reason: any) => {
            console.log(reason);
            Alert.alert("Fehler", "Es ist ein Fehler aufgetreten. Bitte versuchen Sie es erneut.");
        })

    }

    updatePersonInfo() {
        let formData = new FormData();
        formData.append('givenName', this.state.givenName)
        axios({
            method: 'post',
            url: Global.__SERVER_PATH__ + "/api/" + this.state.userID + "/persons/" + this.props.personID,
            data: formData
        }).then((res: any) => {
            if (res.status === 201) {
                Alert.alert("Erfolg", "Änderungen wurden gespeichert");
            }
            /* not needed yet
            let personObject = JSON.parse(res.data);
            this.setState({
                fullName: personObject.fullName
            })*/
        }).catch((reason: any) => {
            console.log(reason);
            Alert.alert("Fehler", "Es ist ein Fehler aufgetreten. Bitte versuchen Sie es erneut.");
        })
    }

    updatePhoto(image: any) {

        this.setState({
            takePhoto: false,
        })

        let formData = new FormData();
        let uriParts = image.uri.split('.');
        let fileType = uriParts[uriParts.length - 1];
        formData.append('image', {
            // @ts-ignore "uri" not found because state variable is of type "blob", no object literal
            uri: image.uri,
            name: `image.${fileType}`,
            type: `image/${fileType}`,
        })

        axios({
            method: 'post',
            url: Global.__SERVER_PATH__ + "/api/" + this.state.userID + "/persons/" + this.props.personID + "/photo",
            data: formData,
            headers: {
                'Content-Type': 'multipart/form-data',
            }
        }).then((resPhoto: any) => {
            if (resPhoto.status === 201) {
                Alert.alert("Erfolg", "Foto wurde erfolgreich geupdated.")
            }
        }).catch((reason: any) => {
            console.log(reason);
            Alert.alert("Fehler", "Es ist ein Fehler beim Speichern des Bildes aufgetreten. Bitte versuchen Sie es erneut.");
        })

        this.setState({
            image: image
        })
    }

    setGivenName(text: string) {
        this.setState({
            givenName: text
        })
    }

    render() {
        if (this.state.takePhoto) {
            return (
                <TakePhoto enableChoosePhoto={true} onPhotoTaken={this.updatePhoto} />
            )
        }
        return (
            <View>
                <Text>Personübersicht</Text>
                <Text>Name: </Text>
                <TextInput
                    style={styles.givenNameInput}
                    onChangeText={this.setGivenName}
                    value={this.state.givenName}
                ></TextInput>
                {this.state.image ?
                    <Image
                        style={{
                            width: 100,
                            height: 100,
                        }}
                        source={{ uri: this.state.image.uri }}
                    />
                    :
                    <Text>Kein Bild vorhanden.</Text>
                }
                <TouchableHighlight
                    onPress={() => this.setState({ takePhoto: true })}
                >
                    <Text>Neues Foto</Text>
                </TouchableHighlight>

                <TouchableHighlight
                    onPress={this.updatePersonInfo}
                >
                    <Text>Speichern</Text>
                </TouchableHighlight>
            </View>
        )
    }
}