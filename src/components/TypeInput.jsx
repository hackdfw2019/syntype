import React, { Component } from "react";
import KeyboardEventHandler from "react-keyboard-event-handler";
import Letter from "./Letter";
import { isAbsolute } from "path";

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
      curLine.push({ char: s, status: 0, isCurrent: false });
      if (s === "\n") {
        tempLines.push({ line: curLine });
        curLineCount++;
        curLine = [];
        continue;
      } else {
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
      lastSentCharNum: 0
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

    if (key === "\b") {
      if (this.state.errCount > 0) {
        this.state.errCount--;
        this.setStatus(0);
        this.decrementPointer();
      }
    } else if (
      key === this.state.lines[this.state.lineNum].line[this.state.charNum].char
    ) {
      //handle normal chars, new line, tabs
      this.setStatus(1);
      this.incrementPointer();
    } else {
      //we got an bad key
      this.setStatus(2);
      this.state.errCount++;
      // this.setState({ errCount: this.state.errCount + 1 });
      this.incrementPointer();
    }
    this.setState();

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
          type="text"
          ref={input => {
            this.textInput = input;
          }}
          style={{ opacity: 0 }}
          onChange={this.handleInput}
          onBlur={this.reFocus}
        />
        {this.state.lines.map(line => (
          <div>
            {line.line.map(letter => (
              <Letter letter={letter} />
            ))}
          </div>
        ))}
      </div>
    );
  }

  renderList = () => {
    return <h1>d</h1>;
  };
}

export default TypeInput;
