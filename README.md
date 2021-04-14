# FaceMole

FaceMole ist eine Client-Server-Anwendung, die Menschen mit Prosopagnosie (Gesichtsblindheit) zu helfen. Hierzu steht eine React-Native-Anwendung zur Verfügung, mit der Gesichter bekannter Menschen mit Namen gespeichert werden können. Mittels des Python-Flask-Backends mit MongoDB-Datenbank können dann später bekannte Menschen wiedererkannt werden.

## Benötigte Pakete

### Backend

1. Paket <code>cblas</code> (auf Arch)
2. python -m venv flask-venv
3. source flask-venv/bin/activate
4. pip-Pakete installieren in VEnv:
  * face_recognition
  * flask
  * flask-restful
  * flask-cors
  * mongoengine


### Frontend

1. npm
2. expo (npm install -g expo-cli)
3. Expo-Packets:
* expo-camera
* react-native-router-flux (für Scenes / Stacks)
* react-native-screens (für Scenes / Stacks)
* react-native-gesture-handler (für Scenes / Stacks)
* react-native-reanimated (für Scenes / Stacks)
* expo-image-picker
* expo-face-detector
* axios
* form-data
* expo-image-manipulator
* expo-file-system

### Datenbank

1. Docker installieren und starten
2. Container starten mit Shell-Skript
3. docker exec -it mongod /bin/bash
4. mongo -u root -p example
5. use admin
6. db.grantRolesToUser("root", ["readWrite", {role: "dbAdmin", db: "facemole"}])
