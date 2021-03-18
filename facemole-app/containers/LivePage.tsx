import React from 'react';
import { View, Text, TouchableOpacity, Image, ImageBackground, Alert } from 'react-native';
import { Camera, FaceDetectionResult } from 'expo-camera';
import axios from 'axios';
import FormData from 'form-data';
import Global from '../Global';
import * as FaceDetector from 'expo-face-detector';
import * as ImageManipulator from 'expo-image-manipulator';
import { Dimensions } from 'react-native';

import styles from '../styles/Main.style';
import DetectedFace from '../DetectedFace';

export default class LivePage extends React.Component<any, any> {

    constructor(props: any) {
        super(props);
        this.state = {
            hasCameraPermission: null,
            detectedFaces: []

        }
        this.processPhoto = this.processPhoto.bind(this)
        this.detectFaces = this.detectFaces.bind(this)
        this.sendPhoto = this.sendPhoto.bind(this)
    }

    componentDidMount() {
        Camera.requestPermissionsAsync()
            .then(data => {
                this.setState({
                    hasCameraPermission: data.status,
                    faceDetectorSettings: {
                        mode: FaceDetector.Constants.Mode.accurate,
                        detectLandmarks: FaceDetector.Constants.Landmarks.none,
                        runClassifications: FaceDetector.Constants.Classifications.none,
                        minDetectionInterval: 100,
                        tracking: true
                    },
                    userID: Global.__USER_ID__
                })
            });
    }

    processPhoto() {

        this.setState({
            detectFaces: []
        })
        // @ts-ignore type "camera" does not exist on type "LivePage" - no fix from Camera module yet to support TS
        if (this.camera && this.state.hasCameraPermission) {
            // @ts-ignore type "camera" does not exist on type "LivePage" - no fix from Camera module yet to support TS
            this.camera.takePictureAsync()
                .then((photo: any) => {
                    this.setState({
                        capturedImage: photo
                    })
                    this.detectFaces()
                })
        }
        else {
            Alert.alert("Fehler", "Funktion nicht verfügbar, wenn keine Kameraberechtigung vorliegt.")
        }
    }

    detectFaces() {
        FaceDetector.detectFacesAsync(this.state.capturedImage.uri, this.state.faceDetectorSettings)
            .then(({ faces }: any) => {
                faces.forEach((item: any) => {
                    ImageManipulator.manipulateAsync(this.state.capturedImage.uri, [{
                        crop: {
                            originX: (item.bounds.origin.x >= 0 ? item.bounds.origin.x : 0),
                            originY: (item.bounds.origin.y >= 0 ? item.bounds.origin.y : 0),
                            width: item.bounds.size.width,
                            height: item.bounds.size.height
                        },
                    }
                    ], { compress: 1, format: ImageManipulator.SaveFormat.JPEG, base64: true })
                        .then((manipPhoto: any) => this.sendPhoto(manipPhoto, item))
                })

            })
    }

    sendPhoto(photo: any, item: any) {
        // contact server
        let formData = new FormData();
        let uriParts = photo.uri.split('.');
        let fileType = uriParts[uriParts.length - 1];

        formData.append('image', {
            uri: photo.uri,
            name: `image.${fileType}`,
            type: `image/${fileType}`,
        })


        axios({
            method: 'post',
            url: Global.__SERVER_PATH__ + "/api/" + this.state.userID + "/compare",
            data: formData,
            headers: {
                'Content-Type': 'multipart/form-data',
            }
        }).then((res: any) => {
            this.setState((currentState: any) => {
                return ({
                    detectedFaces: [...currentState.detectedFaces,
                    new DetectedFace(res.data.ID, res.data.givenName, item.bounds.origin.x, item.bounds.origin.y, item.bounds.size.height, item.bounds.size.width)
                    ]
                })
            })

        })

    }

    render() {
        let camera: Camera | null = null;
        if (this.state.capturedImage != null) {
            return (
                <View style={{ flex: 1 }}>
                    <ImageBackground
                        style={{ flex: 1 }}
                        source={{ uri: this.state.capturedImage.uri }}
                    >
                        {
                            this.state.detectedFaces.map((item: any) => (
                                <View
                                    key={item.ID}
                                    style={{
                                        borderWidth: 1,
                                        borderColor: 'red',
                                        position: 'absolute',
                                        // Umrechnung: Photobreite auf Bildschirmbreite
                                        left: (item.x / this.state.capturedImage.width) * Dimensions.get('window').width,
                                        top: (item.y / this.state.capturedImage.height) * Dimensions.get('window').height,
                                        width: (item.width / this.state.capturedImage.width) * Dimensions.get('window').width,
                                        height: (item.height / this.state.capturedImage.height) * Dimensions.get('window').height,
                                    }}
                                ><Text style={styles.givenNameDisplay}>{item.givenName}</Text></View>
                            ))

                        }
                    </ImageBackground>

                </View>


            )
        }
        if (this.state.hasCameraPermission === null) {
            return (
                <View></View>
            )
        }
        if (this.state.hasCameraPermission !== 'granted') {
            return (
                <View style={{ flex: 1 }}>
                    <Text>Kein Zugriff auf die Kamera.</Text>
                </View>
            )
        }
        return (
            <View style={{ flex: 1 }}>
                <Camera
                    style={{ flex: 1 }}
                    type={Camera.Constants.Type.back}
                    // @ts-ignore type "camera" does not exist on type "LivePage" - no fix from Camera module yet to support TS
                    ref={(ref) => { this.camera = ref }}
                >

                </Camera>
                <View style={{ flexDirection: 'row' }} >
                    <TouchableOpacity
                        style={styles.takePhoto}
                        onPress={this.processPhoto}>
                        <Image style={styles.innerImage} source={require('../assets/takePhoto.png')}></Image>
                    </TouchableOpacity>
                </View>

            </View>
        )
    }
}