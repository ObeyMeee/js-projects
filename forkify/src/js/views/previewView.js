import { View } from './view';

export class PreviewView extends View {

  _generateMarkup() {
    return this._data.map(this.#generateMarkupPreview).join('');
  }

  #generateMarkupPreview(recipe) {
    const id = window.location.hash.slice(1);
    return `
        <li class='preview'>
          <a class='preview__link ${recipe.id === id ? 'preview__link--active' : ''}' href='#${recipe.id}'>
            <figure class='preview__fig'>
              <img src='${recipe.image}' alt='${recipe.title}' />
            </figure>
            <div class='preview__data'>
              <h4 class='preview__title'>${recipe.title}</h4>
              <p class='preview__publisher'>${recipe.publisher}</p>
            </div>
          </a>
        </li>`;
  }
}

