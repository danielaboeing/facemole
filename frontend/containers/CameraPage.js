import React from 'react';
import { StyleSheet, Text, View, TouchableOpacity, Image } from 'react-native';
import { Camera } from 'expo-camera';

// https://www.freecodecamp.org/news/how-to-create-a-camera-app-with-expo-and-react-native/

export default class CameraPage extends React.Component {
 
  constructor(props){
    super(props)
    this.state = {
      previewVisible: false,
      capturedImage: false
    }
  }

  async takePhoto(camera){
   if(camera){
          let photo = await camera.takePictureAsync();
          //photo.uri
          this.setState({
            previewVisible: true,
            capturedImage: photo,
          })
          console.log(photo)
      }
  
  }

    render() {
  return (
    <View style={styles.container}>
      {this.state.previewVisible && this.state.capturedImage ? (
        <Image 
        style={styles.camera}
        source={{ uri: this.state.capturedImage.uri }}
        />
      ) : (
      <Camera style={styles.camera} type={Camera.Constants.Type.back} ref={ref => {this.camera = ref}}>
        <View style={styles.buttonContainer}>
            <TouchableOpacity
                style={styles.button}
                onPress={() => this.takePhoto(this.camera)}>
                    <Text style={styles.text}>Take Photo</Text>
            </TouchableOpacity>
        </View>
      </Camera>
      )}
    </View>
  
  );
}

}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  camera: {
    flex: 1,
  },
  buttonContainer: {
    flex: 1,
    backgroundColor: 'transparent',
    flexDirection: 'row',
    margin: 20,
  },
  button: {
    flex: 0.1,
    alignSelf: 'flex-end',
    alignItems: 'center',
  },
  text: {
    fontSize: 18,
    color: 'white',
  },
});
