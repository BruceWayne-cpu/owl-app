// send and reiceve messages over BLE
import { BLE } from "@ionic-native/ble";
export let devices = [];
let DevIce;

function setMsgBuffer(op, d1, d2) {
    const buff = new Uint8Array([op, d1, d2]);
    return buff.buffer;
}

export async function scanDevices() {
    BLE.isEnabled().catch(() => BLE.enable());
    BLE.scan([], 5).subscribe(device => {

        //setDevices(devices => [...devices, device]);
        //devices.push(device);
        devices = [...devices, device];
    },
        error => {
            console.log(JSON.stringify(error));
            //setShowToast(true);
        }

    );
    return devices
}

export function connectDevice(dev) {
    BLE.connect(dev.id).subscribe(
        (peripheralData) => {
            setConnectedDevice(peripheralData);
        },
        () => {
            //setShowToast1(true);
            console.log("no se pudo conectar");
        }
    );
}

export function send(connectedDevice, op, d1, d2) {
    if (!(connectedDevice)) {
        console.log('device = null o texto vacio')
    } else {
        BLE.writeWithoutResponse(
            connectedDevice.id,
            connectedDevice.parsedCharacteristics.Write.service,
            connectedDevice.parsedCharacteristics.Write.characteristic,
            setMsgBuffer(op, d1, d2))
            .then(() => console.log('mensaje enviado'))
            .catch(() => console.log('mensaje no se pudo enviar'));
    }
}

export function setConnectedDevice(dev) {
    DevIce = dev;
}
export function getConnectedDevice() {
    return DevIce
}