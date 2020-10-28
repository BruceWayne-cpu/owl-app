<template>
  <v-container>
    <div class="home">
      <v-row no-gutters>
        <!-- <div
            v-bind:class="{ normal: count !== index, high: count === index }"
            v-for="(step, index) in steps"
            v-bind:key="index"
          >
            {{ step[0] }}
          </div> -->
        <v-col>
          <v-btn
            fab
            @click="sendNote(index)"
            v-bind:color="count === index ? '#3dc2ff' : 'auto'"
            @focus="onFocus"
            v-bind:class="{ normal: count !== index, high: count === index }"
            v-for="(step, index) in steps"
            v-bind:key="index"
          >
            {{ step[0] }}
          </v-btn>
        </v-col>
      </v-row>
      <v-divider></v-divider>
      <v-row>
        <v-container>
          <v-touch @swipeup="swipeUpHandle" @swipedown="swipeDownHandle">
            <keyboard v-model="selectedNote"></keyboard>
          </v-touch>
        </v-container>
      </v-row>

      <v-divider></v-divider>

      <v-row align="end" justify="space-between" no-gutters>
        <v-col offset="1">
          <span class="display-1 font-weight-light" v-text="bpm"></span>
          <span class="subheading font-weight-light mr-1">BPM</span>
        </v-col>

        <!-- <v-col>
            <v-fade-transition>
              <v-avatar
                v-if="isPlaying"
                color="primary"
                :style="{
                  animationDuration: animationDuration,
                }"
                class="mb-1 v-avatar--metronome"
                size="12"
              ></v-avatar>
            </v-fade-transition>
          </v-col> -->

        <v-col cols="3">
          <v-btn color="primary" dark @click="playToggle">
            <v-icon large>
              {{ isPlaying ? "mdi-pause" : "mdi-play" }}
            </v-icon>
          </v-btn>
        </v-col>
        <v-col cols="3">
          <v-btn color="primary" dark @click="stopMetro">
            <v-icon large>
              {{ "mdi-stop" }}
            </v-icon>
          </v-btn>
        </v-col>
      </v-row>
      <!--  <v-row>
          <v-slider
            @mouseup="sendBpm"
            v-model="bpm"
            color="primary"
            track-color="grey"
            always-dirty
            min="40"
            max="218"
          >
            <template v-slot:prepend>
              <v-icon color="primary" @click="decrement"> mdi-minus </v-icon>
            </template>

            <template v-slot:append>
              <v-icon color="primary" @click="increment"> mdi-plus </v-icon>
            </template>
          </v-slider>
        </v-row> -->
      <v-container>
        <vue-slider v-model="bpm" v-bind="options"></vue-slider>
      </v-container>
    </div>
    <v-snackbar v-model="snackbar" :timeout="timeout">
      connected with {{ connDevice.name }}

      <template v-slot:action="{ attrs }">
        <v-btn color="blue" text v-bind="attrs" @click="snackbar = false">
          Close
        </v-btn>
      </template>
    </v-snackbar>
    <v-snackbar v-model="snackbar2" :timeout="timeout">
      couldn't connect with {{ connDevice.name }}

      <template v-slot:action="{ attrs }">
        <v-btn color="blue" text v-bind="attrs" @click="snackbar2 = false">
          Close
        </v-btn>
      </template>
    </v-snackbar>
  </v-container>
</template>

<script>
import { BLE } from "@ionic-native/ble";
import VueSlider from "vue-slider-component";
import "vue-slider-component/theme/antd.css"; // LE COMENTE TODO LO QUE TENIA HOVER, si cambias hover por active funciona un poco mas lindo pero algunas cosas andan raras
import {
  getConnectedDevice,
  send,
  setConnectedDevice,
} from "../comm/communication";
import { opcode, data1, data2 } from "../comm/message";
import Keyboard from "../components/Keyboard";

