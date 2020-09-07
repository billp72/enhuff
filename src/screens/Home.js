import React, {useEffect, useState} from 'react';
import * as firebase from 'firebase/app';
import "firebase/auth";
import * as geofirestore from 'geofirestore';
import '@firebase/storage';
import { ResponsiveImage, ResponsiveImageSize } from 'react-responsive-image';

const large = 'https://i.postimg.cc/Hk2dqWyJ/enhuff.png';

const Home = (props) => {
  const auth = firebase.auth(),
          db = firebase.firestore(),
          GeoFirestore = geofirestore.initializeApp(db);

  const [asName, setAsName] = useState('');
  const [imageAsFile, setImageAsFile] = useState('');
  const [imageURL, setImageURL] = useState('https://i.postimg.cc/FzBmZRCv/silhouette.png');

  useEffect(() => {
    GeoFirestore.collection('users').doc(auth.currentUser.uid).set({
      name:'anonymous'
    },{merge:true});

    db.collection('coordinates').doc(auth.currentUser.uid).set({
      name:'anonymous'
    },{merge:true})
  },[GeoFirestore])

  const setImage = (e) => {
    const image = e.target.files[0]
    const ext = image.name.split('.')[1];
    if(Math.round(image.size / 1024) < 4096 &&
       image.type.split('/')[1] === 'jpeg' ||
       image.type.split('/')[1] === 'png'){

      let updatedName = auth.currentUser.uid+'.'+ext;
      let newBlob = new File([image], updatedName,{
        type:image.type,
        lastModified:image.lastModified,
        lastModifiedDate:image.lastModifiedDate,
        webkitRelativePath: image.webkitRelativePath
      })
      setImageAsFile(imageFile => (newBlob))
    }else{
      alert('file must be a small jpg, or png image')
    }
    
  }

  const setName = (e) => {
    const name = e.target.value;
    setAsName(name);
  }

  const addUser = async () => {
      const userInfo = await GeoFirestore.collection('users').doc(auth.currentUser.uid).get();
      if(asName){
        if(imageAsFile){
            const ref = firebase.storage().ref();
            const image = ref.child(`images/${imageAsFile.name}`)
            const uploadTask = image.put(imageAsFile);
            uploadTask.on('state_changed', 
              (snapShot) => {
                //takes a snap shot of the process as it is happening
                console.log(snapShot)
              }, (err) => {
                //catches the errors
                console.error(err)
              }, () => {
                firebase.storage().ref('images').child(imageAsFile.name).getDownloadURL().then((uploadURL) => {
                  userInfo.ref.set({
                    image: uploadURL
                  },{merge:true})
                  setImageURL(uploadURL);
                })
              })
          }
        
          userInfo.ref.set({
             name: asName 
          },{merge:true})

           db.collection('coordinates').doc(auth.currentUser.uid).set({
            name:asName,
            img: imageAsFile ? imageAsFile.name : ''
          },{merge:true})
          
      }else{
        alert('You must add a name')
      }
  }

  const logout = () => {
    db.collection('users').doc(auth.currentUser.uid).delete().then(async() => {
        const data = await db.collection('coordinates').doc(auth.currentUser.uid).get()

        firebase.storage().ref('images').child(`${data.data().img}`).delete().catch((error) => console.error(error))
        db.collection('coordinates').doc(auth.currentUser.uid).delete().catch(err => console.error(err));
        auth.currentUser.delete().then(() => {
          console.log('logged out')
        }).catch((error) => {
          console.error(error)
        }) 
    })
    
  }
    return (
        <div className='main'>
            <div className='kendo-image'>
              <ResponsiveImage>
              <ResponsiveImageSize
                  minWidth={0}
                  path={large}
                />
                <ResponsiveImageSize
                  minWidth={415}
                  path={large}
                />
                <ResponsiveImageSize
                  minWidth={1000}
                  path={large}
                />
              </ResponsiveImage>
              </div>
              <div className='kendo-details'>
                <input type="submit" className="logout" value="Log out" onClick={(e) => logout()} /><br /><br />
                <h2>Name & Image</h2>
                <div>
                
                    <input type="text" className="user" name="firstname" placeholder="Type name" onChange={setName} /><br />
                    <input type="file" className="user" name="img" accept="image/*" onChange={setImage} /><br />
                    <button className="user" id="submit" onClick={() => addUser()}>Submit</button>
                
                </div>
              
                  <img width="100" height="100" src={imageURL} alt="User Image" />
                 
              </div>
          </div>
      );
}

export default Home;