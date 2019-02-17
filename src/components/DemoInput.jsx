import React, { Component } from "react";
import KeyboardEventHandler from "react-keyboard-event-handler";
import { isAbsolute } from "path";

class DemoInput extends Component {
  constructor(props) {
    super(props);

    this.state = {
      websocket: new WebSocket("ws://127.0.0.1:5678/"),
    };

  }

  sendPacket = (char, time, request) => {
      this.state.websocket.send(
        JSON.stringify({ char: char, time: time, request: request })
      );
  };

  handleKeyDown = e => {
    let key = e.key;
    if (key.length === 1) {
        this.sendPacket(key, Date.now(), 1000000);
    }
  };

  componentDidMount() {
    this.reFocus();
  }

  reFocus = () => {
    this.textInput.focus();
  };

  render() {
    return (
      <div className="TypeText">
        <input
          type="textArea"
          ref={input => {
            this.textInput = input;
          }}
          style={{ opacity: 0 }}
          onKeyDown={this.handleKeyDown}
          onBlur={this.reFocus}
          value={""}
        />
      </div>
    );
  }
}

export default DemoInput;
