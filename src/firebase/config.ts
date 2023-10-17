import { initializeApp } from "firebase/app";

// Need to be updated once google login screen is finalised
export default function firebaseInit() {
  const firebaseConfig: { [key: string]: string } = {
    apiKey: "AIzaSyBn23BYVmwbT495z9bHeZGBYo8BFvFL0e8",
    authDomain: "brain-exercise-initiative.firebaseapp.com",
    projectId: "brain-exercise-initiative",
    storageBucket: "brain-exercise-initiative.appspot.com",
    messagingSenderId: "233330185060",
    appId: "1:233330185060:web:e346468160f509e3eba071",
    measurementId: "G-W3K638SJV1",
  };

  try {
    initializeApp(firebaseConfig);
  } catch (err) {
    // console.log(err);
  }
}
