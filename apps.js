//  http://www.omdbapi.com/?i=tt3896198&apikey=8cb964c5 // &page=2 < request the next result
let datas = [];

document.querySelector(".search-btn").addEventListener("click", startSearch);
document.querySelector(".main-wrapper").addEventListener("click", titleMoreInfos);

function startSearch() {
  const searchInput = document.querySelector(".search-input").value;
  document.querySelector(".main-wrapper").innerHTML = "";
  getData(searchInput);
}

async function getData(search) {
  const response = await fetch(`http://www.omdbapi.com/?s=${search}&apikey=8cb964c5`);

  datas = await response.json();
  console.log(datas);

  if (datas.Response === "False") {
    document.querySelector(".main-wrapper").insertAdjacentHTML("beforeend", `<h3>NO MOVIES FOUND</h3>`);
  } else {
    document.querySelector(".header-wrapper").insertAdjacentHTML(
      "beforeend",
      `
      <div>
      <button>previous</button>
      <button>next</button>
      <div>
      `
    );

    const linkTotalResult = Math.floor(datas.totalResults / 10);
    const linkRemainderTotalResult = datas.totalResults % 10;

    console.log(linkTotalResult);
    console.log(linkRemainderTotalResult);

    datas.Search.forEach(data => {
      document.querySelector(".main-wrapper").insertAdjacentHTML(
        "beforeend",
        `
         <div class="title-wrapper">
          <div class="title-info-wrapper">
            <h3>${data.Title}</h3>
            <h4>Type: ${data.Type}</h4>
            <img class="image" src=${data.Poster} height="450" width="300" alt="">
            <button class="additional-info-btn" data-title-id=${data.imdbID}>more info</button>
          </div>
       
         </div>
        `
      );
    });
  }
}

function titleMoreInfos(e) {
  const addTitleInfoWrapper = document.querySelector(".add-title-info-wrapper");

  datas.Search.forEach((data, index) => {
    if (e.target.dataset.titleId === data.imdbID) {
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
