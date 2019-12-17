//  http://www.omdbapi.com/?i=tt3896198&apikey=8cb964c5
let datas = [];

document.querySelector(".submit-btn").addEventListener("click", startSearch);
document.querySelector(".box").addEventListener("click", moreInfo);

function startSearch() {
  const search = document.querySelector(".search").value;
  getData(search);
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
         <button class="more-info-btn" data-id=${data.imdbID}>more info</button>
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
    if (e.target.dataset.id === data.imdbID) {
      getInfo(e.target.dataset.id);
    }
  });
}

function getInfo(search) {
  const xhttp = new XMLHttpRequest();
  console.log(search);
  xhttp.onload = function() {
    const infos = JSON.parse(this.response);

    document.querySelector("search").insertAdjacentHTML(
      "beforeend",
      `  
        <p>Actors: ${infos.Actors}</p>
        <p>Type: ${infos.Plot}</p>
        <p>Metascore: ${infos.Metascore}</p>
        <p class="ry">Release Year: ${infos.Year}</p>
        `
    );

    for (const [key, value] of Object.entries(infos.Ratings[0])) {
      document.querySelector(".ry").insertAdjacentHTML(
        "beforeend",
        `
        <p>Rating: ${key}:${value}</p>
        `
      );
    }

    console.log(infos);
  };

  xhttp.open("GET", `http://www.omdbapi.com/?i=${search}&apikey=8cb964c5`, true);
  xhttp.send();
}
