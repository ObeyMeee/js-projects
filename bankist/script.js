'use strict';

// Elements
const modal = document.querySelector('.modal');
const overlay = document.querySelector('.overlay');
const btnCloseModal = document.querySelector('.btn--close-modal');
const btnsOpenModal = document.querySelectorAll('.btn--show-modal');

const header = document.querySelector('.header');
const tabsContainer = document.querySelector('.operations__tab-container');
const nav = document.querySelector('.nav');
const logo = document.querySelector('.nav__logo');
const section1 = document.querySelector('#section--1');
const allSections = document.querySelectorAll('.section');
const lazyImages = document.querySelectorAll('img[data-src]');
const slides = document.querySelectorAll('.slide');
const btnSliderLeft = document.querySelector('.slider__btn--left');
const btnSliderRight = document.querySelector('.slider__btn--right');
const dotsContainer = document.querySelector('.dots');
//////////////////////////////// FUNCTIONS
const openModal = function () {
  modal.classList.remove('hidden');
  overlay.classList.remove('hidden');
};

const closeModal = function () {
  modal.classList.add('hidden');
  overlay.classList.add('hidden');
};

const handleHoverOnNavLinks = function (e) {
  const hovered = e.target;
  if (hovered.classList.contains('nav__link')) {
    hovered
      .closest('.nav')
      .querySelectorAll('.nav__link')
      .forEach((el) => {
        if (el !== hovered) {
          el.style.opacity = this;
        }
        logo.style.opacity = this;
      });
  }
};

const revealSection = function (entries, observer) {
  const [entry] = entries;
  if (!entry.isIntersecting) return;

  const sectionElement = entry.target;
  sectionElement.classList.remove('section--hidden');
  observer.unobserve(sectionElement);
};

const goToSlide = function (slide) {
  slides.forEach(
    (s, i) => (s.style.transform = `translateX(${(i - slide) * 100}%)`)
  );
};

function nextSlide() {
  currentSlide = currentSlide === slides.length - 1 ? 0 : currentSlide + 1;
  goToSlide(currentSlide);
  activateDot(currentSlide);
}

function prevSlide() {
  currentSlide = currentSlide === 0 ? slides.length - 1 : currentSlide - 1;
  goToSlide(currentSlide);
  activateDot(currentSlide);
}

const stickHeader = function (entries) {
  if (entries[0].isIntersecting) nav.classList.remove('sticky');
  else nav.classList.add('sticky');
};

const getIntersectionObserverOptions = function (threshold, rootMargin) {
  return {
    root: null,
    threshold: threshold,
    rootMargin: rootMargin,
  };
};
const loadImage = function (entries, observer) {
  const [entry] = entries;
  const image = entry.target;
  image.src = image.dataset.src;
  image.addEventListener('load', () => image.classList.remove('lazy-img'));
  observer.unobserve(image);
};

function slider() {
  let currentSlide = 0;
  goToSlide(currentSlide);
  createDots();
  activateDot(currentSlide);

  btnSliderRight.addEventListener('click', nextSlide);
  btnSliderLeft.addEventListener('click', prevSlide);
  document.addEventListener('keydown', function (e) {
    const key = e.key;
    key === 'ArrowRight' && nextSlide();
    key === 'ArrowLeft' && prevSlide();
  });

  dotsContainer.addEventListener('click', function (e) {
    const slideDot = e.target;
    if (!slideDot.classList.contains('dots__dot')) return;

    const { slide } = +slideDot.dataset;
    currentSlide = slide;
    goToSlide(slide);
    activateDot(slide);
  });
}

const createDots = function () {
  slides.forEach((_, i) => {
    const html = `<button class="dots__dot" data-slide="${i}"></button>`;
    dotsContainer.insertAdjacentHTML('beforeend', html);
  });
};

function activateDot(currentSlide) {
  document.querySelectorAll('.dots__dot').forEach((dot) => {
    dot.classList.remove('dots__dot--active');
  });
  document
    .querySelector(`.dots__dot[data-slide='${currentSlide}']`)
    .classList.add('dots__dot--active');
}

// Model window
btnsOpenModal.forEach((btn) => btn.addEventListener('click', openModal));

btnCloseModal.addEventListener('click', closeModal);
overlay.addEventListener('click', closeModal);

document.addEventListener('keydown', function (e) {
  if (e.key === 'Escape' && !modal.classList.contains('hidden')) {
    closeModal();
  }
});

// Cookie message
const cookieMessage = `
<div class="cookie-message">
    We use cookies for improved functionality and analytics 
    <button class="btn btn--close-cookie">Got it</button>
</div>`;
header.insertAdjacentHTML('beforeend', cookieMessage);
document
  .querySelector('.btn--close-cookie')
  .addEventListener('click', function () {
    document.querySelector('.cookie-message').remove();
  });

// Smooth scrolling
document
  .querySelector('.btn--scroll-to')
  .addEventListener('click', function (e) {
    e.preventDefault();
    section1.scrollIntoView({ behavior: 'smooth' });
  });

document.querySelector('.nav__links').addEventListener('click', function (e) {
  e.preventDefault();
  if (e.target.classList.contains('nav__link')) {
    const id = e.target.getAttribute('href');
    document.querySelector(id).scrollIntoView({ behavior: 'smooth' });
  }
});

// Operations
tabsContainer.addEventListener('click', function (e) {
  const btn = e.target.closest('.operations__tab');
  if (!btn) return;

  document
    .querySelector('.operations__tab--active')
    .classList.remove('operations__tab--active');

  btn.classList.add('operations__tab--active');
  document
    .querySelector('.operations__content--active')
    .classList.remove('operations__content--active');
  document
    .querySelector(`.operations__content--${btn.dataset.tab}`)
    .classList.add('operations__content--active');
});

// Hover on nav links
nav.addEventListener('mouseover', handleHoverOnNavLinks.bind(0.5));
nav.addEventListener('mouseout', handleHoverOnNavLinks.bind(1));

// Stick header
const headerObserver = new IntersectionObserver(
  stickHeader,
  getIntersectionObserverOptions(0, `-${nav.getBoundingClientRect().height}px`)
);
headerObserver.observe(header);

// Reveal sections
const revealingSectionObserver = new IntersectionObserver(
  revealSection,
  getIntersectionObserverOptions(0.15, '40px')
);

allSections.forEach((section) => {
  section.classList.add('section--hidden');
  revealingSectionObserver.observe(section);
});

// lazy loading images
const observer = new IntersectionObserver(
  loadImage,
  getIntersectionObserverOptions(0, '0px')
);
lazyImages.forEach((img) => observer.observe(img));

// Slider
slider();
