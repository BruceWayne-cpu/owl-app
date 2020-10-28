<template>
  <ul class="set">
    <li class="white e" @click="handleNote(notes.note.c)"></li>
    <li class="black ds" @click="handleNote(notes.note.cs)"></li>
    <li class="white d" @click="handleNote(notes.note.d)"></li>
    <li class="black cs" @click="handleNote(notes.note.ds)"></li>
    <li class="white c" @click="handleNote(notes.note.e)"></li>
    <li class="white b" @click="handleNote(notes.note.f)"></li>
    <li class="black as" @click="handleNote(notes.note.fs)"></li>
    <li class="white a" @click="handleNote(notes.note.g)"></li>
    <li class="black gs" @click="handleNote(notes.note.gs)"></li>
    <li class="white g" @click="handleNote(notes.note.a)"></li>
    <li class="black fs" @click="handleNote(notes.note.as)"></li>
    <li class="white f" @click="handleNote(notes.note.b)"></li>
  </ul>
</template>

<script>
import { data2 } from "../comm/message";
export default {
  name: "Keyboard",
  model: {
    prop: "note",
    event: "note-change",
  },
  props: {
    note: Number,
  },
  data() {
    return {
      notes: {},
    };
  },
  mounted() {
    this.notes = data2;
    console.log(this.notes);
  },
  methods: {
    handleNote(note) {
      this.$emit("note-change", note);
    },
  },
};
</script>

<style scoped>
* {
  box-sizing: border-box;
}

body {
  margin: 0;
}

ul {
  height: 10em;
  width: 100%;
  margin: 0;
  padding: 0;
  position: relative;
  /* border: 1px solid #160801; */

  /* background: linear-gradient(
      to bottom right,
      rgba(0, 0, 0, 0.3),
      rgba(0, 0, 0, 0)
    ),
    url(https://s3-us-west-2.amazonaws.com/s.cdpn.io/187/vwood.png);
  box-shadow: 0 0 50px rgba(0, 0, 0, 0.5) inset,
    0 1px rgba(212, 152, 125, 0.2) inset, 0 5px 15px rgba(0, 0, 0, 0.5); */
}

li {
  margin: 0;
  padding: 0;
  list-style: none;
  position: relative;
  float: left;
}

ul .white {
  height: 100%;
  width: 14%;
  z-index: 1;
  border-left: 1px solid #bbb;
  border-bottom: 1px solid #bbb;
  border-radius: 0 0 5px 5px;
  box-shadow: -1px 0 0 rgba(255, 255, 255, 0.8) inset, 0 0 5px #ccc inset,
    0 0 3px rgba(0, 0, 0, 0.2);
  background: linear-gradient(to bottom, #eee 0%, #fff 100%);
}

ul .white:active {
  border-top: 1px solid #777;
  border-left: 1px solid #999;
  border-bottom: 1px solid #999;
  box-shadow: 2px 0 3px rgba(0, 0, 0, 0.1) inset,
    -5px 5px 20px rgba(0, 0, 0, 0.2) inset, 0 0 3px rgba(0, 0, 0, 0.2);
  background: linear-gradient(to bottom, #fff 0%, #e9e9e9 100%);
}

.black {
  height: 50%;
  width: 2.3em;
  margin: 0 0 0 -1.3em;
  z-index: 2;
  border: 1px solid #000;
  border-radius: 0 0 3px 3px;
  box-shadow: -1px -1px 2px rgba(255, 255, 255, 0.2) inset,
    0 -5px 2px 3px rgba(0, 0, 0, 0.6) inset, 0 2px 4px rgba(0, 0, 0, 0.5);
  background: linear-gradient(45deg, #222 0%, #555 100%);
}

.black:active {
  box-shadow: -1px -1px 2px rgba(255, 255, 255, 0.2) inset,
    0 -2px 2px 3px rgba(0, 0, 0, 0.6) inset, 0 1px 2px rgba(0, 0, 0, 0.5);
  background: linear-gradient(to right, #444 0%, #222 100%);
}

.a,
.g,
.f,
.d,
.c {
  margin: 0 0 0 -1em;
}

ul li:first-child {
  border-radius: 5px 0 5px 5px;
}

ul li:last-child {
  border-radius: 0 5px 5px 5px;
}
</style>