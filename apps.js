//  http://www.omdbapi.com/?i=tt3896198&apikey=8cb964c5
let datas = [];

document.querySelector(".submit-btn").addEventListener("click", startSearch);

function startSearch() {
  const search = document.querySelector(".search").value;
  getData(search);
  getPoster(search);
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
         <img class="image" src="" alt="">
         </div>
        `
      );
    });
  };

  xhttp.open("GET", `http://www.omdbapi.com/?s=${search}&apikey=8cb964c5`, true);
  xhttp.send();
}

function getPoster(search) {
  const xhttp = new XMLHttpRequest();
  const image = document.querySelectorAll(".image");

  xhttp.onload = function() {
    const poster = this.response;
    console.log(poster);
  };

  xhttp.open("GET", `http://img.omdbapi.com/?s=${search}&apikey=8cb964c5`, true);
  xhttp.send();
}
