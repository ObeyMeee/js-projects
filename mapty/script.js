'use strict';

// prettier-ignore
const months = ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December'];

const form = document.querySelector('.form');
const containerWorkouts = document.querySelector('.workouts');
const inputType = document.querySelector('.form__input--type');
const inputDistance = document.querySelector('.form__input--distance');
const inputDuration = document.querySelector('.form__input--duration');
const inputCadence = document.querySelector('.form__input--cadence');
const inputElevation = document.querySelector('.form__input--elevation');

class Workout {
  #id = Math.random();
  #date = new Date();
  #coords;
  #distance;
  #duration;
  #clicks = 0;

  constructor(coords, distance, duration) {
    this.#coords = coords;
    this.#distance = distance;
    this.#duration = duration;
  }

  get id() {
    return this.#id;
  }

  set id(value) {
    this.#id = value;
  }

  get date() {
    return this.#date;
  }

  get distance() {
    return this.#distance;
  }

  set distance(value) {
    this.#distance = value;
  }

  get duration() {
    return this.#duration;
  }

  set duration(value) {
    this.#duration = value;
  }

  get description() {
    const type = this.type;
    return `${type === 'running' ? '🏃' : '🚴'} ${
      type[0].toUpperCase() + type.slice(1)
    } on ${months[this.date.getMonth()]} ${this.date.getDate()}`;
  }

  get coords() {
    return this.#coords;
  }

  click() {
    this.#clicks++;
  }
}

class Running extends Workout {
  #cadence;
  #pace;
  type = 'running';

  constructor(coords, distance, duration, cadence) {
    super(coords, distance, duration);
    this.#cadence = cadence;
  }

  calcPace() {
    this.#pace = this.duration / this.distance;
    return this.#pace;
  }

  get cadence() {
    return this.#cadence;
  }
}

class Cycling extends Workout {
  #elevationGain;
  #speed;
  type = 'cycling';

  constructor(coords, distance, duration, elevationGain) {
    super(coords, distance, duration);
    this.#elevationGain = elevationGain;
  }

  calcSpeed() {
    this.#speed = this.distance / (this.duration / 60);
    return this.#speed;
  }

  get elevationGain() {
    return this.#elevationGain;
  }
}

class App {
  #workouts = [];
  #map;
  #mapEvent;

  constructor() {
    this._getPosition();
    this._getLocalStorage();
    inputType.addEventListener('change', this._toggleElevationField);
    form.addEventListener('submit', this._submitForm.bind(this));
    containerWorkouts.addEventListener('click', this.moveToWorkout.bind(this));
  }

