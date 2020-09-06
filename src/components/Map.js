import {Marker, GoogleApiWrapper} from 'google-maps-react';
import { withRouter } from 'react-router-dom';
import React, { Component } from 'react';
import * as firebase from 'firebase/app';
import "firebase/auth";
import * as geofirestore from 'geofirestore';
import '@firebase/storage';
import CurrentLocation from './MapLocation';
import InfoWindowEx from './InfoWindowEx';

const mapStyles = {
  width: '100%',
  height: '100%'
};

export class MapContainer extends Component {

  constructor(props){
    super(props)
    this.state = {
      showingInfoWindow: false,  //Hides or the shows the infoWindow
      activeMarker: {},          //Shows the active marker upon click
      selectedPlace: {},          //Shows the infoWindow to the selected place upon a marker
      markers: [],
      img: 'https://i.postimg.cc/FzBmZRCv/silhouette.png',
      name:''
    };
    this.room = this.room.bind(this);
  }
  
  async componentDidMount(){
    const auth = firebase.auth(),
    db = firebase.firestore(),
    GeoFirestore = geofirestore.initializeApp(db),
    arr = [];

    const geocollection = GeoFirestore.collection('users');
    const coords = await db.collection('coordinates').doc(auth.currentUser.uid).get();
    const query = geocollection.near({ center: new firebase.firestore.GeoPoint(coords.data().latitude, coords.data().longitude), radius: 100 });
    query.get().then((value) => {
      // All GeoDocument returned by GeoQuery, like the GeoDocument added above
        value.docs.forEach(async(snapshot) => {
      
          const data = await db.collection('users').doc(snapshot.id).get();
          
          if(Array.isArray(data.data())){
            arr = data.data()
          }else{
            arr.push(data.data())
          }
     
          this.setState(state => {
            state.markers = arr
            state.name = coords.data().name
            return state;
        });

      })
    });

  }

  infoWindowRef = React.createRef();

  onMarkerClick = (props, marker, e) =>
    this.setState({
      selectedPlace: props,
      activeMarker: marker,
      showingInfoWindow: true
    });

  onClose = props => {
    if (this.state.showingInfoWindow) {
      this.setState({
        showingInfoWindow: false,
        activeMarker: null
      });
    }
  };

  room  = (room, user) => {
    this.props.history.push(`/room?name=${this.state.name}&user=${user}&room=${room}`);
  }

  render() {
    let img = this.state.selectedPlace.img || this.state.img;

    return (
        <CurrentLocation
            centerAroundCurrentLocation
            google={this.props.google}
        >
      
            {this.state.markers.map((marker, index) => {
              return(
                <Marker
                  key={index}
                  position={{lat:marker.coordinates.ef, lng:marker.coordinates.nf}}
                  onClick={this.onMarkerClick}
                  name={marker.name}
                  img={marker.image}
                  room={marker.room}     
                />
              )
            })}
              
            <InfoWindowEx
                ref={this.infoWindowRef}
                marker={this.state.activeMarker}
                visible={this.state.showingInfoWindow}
                onClose={this.onClose}
            >
              
                <div>
                    <h4>{this.state.selectedPlace.name}</h4>
                    <div><img src={img} width="150" height="150"/></div>
                     Room: <button disabled={!this.state.selectedPlace.room} onClick={() => this.room(this.state.selectedPlace.room, this.state.selectedPlace.name)}>
                        {this.state.selectedPlace.room}
                    </button>
                </div>
            </InfoWindowEx>
        </CurrentLocation>
        );
    }
} 

export default GoogleApiWrapper({
  apiKey: process.env.REACT_APP_KEY
})(withRouter(MapContainer));