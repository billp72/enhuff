import React, {useEffect, useState} from 'react';
import {
  HashRouter,
  Route,
  Switch
} from 'react-router-dom';
import * as firebase from 'firebase/app';
import "firebase/auth";
import '@firebase/firestore';
import * as geofirestore from 'geofirestore';
import '@progress/kendo-theme-default/dist/all.css';
import '@progress/kendo-react-progressbars'
import { useMediaPredicate } from 'react-media-hook';
import MenuWrapper from './components/MenuWrapper.jsx';
import './css/kendo-theme.css';
import './css/custom.css';
import main from './components/items.json';
import login from './components/login.json';
import Home from './screens/Home';
import Login from './screens/Login';
import Map from './screens/Map';
import Room from './screens/room';
import Create from './screens/Create';

const firebaseConfig = {
  apiKey: process.env.REACT_APP_APIKEY,
  authDomain: process.env.REACT_APP_AUTHDOMAIN,
  databaseURL: process.env.REACT_APP_DATABASEURL,
  projectId: process.env.REACT_APP_PROJECTID,
  storageBucket: process.env.REACT_APP_STORAGEBUCKET,
  messagingSenderId: process.env.REACT_APP_MESSAGESENDERID,
  appId: process.env.REACT_APP_APPID,
  measurementId: process.env.REACT_APP_MEASUREMENTID
};
firebase.initializeApp (firebaseConfig);

const App = (props) => {

  const [menu, setMenu] = useState(0);

  useEffect(() => {

    const db = firebase.firestore();
    const GeoFirestore = geofirestore.initializeApp(db);
    firebase.auth().onAuthStateChanged((user) => {
      if (user) {
        const isAnonymous = user.isAnonymous;
        const uid = user.uid;
        if (navigator && navigator.geolocation) {
          navigator.geolocation.getCurrentPosition((pos) => {
            const coords = pos.coords;
            GeoFirestore.collection('users').doc(uid).set({
              coordinates: new firebase.firestore.GeoPoint(coords.latitude, coords.longitude)
            },{merge:true});
            db.collection('coordinates').doc(uid).set({
              latitude:coords.latitude,
              longitude:coords.longitude
            },{merge:true})
          })
      }
        setMenu(main)
     
      } else {
        // User is signed out.
        setMenu(login)
      }
    
    });

  },[]);

  const checkIfMediumPlus = useMediaPredicate(
    '(min-width: 415px)'
   );

   const flatten = (rts) => {
    return (rts || []).map(item =>  item.items ?  [].concat.apply([],flatten(item.items)) :  item);  
   }

   const components = {
    'Home': Home,
    "Login": Login,
    'Map': Map,
    "Room": Room,
    "Create": Create
   }

   const subcomponents = (itm, index) => {
      return itm.map((subitm, i) => <Route exact={true} key={`${index}.${i}`} path={subitm.path} component={components[subitm.component]} />)
    }

    const routes = (items) => flatten(items).map((itm, i) => {
      if(!Array.isArray(itm)){
        return <Route exact={true} key={i} path={itm.path} component={components[itm.component]} />
      }
      if(Array.isArray(itm)){
         return subcomponents(itm, i).filter(item => item != undefined)
      }
    });

    return (
          <HashRouter>
            <Switch>
            <MenuWrapper isMediumPlus={checkIfMediumPlus} data={menu} >
             
                {routes(menu)} 
              
            </MenuWrapper>
            </Switch>
          </HashRouter>
        
      );
}

export default App;