import './css/styles.css';
import debounce from 'lodash.debounce';
import Notiflix from 'notiflix';
const DEBOUNCE_DELAY = 300;

let refs = {
  input: document.querySelector('#search-box'),
  list: document.querySelector('.country-list'),
  info: document.querySelector('.country-info'),
};
const FULL_NAME = 'name';
const CAPITAL = 'capital';
const POPULATION = 'population';
const FLAGS = 'flags';
const LANG = 'languages';

refs.list.setAttribute('style', 'list-style-type: none; font-size: 30px;');

const inportText = () => {
  let name = refs.input.value.trim();
  fetchCountries(name);
};

refs.input.addEventListener('input', debounce(inportText, DEBOUNCE_DELAY));

const fetchCountries = name => {
  const url = `https://restcountries.com/v3.1/name/${name}?fields=${FULL_NAME},${CAPITAL},${POPULATION},${FLAGS},${LANG}`;
  fetch(url)
    .then(response => response.json())
    .then(data => {
      if (data.length > 10) {
        Notiflix.Notify.info(
          'Too many matches found. Please enter a more specific name.'
        );
        return;
      }
      console.log('🚀 ~ file: index.js ~ line 39 ~ data', data);
      insertContent(data);
    })
    .catch(error => {
      console.log('no', error);
    });
};

const createList = item =>
  `<li class="item">
    <img src = ${item.flags.svg} alt = ${item.name.common} width = 50>
    ${item.name.official}
  </li>`;

const generateContent = array =>
  array?.reduce((acc, item) => acc + createList(item), '');
//array?.map(createList).join('');

const insertContent = array => {
  const result = generateContent(array);
  refs.list.innerHTML = result;
};
