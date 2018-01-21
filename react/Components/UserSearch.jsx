import React, { Component } from 'react';
import Services from '../../services';

class UserSearch extends Component {
  constructor(props){
    super(props);

    this.state = {
      users: [],
      participants: []
    };

    this.updateFormVal = this.updateFormVal.bind(this);
    this.renderUsers = this.renderUsers.bind(this);
    this.updateParticipants = this.updateParticipants.bind(this);
    this.renderParticipants = this.renderParticipants.bind(this);
    this.deleteParticipant = this.deleteParticipant.bind(this);
  }

  updateFormVal(event) {
    if (!event.target.value) {this.setState({ users: []});}
    Services.user.search(event.target.value).then((res) => {
      let users = res.content;
      if (users.length > 0) {
        users = users.filter((user) => {
          let matches = this.state.participants.filter((participant) => {
            return participant.fbid === user.fbid;
          });
          return !(matches.length > 0);
        });
      }
      this.setState({ users: users});
    });
  }

  updateParticipants(event, user) {
    const updatedParticipants = this.state.participants.concat(user);
    this.refs.searchInput.value = '';
    this.refs.searchInput.focus();
    this.setState({ participants: updatedParticipants, users: [] });
  }

  deleteParticipant(event, user) {
    let participants = this.state.participants;
    participants = participants.filter((participant) => {
      return participant.fbid !== user.fbid;
    });
    this.refs.searchInput.focus();
    this.setState({ participants: participants});
  }

  renderUsers(users) {
    return users.map((user) => {
      return (
        <div key={user.fbid} onClick={((e) => this.updateParticipants(e, user))} className="search-results">
          <img src={user.photo} height="30px" className="profile-icon"/>
          {user.displayname}
        </div>
      );
    });
  }

  renderParticipants(participants) {
    return participants.map((user) => {
      return (
        <div key={user.fbid}>
          <img src={user.photo} height="30px" className="profile-icon"/>
          {user.displayname}
          <button onClick={((e) => this.deleteParticipant(e, user))}>X</button>
        </div>
      );
    });
  }

  render() {
    const {
      users,
      participants,
    } = this.state;

    let renderedUsers = [];
    let renderedParticipants = [];
    if (users.length > 0) {renderedUsers = this.renderUsers(users);}
    if (participants.length > 0) {
      renderedParticipants = this.renderParticipants(participants);
    }

    return (
      <div>
        <div>Participants:</div>
        <div>{renderedParticipants}</div>
        <div className="form">
          <input className='form-input'
            placeholder='add participants'
            onChange={this.updateFormVal}
            ref="searchInput"
          />
        <div className="rendered-users">{renderedUsers}</div>
        </div>
      </div>
    );
  }
}

export default UserSearch;
