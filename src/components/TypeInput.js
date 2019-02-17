import React, { Component } from "react";
import KeyboardEventHandler from "react-keyboard-event-handler";
import TabVar from "./TabVar";

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
        tempLines.push({ key: curLineCount, line: curLine });
        curLineCount++;
        curLine = [];
        continue;
      }
      curLine.push({ place: i, char: s });
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

  incrementPointer = () => {
    if (
      this.state.charNum === this.state.lines[this.state.lineNum].line.length
    ) {
      this.setState({ lineNum: this.state.lineNum + 1, charNum: 0 });
    } else {
      this.setState({ charNum: this.state.charNum + 1 });
    }
  };

  incrementLastPointer = () => {
    this.setState({ lastSentCharNum: this.state.lastSentCharNum + 1 });
  };

  decrementPointer = () => {
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
  };

  //only called when a good key is done, but may have already been sent, and accidentally backspaced
  registerGoodKey = key => {
    if (
      this.state.charNum === this.state.lastSentCharNum &&
      this.state.lineNum === this.state.lastSentLineNum
    ) {
      if (key === "\n") {
        this.setState({
          lastSentCharNum: 0,
          lastSentLineNum: this.lastSentLineNum + 1
        });
        let bool = this.state.lines.length - this.state.lineNum < 50;
        // sendPacket(key, bool);
      } else {
        // sendPacket(key, false);
      }
    }
  };

  //iterate line num nad charnum, validate, and format
  handleInput = (key, e) => {
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
      this.setState({ errCount: this.state.errCount + 1 });
    }
  };

  render() {
    return (
      <div className=".text-primary">
        {/* <input type="text" /> */}
        <div className="letter-container .text-primary">
          <KeyboardEventHandler
            handleKeys={["all"]}
            onKeyEvent={(key, e) => this.handleInput(key, e)}
          >
            <div tabIndex="0">
              {this.state.lines.map(line => (
                <div key={line.key}>
                  {line.line.map(letter => (
                    <span className=" " key={letter.place}>
                      <TabVar className="letter" char={letter.char} />
                    </span>
                  ))}
                </div>
              ))}
            </div>
          </KeyboardEventHandler>
        </div>
      </div>
    );
  }
}

export default TypeInput;
