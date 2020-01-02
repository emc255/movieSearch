//  http://www.omdbapi.com/?i=tt3896198&apikey=8cb964c5 // &page=2 < request the next result
const mainWrapper = document.querySelector(".main-wrapper");
const optionBtn = document.querySelector(".option-btn");
let titleResults = [];
let pagesOfTitles = [];
let prevNext = [];
let prevCounter = 1;
document.querySelector(".search-btn").addEventListener("click", startSearch);
mainWrapper.addEventListener("click", titleMoreInfos);
optionBtn.addEventListener("click", explore);

function startSearch() {
  const searchInput = document.querySelector(".search-input").value;

  if (optionBtn !== null) {
    optionBtn.innerHTML = "";
  }
  prevNext = [];
  mainWrapper.innerHTML = "";

  getData(searchInput);
}

async function explore(e) {
  const searchInput = document.querySelector(".search-input").value;

  if (e.target.classList.contains("choice")) {
    let currentPage = parseInt(e.target.textContent) - 1;

    if (e.target.classList.contains("prev-btn") || (e.target.classList.contains("next-btn") && prevNext.length > 0)) {
      console.log(prevNext[prevNext.length - 1]);
      window.history.back();
      // const response = await fetch(
      //   `http://www.omdbapi.com/?s=${searchInput}&apikey=8cb964c5&page=${prevNext[prevNext.length - prevCounter++]}`
      // );
      // titleResults = await response.json();
      // mainWrapper.innerHTML = "";
      // printTitles(titleResults.Search);
    } else {
      const response = await fetch(
        `http://www.omdbapi.com/?s=${searchInput}&apikey=8cb964c5&page=${pagesOfTitles[currentPage]}`
      );
      titleResults = await response.json();
      prevNext.push(currentPage);
      mainWrapper.innerHTML = "";
      printTitles(titleResults.Search);
      prevCounter = 1;
    }
  }
}

async function getData(searchTitle) {
  const response = await fetch(`http://www.omdbapi.com/?s=${searchTitle}&apikey=8cb964c5`);
  titleResults = await response.json();
  const linkTotalResult = Math.round(titleResults.totalResults / 10);

  for (let i = 1; i <= linkTotalResult; i++) {
    pagesOfTitles.push(i);
  }

  if (titleResults.Response === "False") {
    mainWrapper.insertAdjacentHTML("beforeend", `<h3>NO MOVIES FOUND</h3>`);
  } else {
    createPages(pagesOfTitles);
    printTitles(titleResults.Search);
  }
}

function titleMoreInfos(e) {
  const addTitleInfoWrapper = document.querySelector(".add-title-info-wrapper");

  titleResults.Search.forEach((title, index) => {
    if (e.target.dataset.titleId === title.imdbID) {
      if (e.target.parentNode.parentNode.lastElementChild.classList.contains("show")) {
        e.target.parentNode.parentNode.lastElementChild.classList.replace("show", "unshow");
        e.target.textContent = "more info";
      } else if (e.target.parentNode.parentNode.lastElementChild.classList.contains("unshow")) {
        e.target.parentNode.parentNode.lastElementChild.classList.replace("unshow", "show");
        e.target.textContent = "less info";
      } else {
        if (addTitleInfoWrapper !== null) {
          addTitleInfoWrapper.outerHTML = "";
        }
        e.target.textContent = "less info";
        getInfo(e.target.dataset.titleId, index);
      }
    }
  });
}

async function getInfo(titleId, index) {
  let addTitleInfosOutput = "";
  const response = await fetch(`http://www.omdbapi.com/?i=${titleId}&apikey=8cb964c5`);
  addTitleInfos = await response.json();

  addTitleInfosOutput += `  
    <p>Actors: ${addTitleInfos.Actors}</p>
    <p>Type: ${addTitleInfos.Plot}</p>
    <p>Metascore: ${addTitleInfos.Metascore}</p>
    <p>Release Year: ${addTitleInfos.Year}</p>
    <p>Rating</p> 
    `;

  for (const rate of addTitleInfos.Ratings) {
    addTitleInfosOutput += ` 
      <p>Source: ${rate.Source}</p>
      <p>Value: ${rate.Value}</p>
      `;
  }
  document
    .querySelectorAll(".title-wrapper")
    [index].insertAdjacentHTML("beforeend", `<div class="add-title-info-wrapper show">${addTitleInfosOutput}</div>`);
}
function printTitles(titles) {
  let titleOutput = "";

  titles.forEach(title => {
    titleOutput += `
      <div class="title-wrapper">
      <div class="title-info-wrapper">
      <h3>${title.Title}</h3>
      <h4>Type: ${title.Type}</h4>
      `;

    if (title.Poster === `N/A`) {
      titleOutput += `
        <p>NO IMAGE AVAILABLE</p>
        <button class="additional-info-btn" data-title-id=${title.imdbID}>more info</button>
        `;
      document.querySelector(".main-wrapper").insertAdjacentHTML("beforeend", `${titleOutput}`);
      titleOutput = "";
    } else {
      titleOutput += `
        <img class="image" src=${title.Poster} height="450" width="300" alt=""></img>
        <button class="additional-info-btn" data-title-id=${title.imdbID}>more info</button>
        `;
      document.querySelector(".main-wrapper").insertAdjacentHTML("beforeend", `${titleOutput}`);
      titleOutput = "";
    }
  });
}

function createPages(number) {
  let pagesBtn = "";
  for (let i = 1; i <= number.length; i++) {
    if (i <= 10) {
      pagesBtn += ` <button class="choice" data-id=${i}>${i}</button>`;
    }
  }
  optionBtn.insertAdjacentHTML(
    "beforeend",
    `
    <button class="choice prev-btn">previous</button>
    ${pagesBtn}  
    <button class="choice next-btn">next</button>
    `
  );
}
