import React, { Component } from "react";
import "./User.css";

class User extends Component {
  componentDidMount() {
    this.props.firebase.auth().onAuthStateChanged(user => {
      this.props.setUser(user);
    });
  }

  signIn(e) {
    const provider = new this.props.firebase.auth.GoogleAuthProvider();
    this.props.firebase.auth().signInWithPopup(provider);
  }

  signOut(e) {
    console.log("goodbye");
    this.props.firebase.auth().signOut();
    this.props.setUser("Guest");
  }

  render() {
    return (
      <div className="dash">
        <p className="text-right greeting">
          Sign In with your Google account or chat as a guest
        </p>
        <p className="text-right">
          <span className="logIn" onClick={this.signIn.bind(this)}>
            Login With Google
          </span>
          <span className="text-right" onClick={this.signOut.bind(this)}>
            Log out
          </span>
        </p>

        <p className="text-right guest">Hello, {this.props.currentUser}!</p>
      </div>
    );
  }
}

export default User;
