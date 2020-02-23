import firebase from 'firebase'

const firebaseConfig = {
  apiKey: 'AIzaSyDfi_F2VLU71uWqK2-suVZljYMub57rSws',
  authDomain: 'nekomzs2.firebaseapp.com',
  databaseURL: 'https://nekomzs2.firebaseio.com',
  projectId: 'nekomzs2',
  storageBucket: 'nekomzs2.appspot.com',
  messagingSenderId: '400729876408',
  appId: '1:400729876408:web:da0ce9cff0de39a3f2114d',
  measurementId: 'G-LD3T5MPYDM'
}

// Initialize Firebase
firebase.initializeApp(firebaseConfig)
firebase.analytics()

// window.firebase = firebase

export default firebase
