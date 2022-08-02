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

const inportText = () => {
  let name = refs.input.value.trim();
  fetchCountries(name);
};

refs.input.addEventListener('input', debounce(inportText, DEBOUNCE_DELAY));

const fetchCountries = name => {
  if (name.length > 0) {
    const url = `https://restcountries.com/v3.1/name/${name}?fields=${FULL_NAME},${CAPITAL},${POPULATION},${FLAGS},${LANG}`;
    fetch(url)
      .then(response => response.json())

      .then(data => {
        if (data.status === 404) {
          Notiflix.Notify.failure('Oops, there is no country with that name');
          return;
        }
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
  }
  refs.list.innerHTML = '';
};

const createList = item =>
  `<li class="item">
    <img src = ${item.flags.svg} alt = ${item.name.common} width = 30>
    ${item.name.official}
  </li>`;

// const createItem = item =>
//   `<li class="item">
//     <img src = ${item.flags.svg} alt = ${item.name.common} width = 30>
//     ${item.name.official}
//   </li>`;

const generateContentList = array => {
  refs.list.setAttribute(
    'style',
    'list-style-type: none; font-size: 20px; font-weight: 500; padding: 0; margin: 0;'
  );
  return array?.reduce((acc, item) => acc + createList(item), '');
};

const generateContentItem = array => {
  refs.list.setAttribute(
    'style',
    'list-style-type: none; font-size: 30px; font-weight: 700; padding: 0; margin: 0;'
  );
  return array?.reduce((acc, item) => acc + createList(item), '');
};
const generateContentItemInfo = array => `<p>${array.capital}</p>`;

const insertContent = array => {
  if (array.length > 1) {
    const resultList = generateContentList(array);
    refs.list.innerHTML = resultList;
    return;
  }

  const resultItem = generateContentItem(array);
  refs.list.innerHTML = resultItem;
  const resultItemInfo = generateContentItemInfo(array);
  console.log('🚀 ~ file: index.js ~ line 91 ~ array', array.capital);

  refs.info.insertAdjacentHTML('beforeend', resultItemInfo);
};