export default {
  name: "Sequencer",
  components: {
    VueSlider,
    Keyboard,
  },
  data() {
    return {
      connDevice: { name: "hello" },
      first: true,
      snackbar: false,
      snackbar2: false,
      timeout: 2000,
      interval: null,
      isPlaying: false,
      selectedNote: 1,
      selectedOctave: 1,
      bpm: 50,
      count: 0,
      stepIndex: 0,
      seqLength: 8,
      steps: [
        ["A", 1],
        ["B", 2],
        ["C", 3],
        ["D", 4],
        ["E", 5],
        ["F", 6],
        ["G", 7],
        ["H", 8],
        ["A", 1],
        ["B", 2],
        ["C", 3],
        ["D", 4],
        ["E", 5],
        ["F", 6],
        ["G", 7],
        ["H", 8],
      ],
      value: 0,
      options: {
        dotSize: 20,
        width: "auto",
        height: 4,
        contained: false,
        direction: "ltr",
        data: null,
        dataLabel: "label",
        dataValue: "value",
        min: 20,
        max: 254,
        interval: 1,
        disabled: false,
        clickable: true,
        duration: 0.5,
        adsorb: false,
        lazy: true,
        tooltip: "active",
        tooltipPlacement: "top",
        tooltipFormatter: void 0,
        useKeyboard: false,
        keydownHook: null,
        dragOnClick: false,
        enableCross: true,
        fixed: false,
        minRange: void 0,
        maxRange: void 0,
        order: true,
        marks: false,
        dotOptions: void 0,
        dotAttrs: void 0,
        process: true,
        dotStyle: void 0,
        railStyle: void 0,
        processStyle: void 0,
        tooltipStyle: void 0,
        stepStyle: void 0,
        stepActiveStyle: void 0,
        labelStyle: void 0,
        labelActiveStyle: void 0,
      },
      intNote: [
        "",
        "C",
        "C#",
        "D",
        "D#",
        "E",
        "F",
        "F#",
        "G",
        "G#",
        "A",
        "A#",
        "B",
      ],
    };
  },
  created() {},
  mounted() {
    this.initSteps();
    setTimeout(() => {
      this.initBLE();
    }, 1500);
    //this.$vuetify.theme.dark = true;
  },
  watch: {
    bpm() {
      this.sendBpm();
    },
    selectedNote() {
      console.log(this.selectedNote);
    },
    steps() {
      console.log("asdf");
    },
  },
  methods: {
    noteToString(note, octave) {
      return this.intNote[note] + JSON.stringify(octave);
    },
    stopMetro() {
      this.sendMsg(opcode.PlayStop, data1.stop, data2.default);
      this.count = 0;
      this.isPlaying = false;
      this.first = true;
    },
    stepCount(index) {
      this.stepIndex = index; //SIRVE DE ALGO STEPINDEX??? pensar bien si usar el count o solo index
      this.count <= this.seqLength - 2 && !this.first
        ? this.count++
        : (this.count = 0);

      console.log(this.count);
    },
    initSteps() {
      this.seqLength = this.steps.length;
    },
    initBLE() {
      getConnectedDevice()
        ? (this.connDevice = getConnectedDevice())
        : (this.connDevice = { name: "Undefined Device" });
      BLE.isConnected(this.connDevice.id)
        .then(() => (this.snackbar = true))
        .catch(() => (this.snackbar2 = true));
      const newCharacteristics = {};
      this.connDevice.characteristics.forEach((characteristic) => {
        newCharacteristics[characteristic.properties[0]] = characteristic;
      });
      this.connDevice.parsedCharacteristics = newCharacteristics;
      setConnectedDevice(this.connDevice);

      BLE.startNotification(
        this.connDevice.id,
        this.connDevice.parsedCharacteristics.Notify.service,
        this.connDevice.parsedCharacteristics.Notify.characteristic
      ).subscribe(
        (buffer) => {
          // me llega un arreglo de 2 lugares. en el primero esta el objeto arraybuffer y en el segundo el largo del mensaje
          let data = new Uint8Array(buffer[0]);
          console.log("largo mensaje: " + buffer[1]);
          console.log("mensaje op: " + data);
          switch (data[0]) {
            case opcode.Tempo:
              this.bpm = data[1];
              break;
            case opcode.Step:
              this.stepCount(data[1]);
              break;
            default:
            // code block
          }
        },
        (error) => console.log("Notification error: " + JSON.stringify(error))
      );
      //startNotification();
    },
    decrement() {
      this.bpm--;
      this.sendBpm();
    },
    increment() {
      this.bpm++;
      this.sendBpm();
    },
    playToggle() {
      let PlayPause;
      if (this.isPlaying) {
        PlayPause = data1.pause;
      } else {
        PlayPause = data1.play;
        this.first = false;
      }
      this.sendMsg(opcode.PlayStop, PlayPause, data2.default);
      this.isPlaying = !this.isPlaying;
    },
    sendBpm() {
      this.sendMsg(opcode.Tempo, this.bpm, data2.default);
    },
    sendNote(i) {
      this.steps[i][0] = this.noteToString(
        this.selectedNote,
        this.selectedOctave
      );
      this.sendMsg(
        opcode.Note,
        i,
        this.selectedNote + 12 * this.selectedOctave
      );
    },
    sendMsg(op, d1, d2) {
      this.connDevice.parsedCharacteristics.Write
        ? send(this.connDevice, op, d1, d2)
        : console.log("couldnt send message");
    },
    swipeUpHandle() {
      this.selectedOctave >= 8
        ? (this.selectedOctave = 8)
        : this.selectedOctave++;
      //console.log("swipe up!!");
    },
    swipeDownHandle() {
      this.selectedOctave <= 0
        ? (this.selectedOctave = 0)
        : this.selectedOctave--;
      //console.log("swipe Down!!");
    },
    onFocus() {
      document.activeElement.blur();
    },
  },
  /*  computed: {
    animationDuration() {
      return `${60 / this.bpm}s`;
    },
  }, */
};
</script>

<style scoped>
.normal {
  /* display: flex;
  align-items: center;
  justify-content: center;
  background: auto; */
  transform: scale(1);
  transition: background 0.1s linear, color 0.1s linear, transform 0.1s linear;
  /*  width: 40px;
  height: 40px; */
  border: 1px solid #eee;
  margin: 4px 14px;
}

.high {
  /*  display: flex;
  align-items: center;
  justify-content: center;
  background: #3dc2ff; */
  transform: scale(1.13);
  transition: background 0.2s linear, color 0.2s linear, transform 0.2s linear;
  /*   width: 40px;
  height: 40px; */
  border: 1px solid #eee;
  margin: 4px 14px;
}

@keyframes metronome-example {
  from {
    transform: scale(0.5);
  }
  to {
    transform: scale(1);
  }
}
.v-avatar--metronome {
  animation-name: metronome-example;
  animation-iteration-count: infinite;
  animation-direction: alternate;
}
.v-card.blackNotes {
  padding: 0;
  margin: 0;
  background: black;
  color: white;
}
.v-card.whiteNotes {
  padding: 0;
  margin: 0;
}
</style>