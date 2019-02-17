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
  TypeInput.addText(data, false);
};

class TypeInput extends Component {
  state = {};

  addText = (text, isImmediate) => {
    if (text === undefined) return [];
    let tempLines = [];
    let curLine = [];
    let curLineCount = 0;
    let isesc = false;
    bigfor: for (let i = 0; i < text.length; i++) {
      let s = text.charAt(i);
      if (isesc) {
        switch (s) {
          case "n":
            s = "\n";
            break;
          case "r":
            isesc = false;
            continue bigfor;
          case "t":
            s = "\t";
            break;
          default:
        }
        isesc = false;
      }
      if (s === "\\") {
        isesc = true;
        continue;
      }
      if (s === "\n") {
        if (curLine.length !== 0) {
          curLine[curLine.length - 1 >= 0 ? curLine.length - 1 : 0].pos = 1;
        }
        curLine.push({ pos: 1, char: s, status: 0, isCurrent: false });
        tempLines.push({ line: curLine });
        curLineCount++;
        curLine = [];
        continue;
      } else if (curLine.length === 0) {
        curLine.push({ pos: -1, char: s, status: 0, isCurrent: false });
      } else {
        curLine.push({ pos: 0, char: s, status: 0, isCurrent: false });
      }
    }
    if (isImmediate) return tempLines;

    this.setState({ lines: this.state.lines.append(tempLines) });
  };

  constructor(props) {
    super(props);

    this.state = {
      text: props.text,
      lines: this.addText(props.text, true),
      lineNum: 0,
      charNum: 0,
      lastSentLineNum: 0,
      lastSentCharNum: 0,
      errCount: 0,
      beginRender: 0,
      endRender: 26
    };
    console.log("done constructing");
  }

  setUnderline(bool) {
    this.state.lines[this.state.lineNum].line[
      this.state.charNum
    ].isCurrent = bool;
  }

  incrementPointer = () => {
    this.setUnderline(false);
    this.state.charNum++;
    if (
      this.state.charNum === this.state.lines[this.state.lineNum].line.length
    ) {
      this.state.lineNum++;
      this.state.charNum = 0;
      if (this.state.lineNum > 8) {
        this.state.beginRender++;
        this.state.endRender++;
      }
    }
    this.setUnderline(true);
  };

  saveLastCords = () => {
    this.state.lastSentCharNum = this.state.charNum;
    this.state.lastSentLineNum = this.state.lineNum;
  };

  decrementPointer = () => {
    this.setUnderline(false);
    if (this.state.charNum === 0) {
      //if we were at beginning of line
      if (this.state.lineNum === 0) {
        //if we were at very beginning
      } else {
        //set it to the end of the line
        this.state.lineNum--;
        this.state.charNum =
          this.state.lines[this.state.lineNum].line.length - 1;
      }
    } else {
      this.state.charNum--;
      // this.setState({ charNum: this.state.charNum - 1 });
    }
    this.setUnderline(true);
  };

  setStatus = int => {
    // let s = this.state.lines;
    // s[this.state.lineNum].line[this.state.charNum].status = int;
    // this.setState({ lines: s });
    this.state.lines[this.state.lineNum].line[this.state.charNum].status = int;
    // this.setState({
    //   lines: (this.state.lines[this.state.lineNum].line[
    //     this.state.charNum
    //   ].status = int)
    // });
  };

  //iterate line num nad charnum, validate, and format
  handleInput = e => {
    let key = this.textInput.value;
    this.textInput.value = "";
    // console.log("event: " + e);
    console.log(key);
    console.log("errcound: " + this.state.errCount);

    if (key === "\b") {
      if (this.state.errCount > 0) {
        this.state.errCount--;
        this.setStatus(0);
        this.decrementPointer();
      }
    } else if (this.state.errCount > 0) {
      this.errCount++;
      this.setStatus(2);
      this.incrementPointer();
    } else if (
      key === this.state.lines[this.state.lineNum].line[this.state.charNum].char
    ) {
      //handle normal chars, new line, tabs
      this.setStatus(1);
      this.incrementPointer();
      console.log(key);
      sendPacket(key, this.state.lines.length - this.state.lineNum < 50);
    } else {
      //we got an bad key
      this.setStatus(2);
      this.state.errCount++;
      // this.setState({ errCount: this.state.errCount + 1 });
      this.incrementPointer();
    }
    this.setState(this.state);

    // console.log(JSON.stringify(this.state));
  };

  cleanInput(input) {
    // switch (in) {
    //   case "enter":
    //     key = "\n";
    //     break;
    //   case "tab":
    //     key = "\t";
    //     break;
    //   case "space":
    //     key = " ";
    //     break;
    //   default:
    // }
  }

  componentDidMount() {
    this.reFocus();
  }

  reFocus = () => {
    this.textInput.focus();
  };

  render() {
    //console.log(JSON.stringify(this.state));
    return (
      <div className="TypeText">
        <input
          type="textArea"
          ref={input => {
            this.textInput = input;
          }}
          style={{ opacity: 0 }}
          onChange={this.handleInput}
          onSubmit={this.handleInput}
          onBlur={this.reFocus}
        />
        {this.renderList()}
      </div>
    );
  }

  renderList = () => {
    var elements = [];
    for (var i = this.state.beginRender; i < this.state.endRender; i++) {
      elements.push(this.renderLine(i));
    }
    return elements;
  };

  renderLine = lineNum => {
    return (
      <div className={lineNum === this.state.lineNum && "current-line"}>
        {this.state.lines[lineNum].line.map(letter => (
          <Letter letter={letter} />
        ))}
      </div>
    );
  };
}

export default TypeInput;
