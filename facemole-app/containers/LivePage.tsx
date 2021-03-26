import React from 'react';
import { View, Text, TouchableOpacity, Image, ImageBackground, Alert } from 'react-native';
import { Camera } from 'expo-camera';
import axios from 'axios';
import FormData from 'form-data';
import Global from '../Global';
import * as FaceDetector from 'expo-face-detector';
import * as ImageManipulator from 'expo-image-manipulator';
import { Dimensions } from 'react-native';

import styles from '../styles/Main.style';

class DetectedFace {
    ID: string;
    x: number;
    y: number;
    height: number;
    width: number;
    givenName: string;

    constructor(ID: string, givenName: string, x: number, y: number, height: number, width: number) {
        this.ID = ID;
        this.givenName = givenName;
        this.x = x;
        this.y = y;
        this.height = height;
        this.width = width;
    }
}

enum ProgressState {
    Initialize = "Initialisierung...",
    PhotoShot = "Foto wurde geschossen...",
    PhotoManipulated = "Foto wurde vorverarbeitet... Sollte der Status zu lange anhalten, wurde kein Gesicht gefunden.",
    FaceDetected = "Gesicht wurde entdeckt und wird an den Server gesandt...",
    ServerResponded = "Serverantwort liegt vor, Gesichtserkennung abgeschlossen."
}

export default class LivePage extends React.Component<any, any> {

    constructor(props: any) {
        super(props);
        this.state = {
            hasCameraPermission: null,
            detectedFaces: [],
            capturedImage: null,
            progressState: ProgressState.Initialize,
            // Testen
            /*capturedImage: {
                uri: "file:///data/user/0/host.exp.exponent/cache/ExperienceData/%2540anonymous%252Ffacemole-app-3995658d-e765-4886-b292-6fec097d7abe/ImageManipulator/3d5aa3c1-52b4-4266-8326-13cb966500ff.jpg",
                width: 411,
                height: 548
            },
            detectedFaces: [{ 
                new DetectedFace(1, "Test", 50, 50, 100m 100)
            }]*/

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
        // @ts-ignore type "camera" does not exist on type "LivePage" - no fix from Camera module yet to support TS
        if (this.camera && this.state.hasCameraPermission) {
            // @ts-ignore type "camera" does not exist on type "LivePage" - no fix from Camera module yet to support TS
            this.camera.takePictureAsync()
                .then((photo: any) => {
                    this.setState({
                        detectFaces: [],
                        progressState: ProgressState.PhotoShot
                    })
                    ImageManipulator.manipulateAsync(photo.uri, [{
                        resize: {
                            width: Dimensions.get("window").width
                        },
                    }
                    ], { compress: 1, format: ImageManipulator.SaveFormat.JPEG, base64: true })
                        .then((manipPhoto: any) => {
                            this.setState({
                                capturedImage: manipPhoto,
                                progressState: ProgressState.PhotoManipulated
                            })
                            this.detectFaces()
                        })
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
                        .then((manipPhoto: any) => {
                            this.setState({
                                progressState: ProgressState.FaceDetected
                            })
                            this.sendPhoto(manipPhoto, item)
                        })
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
                    progressState: ProgressState.ServerResponded,
                    detectedFaces: [...currentState.detectedFaces,
                    new DetectedFace(res.data.ID, res.data.givenName, item.bounds.origin.x, item.bounds.origin.y, item.bounds.size.height, item.bounds.size.width)
                    ]
                })
            })
        }).catch((reason: any) => {
            console.log(reason);
            Alert.alert("Fehler", "Es ist ein Fehler aufgetreten. Bitte versuchen Sie es erneut.");
        })

    }

    render() {
        let camera: Camera | null = null;
        if (this.state.capturedImage !== null) {
            return (
                <View>

                    <View style={{ flex: 1 }}>
                        <ImageBackground
                            style={{
                                width: this.state.capturedImage.width,
                                height: this.state.capturedImage.height,
                                marginTop: (Dimensions.get("window").height - this.state.capturedImage.height) / 2  // Bild zentriert positionieren
                            }}
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
                                            left: item.x,
                                            top: item.y,
                                            width: item.width,
                                            height: item.height,
                                        }}
                                    ><Text style={styles.givenNameDisplay}>{item.givenName}</Text></View>
                                ))
                            }
                        </ImageBackground>
                        <View style={styles.statusContainer}>
                            <Text style={styles.statusText}>
                                Status:
                            </Text>
                            <Text style={styles.statusContent}>
                                {this.state.progressState}
                            </Text>
                        </View>
                    </View>
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
                    <View style={styles.takePhotoContainer} >
                        <TouchableOpacity
                            style={styles.takePhoto}
                            onPress={this.processPhoto}>
                            <Image style={styles.innerImage} source={require('../assets/takePhoto.png')}></Image>
                        </TouchableOpacity>
                    </View>
                </Camera>

            </View>
        )
    }
}