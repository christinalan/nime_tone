// let dataSample = [0.2, 0.5, 7, 0.8, 0.6, 0.3];

let dataSample = [];

fetch("test.json")
  .then((response) => {
    return response.json();
  })
  .then((data) => {
    for (let i = 0; i < data.one.length; i++) {
      dataSample.push(data.one[i].dist);
    }
    console.log(dataSample);
  });

let newnotes = ["C", "D", "E", "F", "G", "A", "H"];
let melody = 1;
let loop, seq;

let synths = [
  "FM Synth",
  "AM Synth",
  "Membrane Synth",
  "Plucky Synth",
  "Metal Synth",
  "Mono Synth",
];

let triggers = {
  am: false,
  fm: false,
  membrane: false,
  pluck: false,
  metal: false,
  mono: false,
};

let chosenSynth;

let value = 0.1;
let noteM;
let notes = [];
function mapRange(value, minf, maxf, mins, maxs) {
  value = (value - minf) / (maxf - minf);
  return mins + value * (maxs - mins);
}

let synthInstruments = [];

// document.querySelector("button")?.addEventListener("click", async () => {
//   await Tone.start();
//   init();
// });

function calculateNote(valueString) {
  let interval = Math.floor((valueString * 10) % 7);
  console.log(interval);
  return newnotes[interval];
}

function calculateOctave(valueString) {
  let interval = Math.floor((valueString * 10) / 7);
  return interval.toString();
}

window.addEventListener("load", () => {
  let dropdown = document.getElementById("dropdown");
  let defaultoption = document.createElement("option");
  defaultoption.text = "Select Synth";

  dropdown.add(defaultoption);

  for (let i = 0; i < synths.length; i++) {
    let synthOption = document.createElement("option");
    synthOption.text = synths[i];
    dropdown.add(synthOption);
  }

  dropdown.selectedIndex = 0;

  dropdown.addEventListener("change", function (e) {
    if (e.target.value == "FM Synth") {
      Object.keys(triggers).forEach((item) => {
        item != "FM Synth" ? triggers[item] : false;
      });
      triggers.fm = true;
    }
    chosenSynth = synthInstruments[0];
    if (e.target.value == "AM Synth") {
      Object.keys(triggers).forEach((item) => {
        item != "AM Synth" ? triggers[item] : false;
      });
      triggers.am = true;
    }
    chosenSynth = synthInstruments[1];
    if (e.target.value == "Membrane Synth") {
      Object.keys(triggers).forEach((item) => {
        item != "Membrane Synth" ? triggers[item] : false;
      });
      triggers.membrane = true;
    }

    if (e.target.value == "Plucky Synth") {
      triggers.pluck = true;
    }

    if (e.target.value == "Metal Synth") {
      triggers.metal = true;
    }

    if (e.target.value == "Mono Synth") {
      triggers.mono = true;
    }
  });
});

document.getElementById("button-start").addEventListener("click", async () => {
  dataSample.forEach((data) => {
    noteM = data * 2000;
    notes.push(noteM);
    // melody = calculateNote(data).concat(calculateOctave(data));
  });

  Tone.Transport.stop();
  await Tone.start();
  init();
  seq = new Tone.Sequence(function (time, note) {
    console.log(note);
    chosenSynth.triggerAttackRelease(note, 0.5, time);
  }, notes).start(0);

  // loop = new Tone.Loop(function (time) {
  //   // console.log(time);
  //   chosenSynth.triggerAttackRelease(seq);
  // }, "4n").start(0);
  Tone.Transport.start();
});

//stop button
document.getElementById("button-stop").addEventListener("click", async () => {
  loop.stop();
  console.log("stop");
  Tone.Transport.stop();
  loop.mute = true;
});

function init() {
  const freqV = mapRange(value, 50, 4000, 0.1, 5);

  const fmSynth = new Tone.FMSynth({
    frequency: 2000,
    envelope: {
      attack: 0.01,
      decay: 1.4,
      release: 0.8,
    },
    harmonicity: 0.2,
  }).toDestination();

  const amSynth = new Tone.AMSynth({
    frequency: freqV,
    envelope: {
      attack: 0.01,
      decay: 1.4,
      release: 0.5,
    },
    harmonicity: freqV,
  }).toDestination();

  const membraneSynth = new Tone.MembraneSynth({
    frequency: freqV,
    envelope: {
      attack: 0.01,
      decay: 1.4,
      release: 0.5,
    },
    harmonicity: freqV,
  }).toDestination();

  const pluckSynth = new Tone.PluckSynth({
    activeVoices: freqV,
  }).toDestination();
  pluckSynth.set({ detune: -200 });

  const metalSynth = new Tone.MetalSynth({
    frequency: freqV,
    envelope: {
      attack: 0.1,
      decay: 2,
      release: 0.8,
    },
    resonance: freqV,
  }).toDestination();

  const monoSynth = new Tone.MetalSynth({
    frequency: freqV - 1000,
    envelope: {
      attack: 0.1,
      decay: 2,
      release: 0.8,
    },
    oscillator: {
      type: "square",
    },
  }).toDestination();

  synthInstruments.push(
    amSynth,
    fmSynth,
    membraneSynth,
    pluckSynth,
    metalSynth,
    monoSynth
  );

  // chosenSynth.triggerAttackRelease(notes[0]);

  if (triggers.fm == true) {
    chosenSynth = synthInstruments[0];
  }

  if (triggers.am == true) {
    chosenSynth = synthInstruments[1];
  }

  if (triggers.membrane == true) {
    chosenSynth = synthInstruments[2];
  }

  if (triggers.pluck == true) {
    chosenSynth = synthInstruments[3];
  }

  if (triggers.metal == true) {
    chosenSynth = synthInstruments[4];
  }

  if (triggers.mono == true) {
    chosenSynth = synthInstruments[5];
  }

  // for (let i = 0; i < notes.length; i++) {
  //   chosenSynth.triggerAttackRelease(notes[i], "2n");
  // }

  // const filter = new Tone.Filter(freqV, "lowpass").toDestination();
  // chosenSynth.connect(filter);

  // const feedbackDelay = new Tone.FeedbackDelay("8n", 0.5).toDestination();
  // chosenSynth.connect(feedbackDelay);

  // const distortion = new Tone.Distortion(freqV).toDestination();
  // chosenSynth.connect(distortion);

  // const freeverb = new Tone.Freeverb().toDestination();
  // freeverb.dampening = 1000;
  // chosenSynth.connect(freeverb);

  // const tremolo = new Tone.Tremolo(9, freqV).toDestination().start();
  // chosenSynth.connect(tremolo);

  // const cheby = new Tone.Chebyshev(50).toDestination();
  // chosenSynth.connect(cheby);

  // const phaser = new Tone.Phaser({
  //   frequency: 15,
  //   octaves: 5,
  //   baseFrequency: freqV,
  // }).toDestination();
  // chosenSynth.connect(phaser);
}

// const player = new Tone.Player("testSounds/pigeons.mp3").toDestination();
// // play as soon as the buffer is loaded
// player.autostart = true;
