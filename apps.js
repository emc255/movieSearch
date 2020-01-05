const mainWrapper = document.querySelector(".main-wrapper");
const optionBtn = document.querySelector(".option-btn");
let titles = [];
let data = [];
let collectionOfMovies = {
  query: titles,
  page: 1,
  rows: 10,
  window: 10,
};

document.querySelector(".search-btn").addEventListener("click", startSearch);
document.querySelector(".search-input").addEventListener("keyup", startSearch);
mainWrapper.addEventListener("click", titleMoreInfos);
optionBtn.addEventListener("click", explore);

function startSearch(e) {
  if (e.target.classList.contains("search-btn") || e.keyCode === 13) {
    const searchInput = document.querySelector(".search-input").value;
    if (optionBtn !== null) {
      optionBtn.innerHTML = "";
      collectionOfMovies.page = 1;
    }
    mainWrapper.innerHTML = "";
    getData(searchInput);
  }
}

async function getData(searchTitle) {
  const response1 = await fetch(`http://www.omdbapi.com/?s=${searchTitle}&apikey=8cb964c5`);
  titleResults1 = await response1.json();
  const linkTotalResult = Math.round(titleResults1.totalResults / 10);

  titles = [];
  for (let i = 1; i <= linkTotalResult; i++) {
    const response2 = await fetch(`http://www.omdbapi.com/?s=${searchTitle}&apikey=8cb964c5&page=${i}`);
    titleResults2 = await response2.json();
    titleResults2.Search.forEach(ele => {
      titles.push(ele);
    });
  }

  collectionOfMovies.query = titles;
  data = pagination(collectionOfMovies.query, collectionOfMovies.page, collectionOfMovies.rows);

  printTitles(data);
  pageBtn(collectionOfMovies.page);
}

function titleMoreInfos(e) {
  const addTitleInfoWrapper = document.querySelector(".add-title-info-wrapper");
  data = pagination(collectionOfMovies.query, collectionOfMovies.page, collectionOfMovies.rows);

  data.query.forEach((title, index) => {
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

function pagination(query, page, rows) {
  let trimStart = (page - 1) * rows;
  let trimEnd = trimStart + rows;
  let trimData = query.slice(trimStart, trimEnd);
  let pages = Math.ceil(query.length / rows);

  return {
    query: trimData,
    pages: pages,
  };
}

function printTitles(titles) {
  let titleOutput = "";

  titles.query.forEach(title => {
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

function pageBtn(pages) {
  let pagesBtn = "";
  let maxLeft = pages - Math.floor(collectionOfMovies.window / 2);
  let maxRight = pages + Math.floor(collectionOfMovies.window / 2);

  if (maxLeft < 1) {
    maxLeft = 1;
    maxRight = collectionOfMovies.window + 1;
  }

  if (maxRight > data.pages) {
    maxRight = data.pages + 1;
    maxLeft = maxRight - 10;

    if (maxLeft < 1) {
      maxLeft = 1;
    }
  }

  for (let page = maxLeft; page < maxRight; page++) {
    if (page === maxLeft) {
      pagesBtn += ` <button class="choice choiceNumber highlight" data-id=${page}>${page}</button>`;
    } else {
      pagesBtn += ` <button class="choice choiceNumber" data-id=${page}>${page}</button>`;
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

function explore(e) {
  if (e.target.classList.contains("choice")) {
    mainWrapper.innerHTML = "";

    if (e.target.classList.contains("choiceNumber")) {
      collectionOfMovies.page = parseInt(e.target.dataset.id);
    }

    if (e.target.classList.contains("prev-btn")) {
      collectionOfMovies.page -= 1;

      if (collectionOfMovies.page < 1) {
        collectionOfMovies.page = 1;
      }
    }

    if (e.target.classList.contains("next-btn")) {
      collectionOfMovies.page += 1;

      if (collectionOfMovies.page >= data.pages) {
        collectionOfMovies.page = data.pages;
      }
    }

    data = pagination(collectionOfMovies.query, collectionOfMovies.page, collectionOfMovies.rows);

    if (optionBtn !== null) {
      optionBtn.innerHTML = "";
    }

    printTitles(data);
    pageBtn(collectionOfMovies.page);

    const opt = document.querySelectorAll(".choiceNumber");

    for (const iterator of opt) {
      iterator.classList.remove("highlight");
    }

    for (const iterator of opt) {
      if (parseInt(iterator.textContent) === collectionOfMovies.page) {
        iterator.classList.add("highlight");
      }
    }
  }
}
