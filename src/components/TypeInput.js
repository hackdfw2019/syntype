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

    this.setState({ lines: tempLines });
  };

  constructor(props) {
    super(props);

    this.state = {
      text: props.text,
      lines: this.addText(props.text, true),
      lineNum: 0,
      charNum: 0
    };
    // if (props.text !== undefined) {
    //   this.addText(props.text);
    // }
    console.log("done constructing");
  }

  handleInput = (key, e) => {
    console.log("Sent: " + key);
    switch (key) {
      case "enter":
        key = "\n";
        break;
      case "tab":
        key = "\t";
        break;
      default:
    }
  };

  render() {
    return (
      <div className="jumbotron">
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
                    <span className="letter" key={letter.place}>
                      <TabVar char={letter.char} />
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
