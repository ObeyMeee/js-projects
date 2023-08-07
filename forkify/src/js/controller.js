import recipeView from './views/recipeView.js';
import * as model from './model.js';
import searchView from './views/searchView';
import resultsView from './views/resultsView';
import paginationView from './views/paginationView';
import { getSearchResultsPage } from './model.js';
import bookmarksView from './views/bookmarksView';

const controlRecipes = async function() {
  try {
    const id = window.location.hash.slice(1);
    if (!id) return;
    resultsView.update(getSearchResultsPage())
    recipeView.showSpinner();
    await model.loadRecipe(id);
    bookmarksView.render(model.getBookmarksFromLocalStorage());
    recipeView.render(model.state.recipe);
  } catch (err) {
    console.error(err);
    recipeView.renderError();
  }
};

async function controlSearch() {
  const query = searchView.getQuery();
  if (!query) return;
  resultsView.showSpinner();
  await model.loadSearchResults(query);
  resultsView.render(getSearchResultsPage(1));
  paginationView.render(model.state.search)
}

const controlPagination = function(goToPage) {
  resultsView.render(getSearchResultsPage(goToPage));
  paginationView.render(model.state.search);
}

const controlServings = function (newServings) {
  model.updateServings(newServings);
  recipeView.update(model.state.recipe);
}

const controlBookmark = function() {
  const recipe = model.state.recipe;
  model.renderBookmark(recipe);
  const bookmarks = model.getBookmarksFromLocalStorage();
  bookmarksView.render(bookmarks);
  recipeView.update(recipe)
}

const init = function() {
  recipeView.addHandlerRender(controlRecipes);
  recipeView.addHandlerUpdateServings(controlServings)
  recipeView.addHandlerAddBookmark(controlBookmark)
  searchView.addHandlerRender(controlSearch);
  paginationView.addHandlerClickBtn(controlPagination)
}

init();
