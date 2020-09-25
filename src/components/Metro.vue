<template>
  <v-card-text>
    <v-row align="end" justify="space-between">
      <v-col class="text-left">
        <span class="display-1 font-weight-light" v-text="bpm"></span>
        <span class="subheading font-weight-light mr-1">BPM</span>
      </v-col>
      <v-row align="end">
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
      </v-row>

      <v-col class="text-right">
        <v-btn color="primary" dark depressed fab @click="toggle">
          <v-icon large>
            {{ isPlaying ? "mdi-pause" : "mdi-play" }}
          </v-icon>
        </v-btn>
      </v-col>
    </v-row>

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
  </v-card-text>
</template>

<script>
export default {
  name: "Metro",
  props: {
    bpmProp: Number,
  },
  data: () => ({
    bpm: 75,
    interval: null,
    isPlaying: false,
  }),
  created() {
    //this.bpm = this.$props.bpmProp;
    //this.initMetro();
    console.log("init en Metro, bpm = " + JSON.stringify(this.bpm));
  },
  computed: {
    animationDuration() {
      return `${60 / this.bpm}s`;
    },
  },
  methods: {
    /*  initMetro() {
      this.bpm = this.$props.bpmProp;
    }, */
    decrement() {
      this.bpm--;
    },
    increment() {
      this.bpm++;
    },
    toggle() {
      this.isPlaying = !this.isPlaying;
    },
    sendEvent() {
      this.$emit("input", this.bpm);
      console.log("printendddd!!!!");
    },
  },
};
</script>

<style>
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