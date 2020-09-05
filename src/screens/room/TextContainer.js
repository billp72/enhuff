import React from 'react'

class TextContainer extends React.Component {
    render () {
        //const orderedRooms = [...this.props.rooms].sort((a, b) => a.id > b.id)
        return (
            <div className="rooms-list">
                <ul>
                <h3>Members in this room</h3>
                {console.log(this.props.users)}
                    {this.props.users.map(user => {
                        const active = 'active';
                        return (
                            <li key={user.id} className={"room " + active}>
                                <a style={{color:'blue'}}
                                    onClick={() => this.props.chatPrivate(user.id)}
                                    href="#">
                                    # {user.name}
                                </a>
                            </li>
                        )
                    })}
                </ul>
            </div>
        )
    }
}

export default TextContainer