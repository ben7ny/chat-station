import React, { Component } from "react";
import "./RoomList.css";

class RoomList extends Component {
  constructor(props) {
    super(props);

    this.state = {
      rooms: [],
      newRoomName: "",
      validationMessage: ""
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
        room => room.key !== snapshot.key
      );
      this.setState({ rooms: deltRoom });
    });
  }

  createRoom(e) {
    e.preventDefault();
    const newRoomName = this.state.newRoomName;
    const rooms = this.state.rooms.find(room => room.name === newRoomName);
    const matchedRoom = rooms !== undefined ? rooms.name : null;
    console.log(matchedRoom);
    if (newRoomName === "" || matchedRoom === newRoomName) {
      console.log("The name already exist");
      this.setState({
        validationMessage: "The name already exist or Empty Space"
      });
    } else {
      this.roomsRef.push({
        name: newRoomName
      });
      this.setState({ newRoomName: "", validationMessage: "" });
    }
  }

  deleteRoom(room) {
    this.roomsRef.child(room.key).remove();
  }

  getNameChange(e) {
    this.setState({ newRoomName: e.target.value });
  }

  render() {
    const activeRoom = this.props.activeRoom;

    return (
      <div className="roomListPart">
        {this.state.validationMessage !== "" && (
          <h4 className="alert alert-primary" role="alert">
            {this.state.validationMessage}
          </h4>
        )}
        <div className="roomContianer" style={{ backgroundColor: "#151A57" }}>
          <div className="roomsInputTitle">Add New Room</div>
          <form className="NewRoomCreated" onSubmit={e => this.createRoom(e)}>
            <label>
              <input
                type="text"
                placeholder="New Room Name"
                value={this.state.newRoomName}
                onChange={e => this.getNameChange(e)}
              />
            </label>
            <input type="submit" value="Add" />
          </form>
          <div />
          <h2
            style={{
              color: "white",
              fontSize: "24px",
              paddingLeft: "1.6rem",
              marginTop: "10px"
            }}
          >
            Rooms
          </h2>
          <div className="myRoomList">
            <div
              className="container d-none d-md-block"
              style={{ backgroundColor: "#151A57", minHeight: "100vh" }}
            >
              {this.state.rooms
                .map(room => (
                  <ul key={room.key}>
                    <div className="roomSet">
                      <li onClick={e => this.props.selectRoom(room)}>
                        {room === activeRoom ? (
                          <h2 style={{ color: "white" }}>{room.name}</h2>
                        ) : (
                          <h4 style={{ color: "#3BA9D9" }}>{room.name}</h4>
                        )}
                      </li>
                      <li>
                        <button onClick={e => this.deleteRoom(room)}>
                          Remove
                        </button>
                      </li>{" "}
                    </div>
                  </ul>
                ))
                .reverse()}
            </div>

            <div
              className="dropdown d-block d-md-none"
              style={{ backgroundColor: "#151A57" }}
            >
              <button
                className="btn dropdown-toggle"
                type="button"
                id="dropdownMenuButton"
                data-toggle="dropdown"
                aria-haspopup="true"
                aria-expanded="false"
              >
                Pick Room
              </button>
              <div
                className="dropdown-menu"
                aria-labelledby="dropdownMenuButton"
              >
                <div>
                  {this.state.rooms
                    .map(room => (
                      <ul key={room.key}>
                        {" "}
                        <div className="roomSet">
                          <li onClick={e => this.props.selectRoom(room)}>
                            {room === activeRoom ? (
                              <h2 style={{ color: "white" }}>{room.name}</h2>
                            ) : (
                              <h4 style={{ color: "#3BA9D9" }}>{room.name}</h4>
                            )}
                          </li>
                          <li>
                            <button onClick={e => this.deleteRoom(room)}>
                              Remove
                            </button>
                          </li>
                        </div>
                      </ul>
                    ))
                    .reverse()}
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }
}

export default RoomList;
