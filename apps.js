//  http://www.omdbapi.com/?i=tt3896198&apikey=8cb964c5
let datas = [];

document.querySelector(".submit-btn").addEventListener("click", startSearch);
document.querySelector(".box").addEventListener("click", moreInfo);

function startSearch() {
  const searchInput = document.querySelector(".search-input").value;
  getData(searchInput);
}

function getData(search) {
  const xhttp = new XMLHttpRequest();

  xhttp.onload = function() {
    datas = JSON.parse(this.response);

    datas.Search.forEach(data => {
      document.querySelector(".box").insertAdjacentHTML(
        "beforeend",
        `
         <div class="container_title">
         <p>Title: ${data.Title}</p>
         <p>Type: ${data.Type}</p>
         <img class="image" src=${data.Poster} alt="">
         <button class="more-info-btn" data-title-id=${data.imdbID}>more info</button>
         </div>
        `
      );
    });
  };

  xhttp.open("GET", `http://www.omdbapi.com/?s=${search}&apikey=8cb964c5`, true);
  xhttp.send();
}

function moreInfo(e) {
  datas.Search.forEach(data => {
    if (e.target.dataset.titleId === data.imdbID) {
      getInfo(e.target.dataset.titleId);
    }
  });
}

function getInfo(search) {
  const xhttp = new XMLHttpRequest();

  xhttp.onload = function() {
    const infos = JSON.parse(this.response);

    document.querySelector(`[data-title-id=${search}]`).insertAdjacentHTML(
      "afterend",
      ` 
        <p>Actors: ${infos.Actors}</p>
        <p>Type: ${infos.Plot}</p>
        <p>Metascore: ${infos.Metascore}</p>
        <p class="ee">Release Year: ${infos.Year}</p>
        `
    );

    for (const rate of infos.Ratings) {
      document.querySelector(`[data-title-id=${search}]`).insertAdjacentHTML(
        "afterend",
        `
        <p>Rating</p>
        <p>Source: ${rate.Source}</p>
        <p>Value:${rate.Value}</p>
        `
      );
    }
  };

  xhttp.open("GET", `http://www.omdbapi.com/?i=${search}&apikey=8cb964c5`, true);
  xhttp.send();
}
