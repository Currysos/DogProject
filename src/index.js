/*
    This is a project made for dog competitions where this app will make it easier for competitors and hosts
    to regulate who is starting when. 

    How to get started guide: https://www.youtube.com/watch?v=rQvOAnNvcNQ

    The project is in development state. Make sure to have node.js installed with these packages webpack, webpack-cli, serve. 
    To build: 'node_modules/.bin/webpack'
    To setup watchmode: 'npx webpack --watch'
    Open 'index.html' or run 'serve dist/' from the terminal to open the web-app
    Styling with SCSS, setup 

    Made by Noah Hjerdin
*/

// Import the functions you need from the SDKs you need
import { initializeApp } from 'firebase/app';
import { getAnalytics } from 'firebase/analytics';
import { getAuth, onAuthStateChanged } from 'firebase/auth'
import { getFirestore, addDoc, getDocs, collection } from 'firebase/firestore';
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

console.log('Hello, starting here!');

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: 'AIzaSyDBUU59RSjaY474U8im00EiIc1kYmqbgB4',
  authDomain: 'dogproject-afa73.firebaseapp.com',
  projectId: 'dogproject-afa73',
  storageBucket: 'dogproject-afa73.appspot.com',
  messagingSenderId: '334223697188',
  appId: '1:334223697188:web:1f2e460df8dcd7f9bdffb1',
  measurementId: 'G-6G6097VHK8'
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);

const analytics = getAnalytics(app);
const auth = getAuth(app)
const db = getFirestore(app);

// Detect auth state
onAuthStateChanged(auth, user => {
    if(user != null) {
        console.log('Logged in!');
    } else {
        console.log('No user');
    }
});

async function writeNewDog() {
    console.log('Start adding document');
    // Databases are built up collection/doc/collection/doc...
    const writeCollection = collection(db, 'competitions/2024-09-22/competitors');
    const docData = {
        startNR: 0,
        name: 'Peter',
        dogName: 'Lars',
        race: 'Fax',
        size: 'Liten',
        class: 'Klass-A',
        registered: true,
        started: false,
        deleted: false
    };
    try {
        await addDoc(writeCollection, docData);
        console.log(`Wrote this to database:`, docData);
    } catch (error) {
        console.log(`Error while uploading to database: ${error}`);
    }
    console.log('Done adding document');
}

async function getAllDogs(_date) {
    console.log(`Start getting all docs from ${_date}`);
    let _docs = [];
    try {
        const querySnapshot = await getDocs(collection(db, 'competitions', _date, 'competitors'));
        querySnapshot.forEach((doc) => {
            _docs.push(doc.data());
            writeDogToPage(doc.data());
        });
        console.log(_docs);
    } catch (error) {
        console.log(`Error while getting documents: ${error}`);
    }
    console.log('Done getting all documents in collection');
}

function getCurrentDate() {
    let today = new Date();
    let dd = String(today.getDate()).padStart(2, '0');
    let mm = String(today.getMonth() + 1).padStart(2, '0'); //January is 0!
    let yyyy = today.getFullYear();

    let _today = yyyy + '-' + mm + '-' + dd;
    return _today;
}

/* 
Write dog to list with id 'dogs'
To make unregistered: add class 'unregistered
To make deleted: add class 'deleted
If registered: no extra class
*/
function writeDogToPage(_dog) {
    document.getElementById('dogs').innerHTML += `
                <li>
                    <div>
                        <button>UP</button>
                        <button>DOWN</button>
                    </div>
                    <p>${_dog.startNR}</p>
                    <p>${_dog.dogName} ${_dog.race}</p>
                </li>`;
}

//writeNewDog();
getAllDogs('2024-09-22');

console.log("Today = " + getCurrentDate());