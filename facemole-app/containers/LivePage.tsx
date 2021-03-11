import React from 'react';
import { View, Text } from 'react-native';
import { Camera } from 'expo-camera';

import styles from '../styles/Main.style';

export default class LivePage extends React.Component<any, any> {

    constructor(props: any) {
        super(props);
        this.state = {
            hasCameraPermission: null,
            detectedFaces: []

        }
        this.processPhoto = this.processPhoto.bind(this)
    }

    componentDidMount() {
        let intervalID = setInterval(this.processPhoto, 1000);
        this.setState({ intervalID: intervalID })
        Camera.requestPermissionsAsync()
            .then(data => {
                this.setState({
                    hasCameraPermission: data.status
                })
            });
    }

    componentWillUnmount() {
        clearInterval(this.state.intervalID);
    }

    async processPhoto() {
        // @ts-ignore type "camera" does not exist on type "LivePage" - no fix from Camera module yet to support TS
        if (this.camera && this.state.hasCameraPermission) {
            // @ts-ignore type "camera" does not exist on type "LivePage" - no fix from Camera module yet to support TS
            let photo = await this.camera.takePictureAsync();
            console.log(photo)

            // contact server
            /*
            let faces: any;
            this.setState({
                detectedFaces: []
            })
            faces.forEach((item: any) => {
                this.setState((currentState: any) => {
                    return ({
                        detectedFaces: [...currentState.detectedFaces,
                        {
                            x: item.bounds.origin.x,
                            y: item.bounds.origin.y,
                            height: item.bounds.size.height,
                            width: item.bounds.size.width,
                            givenName: ''
                        }
                        ]
                    })
                })
            })*/
        }


    }

    render() {
        let rectangles: JSX.Element[] = []
        if (this.state.detectedFaces.length > 0) {
            this.state.detectedFaces.forEach((item: any) => {
                console.log(item)
                rectangles.push(<View
                    style={{
                        borderWidth: 1,
                        borderColor: 'red',
                        position: 'absolute',
                        top: item.x,
                        left: item.y,
                        height: item.height,
                        width: item.width,
                    }}
                >
                    <Text
                    style={styles.givenNameDisplay}>
                        {item.givenName}
                    </Text>
                </View>)
            });
        }
        else {
            rectangles = []
        }

        if(this.state.hasCameraPermission === null){
            return (
                <View></View>
            )
        }
        if (this.state.hasCameraPermission !== 'granted'){
            return (
                <View style={{flex: 1}}>
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
                    {rectangles}
                </Camera>
            </View>
        )
    }
}