// Message structure

export const opcode = {
    Tempo: 0,
    PlayStop: 1,
    Step: 3,
    Note: 4
}

export const data1 = {
    play: 0,
    pause: 1,
    stop: 2
}

export const data2 = {
    default: 0,
    note: {
        c: 1,
        cs: 2,
        d: 3,
        ds: 4,
        e: 5.,
        f: 6,
        fs: 7,
        g: 8,
        gs: 9,
        a: 10,
        as: 11,
        b: 12
    }
}

const intNote = ['', 'C', 'C#', 'D', 'D#', 'E', 'F', 'F#', 'G', 'G#', 'A', 'A#', 'B']
export function noteToString(note, octave) {
    return intNote[note] + JSON.stringify(octave)
}