import React, { useState, useEffect } from 'react';
import { Link } from "react-router-dom";
import * as firebase from 'firebase/app';
import "firebase/auth";
import '../css/Create.css';

export default function SignIn() {

  const [name, setName] = useState('');
  const [room, setRoom] = useState('');

  useEffect(() => {
      const auth = firebase.auth()
      const db = firebase.firestore();
      db.collection('coordinates').doc(auth.currentUser.uid).get().then((snapshot) =>{
          setName(snapshot.data().name)
      })
    
  },[])
  

  return (
    <div className="joinOuterContainer">
      <div className="joinInnerContainer">
        <h1 className="heading">Create a Room</h1>
        <div>
          <input placeholder="Type room name" className="joinInput mt-20" type="text" onChange={(event) => setRoom(event.target.value)} />
        </div>
        <Link onClick={e => (!name || !room) ? e.preventDefault() : null} to={`/room?name=${name}&room=${room}`}>
          <button className={'button mt-20'} type="submit">Enter your room</button>
        </Link>
      </div>
    </div>
  );
}