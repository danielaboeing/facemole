import React from 'react';
import { View, Text, TouchableOpacity, Image, ImageBackground } from 'react-native';
import { Camera, FaceDetectionResult } from 'expo-camera';
import axios from 'axios';
import FormData from 'form-data';
import '../global'
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
        //this.onFacesDetected = this.onFacesDetected.bind(this)
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
                    userID: "1234" //TODO
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
            //TODO
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
            // @ts-ignore global variables not known in TS
            url: global.__SERVER_PATH__ + "/api/" + this.state.userID + "/compare",
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

    /*
        updateTracking({ faces }: any) {
    
            let allIDs: string[] = []
            faces.forEach((item: any) => {
                allIDs.push(item.faceID)
    
                if (this.state.detectedFaces.filter((e: any) => e.faceID === item.faceID).length === 0) {
                    // new faceID was added - send image to server
                    this.setState((currentState: any) => {
                        return {
                            detectedFaces: [...currentState.detectedFaces,
                            new DetectedFace(item.faceID, item.bounds.origin.x, item.bounds.origin.y, item.bounds.size.height, item.bounds.size.weight)
                            ]
                        }
                    })
    
                }
    
                // update position of already added faces
                this.setState((currentState: any) => {
                    return {
                        detectedFaces: currentState.detectedFaces.map((e: DetectedFace) => {
                            if (e.faceID === item.faceID) {
                                e.updateConstraints(item.bounds.origin.x, item.bounds.origin.y, item.bounds.size.width, item.bounds.size.height)
                            }
                            return e
                        })
                    }
                })
            })
            // delete faces from array that have disappeared
            this.setState((currentState: any) => {
                return {
                    detectedFaces: currentState.detectedFaces.filter((e: any) => allIDs.includes(e.faceID))
                }
            })
    
    
        }
    
    */
    /*
    
        onFacesDetected({ faces }: any) {
    
            this.updateTracking(faces);
    
            // @ts-ignore type "camera" does not exist on type "LivePage" - no fix from Camera module yet to support TS
            if (this.camera && this.state.hasCameraPermission) {
                // @ts-ignore type "camera" does not exist on type "LivePage" - no fix from Camera module yet to support TS
                this.camera.takePictureAsync()
                    .then((photo: any) => {
                        FaceDetector.detectFacesAsync(photo.uri, this.state.faceDetectorSettings)
                            .then(({ newFaces }: any) => {
                                newFaces.forEach((item: any) => {
                                    ImageManipulator.manipulateAsync(photo.uri, [{
                                        crop: {
                                            // Umrechnung: Bildschirmbreite auf Photobreite
                                            originX: (item.bounds.origin.x >= 0 ? (photo.width / Dimensions.get('window').width) * item.bounds.origin.x : 0),
                                            originY: (item.bounds.origin.y >= 0 ? (photo.height / Dimensions.get('window').height) * item.bounds.origin.y : 0),
                                            width: (photo.width / Dimensions.get('window').width) * item.bounds.size.width,
                                            height: (photo.height / Dimensions.get('window').height) * item.bounds.size.height
                                        },
                                        resize: {
                                            width: 800
                                        }
                                    }
                                    ], { compress: 1, format: ImageManipulator.SaveFormat.JPEG, base64: true })
                                        .then((manipPhoto: any) => this.processPhoto(item, manipPhoto))
                                })
    
                            })
                    })
            }
        }
        */

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
                    //onFacesDetected={this.onFacesDetected}
                    //faceDetectorSettings={this.state.faceDetectorSettings}
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