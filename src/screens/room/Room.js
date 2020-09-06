import React from 'react';
import io from 'socket.io-client';
import * as firebase from 'firebase/app';
import * as geofirestore from 'geofirestore';
import "firebase/auth";
import "./style.css";
import MessageList from './MessageList'
import SendMessageForm from './SendMessageForm'
import queryString from "query-string";
import TextContainer from './TextContainer';

const ENDPOINT = 'https://enhuff.herokuapp.com/';

class Room extends React.Component {
    
    constructor(props) {
        super(props)
        const db = firebase.firestore();
        this.GeoFirestore = geofirestore.initializeApp(db);
        this.state = {
            roomId: '',
            name: '',
            user: '',
            users:[],
            messages: []
           
        }
        this.socket = io(ENDPOINT);
        this.sendMessage = this.sendMessage.bind(this)
        this.chatPrivately = this.chatPrivate.bind(this);
    } 
    
    componentDidMount() {
       const {name, user, room} = queryString.parse(this.props.location.search)
       this.setState({
            roomId: room,
            name: name,
            user: user
       })
       this.socket.emit('join', {name: this.state.name, room: this.state.roomId}, (msg) => {
            this.GeoFirestore.collection('users').doc(firebase.auth().currentUser.uid).update({
                room: this.state.roomId
            })
        })

        this.socket.on('message', (message) => {
            this.state.messages.push(message)
            this.setState({
                messages: this.state.messages
            })
        })

        this.socket.on("roomData", ({ users }) => {
            this.setState({
                users: users
            })
        });
    }
    
    componentWillUnmount() {
        this.socket.emit('disconnect');
        this.socket.off();
    }

    sendMessage(message) {
       if(message){
           this.socket.emit('sendMessage',message, () => {})
       }
    }
    
    chatPrivate() {

    }

    render() {
        console.log(this.state.users)
        return (
            <div className="app">
                <TextContainer
                    chatPrivate={this.chatPrivate}
                    users={this.state.users}
                    roomId={this.state.roomId} 
                />
                <MessageList 
                    roomId={this.state.roomId}
                    messages={this.state.messages}
                />
                <SendMessageForm
                    disabled={!this.state.roomId}
                    sendMessage={this.sendMessage} 
                />
               
            </div>
        );
    }
}

export default Room