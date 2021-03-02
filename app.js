const imagesArea = document.querySelector(".images");
const gallery = document.querySelector(".gallery");
const galleryHeader = document.querySelector(".gallery-header");
const searchBtn = document.getElementById("search-btn");
const sliderBtn = document.getElementById("create-slider");
const sliderContainer = document.getElementById("sliders");
const searchInputText = document.getElementById("search");
const durationinputNumber = document.getElementById("duration");
const spinnerDiv = document.getElementById("spinner");

// selected image
let sliders = [];

// If this key doesn't work
// Find the name in the url and go to their website
// to create your own api key
const KEY = "15674931-a9d714b6e9d654524df198e00&q";

// show images
const showImages = (images) => {
  spinnerDiv.classList.toggle("d-none"); // hide loading spinner

  imagesArea.style.display = "block";
  gallery.innerHTML = "";
  // show gallery title
  galleryHeader.style.display = "flex";
  images.forEach((image) => {
    const tags = image.tags.split(",");
    let html = ` 
    <div class="col-lg-3 col-md-4 col-xs-6 img-item mb-2">
    <img class="img-fluid img-thumbnail" onclick=selectItem(event,"${image.webformatURL}") src="${image.webformatURL}" alt="${image.tags}">
    <div class="img-footer d-flex align-items-center">    
    <a class="btn tag-link"> <span class="items">${tags[0]} </span></a>    
    <a class="btn tag-link"> <span class="items">${tags[1]} </span></a>    
    <a class="btn tag-link"> <span class="items">${tags[2]} </span></a>    
  </div>
    </div>
    `;
    // let div = document.createElement("div");
    // div.className = "col-lg-3 col-md-4 col-xs-6 img-item mb-2";
    // div.innerHTML = ` <img class="img-fluid img-thumbnail" onclick=selectItem(event,"${image.webformatURL}") src="${image.webformatURL}" alt="${image.tags}">
    // `;
    // gallery.appendChild(div);

    gallery.insertAdjacentHTML("beforeend", html);
  });
};

const getImages = (query) => {
  spinnerDiv.classList.toggle("d-none"); // show loading spinner
  fetch(
    `https://pixabay.com/api/?key=${KEY}=${query}&image_type=photo&pretty=true`
  )
    .then((response) => response.json())
    .then((data) => showImages(data.hits)) //Bug: keyword is 'hits' instead of 'hitS'
    .catch((err) => console.log(err));
};

let slideIndex = 0;
const selectItem = (event, img) => {
  let element = event.target;
  // element.classList.add("added");
  element.classList.toggle("added"); //toggle added class to sellect/ desellect images

  let item = sliders.indexOf(img);
  if (item === -1) {
    sliders.push(img);
  }
  // else {
  //   alert("Hey, Already added !");
  // }
};
var timer;
const createSlider = () => {
  // check slider image length
  if (sliders.length < 2) {
    alert("Select at least 2 image.");
    return;
  }
  // crate slider previous next area
  sliderContainer.innerHTML = "";
  const prevNext = document.createElement("div");
  prevNext.className =
    "prev-next d-flex w-100 justify-content-between align-items-center";
  prevNext.innerHTML = ` 
  <span class="prev" onclick="changeItem(-1)"><i class="fas fa-chevron-left"></i></span>
  <span class="next" onclick="changeItem(1)"><i class="fas fa-chevron-right"></i></span>
  `;

  sliderContainer.appendChild(prevNext);
  document.querySelector(".main").style.display = "block";
  // hide image aria
  imagesArea.style.display = "none";
  // const duration = document.getElementById("duration").value || 1; //Bug: id name 'duration', not 'doration'
  const duration = durationinputNumber.value || 1; //Bug: id name 'duration', not 'doration'
  sliders.forEach((slide) => {
    let item = document.createElement("div");
    item.className = "slider-item";
    item.innerHTML = `<img class="w-100"
    src="${slide}"
    alt="">`;
    sliderContainer.appendChild(item);
  });
  changeSlide(0);
  timer = setInterval(function () {
    slideIndex++;
    changeSlide(slideIndex);
  }, duration * 1000);
};

// change slider index
const changeItem = (index) => {
  changeSlide((slideIndex += index));
};

// change slide item
const changeSlide = (index) => {
  const items = document.querySelectorAll(".slider-item");
  if (index < 0) {
    slideIndex = items.length - 1;
    index = slideIndex;
  }

  if (index >= items.length) {
    index = 0;
    slideIndex = 0;
  }

  items.forEach((item) => {
    item.style.display = "none";
  });

  items[index].style.display = "block";
};

searchBtn.addEventListener("click", function () {
  document.querySelector(".main").style.display = "none";
  clearInterval(timer);
  // const search = document.getElementById("search");
  getImages(searchInputText.value);
  sliders.length = 0;
  searchInputText.placeholder = searchInputText.value; // Replaced placeHolder with searchInputText value;
  searchInputText.value = ""; //Clear search input text;
});

sliderBtn.addEventListener("click", function () {
  if (durationinputNumber.value < 0) {
    alert("Please enter positive number for slide changging interval");
  } else {
    createSlider();
  }
});

//add enter key event

// Execute a function when the user releases a key on the keyboard
searchInputText.addEventListener("keyup", (event) => enterKeyEvent(searchBtn));
durationinputNumber.addEventListener("keyup", (event) =>
  enterKeyEvent(sliderBtn)
);

function enterKeyEvent(btnToTrigger) {
  if (event.keyCode === 13) {
    // event.preventDefault();
    btnToTrigger.click();
  }
}
// init
(() => {
  getImages("flower");
})();

/*
* Debugging log
1. Bug: keyword is 'hits' instead of 'hitS';
2. Bug: id name 'duration', not 'doration';
3. Duration input fixed to positive number only; 
4. Added enter key event for search and duration input field; 
5. Addeed fuctionality to sellect/ desellect an image by clicking; 
### Features added: 
1. Loading spinner after search;
2. Image tags displayed at bottom

 */
