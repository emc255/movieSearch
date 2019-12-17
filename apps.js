//  http://www.omdbapi.com/?i=tt3896198&apikey=8cb964c5
let datas = [];

document.querySelector(".submit-btn").addEventListener("click", startSearch);
document.querySelector(".box").addEventListener("click", moreInfo);

function startSearch() {
  const searchInput = document.querySelector(".search-input").value;
  document.querySelector(".box").innerHTML = "";
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
         <div class="container-title">
         <h3>Title: ${data.Title}</h3>
         <h4>Type: ${data.Type}</h4>
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
  const reset = document.querySelector(".reset");

  if (reset != null) {
    reset.outerHTML = "";
  }

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
      <div class="reset">
        <p>Actors: ${infos.Actors}</p>
        <p>Type: ${infos.Plot}</p>
        <p>Metascore: ${infos.Metascore}</p>
        <p class="rating">Release Year: ${infos.Year}</p>
      </div>
        `
    );

    const rating = document.querySelector(".rating");

    for (const rate of infos.Ratings) {
      rating.insertAdjacentHTML(
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
