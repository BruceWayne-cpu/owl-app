<template>
  <v-container>
    <span>{{ text }}</span>

    <v-card class="mx-auto" max-width="300">
      <v-btn block large color="primary" @click="scan">
        <v-icon left large>mdi-bluetooth</v-icon> SCAN</v-btn
      >
      <v-list>
        <v-subheader>DEVICES</v-subheader>
        <v-list-item-group color="primary">
          <v-list-item
            @click="handleDevice(device)"
            v-for="(device, i) in devices"
            :key="i"
          >
            <v-list-item-icon>
              <v-icon>mdi-access-point</v-icon>
            </v-list-item-icon>
            <v-list-item-content>
              <v-list-item-title v-text="device.name"></v-list-item-title>
              <v-list-item-subtitle v-html="device.id"></v-list-item-subtitle>
            </v-list-item-content>
          </v-list-item>
        </v-list-item-group>
      </v-list>
    </v-card>
  </v-container>
</template>

<script>
import { BLE } from "@ionic-native/ble";
import { connectDevice } from "../comm/communication";
//import { scanDevices } from "../comm/communication";
export default {
  name: "Scan",
  data() {
    return {
      devices: [],
      text: "default",
    };
  },
  mounted() {},
  methods: {
    scan() {
      //scanDevices().then((dev) => (this.devices = dev));
      BLE.isEnabled().catch(() => BLE.enable());
      this.devices = [];
      BLE.scan([], 10).subscribe(
        (device) => {
          this.devices.push(device);
        },
        (error) => {
          console.log(JSON.stringify(error));
          //setShowToast(true);
        }
      );
    },
    handleDevice(dev) {
      connectDevice(dev);
      this.$router.push("/about");
    },
  },
};
</script>

