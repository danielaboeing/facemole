import { StyleSheet } from 'react-native';


const textColor: string = '#201919';
const specialFont: string = "Roboto";
const normalFont: string = "normal";
const bgColor: string = '#251313';
const bgColorAlt: string = '#827575';
const highlightColor: string = '#B3A2A2';
const borderColorAlt: string = '#CBCBCB';

export default StyleSheet.create({

    // general
    innerImage: {
        width: '100%',
        height: '100%',
        resizeMode: 'cover',
        margin: 0
    },


    // Navigation Bar
    navigationBar: {
        height: 70,
        left: 0,
        top: 0,
    },
    navbarText: {
        width: '100%',
        height: 35,
        right: 20,
        top: 30,
        fontFamily: specialFont,
        fontWeight: "normal",
        fontSize: 14,
        lineHeight: 29,
        textAlign: "right",
        color: highlightColor
    },
    hamburger: {
        position: "absolute",
        marginLeft: 17,
        marginTop: 40,
    },
    hamburgerPic: {
        width: 30,
        height: 15,
    },

    // Sidebar 
    sidebarTop: {
        height: 90,
        paddingTop: 30,
        flexDirection: 'row'
    },
    sidebarBottom: {
        height: '100%',
        backgroundColor: bgColorAlt,
    },
    sidebarMenuItem: {
        color: textColor,
        fontSize: 18,
        margin: 10
    },
    sidebarSubItem: {
        color: textColor,
        fontSize: 14,
        marginLeft: 20,
        margin: 5
    },
    sidebarLogo: {
        height: '80%',
        resizeMode: 'contain',
        flex: 1
    },
    sidebarLogoText: {
        flex: 2,
        fontFamily: specialFont,
        color: highlightColor,
        fontSize: 32
    },

    // FrontPage
    frontButton: {
        height: '40%',
        width: '80%',
        marginLeft: 'auto',
        marginRight: 'auto',
        marginTop: '10%',
        position: 'relative'
    },
    versionText: {
        position: 'absolute',
        right: 0,
        bottom: 0,
    },

    // AddPersonPage
    cameraRectangle: {
        borderWidth: 1,
        borderColor: 'red',
        height: 400,
        width: 300,
        marginLeft: 'auto',
        marginRight: 'auto',
        marginTop: 150,
        marginBottom: 50
    },
    takePhoto: {
        position: 'relative',
        height: 50,
        width: 50,
        marginLeft: 'auto',
        marginRight: 'auto'
    },
    givenNameInput: {
        fontSize: 20,
        color: textColor,
        position: 'relative',
        marginLeft: 'auto',
        marginRight: 'auto',
        marginTop: '5%'

    },
    givenNameContainer: {
        backgroundColor: 'white',
        width: '100%',
        position: 'absolute',
        top: 0,
        padding: 20
    },
    savePhoto: {
        position: 'absolute',
        height: 80,
        width: 80,
        marginLeft: 'auto',
        marginRight: 'auto',
        bottom: '10%',
        right: '10%'
    },

    //LivePage
    givenNameDisplay: {
        color: 'red',
        position: 'absolute',
        bottom: 0,
        right: 10
    },
    takePhotoContainer: {
        flexDirection: 'row', 
        position: 'absolute', 
        width: '100%', 
        bottom: '5%'
    }

});
