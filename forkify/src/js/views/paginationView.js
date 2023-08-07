import { View } from './view.js';
import icons from '../../img/icons.svg';

class PaginationView extends View {
  _parentElement = document.querySelector('.pagination');

  _generateMarkup() {
    const amountPages = Math.ceil(this._data.recipes.length / this._data.itemsPerPage);
    const currPage = this._data.page;
    const nextPage = currPage + 1;
    const prevPage = currPage - 1;

    if (currPage === 1 && amountPages > 1)
      return this.generatePaginationBtnMarkup(nextPage, 'right');

    if (currPage < amountPages)
      return `
      ${this.generatePaginationBtnMarkup(prevPage, 'left')}
      ${this.generatePaginationBtnMarkup(nextPage, 'right')}`;

    if (currPage !== 1 && currPage === amountPages)
      return this.generatePaginationBtnMarkup(prevPage, 'left');

    return ``;
  }

  generatePaginationBtnMarkup(goToPage, direction) {
    return `
        <button class='btn--inline pagination__btn--${direction === 'right' ? 'next' : 'prev'}' data-go-to='${goToPage}'>
         <span>Page ${goToPage}</span>
         <svg class='search__icon'>
           <use href='${icons}#icon-arrow-${direction}'></use>
         </svg>
        </button>`;
  }

  addHandlerClickBtn(handler) {
    this._parentElement.addEventListener('click', function(e) {
      const btn = e.target.closest('.btn--inline');
      if (!btn) return;

      const goToPage = +btn.dataset.goTo;
      handler(goToPage);
    });
  }
}

export default new PaginationView();