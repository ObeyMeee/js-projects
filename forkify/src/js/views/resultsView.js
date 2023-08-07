import { PreviewView } from './previewView';

class ResultsView extends PreviewView {
  _parentElement = document.querySelector('.results');
  _errorMessage = 'There is no recipes by this query. Please, try again';
}

export default new ResultsView();