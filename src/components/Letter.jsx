import React, { Component } from "react";

class Letter extends Component {
  state = {};
  render() {
    return (
      <span className={this.getLetterClasses(this.props.letter)}>
        {this.getChar(this.props.letter)}
      </span>
    );
  }

  getChar = lett => {
    if (lett.char === "\t") {
      return <React.Fragment>&emsp;&emsp;</React.Fragment>;
    } else if (lett.char === "\n") {
      return <React.Fragment>&nbsp;</React.Fragment>;
    } else {
      return <React.Fragment>{lett.char}</React.Fragment>;
    }
  };

  getLetterClasses(letter) {
    let cls = "";
    switch (letter.status) {
      case 0:
        cls += "not-typed ";
        break;
      case 1:
        cls += "good ";
        break;
      case 2:
        cls += "bad ";
        break;
      default:
    }
    cls += "highlight ";

    switch (letter.pos) {
      case -1:
        cls += "left-round ";
        break;
      case 1:
        cls += "right-round ";
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
