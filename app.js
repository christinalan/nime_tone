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

let effects = [
  "filter",
  "delay",
  "reverb",
  "distortion",
  "tremolo",
  "cheby",
  "phaser",
];

let triggers = {
  am: false,
  fm: false,
  membrane: false,
  pluck: false,
  metal: false,
  mono: false,
};

let trigeffects = {
  filter: false,
  delay: false,
  reverb: false,
  distortion: false,
  tremolo: false,
  cheby: false,
  phaser: false,
};

let chosenSynth, chosenEffect, sampler;
let samplerOn;

let value = 0.1;
let noteM;
let notes = [];

function mapRange(value, minf, maxf, mins, maxs) {
  value = (value - minf) / (maxf - minf);
  return mins + value * (maxs - mins);
}

let synthInstruments = [];
let toneEffects = [];

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
  let drop_effects = document.getElementById("effects");
  let defaultoption = document.createElement("option");
  let defaultoption1 = document.createElement("option");
  defaultoption.text = "Select Synth";
  defaultoption1.text = "Select Effect";

  dropdown.add(defaultoption);
  drop_effects.add(defaultoption1);

  for (let i = 0; i < synths.length; i++) {
    let synthOption = document.createElement("option");
    synthOption.text = synths[i];
    dropdown.add(synthOption);
  }

  for (let i = 0; i < effects.length; i++) {
    let effectOption = document.createElement("option");
    effectOption.text = effects[i];
    drop_effects.add(effectOption);
  }

  dropdown.selectedIndex = 0;
  drop_effects.selectedIndex = 0;

  dropdown.addEventListener("change", function (e) {
    if (e.target.value == "FM Synth") {
      Object.keys(triggers).forEach((item) => {
        item != "FM Synth" ? triggers[item] : false;
      });
      triggers.fm = true;
    }
    if (e.target.value == "AM Synth") {
      Object.keys(triggers).forEach((item) => {
        item != "AM Synth" ? triggers[item] : false;
      });
      triggers.am = true;
    }
    if (e.target.value == "Membrane Synth") {
      Object.keys(triggers).forEach((item) => {
        item != "Membrane Synth" ? triggers[item] : false;
      });
      triggers.membrane = true;
    }
    if (e.target.value == "Plucky Synth") {
      Object.keys(triggers).forEach((item) => {
        item != "Plucky Synth" ? triggers[item] : false;
      });
      triggers.pluck = true;
    }
    if (e.target.value == "Metal Synth") {
      Object.keys(triggers).forEach((item) => {
        item != "Metal Synth" ? triggers[item] : false;
      });
      triggers.metal = true;
    }
    if (e.target.value == "Mono Synth") {
      Object.keys(triggers).forEach((item) => {
        item != "Mono Synth" ? triggers[item] : false;
      });
      triggers.mono = true;
    }
  });

  drop_effects.addEventListener("change", function (e) {
    if (e.target.value == "filter") {
      Object.keys(trigeffects).forEach((item) => {
        item != "filter" ? trigeffects[item] : false;
      });
      trigeffects.filter = true;
    }
    if (e.target.value == "delay") {
      Object.keys(trigeffects).forEach((item) => {
        item != "delay" ? trigeffects[item] : false;
      });
      trigeffects.delay = true;
    }
    if (e.target.value == "reverb") {
      Object.keys(trigeffects).forEach((item) => {
        item != "reverb" ? trigeffects[item] : false;
      });
      trigeffects.reverb = true;
    }
    if (e.target.value == "distortion") {
      Object.keys(trigeffects).forEach((item) => {
        item != "distortion" ? trigeffects[item] : false;
      });
      trigeffects.distortion = true;
    }
    if (e.target.value == "tremolo") {
      Object.keys(trigeffects).forEach((item) => {
        item != "tremolo" ? trigeffects[item] : false;
      });
      trigeffects.tremolo = true;
    }
    if (e.target.value == "cheby") {
      Object.keys(trigeffects).forEach((item) => {
        item != "cheby" ? trigeffects[item] : false;
      });
      trigeffects.cheby = true;
    }
    if (e.target.value == "phaser") {
      Object.keys(trigeffects).forEach((item) => {
        item != "phaser" ? trigeffects[item] : false;
      });
      trigeffects.phaser = true;
    }
  });

  sampler = document.getElementById("start_sampler");
  sampler.addEventListener("click", () => {
    document.getElementById("files").style.display = "block";
    samplerOn = true;
  });
  let addS = document.getElementById("addSamples");
  addS.addEventListener("click", () => {
    let newSample = document.createElement("input");
    newSample.setAttribute("type", "file", "accept", "audio");
    newSample.innerHTML = "Choose File";
    document.body.appendChild(newSample);
  });

  let sfiles = document.getElementsByTagName("input");
  for (var sfile of Array.from(sfiles)) {
    sfile.addEventListener("click", () => {
      console.log("clicked");
    });

    sfile.addEventListener("change", () => {
      console.log("changed");
    });
  }

  function handleFiles(event) {
    let samplerFiles = event.target.files;
    let audiosource = document.getElementById("src");
    audiosource.src = URL.createObjectURL(samplerFiles[0]);
    document.getElementById("audio").load();
    console.log(audiosource.src);
  }
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
  seq.stop();
  console.log("stop");
  Tone.Transport.stop();
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
    envelope: {
      attack: 0.01,
      decay: 1.4,
      release: 0.5,
    },
    harmonicity: freqV,
  }).toDestination();

  const membraneSynth = new Tone.MembraneSynth({
    envelope: {
      attack: 0.01,
      decay: 1.4,
      release: 0.5,
    },
    harmonicity: freqV,
  }).toDestination();

  const pluckSynth = new Tone.PluckSynth({
    activeVoices: 3,
  }).toDestination();
  pluckSynth.set({ detune: -100 });

  const metalSynth = new Tone.MetalSynth({
    envelope: {
      attack: 0.1,
      decay: 2,
      release: 0.8,
    },
    resonance: 5,
  }).toDestination();

  const monoSynth = new Tone.MetalSynth({
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

  console.log(freqV);

  const filter = new Tone.Filter(freqV, "highpass").toDestination();

  const feedbackDelay = new Tone.FeedbackDelay("4n", 0.5).toDestination();

  const distortion = new Tone.Distortion(0.8).toDestination();

  const freeverb = new Tone.Freeverb().toDestination();
  freeverb.dampening = 1000;

  const tremolo = new Tone.Tremolo(9, 0.75).toDestination().start();

  const cheby = new Tone.Chebyshev(50).toDestination();

  const phaser = new Tone.Phaser({
    frequency: 15,
    octaves: 5,
    baseFrequency: freqV,
  }).toDestination();

  toneEffects.push(
    filter,
    feedbackDelay,
    distortion,
    freeverb,
    tremolo,
    cheby,
    phaser
  );

  if (trigeffects.filter == true) {
    chosenEffect = toneEffects[0];
  }

  if (trigeffects.delay == true) {
    chosenEffect = toneEffects[1];
  }

  if (trigeffects.reverb == true) {
    chosenEffect = toneEffects[2];
  }

  if (trigeffects.distortion == true) {
    chosenEffect = stoneEffects[3];
  }

  if (trigeffects.tremolo == true) {
    chosenEffect = toneEffects[4];
  }

  if (trigeffects.cheby == true) {
    chosenEffect = toneEffects[5];
  }

  if (trigeffects.phaser == true) {
    chosenEffect = toneEffects[6];
  }

  chosenSynth.connect(chosenEffect);

  //sampler stuff
  if ((samplerOn = true)) {
    urls: {
    }
  }
}
