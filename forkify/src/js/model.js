import { getJSON } from './helpers';
import { API_URL, ITEMS_PER_PAGE } from './config';

export const state = {
  recipe: {},
  search: {
    query: '',
    recipes: [],
    page: 1,
    itemsPerPage: ITEMS_PER_PAGE
  },
  bookmarks: []
};

export const loadRecipe = async function(id) {
  const data = await getJSON(`${API_URL}${id}`);
  const { recipe } = data.data;
  state.recipe = {
    id: recipe.id,
    cookingTime: recipe.cooking_time,
    image: recipe.image_url,
    ingredients: recipe.ingredients,
    publisher: recipe.publisher,
    servings: recipe.servings,
    sourceUrl: recipe.source_url,
    title: recipe.title
  };
  state.recipe.bookmarked = getBookmarksFromLocalStorage().some(bookmark => bookmark.id === id);
};

export const loadSearchResults = async function(query) {
  const data = await getJSON(`${API_URL}?search=${query}`);
  state.search.query = query;
  state.search.recipes = data.data.recipes.map(recipe => {
    return {
      id: recipe.id,
      image: recipe.image_url,
      publisher: recipe.publisher,
      title: recipe.title
    };
  });
};

export const getSearchResultsPage = function(numPage = state.search.page) {
  state.search.page = numPage;
  const start = (numPage - 1) * state.search.itemsPerPage;
  const end = numPage * state.search.itemsPerPage;
  return state.search.recipes.slice(start, end);
};


export function updateServings(newServings) {
  state.recipe.ingredients.forEach(ingredient =>
    ingredient.quantity *= newServings / state.recipe.servings);
  state.recipe.servings = newServings;
}

export function getBookmarksFromLocalStorage() {
  return JSON.parse(localStorage.getItem('bookmarks'));
}

export const renderBookmark = function(recipe) {
  const bookmarks = getBookmarksFromLocalStorage();
  if (!bookmarks) {
    addBookmark(recipe);
  } else {
    const index = bookmarks.findIndex(bookmark => bookmark.id === recipe.id);
    index === -1 ? addBookmark(recipe) : deleteBookmark(index);
  }
  localStorage.setItem('bookmarks', JSON.stringify(state.bookmarks));
};

function addBookmark(recipe) {
  state.bookmarks.push(recipe);
  state.recipe.bookmarked = true;
}

function deleteBookmark(index) {
  state.bookmarks.splice(index, 1);
  state.recipe.bookmarked = false;
}

