// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getStorage, ref, uploadBytes } from "firebase/storage";
import ShortUniqueId from "short-unique-id";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: "AIzaSyCQRwQ_RXwl9uQoiVYbaHbaQyOZo97hjzY",
  authDomain: "studybuddy-90f0b.firebaseapp.com",
  projectId: "studybuddy-90f0b",
  storageBucket: "studybuddy-90f0b.appspot.com",
  messagingSenderId: "571241515318",
  appId: "1:571241515318:web:5e2b74be97a2cf6649cb97",
  measurementId: "G-Y4Q2B4XZ7S",
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const storage = getStorage(app);

const uid = new ShortUniqueId();

export const uploadImage = async (file: File, path?: string) => {
  if (!path) {
    const uuid = uid.randomUUID(20);
    path = `images/${uuid}`;
  }
  const reference = ref(storage, path);
  const res = await uploadBytes(reference, file);
  return res;
};
