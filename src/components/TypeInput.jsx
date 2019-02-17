import React, { Component } from "react";
import KeyboardEventHandler from "react-keyboard-event-handler";
import Letter from "./Letter";
import { isAbsolute } from "path";

const websocket = new WebSocket("ws://127.0.0.1:5678/");

const sendPacket = (char, request = 0) => {
  var d = new Date();
  websocket.send(
    JSON.stringify({ char: char, time: d.getTime(), request: request })
  );
};

websocket.onmessage = function(event) {
  var data = event;
  console.log(data);
  TypeInput.addText(data);
};

class TypeInput extends Component {
  constructor(props) {
    super(props);

    this.state = {
      buffer: [],
      toplines: [],
      bottomlines: [],
      mainline: "",
      lineNum: 0,
      charNum: 0,
      lastSentLineNum: 0,
      lastSentCharNum: 0,
      goodPointer: 0,
      numToplines: props.numToplines,
      numBottomlines: props.numBottomlines
    };
    this.addText(props.text); // TODO: replace

    this.state.mainline = this.state.buffer.shift()
    this.mainlineToLetters();
    for (var i = 0; i < this.state.numBottomlines; i++) {
        this.state.bottomlines.push(this.state.buffer.shift());
    }
    console.log(this.state.bottomlines);
  }

  addText = (text) => {
    let lines = text.split('\\n');
    this.state.buffer = this.state.buffer.concat(lines)
  };

  mainlineToLetters = () => {
    this.state.mainlineLetters = []
    for (var i = 0; i < this.state.mainline.length; i++) {
        var pos;
        if (i === 0) pos = -1;
        else if (i === this.state.mainline.length - 1) pos = 1;
        else pos = 0;
        this.state.mainlineLetters.push({char: this.state.mainline.charAt(i), status: 0, isCurrent: false, pos: pos});
    }
  };

  setUnderline(bool) {
    this.state.mainlineLetters[this.state.charNum].isCurrent = bool;
  }

  incrementPointer = () => {
    if (this.state.charNum < this.state.mainline.length) {
      this.setUnderline(false);
      this.state.charNum++;
      if (this.state.charNum !== this.state.mainline.length) {
        this.setUnderline(true);
      }
    }
  };

  saveLastCords = () => {
    this.state.lastSentCharNum = this.state.charNum;
    this.state.lastSentLineNum = this.state.lineNum;
  };

  decrementPointer = () => {
    if (this.state.charNum !== this.state.mainline.length) {
        this.setUnderline(false);
    }
    if (this.state.charNum > 0) {
      this.state.charNum--;
    }
    this.setUnderline(true);
  };

  setStatus = int => {
    this.state.mainlineLetters[this.state.charNum].status = int;
  };

  handleKeyDown = e => {
    let key = e.key;

    if (key === "Backspace" && (this.state.charNum !== this.state.mainline.length || this.state.goodPointer !== this.state.mainline.length)) {
        this.decrementPointer();
        this.setStatus(0);
    } else if (key === "Enter" && this.state.charNum === this.state.mainline.length && this.state.goodPointer === this.state.mainline.length) {
      this.state.charNum = 0;
      this.state.goodPointer = 0;

      this.state.toplines.push(this.state.mainline);
      if (this.state.toplines.length > this.state.numToplines) this.state.toplines.shift()

      this.state.mainline = this.state.bottomlines.shift()
      this.mainlineToLetters();
      this.state.bottomlines.push(this.state.buffer.shift())

      if (this.state.mainline.length !== 0) {
        this.setUnderline(true);
      }

    } else if (key === this.state.mainline.charAt(this.state.charNum) && this.state.charNum !== this.state.mainline.length) {
      this.setStatus(1);
      this.incrementPointer();
      if (this.state.goodPointer === this.state.charNum - 1) {
        console.log("sending!");
        this.state.goodPointer++;
        sendPacket(key, Date.now(), this.state.buffer.length);
      }
    } else if (key.length === 1 && this.state.charNum !== this.state.mainline.length) {
      this.setStatus(2);
      this.incrementPointer();
    }
    this.forceUpdate();
  };

  componentDidMount() {
    this.reFocus();
  }

  reFocus = () => {
    this.textInput.focus();
  };

  renderLines = (lines) => {
    var elements = []
    for (var i = 0; i < lines.length; i++) {
      if (lines[i].length == 0) {
          elements.push((<br/>));
      } else {
          elements.push((<div>{lines[i]}</div>));
      }
    }
    return elements;
  };

  renderMainline = (letters) => {
    if (letters.length === 0) {
        return (<br/>)
    }
    var elements = []
    for (var i = 0; i < letters.length; i++) {
      elements.push((<Letter letter={letters[i]}/>)); 
    }
    return elements;
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
        <div className="topLines">
            {this.renderLines(this.state.toplines)}
        </div>
        <div className="mainLine">
            {this.renderMainline(this.state.mainlineLetters)}
        </div>
        <div className="bottomLines">
            {this.renderLines(this.state.bottomlines)}
        </div>
      </div>
    );
  }
}

export default TypeInput;
