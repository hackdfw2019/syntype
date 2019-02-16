import React, { Component } from "react";

class TabVar extends Component {
  state = {};
  render() {
    if (this.props.char === "\t") {
      return <React.Fragment>&emsp;&emsp;</React.Fragment>;
    }
    return <React.Fragment>{this.props.char}</React.Fragment>;
  }
}

export default TabVar;
