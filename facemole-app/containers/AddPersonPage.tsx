import React from 'react';
import { View, Text, TouchableOpacity, Image, ImageBackground, Alert, TouchableHighlight, TextInput, Platform } from 'react-native';
import { Camera } from 'expo-camera';
import * as ImagePicker from 'expo-image-picker';

import styles from '../styles/Main.style';

export default class AddPersonPage extends React.Component<any, any> {

    constructor(props: any) {
        super(props);
        this.state = {
            hasCameraPermission: null,
            hasMediaLibraryPermission: null,
            givenName: '',
            capturedImage: null,
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
        if(Platform.OS !== 'web'){
            ImagePicker.requestMediaLibraryPermissionsAsync()
            .then(data => {
                this.setState({
                    hasMediaLibraryPermission: data.status
                })
            })
        }
    }

    async choosePhoto(){
        if(this.state.hasMediaLibraryPermission){
            let result = await ImagePicker.launchImageLibraryAsync({
                mediaTypes: ImagePicker.MediaTypeOptions.All,
                allowsEditing: true,
                aspect: [1, 2],
                quality: 1,
            });
            if (!result.cancelled){
                this.setState({
                    capturedImage: result
                })
            }
        }
        else{
            Alert.alert("Fehler", "Es kann nicht auf Bilder zugegriffen werden, wenn keine Erlaubnis für den Zugriff auf die Media Library besteht.")
        }
    }

    async takePhoto(camera: Camera | null) {
        if (camera && this.state.hasCameraPermission) {
            let photo = await camera.takePictureAsync();
            this.setState({
                capturedImage: photo
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
        console.log(this.state.givenName);
        this.setState({
            capturedImage: null
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
                        <View style={styles.givenNameContainer}>
                        <TextInput
                            style={styles.givenNameInput}
                            onChangeText={this.setGivenName}
                            placeholder="Namen hier eingeben..."
                            value={this.state.givenName}
                        />
                        </View>
                        <TouchableHighlight
                            style={styles.savePhoto}
                            onPress={this.saveImage}>
                            <Image style={styles.innerImage} source={require('../assets/check.png')} />
                        </TouchableHighlight>

                    </ImageBackground>

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
