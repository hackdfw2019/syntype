import React, { Component } from "react";
import KeyboardEventHandler from "react-keyboard-event-handler";
import Letter from "./Letter";
import { isAbsolute } from "path";

class TypeInput extends Component {
  constructor(props) {
    super(props);

    this.state = {
      buffer: [],
      toplines: [],
      bottomlines: [],
      mainline: "",
      mainlineLetters: [],
      lineNum: 0,
      charNum: 0,
      lastSentLineNum: 0,
      lastSentCharNum: 0,
      goodPointer: 0,
      numToplines: props.numToplines,
      numBottomlines: props.numBottomlines,
      websocket: new WebSocket("ws://127.0.0.1:5678/"),
      ready: false
    };

    this.state.websocket.onmessage = event => {
      this.addText(event.data);
    };

    this.state.websocket.onopen = event => {
        this.sendPacket(null, null, null);
    };

  }

  sendPacket = (char, time, request) => {
      this.state.websocket.send(
        JSON.stringify({ char: char, time: time, request: request })
      );
  };

  addText = text => {
    let lines = text.split("\n");
    this.state.buffer = this.state.buffer.concat(lines);

    if (!this.state.ready) {
        this.state.ready = true;
        this.state.mainline = this.state.buffer.shift();
        this.mainlineToLetters();
        for (var i = 0; i < this.state.numBottomlines; i++) {
          this.state.bottomlines.push(this.state.buffer.shift());
        }
        this.forceUpdate();
    }
  };

  mainlineToLetters = () => {
    this.state.mainlineLetters = [];
    for (var i = 0; i < this.state.mainline.length; i++) {
      var pos;
      if (i === 0) pos = -1;
      else if (i === this.state.mainline.length - 1) pos = 1;
      else pos = 0;
      this.state.mainlineLetters.push({
        char: this.state.mainline.charAt(i),
        status: 0,
        isCurrent: false,
        pos: pos
      });
    }
    this.state.mainlineLetters.push({
      char: <React.Fragment>&nbsp;</React.Fragment>,
      status: 0,
      isCurrent: false,
      pos: 1
    });
  };

  setUnderline(bool) {
    this.state.mainlineLetters[this.state.charNum].isCurrent = bool;
  }

  incrementPointer = () => {
    if (this.state.charNum < this.state.mainlineLetters.length) {
      this.setUnderline(false);
      this.state.charNum++;
      if (this.state.charNum !== this.state.mainlineLetters.length) {
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

    if (
      key === "Backspace" &&
      ((this.state.charNum !== this.state.mainline.length ||
        this.state.goodPointer !== this.state.mainline.length)
        && this.state.mainline.charAt(this.state.charNum - 1) !== '\t')
    ) {
      this.decrementPointer();
      this.setStatus(0);
    } else if (
      key === "Enter" &&
      this.state.charNum === this.state.mainline.length &&
      this.state.goodPointer === this.state.mainline.length
    ) {
      this.state.charNum = 0;
      this.state.goodPointer = 0;

      this.state.toplines.push(this.state.mainline);
      if (this.state.toplines.length > this.state.numToplines)
        this.state.toplines.shift();

      this.state.mainline = this.state.bottomlines.shift();
      this.mainlineToLetters();
      this.state.bottomlines.push(this.state.buffer.shift());

      if (this.state.mainline.length !== 0) {
        this.setUnderline(true);
      }

      while (this.state.mainline.charAt(this.state.charNum) === '\t') {
        this.setStatus(1);
        this.incrementPointer();
        this.state.goodPointer++;
      }
      this.setUnderline(true);
    } else if (
      key === this.state.mainline.charAt(this.state.charNum) &&
      this.state.charNum !== this.state.mainline.length
    ) {
      this.setStatus(1);
      this.incrementPointer();
      if (this.state.goodPointer === this.state.charNum - 1) {
        this.state.goodPointer++;
        this.sendPacket(key, Date.now(), this.state.buffer.length);
      }
    } else if (
      key.length === 1 &&
      this.state.charNum !== this.state.mainline.length
    ) {
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

  renderLines = lines => {
    var elements = [];
    for (var i = 0; i < lines.length; i++) {
      if (lines[i].length === 0) {
        elements.push(<br />);
      } else {
        let content = lines[i].split('').map(char => {
            if (char === "\t") {
                return <React.Fragment>&emsp;&emsp;</React.Fragment>;
            } else {
                return <React.Fragment>{char}</React.Fragment>
            }
        });
        elements.push(<div>{content}</div>);
      }
    }
    return elements;
  };

  renderMainline = letters => {
    if (letters.length === 0) {
      return (
        <React.Fragment>
          &nbsp;
          <br />
        </React.Fragment>
      );
    }
    var elements = [];
    for (var i = 0; i < letters.length; i++) {
      elements.push(<Letter letter={letters[i]} />);
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
        <div className="top-lines good">
          {this.renderLines(this.state.toplines)}
        </div>
        <div className="main-line">
          {this.renderMainline(this.state.mainlineLetters)}
        </div>
        <div className="bottom-lines">
          {this.renderLines(this.state.bottomlines)}
        </div>
      </div>
    );
  }
}

export default TypeInput;
