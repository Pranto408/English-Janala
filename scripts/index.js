//Create element for modal synonyms
const createElement = (arr) => {
  const synonyms = arr.map(
    (element) =>
      `<span class="border border-[#D7E4EF] bg-[#EDF7FF] py-2 px-3 rounded-md">${element}</span>`,
  );
  return synonyms.join(" ");
};

function pronounceWord(word) {
  const utterance = new SpeechSynthesisUtterance(word);
  utterance.lang = "en-EN"; // English
  window.speechSynthesis.speak(utterance);
}

const manageSpinner = (status) => {
  if (status === true) {
    document.getElementById("spinner").classList.remove("hidden");
    document.getElementById("words-container").classList.add("hidden");
  } else {
    document.getElementById("words-container").classList.remove("hidden");
    document.getElementById("spinner").classList.add("hidden");
  }
};

const loadLessons = () => {
  fetch("https://openapi.programming-hero.com/api/levels/all")
    .then((res) => res.json())
    .then((json) => displayLessons(json.data));
};

const displayLessons = (lessons) => {
  //   1.get the container &empty
  const lessonsContainer = document.getElementById("lessons-container");
  lessonsContainer.innerHTML = "";
  // 2. create element div and innar html
  for (let lesson of lessons) {
    const btnDiv = document.createElement("div");
    btnDiv.innerHTML = `
        <button id="level-btn-${lesson.level_no}" onclick="loadLevelWord(${lesson.level_no})" class="btn btn-outline btn-primary lesson-btn">
        <i class="fa-solid fa-book-open"></i> Lesson -${lesson.level_no}
    </button>
        `;
    lessonsContainer.appendChild(btnDiv);
  }
};
loadLessons();
const removeActive = () => {
  const lessonButton = document.querySelectorAll(".lesson-btn");
  lessonButton.forEach((btn) => btn.classList.remove("active"));
};
const loadLevelWord = (id) => {
  manageSpinner(true);
  const url = `https://openapi.programming-hero.com/api/level/${id}`;
  fetch(url)
    .then((res) => res.json())
    .then((json) => {
      removeActive();
      const clickedBtn = document.getElementById(`level-btn-${id}`);
      clickedBtn.classList.add("active");
      displayWordLessons(json.data);
      manageSpinner(false);
    });
};
//Modal data load
const loadWordDetails = async (id) => {
  const url = `https://openapi.programming-hero.com/api/word/${id}`;
  const res = await fetch(url);
  const details = await res.json();
  displayWordDetails(details.data);
};
//Modal display
const displayWordDetails = (details) => {
  const detailsContainer = document.getElementById("details-container");
  detailsContainer.innerHTML = `
  <div>
            <h2 class="text-[#000000] text-2xl font-semibold">${details.word} (<i class="fa-solid fa-microphone-lines"></i>:${details.pronunciation})</h2>
          </div>
          <div>
            <h2 class="text-[#000000] text-xl font-semibold">Meaning</h2>
            <p class="font-bangla text-xl font-medium">${details.meaning}</p>
          </div>
          <div>
            <h2 class="text-[#000000] text-xl font-semibold">Example</h2>
            <p class="text-xl">${details.sentence}</p>
          </div>
          <div>
            <h2 class="text-[#000000] text-xl mb-2 font-medium font-bangla">সমার্থক শব্দ গুলো</h2>
            <div class="space-x-3">
              ${createElement(details.synonyms)}
            </div>
          </div>
  `;
  document.getElementById("details_Modal").showModal();
};

const displayWordLessons = (data) => {
  //   1.get the container &empty
  const lessonsWordContainer = document.getElementById("words-container");
  lessonsWordContainer.innerHTML = "";
  //No lesson load
  if (data.length === 0) {
    lessonsWordContainer.innerHTML = `
       <div class="flex flex-col items-center space-y-2 col-span-3">
        <img class="mx-auto" src="./assets/alert-error.png" alt="">
        <p class="text-[#79716B] text-sm font-bangla">এই Lesson এ এখনো কোন Vocabulary যুক্ত করা হয়নি।</p>
        <h2 class="text-[#292524] font-semibold text-3xl  font-bangla">নেক্সট Lesson এ যান</h2>
       </div>
    `;
  }
  // 2. create element div and inner html
  for (let d of data) {
    const wordDiv = document.createElement("div");
    wordDiv.innerHTML = ` 
        <div class="bg-white py-10 px-5 text-center space-y-4 shadow rounded-lg">
        <h2 class="font-bold text-3xl">${d.word ? d.word : '<span style="color:red;">Word not found!</span>'}</h2>
        <p class="text-xl font-medium leading-6">Meaning /Pronunciation</p>
        <h2 class="text-[#464648] font-bangla font-semibold text-3xl">"${d.meaning ? d.meaning : '<span style="color:red;">অর্থ পাওয়া যায় নি!</span>'} / ${d.pronunciation ? d.pronunciation : '<span style="color:red;">উচ্চারণ পাওয়া যায় নি!</span>'}"</h2>
        <div class="flex justify-between items-center">
          <button onclick="loadWordDetails(${d.id})" class="btn text-[#374957] bg-[#1A91FF10] hover:bg-[#1A91FF80] text-xl py-6 px-3"><i class="fa-solid fa-circle-info"></i></button>
          <button onClick="pronounceWord('${d.word}')" class="btn text-[#374957] bg-[#1A91FF10] hover:bg-[#1A91FF80] text-xl  py-6 px-3"><i class="fa-solid fa-volume-high"></i></button>
        </div>
      </div>
        `;
    lessonsWordContainer.appendChild(wordDiv);
  }
};

document.getElementById("button-search").addEventListener("click", () => {
  removeActive();

  const input = document.getElementById("input-search");
  const value = input.value.trim().toLowerCase();
  console.log(value);

  fetch("https://openapi.programming-hero.com/api/words/all")
    .then((res) => res.json())
    .then((data) => {
      const allWords = data.data;
      console.log(allWords);
      const filteredWord = allWords.filter((item) =>
        item.word.toLowerCase().includes(value),
      );
      displayWordLessons(filteredWord);
    });
});
