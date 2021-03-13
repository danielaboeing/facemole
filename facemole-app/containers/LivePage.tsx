import React from 'react';
import { View, Text } from 'react-native';
import { Camera, FaceDetectionResult } from 'expo-camera';
import axios from 'axios';
import FormData from 'form-data';
import '../global'
import * as FaceDetector from 'expo-face-detector';
import * as ImageManipulator from 'expo-image-manipulator';
import { Dimensions } from 'react-native';

import styles from '../styles/Main.style';

export default class LivePage extends React.Component<any, any> {

    constructor(props: any) {
        super(props);
        this.state = {
            hasCameraPermission: null,
            detectedFaces: []

        }
        this.processPhoto = this.processPhoto.bind(this)
        this.onFacesDetected = this.onFacesDetected.bind(this)
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
                    }
                })
            });
    }

    async processPhoto(face: any) {
        // @ts-ignore type "camera" does not exist on type "LivePage" - no fix from Camera module yet to support TS
        if (this.camera && this.state.hasCameraPermission) {
            // @ts-ignore type "camera" does not exist on type "LivePage" - no fix from Camera module yet to support TS
            let photo = await this.camera.takePictureAsync();

            let manipPhoto = await ImageManipulator.manipulateAsync(photo.uri, [{
                crop: {
                    originX: (face.bounds.origin.x >= 0 ? (photo.width / Dimensions.get('window').width)*face.bounds.origin.x : 0),
                    originY: (face.bounds.origin.y >= 0 ? (photo.height / Dimensions.get('window').height)*face.bounds.origin.y : 0),
                    width: (photo.width / Dimensions.get('window').width)*face.bounds.size.width,
                    height: (photo.height / Dimensions.get('window').height)*face.bounds.size.height
                }
            }], {compress: 1, format: ImageManipulator.SaveFormat.JPEG, base64: true})

            manipPhoto = photo
            // contact server
            let formData = new FormData();
            let uriParts = manipPhoto.uri.split('.');
            let fileType = uriParts[uriParts.length - 1];

            formData.append('image', {
                uri: manipPhoto.uri,
                name: `image.${fileType}`,
                type: `image/${fileType}`,
            })


            let res: any = await axios({
                method: 'post',
                // @ts-ignore
                url: global.__SERVER_PATH__ + "/api/1234/compare",
                data: formData,
                headers: {
                    'Content-Type': 'multipart/form-data',
                }
            })

            this.setState((currentState: any) => {
                return ({
                    detectedFaces: currentState.detectedFaces.map((e: any) => {
                        if (e.faceID === face.faceID) {
                            e.givenName = res.data.givenName
                        }
                        return e
                    })
                })
            })

        }




    }

    onFacesDetected({ faces }: any) {
        let allIDs: string[] = []
        // check if new face was detected by faceID
        faces.forEach((item: any) => {
            allIDs.push(item.faceID)
            if (this.state.detectedFaces.filter((e: any) => e.faceID === item.faceID).length === 0) {
                // new faceID was added - send image to server
                this.setState((currentState: any) => {
                    return {
                        detectedFaces: [...currentState.detectedFaces, {
                            faceID: item.faceID,
                            x: item.bounds.origin.x,
                            y: item.bounds.origin.y,
                            height: item.bounds.size.height,
                            width: item.bounds.size.width,
                            givenName: 'Processing...'
                        }]
                    }
                })
                this.processPhoto(item)
            }
            else {
                // update position of already added faces
                this.setState((currentState: any) => {
                    return {
                        detectedFaces: currentState.detectedFaces.map((e: any) => {
                            if (e.faceID === item.faceID) {
                                e.x = item.bounds.origin.x;
                                e.y = item.bounds.origin.y;
                                e.width = item.bounds.size.width;
                                e.height = item.bounds.size.height;
                            }
                            return e
                        })
                    }
                })
            }
        })

        // delete faces from array that have disappeared
        this.setState((currentState: any) => {
            return {
                detectedFaces: currentState.detectedFaces.filter((e: any) => allIDs.includes(e.faceID))
            }
        })

    }

    render() {
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
                    onFacesDetected={this.onFacesDetected}
                    faceDetectorSettings={this.state.faceDetectorSettings}
                    // @ts-ignore type "camera" does not exist on type "LivePage" - no fix from Camera module yet to support TS
                    ref={(ref) => { this.camera = ref }}
                >

                </Camera>
                {
                    this.state.detectedFaces.map((item: any) => (
                        <View
                            key={item.faceID}
                            style={{
                                borderWidth: 1,
                                borderColor: 'red',
                                position: 'absolute',
                                left: item.x,
                                top: item.y,
                                width: item.width,
                                height: item.height,
                            }}
                        ><Text style={styles.givenNameDisplay}>{item.givenName}</Text></View>
                    ))

                }
            </View>
        )
    }
}