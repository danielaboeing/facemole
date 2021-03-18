
** benötigte Pakete**

BeeWare-App:
1. Python3 (https://docs.beeware.org/en/latest/tutorial/tutorial-0.html)
für Arch: sudo pacman -Syu git pkgconf cairo python-cairo pango gobject-introspection gobject-introspection-runtime python-gobject webkit2gtk
2. (idealerweise:) venv einrichten: 
$ mkdir beeware-tutorial
$ cd beeware-tutorial
$ python3 -m venv beeware-venv
3. jedes Mal zu Beginn: source beeware-venv/bin/activate
4. python -m pip install briefcase


briefcase new

Toga, damit Android / iOS

briefcase create android 
briefcase build android
briefcase run android -d <nuber> (USB-Anschluss)

Android Logs sehen: adb logcat -s MainActivity:* stdio:* Python:*