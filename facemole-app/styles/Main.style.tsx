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
        right: 10,
        bottom: 10,
        color: textColor
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
        height: 70,
        width: 70,
        marginLeft: 'auto',
        marginRight: 'auto'
    },
    givenNameInput: {
        fontSize: 20,
        color: textColor,
        position: 'relative',
        marginLeft: 'auto',
        marginRight: 'auto',
        textAlign: 'center'

    },
    givenNameContainer: {
        backgroundColor: 'white',
        width: '100%',
        position: 'absolute',
        top: 50,
        padding: 20
    },
    savePhoto: {
        position: 'absolute',
        height: 80,
        width: 80,
        marginLeft: 'auto',
        marginRight: 'auto',
        bottom: '5%',
        right: '5%'
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
    },
    statusContainer: {
        flex: 1,
        padding: 20,
    },
    statusText: {
        fontSize: 22,
        color: highlightColor,
        marginBottom: 10,
    },
    statusContent: {
        fontSize: 16,
    },

    // PersonsPage
    listContainer: {
        marginTop: 10,
        marginBottom: 10
    },
    entryContainer: {
        flexDirection: 'row',
        borderBottomColor: highlightColor,
        borderBottomWidth: 1,
        paddingBottom: 10,
        paddingTop: 10,
        paddingLeft: 20,
        paddingRight: 20,
    },
    nameEntry: {
        flex: 6,
        fontSize: 20,
        alignContent: 'center',
    },
    iconEntry: { 
        flex: 1,
        color: highlightColor
    }

});
