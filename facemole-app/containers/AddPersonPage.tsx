import React from 'react';
import { View, Text, TouchableOpacity, Image, Alert, TouchableHighlight, TextInput, Platform, Dimensions } from 'react-native';
import { Camera } from 'expo-camera';
import * as ImagePicker from 'expo-image-picker';
import * as ImageManipulator from 'expo-image-manipulator';
import axios from 'axios';
import Global from '../Global';

import styles from '../styles/Main.style';
import TakePhoto from './TakePhoto';

export default class AddPersonPage extends React.Component<any, any> {

    constructor(props: any) {
        super(props);
        this.state = {
            hasCameraPermission: null,
            hasMediaLibraryPermission: null,
            givenName: '',
            // zum Testen
            /*capturedImage: {
                uri: "file:///data/user/0/host.exp.exponent/cache/ExperienceData/%2540anonymous%252Ffacemole-app-3995658d-e765-4886-b292-6fec097d7abe/ImageManipulator/3d5aa3c1-52b4-4266-8326-13cb966500ff.jpg",
                width: 411,
                height: 548
            },*/
            capturedImage: null,
            userID: Global.__USER_ID__
        }
        this.setGivenName = this.setGivenName.bind(this);
        this.saveImage = this.saveImage.bind(this);
        this.setCapturedImage = this.setCapturedImage.bind(this);
        this.sendImageData = this.sendImageData.bind(this);
        this.cleanUp = this.cleanUp.bind(this);
    }

    setGivenName(text: String) {
        this.setState({
            givenName: text
        })
    }

    saveImage(image: any) {
        let formData = new FormData();

        formData.append('givenName', this.state.givenName);

        axios({
            method: 'post',
            url: Global.__SERVER_PATH__ + "/api/" + this.state.userID + "/persons",
            data: formData,
        }).then((resPerson: any) => {
            this.sendImageData(resPerson)
        }).catch((reason: any) => {
            console.log(reason);
            Alert.alert("Fehler", "Es ist ein Fehler beim Speichern der Person aufgetreten. Bitte versuchen Sie es erneut.");
            this.cleanUp()
        })

    }

    cleanUp(){
        this.setState({
            capturedImage: null,
            givenName: ""
        })
    }

    sendImageData(resPerson: any) {
        let formData = new FormData();
        let uriParts = this.state.capturedImage.uri.split('.');
        let fileType = uriParts[uriParts.length - 1];
        let personJSON = JSON.parse(resPerson.data)
        formData.append('image', {
            // @ts-ignore "uri" not found because state variable is of type "blob", no object literal
            uri: this.state.capturedImage.uri,
            name: `image.${fileType}`,
            type: `image/${fileType}`,
        })

        axios({
            method: 'post',
            url: Global.__SERVER_PATH__ + "/api/" + this.state.userID + "/persons/" + personJSON._id.$oid + "/photo",
            data: formData,
            headers: {
                'Content-Type': 'multipart/form-data',
            }
        }).then((resPhoto: any) => {
            if (resPhoto.status === 201) {
                if (resPerson.status === 201) {
                    Alert.alert("Erfolg", "Person wurde erfolgreich hinzugefügt.")
                }
                if (resPerson.status === 204) {
                    Alert.alert("Erfolg", "Person wurde erfolgreich geupdated.")
                }
            }
            this.cleanUp()
        }).catch((reason: any) => {
            console.log(reason);
            Alert.alert("Fehler", "Es ist ein Fehler beim Speichern des Bildes aufgetreten. Bitte fügen Sie dieses manuell hinzu.");
            this.cleanUp()
        })

    }

    setCapturedImage(image: any) {
        this.setState({
            capturedImage: image
        })
    }

    render() {
        if (this.state.capturedImage !== null) {
            return (
                <View style={{ flex: 1 }}>
                    <View style={styles.givenNameContainer}>
                        <TextInput
                            style={styles.givenNameInput}
                            onChangeText={this.setGivenName}
                            placeholder="Namen hier eingeben..."
                            value={this.state.givenName}
                        />
                    </View>
                    <Image
                        style={{
                            width: this.state.capturedImage.width,
                            height: this.state.capturedImage.height,
                            marginTop: (Dimensions.get("window").height - this.state.capturedImage.height) / 2  // Bild zentriert positionieren
                        }}
                        source={{ uri: this.state.capturedImage.uri }}
                    />
                    <TouchableHighlight
                        style={styles.savePhoto}
                        onPress={this.saveImage}>
                        <Image style={styles.innerImage} source={require('../assets/check.png')} />
                    </TouchableHighlight>


                </View>
            )
        }
        else {
            return (
                <TakePhoto enableChoosePhoto={true} onPhotoTaken={this.setCapturedImage} />
            )
        }
    }
}
