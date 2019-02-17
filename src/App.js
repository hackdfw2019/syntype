import React, { Component } from "react";
// import logo from "./logo.svg";
import "./App.css";
import TypeInput from "./components/TypeInput.jsx";

class App extends Component {
  render() {
    return (
      <div>
        <TypeInput
          numToplines={3}
          numBottomlines={3}
        />
      </div>
    );
  }

  sendCorrect(char) {}
}

export default App;
