window.addEventListener("DOMContentLoaded", function () {
  "use strict";

  const selectMovies = document.getElementById("movies");
  const container = document.querySelector(".container");

  const getDate = (outputDate, errorDate) => {
    const request = new XMLHttpRequest();
    request.open("GET", "./dbHeroes.json");
    request.addEventListener("readystatechange", () => {
      if (request.readyState !== 4) {
        return;
      }
      if (request.status === 200) {
        const data = JSON.parse(request.responseText);
        outputDate(data);
      } else {
        errorDate();
      }
    });
    request.send();
  };
  
  const addMovies = (data) => {
    let movies = [];
    data.forEach((elem) => {
      if (typeof elem.movies === "object") {
        elem.movies.forEach((movie) => {
          if (!movies.includes(movie)) {
            movies.push(movie);
          }
        });
      }
    });
    return movies;
  };

  const createSelect = (movies) => {
    selectMovies.style.display='inline-block';
    movies.forEach((elem) => {
      let newOption = new Option(`${elem}`, `${elem}`);
      selectMovies.append(newOption);
    });
  };

  const addHeroes = (elem) => {
    let block = document.createElement("div");
    block.classList.add("heroes");
    block.style.backgroundImage = `url(../${elem.photo})`;
    block.innerHTML = `<div class="heroes-name"><p>${elem.name}</p></div>      
      <div class="heroes-info"><p></p></div>`;
    let heroesInfo = block.querySelector(".heroes-info");
    for (const [key, value] of Object.entries(elem)) {
      if (key !== "name" && key !== "photo" && key !== "movies") {
        heroesInfo.insertAdjacentHTML(
          "beforeend",
          `<div class="heroes-block">
            <p class="heroes-title">${key}:</p>
            <span class="heroes-text">${value}</span>
          </div>`
        );
      }
    }    
    container.append(block);
  };

  const changeHeroes = (data, select) => {
    data.forEach((elem) => {
      if (typeof elem.movies === "object") {
        elem.movies.forEach((movie) => {
          if (select === movie) {
            addHeroes(elem);
          }
        });
      }
    });
  };
  
  const progressDate = (data) => {    
    document.body.style.background = "rgba(128, 0, 128, 0.2)";  
    const movies = addMovies(data);
    createSelect(movies);
    selectMovies.addEventListener("change", () => {
      container.textContent='';
      if (selectMovies.value==='movies') {
        data.forEach((elem) => {
          addHeroes(elem);
        });
      }else{
          changeHeroes(data, selectMovies.value);
      }        
    });    
    data.forEach((elem)=>{
      addHeroes(elem);
    });
  };

  getDate(
    (data) => progressDate(data),
    () => container.textContent="Произошла ошибка, данные не доступны..."
  );
  
});
