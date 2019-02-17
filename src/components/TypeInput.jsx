import React, { Component } from "react";
import KeyboardEventHandler from "react-keyboard-event-handler";
import Letter from "./Letter";

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
        curLine.push({ place: i, char: s, status: 0, isCurrent: false });
        tempLines.push({ key: curLineCount, line: curLine });
        curLineCount++;
        curLine = [];
        continue;
      }
      curLine.push({ place: i, char: s, status: 0, isCurrent: false });
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
      lastSentCharNum: 0
    };
    // if (props.text !== undefined) {
    //   this.addText(props.text);
    // }
    console.log("done constructing");
  }

  setUnderline(bool) {
    // let x = this.state.lineNum;
    // let y = this.state.charNum;
    // if (y >= this.state.lines[x].line.length) return;
    // // let s = this.state.lines;
    // // s[x].line[y].isCurrent = bool;
    // // this.setState({ lines: s });
    // this.state.lines[x].line[y].isCurrent = bool;
  }
  incrementPointer = () => {
    this.setUnderline(false);
    if (
      this.state.charNum === this.state.lines[this.state.lineNum].line.length
    ) {
      this.setState({ lineNum: this.state.lineNum + 1, charNum: 0 });
    } else {
      this.setState({ charNum: this.state.charNum + 1 });
    }
    this.setUnderline(true);
  };

  incrementLastPointer = () => {
    this.setState({ lastSentCharNum: this.state.lastSentCharNum + 1 });
  };

  decrementPointer = () => {
    this.setUnderline(false);
    if (this.state.charNum === 0) {
      //if we were at beginning of line
      if (this.state.lineNum === 0) {
        //if we were at very beginning
      } else {
        //set it to the end of the line
        this.setState({
          lineNum: this.state.lineNum - 1,
          charNum: this.state.lines[this.state.lineNum - 1].line[
            this.state.lines[this.state.lineNum].line.length - 1
          ]
        });
      }
    } else {
      this.setState({ charNum: this.state.charNum - 1 });
    }
    this.setUnderline(true);
  };

  setStatus = int => {
    // let s = this.state.lines;
    // s[this.state.lineNum].line[this.state.charNum].status = int;
    // this.setState({ lines: s });
    this.setState({
      lines: (this.state.lines[this.state.lineNum].line[
        this.state.charNum
      ].status = int)
    });
  };

  //only called when a good key is done, but may have already been sent, and accidentally backspaced
  registerGoodKey = key => {
    this.setStatus(1);
    if (
      this.state.charNum === this.state.lastSentCharNum &&
      this.state.lineNum === this.state.lastSentLineNum
    ) {
      if (key === "\n") {
        this.setState({
          lastSentCharNum: 0,
          lastSentLineNum: this.lastSentLineNum + 1
        });
        let bool = this.state.lines.length - this.state.lineNup < 50;
        // sendPacket(key, bool);
      } else {
        this.setState({
          lastSentCharNum: this.state.lastSentCharNum + 1
        });
        // sendPacket(key, false);
      }
    }
  };

  //iterate line num nad charnum, validate, and format
  handleInput = e => {
    let key = e.key;
    console.log("Sent: " + key);
    //clean special characters
    switch (key) {
      case "enter":
        key = "\n";
        break;
      case "tab":
        key = "\t";
        break;
      case "space":
        key = " ";
        break;
      default:
    }
    if (key === "backspace") {
      if (this.state.errCount > 0) {
        this.setState({ errCount: this.state.errCount - 1 });
      }
      this.setStatus(0);
      this.decrementPointer();
    } else if (
      this.state.charNum === this.state.lines[this.state.lineNum].line.length &&
      key === "\n"
    ) {
      //handle new line
      this.registerGoodKey(key);
      this.incrementPointer();
    } else if (
      key === this.state.lines[this.state.lineNum].line[this.state.charNum].char
    ) {
      //handle normal chars
      this.registerGoodKey(key);
      this.incrementPointer();
    } else {
      //we got an error
      this.setStatus(2);
      this.setState({ errCount: this.state.errCount + 1 });
      this.incrementPointer();
    }
    this.setState();

    // console.log(JSON.stringify(this.state));
  };

  render() {
    console.log(JSON.stringify(this.state));
    return (
      <div>
        {/* <input type="text" /> */}
        <div className="letter-container .text-primary">
          {/* <input
            type="text"
            autoComplete="off"
            autoCorrect="off"
            autoFocus
            aria-hidden="true"
            style={{
              outline: null,
              color: "white",
              border: "white",
              position: "fixed",
              fontSize: "1px",
              left: "50%",
              top: "-21px"
            }}
            onChange={this.handleInput}
          /> */}
          <div>
            {this.state.lines.map(line => (
              <div className="" key={line.key}>
                {line.line.map(letter => (
                  <Letter letter={letter} key={letter.place} />
                ))}
              </div>
            ))}
          </div>
        </div>
      </div>
    );
  }

  renderList = () => {
    return <h1>d</h1>;
  };
}

export default TypeInput;
