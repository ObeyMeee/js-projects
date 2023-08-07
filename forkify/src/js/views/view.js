import icons from '../../img/icons.svg';

export class View {
  _parentElement;
  _data;
  _successMessage;
  _errorMessage;

  render(data) {
    if (!data || (Array.isArray(data) && data.length === 0)) return this.renderError();

    this._data = data;
    const markup = this._generateMarkup();
    this._insertHTMLToParent(markup);
  }

  update(data) {
    this._data = data;
    const newMarkup = this._generateMarkup();
    const currentElements = Array.from(this._parentElement.querySelectorAll('*'));
    const newDOM = document.createRange().createContextualFragment(newMarkup);
    const newElements = newDOM.querySelectorAll('*');
    currentElements.forEach((curEl, i) => {
      const newEl = newElements[i];
      this.#changeDifferentTextContent(curEl, newEl);
      this.#changeDifferentAttributes(curEl, newEl);
    });
  }

  #changeDifferentTextContent(curEl, newEl) {
    if (!curEl.isEqualNode(newEl) && newEl.firstChild?.nodeValue.trim() !== '') {
      curEl.textContent = newEl.textContent;
    }
  }

  #changeDifferentAttributes(curEl, newEl) {
    if (!curEl.isEqualNode(newEl)) {
      Array.from(newEl.attributes).forEach(attr =>
        curEl.setAttribute(attr.name, attr.value)
      );
    }
  }

  showSpinner() {
    const markup = `
    <div class='spinner'>  
      <svg>
        <use href='${icons}#icon-loader'></use>
      </svg>
    </div>
  `;
    this._insertHTMLToParent(markup);
  }

  renderError(message = this._errorMessage) {
    const markup = `
     <div class='error'>
      <div>
        <svg>
          <use href='src/img/icons.svg#icon-alert-triangle'></use>
        </svg>
      </div>
      <p>${message}</p>
     </div>`;
    this._insertHTMLToParent(markup);
  }

  renderSuccessMessage(message = this._successMessage) {
    const markup = `
      <div class='message'>
          <div>
            <svg>
              <use href='src/img/icons.svg#icon-smile'></use>
            </svg>
          </div>
          <p>${message}</p>
      </div>`;
    this._insertHTMLToParent(markup);
  }

  _clear() {
    this._parentElement.innerHTML = '';
  }

  _insertHTMLToParent(markup) {
    this._clear();
    this._parentElement.insertAdjacentHTML('afterbegin', markup);
  }
}