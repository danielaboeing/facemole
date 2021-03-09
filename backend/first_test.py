import face_recognition

image = face_recognition.load_image_file("face.jpg")

face_landmarks_list = face_recognition.face_landmarks(image)

print(face_landmarks_list)


known_image = face_recognition.load_image_file("known_picture.jpg")
unknown_image = face_recognition.load_image_file("unknown_picture.jpg")

known_encoding = face_recognition.face_encodings(known_image)[0]
unknown_encoding = face_recognition.face_encodings(unknown_image)[0]

results = face_recognition.compare_faces([known_encoding], unknown_encoding)

print(results)
