let dataSample = [0.2, 0.5, 7, 0.8, 0.6, 1.2, 0.3, 1.7, 1, 3, 2.4, 5, 1.9];
let synths = [
  "FM Synth",
  "AM Synth",
  "Membrane Synth",
  "Plucky Synth",
  "Metal Synth",
  "Mono Synth",
];
let am, fm, membrane, pluck, metal, mono;
let chosenSynth;

document.querySelector("button")?.addEventListener("click", async () => {
  await Tone.start();
  init();
});

let value = 0.1;
let note;
let notes = [];
function mapRange(value, minf, maxf, mins, maxs) {
  value = (value - minf) / (maxf - minf);
  return mins + value * (maxs - mins);
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
      fm = true;
    }

    if (e.target.value == "AM Synth") {
      am = true;
    }

    if (e.target.value == "Membrane Synth") {
      membrane = true;
    }

    if (e.target.value == "Plucky Synth") {
      pluck = true;
    }

    if (e.target.value == "Metal Synth") {
      metal = true;
    }

    if (e.target.value == "Mono Synth") {
      mono = true;
    }
  });
});

let synthInstruments = [];

function init() {
  const freqV = mapRange(value, 50, 4000, 0.1, 5);

  const fmSynth = new Tone.FMSynth({
    frequency: freqV,
    envelope: {
      attack: 0.01,
      decay: 1.4,
      release: 0.5,
    },
    harmonicity: freqV,
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

  dataSample.forEach((data) => {
    note = data * 100;
    notes.push(note);
  });

  if (fm == true) {
    chosenSynth = synthInstruments[0];
  }

  if (am == true) {
    chosenSynth = synthInstruments[1];
  }

  if (membrane == true) {
    chosenSynth = synthInstruments[2];
  }

  if (pluck == true) {
    chosenSynth = synthInstruments[3];
  }

  if (metal == true) {
    chosenSynth = synthInstruments[4];
  }

  if (mono == true) {
    chosenSynth = synthInstruments[5];
  }

  for (let i = 0; i < notes.length; i++) {
    chosenSynth.triggerAttackRelease(notes[i], "2n", i);
  }

  const filter = new Tone.Filter(freqV, "lowpass").toDestination();
  chosenSynth.connect(filter);

  const feedbackDelay = new Tone.FeedbackDelay(freqV, 0.5).toDestination();
  chosenSynth.connect(feedbackDelay);

  const distortion = new Tone.Distortion(freqV).toDestination();
  //connect a player to the distortion
  chosenSynth.connect(distortion);

  const freeverb = new Tone.Freeverb().toDestination();
  freeverb.dampening = 1000;
  chosenSynth.connect(freeverb);

  const tremolo = new Tone.Tremolo(9, freqV).toDestination().start();
  chosenSynth.connect(tremolo);

  const cheby = new Tone.Chebyshev(50).toDestination();
  chosenSynth.connect(cheby);

  const phaser = new Tone.Phaser({
    frequency: 15,
    octaves: 5,
    baseFrequency: freqV,
  }).toDestination();
  chosenSynth.connect(phaser);
}

// const player = new Tone.Player("testSounds/pigeons.mp3").toDestination();
// // play as soon as the buffer is loaded
// player.autostart = true;
