import React, { Component } from "react";
// import logo from "./logo.svg";
import "./App.css";
import TypeInput from "./components/TypeInput.jsx";

class App extends Component {
  render() {
    return (
      <div>
        <TypeInput
          numToplines={6}
          numBottomlines={6}
          text="package data_structures;\n\nimport java.util.Random;\n\n\/\/0- based indexable skip list.\npublic class IndexableSkipList <E extends Comparable<E>> {\t\n\n\tclass Node \n\t{\n\t\tE value;\n\t\tint level;\n\t\tint length;\n\t\tNode next;\n\t\tNode down;\n\n\t\tpublic Node(E val, int lvl, int ps, Node nxt, Node dwn) \n\t\t{\n\t\t\tvalue = val;\n\t\t\tlevel = lvl;\n\t\t\tlength = ps;\n\t\t\tnext = nxt;\n\t\t\tdown = dwn;\n\t\t}\n\t}\n\n\tfinal static double p = 0.5;\n\t\n\tNode head;\n\tRandom rand;\n\tint size;\n\n\tpublic IndexableSkipList() \n\t{\n\t\thead = new Node(null, 0, -1, null, null);\n\t\trand = new Random();\n\t\tsize = 0;\n\t}\n\n\tpublic int randomizeLevel() \n\t{\n\t\tint level = 0;\n\t\twhile (level <= head.level && rand.nextDouble() < p)\n\t\t\t++level;\n\t\treturn level;\n\t}\n\t\n\tpublic E remove(int index)\n\t{\n\t\tif (index < 0 || index >= size)\n\t\t\treturn null;\n\t\tE removed = null;\n\t\tint cur_pos = -1;\n\t\tNode cur = head;\t\n\t\twhile (cur != null)\n\t\t{\n\t\t\tif (cur.next != null && cur_pos + cur.length < index) \n\t\t\t{\n\t\t\t\tcur_pos += cur.length;\n\t\t\t\tcur = cur.next;\n\t\t\t}\n\t\t\telse\n\t\t\t{\n\t\t\t\tcur.length--;\n\t\t\t\tif(cur_pos + cur.length + 1 == index && cur.next != null)\n\t\t\t\t{\n\t\t\t\t\tremoved = cur.next.value;\n\t\t\t\t\tcur.length += (cur.next.length == -1 ? 0 : cur.next.length);\n\t\t\t\t\tcur.next = cur.next.next;\t\n\t\t\t\t}\n\t\t\t\tcur = cur.down;\n\t\t\t}\n\t\t}\n\t\t--size;\n\t\tif(size == 0){\t\t\t\n\t\t\thead = new Node(null, 0, -1, null, null);\n\t\t}\n\t\treturn removed;\n\t}\n"
        />
      </div>
    );
  }

  sendCorrect(char) {}
}

export default App;
