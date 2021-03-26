import React from 'react';
import { View, Text, TouchableOpacity, Image, ImageBackground, Alert, TouchableHighlight, TextInput, Platform, Dimensions } from 'react-native';
import { Camera } from 'expo-camera';
import * as ImagePicker from 'expo-image-picker';
import * as ImageManipulator from 'expo-image-manipulator';
import * as FileSystem from 'expo-file-system';
import axios from 'axios';
import Global from '../Global';

import styles from '../styles/Main.style';

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
        this.setGivenName = this.setGivenName.bind(this)
        this.saveImage = this.saveImage.bind(this)
        this.choosePhoto = this.choosePhoto.bind(this)
    }

    componentDidMount() {
        Camera.requestPermissionsAsync()
            .then(data => {
                this.setState({
                    hasCameraPermission: data.status
                })
            });
        if (Platform.OS !== 'web') {
            ImagePicker.requestMediaLibraryPermissionsAsync()
                .then(data => {
                    this.setState({
                        hasMediaLibraryPermission: data.status
                    })
                })
        }
    }

    async choosePhoto() {
        if (this.state.hasMediaLibraryPermission) {
            let result = await ImagePicker.launchImageLibraryAsync({
                mediaTypes: ImagePicker.MediaTypeOptions.All,
                allowsEditing: true,
                aspect: [1, 2],
                quality: 1,
            });
            if (!result.cancelled) {
                this.setState({
                    capturedImage: result
                })
            }
        }
        else {
            Alert.alert("Fehler", "Es kann nicht auf Bilder zugegriffen werden, wenn keine Erlaubnis für den Zugriff auf die Media Library besteht.")
        }
    }

    async takePhoto(camera: Camera | null) {
        if (camera && this.state.hasCameraPermission) {
            let photo = await camera.takePictureAsync();
            let manipPhoto = await ImageManipulator.manipulateAsync(photo.uri, [{
                resize: {
                    width: Dimensions.get("window").width
                },
            }], { compress: 1, format: ImageManipulator.SaveFormat.JPEG, base64: true })

            this.setState({
                capturedImage: manipPhoto
            })
        }
        else {
            Alert.alert("Fehler", "Die Kamera kann nicht genutzt werden, solange es die Berechtigung nicht erteilt wurde.")
        }
    }

    setGivenName(text: String) {
        this.setState({
            givenName: text
        })
    }

    saveImage() {
        let formData = new FormData();
        let uriParts = this.state.capturedImage.uri.split('.');
        let fileType = uriParts[uriParts.length - 1];

        formData.append('givenName', this.state.givenName);
        formData.append('image', {
            // @ts-ignore "uri" not found because state variable is of type "blob", no object literal
            uri: this.state.capturedImage.uri,
            name: `image.${fileType}`,
            type: `image/${fileType}`,
        })

        axios({
            method: 'post',
            url: Global.__SERVER_PATH__ + "/api/" + this.state.userID + "/persons",
            data: formData,
            headers: {
                'Content-Type': 'multipart/form-data',
            }
        }).then((res: any) => {
            if (res.status === 200) {
                Alert.alert("Erfolg", "Person wurde erfolgreich hinzugefügt.")
            }
            else {
                new Error(res.status);
            }
        }).catch((reason: any) => {
            console.log(reason);
            Alert.alert("Fehler", "Es ist ein Fehler aufgetreten. Bitte versuchen Sie es erneut.");
        })


        this.setState({
            capturedImage: null,
            givenName: ""
        })
    }

    render() {
        let camera: Camera | null = null;
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
            if (this.state.hasCameraPermission === null) {
                return (
                    <View></View>
                )
            }
            if (this.state.hasCameraPermission !== 'granted') {
                return (
                    <View style={{ flex: 1 }}>
                        <Text>Kein Zugriff auf die Kamera.</Text>
                        <View style={{ flexDirection: 'row' }} >
                            <TouchableOpacity
                                style={styles.takePhoto}
                                onPress={this.choosePhoto}>
                                <Image style={styles.innerImage} source={require('../assets/choosePhoto.png')}></Image>
                            </TouchableOpacity>
                        </View>
                    </View>
                )
            }
            return (
                <View style={{ flex: 1 }}>
                    <Camera style={{ flex: 1 }} type={Camera.Constants.Type.back} ref={(ref) => { camera = ref }}>
                        <View style={styles.cameraRectangle}
                        ></View>
                        <View style={{ flexDirection: 'row' }} >
                            <TouchableOpacity
                                style={styles.takePhoto}
                                onPress={() => this.takePhoto(camera)}>
                                <Image style={styles.innerImage} source={require('../assets/takePhoto.png')}></Image>
                            </TouchableOpacity>
                            <TouchableOpacity
                                style={styles.takePhoto}
                                onPress={this.choosePhoto}>
                                <Image style={styles.innerImage} source={require('../assets/choosePhoto.png')}></Image>
                            </TouchableOpacity>

                        </View>
                    </Camera>
                </View>
            )

        }
    }
}