  moveToWorkout(e) {
    const workoutElement = e.target.closest('.workout');

    if (!workoutElement) return;
    console.log(workoutElement);
    const foundedWorkout = this.#workouts.find(
      w => w.id === +workoutElement.dataset.id
    );
    this.#map.setView(foundedWorkout.coords, 13, {
      animate: true,
      pan: {
        duration: 1,
      },
    });
    foundedWorkout.click();
    console.log(foundedWorkout);
  }

  _getPosition() {
    navigator.geolocation.getCurrentPosition(
      this._loadMap.bind(this),
      this._failureObtainGeolocation
    );
  }

  _loadMap(position) {
    const { latitude, longitude } = position.coords;
    const coords = [latitude, longitude];
    this.#map = L.map('map').setView(coords, 13);
    L.tileLayer('https://tile.openstreetmap.org/{z}/{x}/{y}.png', {
      attribution:
        '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors',
    }).addTo(this.#map);
    this.#map.on('click', this._newWorkout.bind(this));
  }

  _failureObtainGeolocation() {
    alert("Couldn't get current position");
  }

  _newWorkout(mapEvent) {
    this.#mapEvent = mapEvent;
    this._displayForm();
  }

  _putMarker(workout) {
    const { lat, lng } = this.#mapEvent.latlng;
    L.marker([lat, lng])
      .addTo(this.#map)
      .bindPopup(
        L.popup({
          autoClose: false,
          closeOnClick: false,
          className: `${workout.type}-popup`,
        })
      )
      .setPopupContent(`${workout.description}`)
      .openPopup();
  }

  _displayForm() {
    form.classList.remove('hidden');
    inputDistance.focus();
  }

  _submitForm(event) {
    event.preventDefault();
    const type = inputType.value;
    const duration = +inputDuration.value;
    const distance = +inputDistance.value;
    const cadence = +inputCadence.value;
    const elevationGain = +inputElevation.value;
    const { lat, lng } = this.#mapEvent.latlng;
    const isInputsValid = (...inputs) => inputs.every(value => value > 0);
    let workout;
    if (type === 'running') {
      if (!isInputsValid(distance, duration, cadence))
        return alert('Inputted data must be a positive numbers!');

      workout = new Running([lat, lng], distance, duration, cadence);
    }

    if (type === 'cycling') {
      if (!isInputsValid(distance, duration))
        return alert('Inputted data must be a positive numbers!');

      workout = new Cycling([lat, lng], distance, duration, elevationGain);
    }
    this.#workouts.push(workout);
    this._putMarker(workout);

    this._clearInputFields();
    this._hideForm();
    this._displayWorkout(workout);
    localStorage.setItem('workouts', JSON.stringify(this.#workouts));
  }

  _clearInputFields() {
    inputDistance.value =
      inputDuration.value =
      inputCadence.value =
      inputElevation.value =
        '';
  }

  _hideForm() {
    form.classList.add('hidden');
  }

  _toggleElevationField() {
    inputElevation.closest('.form__row').classList.toggle('form__row--hidden');
    inputCadence.closest('.form__row').classList.toggle('form__row--hidden');
  }

  _displayWorkout(workout) {
    const type = workout.type;
    const isWorkoutTypeRunning = type === 'running';
    let html = `
      <li class='workout workout--${type}' data-id='${workout.id}'>
      <h2 class='workout__title'>${workout.description}</h2>
      <div class='workout__details'>
        <span class='workout__icon'>${isWorkoutTypeRunning ? '🏃' : '🚴'}</span>
        <span class='workout__value'>${workout.distance}</span>
        <span class='workout__unit'>km</span>
      </div>
      <div class='workout__details'>
        <span class='workout__icon'>⏱</span>
        <span class='workout__value'>${workout.duration}</span>
        <span class='workout__unit'>min</span>
      </div>`;

    if (isWorkoutTypeRunning) {
      html += `
      <div class='workout__details'>
        <span class='workout__icon'>⚡️</span>
        <span class='workout__value'>${workout.calcPace().toFixed(1)}</span>
        <span class='workout__unit'>min/km</span>
      </div>
      <div class='workout__details'>
        <span class='workout__icon'>🦶🏼</span>
        <span class='workout__value'>${workout.cadence}</span>
        <span class='workout__unit'>spm</span>
      </div>
    </li>`;
    } else {
      html += `
      <div class='workout__details'>
        <span class='workout__icon'>⚡️</span>
        <span class='workout__value'>${workout.calcSpeed().toFixed(1)}</span>
        <span class='workout__unit'>km/h</span>
      </div>
      <div class='workout__details'>
        <span class='workout__icon'>⛰</span>
        <span class='workout__value'>${workout.elevationGain}</span>
        <span class='workout__unit'>m</span>
      </div>
    </li> `;
    }

    form.insertAdjacentHTML('afterend', html);
  }

  _getLocalStorage() {
    const data = localStorage.getItem('workouts');

    if (!data) return;
    console.log(data);
    this.#workouts = data;
    this.#workouts.forEach(w => this._displayWorkout(w));
  }

  reset() {
    localStorage.removeItem('workouts');
    location.reload();
  }
}

const app = new App();
