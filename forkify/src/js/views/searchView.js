import { View } from './view';

class SearchView extends View {
  _parentElement = document.querySelector('.search');
  _errorMessage = '';

  getQuery() {
    const inputElement = this._parentElement.querySelector('.search__field');
    const query = inputElement.value;
    inputElement.value = '';
    return query;
  }

  addHandlerRender(handler) {
    this._parentElement.addEventListener('submit', e => {
      e.preventDefault();
      handler();
    });
  }
}

export default new SearchView();