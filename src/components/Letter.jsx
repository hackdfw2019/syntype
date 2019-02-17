import React, { Component } from "react";

class Letter extends Component {
  state = {};
  render() {
    return <span className={this.getLetterClasses(this.props.letter)} />;
  }

  getChar = lett => {
    if (this.props.letter.char === "\t") {
      return <React.Fragment>&emsp;&emsp;</React.Fragment>;
    } else if (this.props.letter.char === "\n") {
      return <React.Fragment> </React.Fragment>;
    } else {
      return <React.Fragment>{lett.chars}</React.Fragment>;
    }
  };

  getLetterClasses(letter) {
    let cls = "";
    switch (letter.status) {
      case 0:
        cls += "bg-primary ";
        break;
      case 1:
        cls += "bg-success ";
        break;
      case 2:
        cls += "bg-danger ";
        break;
      default:
    }
    if (letter.isCurrent) {
      cls += "underline ";
    }
    return cls;
  }
}

export default Letter;
