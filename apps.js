//  http://www.omdbapi.com/?i=tt3896198&apikey=8cb964c5 // &page=2 < request the next result
let datas = [];

document.querySelector(".submit-btn").addEventListener("click", startSearch);
document.querySelector(".box").addEventListener("click", moreInfo);
document.querySelector(".previous-btn").addEventListener("click", previousPage);
document.querySelector(".next-btn").addEventListener("click", nextPage);

function startSearch() {
  const searchInput = document.querySelector(".search-input").value;
  document.querySelector(".box").innerHTML = "";
  getData(searchInput);
}

async function getData(search) {
  const response = await fetch(`http://www.omdbapi.com/?s=${search}&apikey=8cb964c5`);
  const totalResult = document.querySelector(".total-result");
  datas = await response.json();

  totalResult.textContent = `${datas.totalResults}`;

  datas.Search.forEach(data => {
    document.querySelector(".box").insertAdjacentHTML(
      "beforeend",
      `
         <div class="container-title">
         <h3>Title: ${data.Title}</h3>
         <h4>Type: ${data.Type}</h4>
         <img class="image" src=${data.Poster} alt="">
         <button class="more-info-btn" data-title-id=${data.imdbID}>more info</button>
         </div>
        `
    );
  });
}

function moreInfo(e) {
  const reset = document.querySelector(".reset");

  if (reset !== null) {
    reset.outerHTML = "";
  }

  datas.Search.forEach(data => {
    if (e.target.dataset.titleId === data.imdbID) {
      getInfo(e.target.dataset.titleId);
    }
  });
}

async function getInfo(search) {
  const response = await fetch(`http://www.omdbapi.com/?i=${search}&apikey=8cb964c5`);
  infos = await response.json();

  document.querySelector(`[data-title-id=${search}]`).insertAdjacentHTML(
    "afterend",
    ` 
      <div class="reset">
        <p>Actors: ${infos.Actors}</p>
        <p>Type: ${infos.Plot}</p>
        <p>Metascore: ${infos.Metascore}</p>
        <p>Release Year: ${infos.Year}</ps>
        <p class="rating">Rating</p>
      </div>
        `
  );

  for (const rate of infos.Ratings) {
    document.querySelector(".rating").insertAdjacentHTML(
      "afterend",
      `
        <p>Source: ${rate.Source}</p>
        <p>Value: ${rate.Value}</p>
        `
    );
  }
}
