import React, { Component } from "react";
// import logo from "./logo.svg";
import "./App.css";
import TypeInput from "./components/TypeInput";

class App extends Component {
  render() {
    return (
      <div>
        <TypeInput text="package data_structures;\r\n\r\nimport java.util.Random;\r\n\r\n\/\/0- based indexable skip list.\r\npublic class IndexableSkipList <E extends Comparable<E>> {\t\r\n\r\n\tclass Node \r\n\t{\r\n\t\tE value;\r\n\t\tint level;\r\n\t\tint length;\r\n\t\tNode next;\r\n\t\tNode down;\r\n\r\n\t\tpublic Node(E val, int lvl, int ps, Node nxt, Node dwn) \r\n\t\t{\r\n\t\t\tvalue = val;\r\n\t\t\tlevel = lvl;\r\n\t\t\tlength = ps;\r\n\t\t\tnext = nxt;\r\n\t\t\tdown = dwn;\r\n\t\t}\r\n\t}\r\n\r\n\tfinal static double p = 0.5;\r\n\t\r\n\tNode head;\r\n\tRandom rand;\r\n\tint size;\r\n\r\n\tpublic IndexableSkipList() \r\n\t{\r\n\t\thead = new Node(null, 0, -1, null, null);\r\n\t\trand = new Random();\r\n\t\tsize = 0;\r\n\t}\r\n\r\n\tpublic int randomizeLevel() \r\n\t{\r\n\t\tint level = 0;\r\n\t\twhile (level <= head.level && rand.nextDouble() < p)\r\n\t\t\t++level;\r\n\t\treturn level;\r\n\t}\r\n\t\r\n\tpublic E remove(int index)\r\n\t{\r\n\t\tif (index < 0 || index >= size)\r\n\t\t\treturn null;\r\n\t\tE removed = null;\r\n\t\tint cur_pos = -1;\r\n\t\tNode cur = head;\t\r\n\t\twhile (cur != null)\r\n\t\t{\r\n\t\t\tif (cur.next != null && cur_pos + cur.length < index) \r\n\t\t\t{\r\n\t\t\t\tcur_pos += cur.length;\r\n\t\t\t\tcur = cur.next;\r\n\t\t\t}\r\n\t\t\telse\r\n\t\t\t{\r\n\t\t\t\tcur.length--;\r\n\t\t\t\tif(cur_pos + cur.length + 1 == index && cur.next != null)\r\n\t\t\t\t{\r\n\t\t\t\t\tremoved = cur.next.value;\r\n\t\t\t\t\tcur.length += (cur.next.length == -1 ? 0 : cur.next.length);\r\n\t\t\t\t\tcur.next = cur.next.next;\t\r\n\t\t\t\t}\r\n\t\t\t\tcur = cur.down;\r\n\t\t\t}\r\n\t\t}\r\n\t\t--size;\r\n\t\tif(size == 0){\t\t\t\r\n\t\t\thead = new Node(null, 0, -1, null, null);\r\n\t\t}\r\n\t\treturn removed;\r\n\t}\r\n" />
      </div>
    );
  }

  sendCorrect(char) {}
}

export default App;
