// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getFirestore } from "firebase/firestore";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
	apiKey: "AIzaSyBdl2nALovNF5ULdbBGE9yA0UzUvaeUGks",
	authDomain: "house-marketplace-app-7b250.firebaseapp.com",
	projectId: "house-marketplace-app-7b250",
	storageBucket: "house-marketplace-app-7b250.appspot.com",
	messagingSenderId: "1031516069516",
	appId: "1:1031516069516:web:f446a78a99c69aebe5e5a9",
	measurementId: "G-374MBP13Z0",
};

// Initialize Firebase
initializeApp(firebaseConfig);
export const db = getFirestore();
