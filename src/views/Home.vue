<template>
  <v-container>
    <div class="home">
      <v-content>
        <v-row class="mb-4">
          <v-col class="text-center">
            <v-btn color="primary" @click="playMetro">Play</v-btn>
          </v-col>
          <v-col class="text-center">
            <v-btn color="primary" @click="stopMetro">Stop</v-btn>
          </v-col>
        </v-row>
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
      <metro v-model="musicalTimerInstance.tempo"></metro>
    </div>
  </v-container>
</template>

<script>
// @ is an alias to /src
import Metro from "@/components/Metro.vue";
//import { MusicalTimer } from "../../node_modules/musical-timer/src/musical-timer.js";
import { MusicalTimer } from "../metronome/metronome";

export default {
  name: "Home",
  components: {
    Metro,
  },
  data() {
    return {
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
      ],
    };
  },
  mounted() {
    this.initTimer();
  },
  methods: {
    playMetro() {
      if (this.musicalTimerInstance.status === "running") {
        this.musicalTimerInstance.pause();
      } else {
        this.musicalTimerInstance.play();
      }
    },
    stopMetro() {
      this.musicalTimerInstance.stop();
      this.count = 0;
    },
    stepCount() {
      this.count <= this.seqLength - 2 ? this.count++ : (this.count = 0);
      console.log(this.count);
      console.log(this.musicalTimerInstance.tempo);
    },
    initTimer() {
      this.musicalTimerInstance = new MusicalTimer(this.stepCount);
      this.musicalTimerInstance.tempo = 75;
      console.log(
        "initTimer, tempo = " + JSON.stringify(this.musicalTimerInstance.tempo)
      );
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
</style>