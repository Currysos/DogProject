/*
    This is a project made for dog competitions where this app will make it easier for competitors and hosts
    to regulate who is starting when. 

    How to get started guide: https://www.youtube.com/watch?v=rQvOAnNvcNQ

    The project is in development state. Make sure to have node.js installed with these packages webpack, webpack-cli, serve. 
    To build: 'node_modules/.bin/webpack'
    To setup watchmode: 'npx webpack --watch'
    Open 'index.html' or run 'serve dist/' from the terminal to open the web-app
    Styling with SCSS, setup 

    Database is setup in firebase (firestore), syntax: 
    competitions/"date"/classes/"class"/sizes/"size"/competitors/"competitor ID
    Example competitor: competitions/2024-10-18/classes/Klass A/sizes/XS/competitors/mlyVW0i50wTkB8BGNKYR

    Made by Noah Hjerdin
*/

// Import the functions you need from the SDKs you need
import { initializeApp } from 'firebase/app';
import { getAnalytics } from 'firebase/analytics';
import { getAuth, onAuthStateChanged } from 'firebase/auth'
import { getFirestore, addDoc, getDocs, collection } from 'firebase/firestore';


// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

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

// Initialize Firebase app
const app = initializeApp(firebaseConfig);

const analytics = getAnalytics(app);
const auth = getAuth(app)
const db = getFirestore(app);

// Detect auth state
onAuthStateChanged(auth, user => {
    if (user != null) {
        console.log('Logged in!');
    } else {
        console.log('No user');
    }
});

console.log('Hello, starting here!');

//START FUNCTIONS
//---------------------------------------------------------------------------------
// Get All Comps
async function getCompetitions() {
    console.log(`Getting Comps`);
    let _comps = [];
    try {
        const querySnapshot = await getDocs(collection(db, '/competitions'));
        querySnapshot.forEach((doc) => {
            _comps.unshift(doc.id);
        });
    } catch (error) {
        console.log(`Error while getting competitions: ${error}`);
    }

    writeCompetitionsToPage(_comps);

    console.log('Done getting all competitions');
    return _comps;
}
// Write Comps to page
function writeCompetitionsToPage(_comps) {
    let elem = document.getElementById('compSidebar');
    _comps.forEach((id) => {
        elem.innerHTML += `
        <a onClick="getComp(${id})">${id}</a>
    `;
    });

}

// Write Comp header to page
function writeCompetitionHeader(_currentCompetition) {
    document.getElementById('compHeader').innerHTML = _currentCompetition;
}

// Get All Classes in comp
async function getClasses(_currentCompetition) {
    console.log(`Getting Classes`);
    let _classes = [];
    try {
        const querySnapshot = await getDocs(collection(db, `/competitions/${_currentCompetition}/classes`));
        querySnapshot.forEach((doc) => {
            _classes.push(doc.id);
        });
    } catch (error) {
        console.log(`Error while getting classes: ${error}`);
    }
    
    writeClassesToPage(_classes);
    
    console.log('Done getting all classes in competition');
    return _classes;
}

// Write Classes to page
function writeClassesToPage(_classes) {
    let elem = document.getElementById('classes');
    elem.innerHTML = '';
    _classes.forEach((id) => {
        elem.innerHTML += `
        <button class="classButtons">${id}</button>
        `;
    });
}

// Get All Sizes in Class and Comp
async function getSizes(_currentCompetition, _currentClass) {
    console.log(`Getting Sizes`);
    let _sizes = [];
    try {
        const querySnapshot = await getDocs(collection(db, `/competitions/${_currentCompetition}/classes/${_currentClass}/sizes`));
        querySnapshot.forEach((doc) => {
            _sizes.unshift(doc.id);
        });
    } catch (error) {
        console.log(`Error while getting sizes: ${error}`);
    }
    
    writeSizesToPage(_sizes);

    console.log('Done getting all sizes in competition');
    return _sizes;
}

// Write Sizes to page
function writeSizesToPage(_sizes) {
    let elem = document.getElementById('sizes');
    elem.innerHTML = '';
    _sizes.forEach((id) => {
        elem.innerHTML += `
        <button class="sizeButtons">${id}</button>
        `;
    });
}

// Get All Dogs in Size, Class and Comp
async function getDogs(_currentCompetition, _currentClass, _currentSize) {
    console.log(`Getting Dogs`);
    let _dogs = [];

    try {
        const querySnapshot = await getDocs(collection(db, `/competitions/${_currentCompetition}/classes/${_currentClass}/sizes/${_currentSize}/competitors`));
        querySnapshot.forEach((doc) => {
            _dogs.push(doc.data());
        });
    } catch (error) {
        console.log(`Error while getting dogs: ${error}`);
    }

    writeDogsToPage(_dogs);

    console.log('Done getting all dogs');
    return _dogs;
}

// Write dogs to page
function writeDogsToPage(_dogs) {
    let elem = document.getElementById('dogs');
    elem.innerHTML = '';
    _dogs.forEach((dog) => {
        elem.innerHTML += `
        <li>
            <div>
                <button>UP</button>
                <button>DOWN</button>
            </div>
            <p>${dog.startNR}</p>
            <p>${dog.dogName} ${dog.race}</p>
        </li>`;
    });
}


let COMPETITIONS = await getCompetitions();
let currentCompetition = COMPETITIONS[0];
console.log(`Current Comp: ${currentCompetition}`);
writeCompetitionHeader(currentCompetition);

let CLASSES = await getClasses(currentCompetition);
let currentClass = CLASSES[0];
console.log(`Current Class: ${currentClass}`);

let SIZES = await getSizes(currentCompetition, currentClass);
let currentSize = SIZES[0];
console.log(`Current Size: ${currentSize}`);

let COMPETITORS = await getDogs(currentCompetition, currentClass, currentSize);

writeNewDog();

//END OF START FUNCTIONS
//---------------------------------------------------------------------------------

async function writeNewDog() {
    console.log('Start adding document');
    const writeCollection = collection(db, `/competitions/${currentCompetition}/classes/${currentClass}/sizes/${currentSize}/competitors`);
    const docData = {
        startNR: 0,
        handler: 'Peter',
        dogName: 'Lars',
        race: 'Tax',
        registered: true,
        started: false,
        deleted: false,
        order: 0
    };
    try {
        await addDoc(writeCollection, docData);
        console.log(`Wrote this to database:`, docData);
    } catch (error) {
        console.log(`Error while uploading to database: ${error}`);
    }
    console.log('Done adding document');
}

function _start() {
    console.log("Function start")
    const formElem = document.getElementById('newDogForm');
    console.log(formElem);

    formElem.addEventListener("submit", (e) => {
        e.preventDefault();

        const formData = new FormData(formElem);

        console.log(formData.get("handler"));
        console.log(formData.get("dogName"));
        console.log(formData.get("race"));
        console.log(formData.get("size"));
        console.log(formData.get("class"));
    });

    formElem.addEventListener("formdata", (e) => {
        console.log("formdata fired");

        // modifies the form data
        const formData = e.formData;
        // formdata gets modified by the formdata event
        formData.set("handler", formData.get("handler"));
        formData.set("dogName", formData.get("dogName"));
        formData.set("race", formData.get("race"));
        formData.set("size", formData.get("size"));
        formData.set("class", formData.get("class"));

    });
}

function getCurrentDate() {
    let today = new Date();
    let dd = String(today.getDate()).padStart(2, '0');
    let mm = String(today.getMonth() + 1).padStart(2, '0'); //January is 0!
    let yyyy = today.getFullYear();

    let _today = yyyy + '-' + mm + '-' + dd;
    return _today;
}


_start();