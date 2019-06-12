import React, { Component } from "react";
import { Button } from "react-bootstrap";

class RoomList extends Component {
  constructor(props) {
    super(props);

    this.state = {
      rooms: [],
      newRoomName: ""
    };

    this.roomsRef = this.props.firebase.database().ref("rooms");
  }

  componentDidMount() {
    this.roomsRef.on("child_added", snapshot => {
      const room = snapshot.val();
      room.key = snapshot.key;
      this.setState({ rooms: this.state.rooms.concat(room) });
    });
    this.roomsRef.on("child_removed", snapshot => {
      const deltRoom = this.state.rooms.filter(
        (room, i) => room.key !== snapshot.key
      );
      this.setState({ rooms: deltRoom });
    });
  }

  createRoom(e) {
    e.preventDefault();
    const newRoomName = this.state.newRoomName;
    // const rooms = this.state.rooms[1].name;
    const rooms = this.state.rooms.find(room => room.name === newRoomName);
    const matchedRoom = rooms !== undefined ? rooms.name : null;
    // console.log(newRoomName);
    console.log(matchedRoom);
    if (newRoomName === "" || matchedRoom === newRoomName) {
      console.log("The name already exist");
    } else {
      this.roomsRef.push({
        name: newRoomName
      });
      this.setState({ newRoomName: "" });
    }
  }

  deleteRoom(room) {
    this.roomsRef.child(room.key).remove();
  }

  getNameChange(e) {
    this.setState({ newRoomName: e.target.value });
  }

  render() {
    return (
      <div className="roomListPart">
        <div>
          <h1 className="app-name">Chat Station</h1>
        </div>
        <div className="myRoomList">
          {" "}
          {this.state.rooms.map((room, index) => (
            <ul key={room.key}>
              <li onClick={e => this.props.selectRoom(room)}>
                <h2>{room.name}</h2>
              </li>
              <li>
                <Button
                  bsStyle="danger"
                  bsSize="small"
                  onClick={e => this.deleteRoom(room)}
                >
                  Remove Room
                </Button>
              </li>
            </ul>
          ))}
        </div>
        <form className="NewRoomCreated" onSubmit={e => this.createRoom(e)}>
          <label>
            {" "}
            Enter New Room Name:
            <input
              type="text"
              placeholder="New Room Name"
              value={this.state.newRoomName}
              onChange={e => this.getNameChange(e)}
            />
          </label>
          <input type="submit" value="Create Room" />
        </form>
      </div>
    );
  }
}

export default RoomList;
