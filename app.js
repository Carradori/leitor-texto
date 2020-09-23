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

const createExpressionBox = ({ img, text }) => {
  const div = document.createElement("div");
  div.classList.add("expression-box");
  div.innerHTML = `
        <img src="${img}" alt="${text}" />
        <p class="info">${text}</p>
    `;

  div.addEventListener("click", () => {
    setTextMessage(text);
    speakText();

    div.classList.add("active");

    setTimeout(() => div.classList.remove("active"), 2000);
  });
  main.appendChild(div);
};

humanExpressions.forEach(createExpressionBox);

let voices = [];

speechSynthesis.addEventListener("voiceschanged", () => {
  voices = speechSynthesis.getVoices();
  const googleVoice = voices.find(
    (voice) => voice.name === "Google português do Brasil"
  );
  const mircosoftVoice = voices.find(
    (voice) =>
      voice.name ===
      "Microsoft Francisca Online (Natural) - Portuguese (Brazil)"
  );

  voices.forEach(({ name, lang }) => {
    const option = document.createElement("option");
    option.value = name;
    if (googleVoice && option.value === googleVoice.name) {
      utterence.voice = googleVoice;
      option.selected = true;
    } else if (mircosoftVoice && option.value === mircosoftVoice.name) {
      utterence.voice = mircosoftVoice;
      option.selected = true;
    }
    option.textContent = `${lang} | ${name}`;
    selectElement.appendChild(option);
  });
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
