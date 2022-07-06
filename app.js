const galleryItems = [
  {
    preview:
      "https://cdn.pixabay.com/photo/2019/05/14/16/43/himilayan-blue-poppy-4202825__340.jpg",
    original:
      "https://cdn.pixabay.com/photo/2019/05/14/16/43/himilayan-blue-poppy-4202825_1280.jpg",
    description: "Hokkaido Flower",
  },
  {
    preview:
      "https://cdn.pixabay.com/photo/2019/05/14/22/05/container-4203677__340.jpg",
    original:
      "https://cdn.pixabay.com/photo/2019/05/14/22/05/container-4203677_1280.jpg",
    description: "Container Haulage Freight",
  },
  {
    preview:
      "https://cdn.pixabay.com/photo/2019/05/16/09/47/beach-4206785__340.jpg",
    original:
      "https://cdn.pixabay.com/photo/2019/05/16/09/47/beach-4206785_1280.jpg",
    description: "Aerial Beach View",
  },
  {
    preview:
      "https://cdn.pixabay.com/photo/2016/11/18/16/19/flowers-1835619__340.jpg",
    original:
      "https://cdn.pixabay.com/photo/2016/11/18/16/19/flowers-1835619_1280.jpg",
    description: "Flower Blooms",
  },
  {
    preview:
      "https://cdn.pixabay.com/photo/2018/09/13/10/36/mountains-3674334__340.jpg",
    original:
      "https://cdn.pixabay.com/photo/2018/09/13/10/36/mountains-3674334_1280.jpg",
    description: "Alpine Mountains",
  },
  {
    preview:
      "https://cdn.pixabay.com/photo/2019/05/16/23/04/landscape-4208571__340.jpg",
    original:
      "https://cdn.pixabay.com/photo/2019/05/16/23/04/landscape-4208571_1280.jpg",
    description: "Mountain Lake Sailing",
  },
  {
    preview:
      "https://cdn.pixabay.com/photo/2019/05/17/09/27/the-alps-4209272__340.jpg",
    original:
      "https://cdn.pixabay.com/photo/2019/05/17/09/27/the-alps-4209272_1280.jpg",
    description: "Alpine Spring Meadows",
  },
  {
    preview:
      "https://cdn.pixabay.com/photo/2019/05/16/21/10/landscape-4208255__340.jpg",
    original:
      "https://cdn.pixabay.com/photo/2019/05/16/21/10/landscape-4208255_1280.jpg",
    description: "Nature Landscape",
  },
  {
    preview:
      "https://cdn.pixabay.com/photo/2019/05/17/04/35/lighthouse-4208843__340.jpg",
    original:
      "https://cdn.pixabay.com/photo/2019/05/17/04/35/lighthouse-4208843_1280.jpg",
    description: "Lighthouse Coast Sea",
  },
];
// - Создание и рендер разметки по массиву данных `galleryItems` из `app.js` и
// предоставленному шаблону.
const galleryUlEl = document.querySelector(".js-gallery");

// - Открытие модального окна по клику на элементе галереи. (Step 1/2)
const modalEl = document.querySelector(".js-lightbox");
const modalImgEl = document.querySelector(".lightbox__image");
const modalBtnEl = document.querySelector(".lightbox__button");

// Для пролистывания фото
let currentImgIndex;

const imagesListItems = galleryItems.map((galleryItem) => {
  const imgLiEl = document.createElement("li");
  const linkEl = document.createElement("a");
  const imgEl = document.createElement("img");

  imgLiEl.classList.add("gallery__item");
  linkEl.classList.add("gallery__link");
  imgEl.classList.add("gallery__image");

  imgEl.src = galleryItem.preview;
  imgEl.alt = galleryItem.description;

  linkEl.appendChild(imgEl);
  imgLiEl.appendChild(linkEl);
  return imgLiEl;
});

galleryUlEl.append(...imagesListItems);

// - Реализация делегирования на галерее `ul.js-gallery` и получение `url` большого
// изображения.
const getChosenImgBig = (e) => {
  if (!e.target.classList.contains("gallery__image")) {
    return;
  }

  // Нахожу какому адресу присвоить src. Но способ мне не очень нравится, т.к. может же быть
  // несколько одинаковых значений. Долго думал как красиво сделать, но это лучшее(
  galleryItems.forEach((galleryItem, index) => {
    if (galleryItem.preview === e.target.src) {
      e.target.src = galleryItem.original;
      e.target.alt = galleryItem.description; // Почему не ставиться?!!?

      currentImgIndex = index;
    }
  });

  // - Открытие модального окна по клику на элементе галереи. (Step 2/2)
  getOpenModal(e.target);

  return currentImgIndex;
};
galleryUlEl.addEventListener("click", getChosenImgBig);

const getOpenModal = (el, srcIndex) => {
  modalEl.classList.add("is-open");

  // - Подмена значения атрибута `src` элемента `img.lightbox__image`.
  modalImgEl.src = el.src;

  // Включаю слушатель закрытия модалки от клика вне изображения
  modalEl.addEventListener("click", getCloseModal);

  // Включаю слушатель закрытия модалки от 'Esc'
  document.addEventListener("keydown", getCloseModal);

  // Включаю слушатели пролистывания модалки
  document.addEventListener("keydown", getSwitchImgModalRight);
  document.addEventListener("keydown", getSwitchImgModalLeft);
};

const getCloseModal = (e) => {
  if (
    // (Клик не на изображении И от клика (а не от клавиш)) ИЛИ от 'Esc'
    (e.target !== modalImgEl && e.code === undefined) ||
    e.code === "Escape"
  ) {
    modalEl.classList.remove("is-open");

    // - Очистка значения атрибута `src` элемента `img.lightbox__image`
    // Не пойму, вроде всё равно сначала показывает другое, но может меня уже глючит

    modalImgEl.src = "";

    // Убираю слушатель 'Esc' при закрытии модалки. От "click" даже не трогаю
    // document.removeEventListener("keydown", getCloseModal);
  }
};

const getSwitchImgModalRight = (e) => {
  if (e.code === "ArrowRight") {
    if (currentImgIndex === galleryItems.length - 1) {
      modalImgEl.src = galleryItems[0].original;
      currentImgIndex = 0;
    } else {
      modalImgEl.src = galleryItems[currentImgIndex + 1].original;
      currentImgIndex += 1;
    }
  }
};

const getSwitchImgModalLeft = (e) => {
  if (e.code === "ArrowLeft") {
    if (currentImgIndex === 0) {
      modalImgEl.src = galleryItems[galleryItems.length - 1].original;
      currentImgIndex = galleryItems.length - 1;
    } else {
      modalImgEl.src = galleryItems[currentImgIndex - 1].original;
      currentImgIndex -= 1;
    }
  }
};

// console.log("test changes for git");
