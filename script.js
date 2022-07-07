import { galleryItems } from "./app.js";

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
