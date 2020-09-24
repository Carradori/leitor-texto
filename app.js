const humanExpressions = [
  { img: "./img/drink.jpg", text: "Estou com sede" },
  { img: "./img/food.jpg", text: "Estou com fome" },
  { img: "./img/tired.jpg", text: "Estou cansado" },
  { img: "./img/hurt.jpg", text: "Estou machucado" },
  { img: "./img/happy.jpg", text: "Estou feliz" },
  { img: "./img/angry.jpg", text: "Estou irritado" },
  { img: "./img/sad.jpg", text: "Estou triste" },
  { img: "./img/scared.jpg", text: "Estou assustado" },
  { img: "./img/outside.jpg", text: "Quero ir lá fora" },
  { img: "./img/home.jpg", text: "Quero ir para casa" },
  { img: "./img/school.jpg", text: "Quero ir para a escola" },
  { img: "./img/grandma.jpg", text: "Quero ver a vovó" },
];

const main = document.querySelector("main");
const buttonInsertText = document.querySelector(".btn-toggle");
const divTextBox = document.querySelector(".text-box");
const buttonCloseBox = document.querySelector(".close");
const selectElement = document.querySelector("select");
const buttonReadText = document.querySelector("#read");
const textArea = document.querySelector("textarea");

const utterence = new SpeechSynthesisUtterance(); //enunciado

const setTextMessage = (text) => {
  utterence.text = text;
};

const speakText = () => {
  speechSynthesis.speak(utterence);
};

const setVoice = (e) => {
  //.find retorna o primeiro elemento q satisfaz
  const selectedVoice = voices.find((voice) => voice.name === e.target.value);
  utterence.voice = selectedVoice;
};

const addExpressionBoxesIntoDOM = () => {
  main.innerHTML = humanExpressions
    .map(
      ({ img, text }) => `
    <div class="expression-box" data-js="${text}">
      <img src="${img}" alt="${text}" data-js="${text}" />
      <p class="info" data-js="${text}">${text}</p>
    </div>
    `
    )
    .join("");
};
addExpressionBoxesIntoDOM();

const setStyleOfClickedDiv = (dataValue) => {
  const div = document.querySelector(`[data-js="${dataValue}"]`);
  div.classList.add("active");

  setTimeout(() => div.classList.remove("active"), 2000);
};

main.addEventListener("click", (e) => {
  const clickedElement = e.target;
  const clickedElementTextMustBeSpoken = ["img", "p"].some(
    (elementName) =>
      clickedElement.tagName.toLowerCase() === elementName.toLowerCase()
  );
  const clickedElementText = clickedElement.dataset.js;
  if (clickedElementTextMustBeSpoken) {
    setTextMessage(clickedElementText);
    speakText();
    setStyleOfClickedDiv(clickedElementText);
  }
});

const insertOptionElementsIntoDOM = (voices) => {
  selectElement.innerHTML = voices.reduce((acc, { name, lang }) => {
    acc += `<option value="${name}">${lang} | ${name}</option>`;
    return acc;
  }, "");
};

const setUtteranceVoice = (voice) => {
  utterence.voice = voice;
  const voiceOptionElement = selectElement.querySelector(
    `[value="${voice.name}"]`
  );
  voiceOptionElement.selected = true;
};

const setPTBRVoices = (voices) => {
  const googleVoice = voices.find(
    (voice) => voice.name === "Google português do Brasil"
  );
  const mircosoftVoice = voices.find(
    (voice) =>
      voice.name ===
      "Microsoft Francisca Online (Natural) - Portuguese (Brazil)"
  );

  if (googleVoice) {
    setUtteranceVoice(googleVoice);
  } else if (mircosoftVoice) {
    setUtteranceVoice(mircosoftVoice);
  }
};

let voices = [];

speechSynthesis.addEventListener("voiceschanged", () => {
  voices = speechSynthesis.getVoices();

  insertOptionElementsIntoDOM(voices);
  setPTBRVoices(voices);
});

buttonInsertText.addEventListener("click", () => {
  divTextBox.classList.add("show");
});

buttonCloseBox.addEventListener("click", () => {
  divTextBox.classList.remove("show");
});

selectElement.addEventListener("change", setVoice);

buttonReadText.addEventListener("click", () => {
  setTextMessage(textArea.value);
  speakText();
});
