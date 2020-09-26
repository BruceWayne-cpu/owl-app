<template>
  <v-container>
    <div class="home">
      <v-row>
        <!-- <div
            v-bind:class="{ normal: count !== index, high: count === index }"
            v-for="(step, index) in steps"
            v-bind:key="index"
          >
            {{ step[0] }}
          </div> -->
        <v-btn
          fab
          v-bind:color="count === index ? '#3dc2ff' : 'auto'"
          @focus="onFocus"
          v-bind:class="{ normal: count !== index, high: count === index }"
          v-for="(step, index) in steps"
          v-bind:key="index"
        >
          {{ step[0] }}
        </v-btn>
      </v-row>

      <v-card-text>
        <v-row align="end" justify="space-between">
          <v-col class="text-left">
            <span class="display-1 font-weight-light" v-text="bpmText"></span>
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

          <v-col>
            <v-btn color="primary" dark fab @click="playToggle">
              <v-icon large>
                {{ isPlaying ? "mdi-pause" : "mdi-play" }}
              </v-icon>
            </v-btn>
          </v-col>
          <v-col>
            <v-btn color="primary" dark fab @click="stopMetro">
              <v-icon large>
                {{ "mdi-stop" }}
              </v-icon>
            </v-btn>
          </v-col>
        </v-row>
        <v-row>
          <v-slider
            @mouseup="sendBpm"
            v-model="bpmText"
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
        </v-row>
        <p>{{ connDevice }}</p>
      </v-card-text>
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
import {
  getConnectedDevice,
  send,
  setConnectedDevice,
} from "../comm/communication";
import { opcode, data1, data2 } from "../comm/message";
import { MusicalTimer } from "../metronome/metronome";

export default {
  name: "Sequencer",
  /*  components: {
    Metro,
  }, */
  data() {
    return {
      connDevice: { name: "hello" },
      first: true,
      snackbar: false,
      snackbar2: false,
      timeout: 2000,
      interval: null,
      isPlaying: false,
      bpmText: 50,
      bpm: 50,
      musicalTimerInstance: MusicalTimer(() => {
        console.log("eee");
      }),
      count: 0,
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
    };
  },
  created() {},
  mounted() {
    this.initTimer();
    setTimeout(() => {
      this.initBLE();
    }, 1000);
    //this.$vuetify.theme.dark = true;
  },
  methods: {
    stopMetro() {
      this.sendMsg(opcode.PlayStop, data1.stop, data2.default);
      this.musicalTimerInstance.stop();
      this.count = 0;
      this.isPlaying = false;
      this.first = true;
      console.log(this.musicalTimerInstance.status);
    },
    stepCount() {
      this.count <= this.seqLength - 2 && !this.first
        ? this.count++
        : (this.count = 0);
      console.log(this.count);
      console.log(this.musicalTimerInstance.tempo);
    },
    initTimer() {
      this.musicalTimerInstance = new MusicalTimer(this.stepCount);
      this.musicalTimerInstance.tempo = this.bpm;
      this.seqLength = this.steps.length;
      console.log(
        "initTimer, tempo = " + JSON.stringify(this.musicalTimerInstance.tempo)
      );
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
      //startNotification();
    },
    decrement() {
      this.bpmText--;
      this.sendBpm();
    },
    increment() {
      this.bpmText++;
      this.sendBpm();
    },
    playToggle() {
      let PlayPause;
      if (this.isPlaying) {
        PlayPause = data1.pause;
        this.musicalTimerInstance.pause();
      } else {
        PlayPause = data1.play;
        this.musicalTimerInstance.play();
        this.first = false;
      }
      this.sendMsg(opcode.PlayStop, PlayPause, data2.default);
      console.log(this.musicalTimerInstance.status);
      this.isPlaying = !this.isPlaying;
    },
    sendBpm() {
      setTimeout(() => {
        this.bpm = this.bpmText;
        this.musicalTimerInstance.tempo = this.bpm;
      }, 30);

      this.sendMsg(opcode.Tempo, this.bpmText, data2.default);
    },
    sendMsg(op, d1, d2) {
      this.connDevice.parsedCharacteristics.Write
        ? send(this.connDevice, op, d1, d2)
        : console.log("couldnt send message");
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
  transition: background 0.2s linear, color 0.2s linear, transform 0.2s linear;
  /*  width: 40px;
  height: 40px; */
  border: 1px solid #eee;
  margin: 13px;
}

.high {
  /*  display: flex;
  align-items: center;
  justify-content: center;
  background: #3dc2ff; */
  transform: scale(1.2);
  transition: background 0.2s linear, color 0.2s linear, transform 0.2s linear;
  /*   width: 40px;
  height: 40px; */
  border: 1px solid #eee;
  margin: 13px;
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
</style>