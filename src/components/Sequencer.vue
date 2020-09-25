<template>
  <v-container>
    <div class="home">
      <v-content>
        <v-row>
          <div
            v-bind:class="{ normal: count !== index, high: count === index }"
            v-for="(step, index) in steps"
            v-bind:key="index"
          >
            {{ step[0] }}
          </div>
        </v-row>
      </v-content>
      <v-card-text>
        <v-row align="end" justify="space-between">
          <v-col class="text-left">
            <span class="display-1 font-weight-light" v-text="bpm"></span>
            <span class="subheading font-weight-light mr-1">BPM</span>
          </v-col>

          <v-col>
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
          </v-col>

          <v-col>
            <v-btn color="primary" dark depressed fab @click="playToggle">
              <v-icon large>
                {{ isPlaying ? "mdi-pause" : "mdi-play" }}
              </v-icon>
            </v-btn>
          </v-col>
          <v-col>
            <v-btn color="primary" dark depressed fab @click="stopMetro">
              <v-icon large>
                {{ "mdi-stop" }}
              </v-icon>
            </v-btn>
          </v-col>
        </v-row>
        <v-row>
          <v-slider
            @input="sendEvent"
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
        </v-row>
      </v-card-text>
    </div>
  </v-container>
</template>

<script>
// @ is an alias to /src
//import Metro from "@/components/Metro.vue";
//import { MusicalTimer } from "../../node_modules/musical-timer/src/musical-timer.js";
import { MusicalTimer } from "../metronome/metronome";

export default {
  name: "Sequencer",
  /*  components: {
    Metro,
  }, */
  data() {
    return {
      interval: null,
      isPlaying: false,
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
  mounted() {
    this.initTimer();
    //this.$vuetify.theme.dark = true;
  },
  methods: {
    stopMetro() {
      this.musicalTimerInstance.stop();
      this.count = 0;
      this.isPlaying = false;
      console.log(this.musicalTimerInstance.status);
    },
    stepCount() {
      this.count <= this.seqLength - 2 ? this.count++ : (this.count = 0);
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
    decrement() {
      this.bpm--;
    },
    increment() {
      this.bpm++;
    },
    playToggle() {
      if (this.isPlaying) {
        this.musicalTimerInstance.pause();
      } else {
        this.musicalTimerInstance.play();
      }
      console.log(this.musicalTimerInstance.status);
      this.isPlaying = !this.isPlaying;
    },
    sendEvent() {
      this.musicalTimerInstance.tempo = this.bpm;
    },
  },
  computed: {
    animationDuration() {
      return `${60 / this.bpm}s`;
    },
  },
};
</script>

<style scoped>
.normal {
  display: flex;
  align-items: center;
  justify-content: center;
  background: auto;
  transform: scale(1);
  transition: background 0.2s linear, color 0.2s linear, transform 0.2s linear;
  width: 40px;
  height: 40px;
  border: 1px solid #eee;
  margin: 20px;
}

.high {
  display: flex;
  align-items: center;
  justify-content: center;
  background: #3dc2ff;
  transform: scale(1.2);
  transition: background 0.2s linear, color 0.2s linear, transform 0.2s linear;
  width: 40px;
  height: 40px;
  border: 1px solid #eee;
  margin: 20px;
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