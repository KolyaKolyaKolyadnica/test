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

const galleryUlEl = document.querySelector(".js-gallery");

// - Создание разметки для фотографии
function createGalleryItemEl({
  preview,
  original,
  description,
} = galleryItems) {
  return `<li class="gallery__item">
    <a
      class="gallery__link"
      href="${original}"
    >
      <img
        class="gallery__image"
        src="${preview}"
        data-source="${original}"
        alt="${description}"
      />
    </a>
  </li>`;
}

// - Созданные картики для каждого элемента массива galleryItems "сшиваются" в одну строку и добавляются в разметку
galleryUlEl.insertAdjacentHTML("beforeend", createGallery());

function createGallery() {
  return galleryItems.map((el) => createGalleryItemEl(el)).join("");
}

//- Реализация делегирования на галерее `ul.js-gallery` и получение `url` большого изображения.
const onImgClick = (e) => {
  e.preventDefault();
  if (!e.target.classList.contains("gallery__image")) {
    return;
  }

  e.target.src = e.target.dataset.source;

  // - Открытие модального окна по клику на элементе галереи.
  getOpenModal(e.target);
};

const modalEl = document.querySelector(".js-lightbox");
const modalImgEl = document.querySelector(".lightbox__image");
const modalBtnEl = document.querySelector(".lightbox__button");

const getOpenModal = (el) => {
  modalEl.classList.add("is-open");
  modalImgEl.src = el.src;
  modalImgEl.alt = el.alt;

  // Включаю слушатель закрытия модалки от клика вне изображения или от кнопки "закрыть"
  modalEl.addEventListener("click", removeSrcOfImageTagOnClick);

  // Включаю слушатель для взаимодействия с модалкой
  document.addEventListener("keydown", getControlModal);
};

function removeSrcOfImageTagOnClick(e) {
  if (e.target !== modalImgEl || e.target === modalBtnEl) {
    removeSrcOfImageTag();
  }
}

function getControlModal(e) {
  if (
    e.code !== "Escape" &&
    e.code !== "ArrowRight" &&
    e.code !== "ArrowLeft"
  ) {
    return;
  }

  // Получается что я всегда по новому ищу индекс своей картинки :(
  const currentImgIndex = galleryItems.findIndex(
    (galleryItem) => modalImgEl.src === galleryItem.original
  );

  if (e.code === "Escape") {
    removeSrcOfImageTag(galleryItems[currentImgIndex]);
  }

  // Включаю слушатели пролистывания модалки
  if (e.code === "ArrowRight") {
    getSwitchImgModalRight(currentImgIndex);
  }

  if (e.code === "ArrowLeft") {
    getSwitchImgModalLeft(currentImgIndex);
  }
}

function getSwitchImgModalRight(currentImgIndex) {
  currentImgIndex += 1;

  if (currentImgIndex > galleryItems.length - 1) {
    currentImgIndex = 0;
  }

  setSrcOfImageTag(galleryItems[currentImgIndex]);
}

function getSwitchImgModalLeft(currentImgIndex) {
  currentImgIndex -= 1;

  if (currentImgIndex < 0) {
    currentImgIndex = galleryItems.length - 1;
  }

  setSrcOfImageTag(galleryItems[currentImgIndex]);
}

function setSrcOfImageTag(el) {
  modalImgEl.src = el.original;
  modalImgEl.alt = el.description;
}

function removeSrcOfImageTag() {
  modalEl.classList.remove("is-open");
  modalImgEl.src = "unknow";
  modalImgEl.alt = "unknow";

  // Отключаю слушатель модалки от клавиш
  document.removeEventListener("keydown", getControlModal);
}

galleryUlEl.addEventListener("click", onImgClick);
