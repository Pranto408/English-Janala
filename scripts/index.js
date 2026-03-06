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
    //   console.log(lesson)
    const btnDiv = document.createElement("div");
    btnDiv.innerHTML = `
        <button onclick="loadLevelWord(${lesson.level_no})" class="btn btn-outline btn-primary">
        <i class="fa-solid fa-book-open"></i> Lesson -${lesson.level_no}
    </button>
        `;
    lessonsContainer.appendChild(btnDiv);
  }
};
loadLessons();

const loadLevelWord = (id) => {
  console.log(id);
  const url = `https://openapi.programming-hero.com/api/level/${id}`;
  fetch(url)
    .then((res) => res.json())
    .then((json) => displayWordLessons(json.data));
};

const displayWordLessons = (data) => {
  //   1.get the container &empty
  const lessonsWordContainer = document.getElementById("words-container");
  lessonsWordContainer.innerHTML = "";
  // 2. create element div and inner html
  for (let d of data) {
      console.log(d)
    const wordDiv = document.createElement("div");
    wordDiv.innerHTML = ` 
        <div class="bg-white py-10 px-5 text-center space-y-4 shadow rounded-lg">
        <h2 class="font-bold text-3xl">${d.word}</h2>
        <p class="text-xl font-medium leading-6">Meaning /Pronunciation</p>
        <h2 class="text-[#464648] font-bangla font-semibold text-3xl">"${d.meaning} / ${d.pronunciation}"</h2>
        <div class="flex justify-between items-center">
          <button class="btn text-[#374957] bg-[#1A91FF10] hover:bg-[#1A91FF80] text-xl py-6 px-3"><i class="fa-solid fa-circle-info"></i></button>
          <button class="btn text-[#374957] bg-[#1A91FF10] hover:bg-[#1A91FF80] text-xl  py-6 px-3"><i class="fa-solid fa-volume-high"></i></button>
        </div>
      </div>
        `;
    lessonsWordContainer.appendChild(wordDiv);
  }
};
