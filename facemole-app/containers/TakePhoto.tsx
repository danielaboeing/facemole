import React from 'react';
import { View, Text, TouchableOpacity, Image, Alert, Platform, Dimensions } from 'react-native';
import { Camera } from 'expo-camera';
import * as ImagePicker from 'expo-image-picker';
import * as ImageManipulator from 'expo-image-manipulator';

import styles from '../styles/Main.style';

export default class TakePhoto extends React.Component<any, any> {

    constructor(props: any) {
        super(props);
        this.state = {
            hasCameraPermission: null,
            hasMediaLibraryPermission: null,
            capturedImage: null,
            enableChoosePhoto: this.props.enableChoosePhoto,
            onPhotoTaken: this.props.onPhotoTaken
        }
        this.choosePhoto = this.choosePhoto.bind(this)
    }

    componentDidMount() {
        Camera.requestPermissionsAsync()
            .then(data => {
                this.setState({
                    hasCameraPermission: data.status
                })
            });
        if (Platform.OS !== 'web' && this.state.enableChoosePhoto) {
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
        this.state.onPhotoTaken(this.state.capturedImage);
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
        this.state.onPhotoTaken(this.state.capturedImage);
    }

    render() {
        let camera: Camera | null = null;
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
                        {this.state.enableChoosePhoto &&
                            <TouchableOpacity
                                style={styles.takePhoto}
                                onPress={this.choosePhoto}>
                                <Image style={styles.innerImage} source={require('../assets/choosePhoto.png')}></Image>
                            </TouchableOpacity>
                        }
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
                        {this.state.enableChoosePhoto &&
                            <TouchableOpacity
                                style={styles.takePhoto}
                                onPress={this.choosePhoto}>
                                <Image style={styles.innerImage} source={require('../assets/choosePhoto.png')}></Image>
                            </TouchableOpacity>
                        }
                    </View>
                </Camera>
            </View>
        )

    }
}

