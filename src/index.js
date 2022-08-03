import './css/styles.css';
import { fetchCountries } from './js/fetchCountries';
import debounce from 'lodash.debounce';
import Notiflix from 'notiflix';
const DEBOUNCE_DELAY = 300;

let refs = {
  input: document.querySelector('#search-box'),
  list: document.querySelector('.country-list'),
  info: document.querySelector('.country-info'),
};

const importText = () => {
  if (refs.input.value === '') {
    refs.list.innerHTML = '';
    refs.info.innerHTML = '';
    return;
  }

  let name = refs.input.value.trim();
  fetchCountries(name)
    .then(data => {
      if (data.status === 404) {
        refs.list.innerHTML = '';
        refs.info.innerHTML = '';
        Notiflix.Notify.failure('Oops, there is no country with that name');
        return;
      }
      if (data.length > 10) {
        refs.list.innerHTML = '';
        refs.info.innerHTML = '';
        Notiflix.Notify.info(
          'Too many matches found. Please enter a more specific name.'
        );
        return;
      }
      insertContent(data);
    })
    .catch(error => {
      console.log('no', error);
    });
};

refs.input.addEventListener('input', debounce(importText, DEBOUNCE_DELAY));

const createList = item =>
  `<li class="item">
    <img src = ${item.flags.svg} alt = ${item.name.common} width = 30>
    ${item.name.official}
  </li>`;

const createListInfo = item =>
  `<p><span style= "font-size: 24px; font-weight: 500;">Capital: </span>${
    item.capital
  }</p>
  <p><span style= "font-size: 24px; font-weight: 500;">Population: </span>${
    item.population
  }</p>
  <p><span style= "font-size: 24px; font-weight: 500;">Languages: </span>${Object.values(
    item.languages
  )}</p>`;

const generateContentList = array => {
  const listStyle = 'font-size: 20px; font-weight: 500';
  const itemStyle = 'font-size: 30px; font-weight: 700';

  refs.info.setAttribute('style', 'font-size: 20px; font-weight: 400');

  refs.list.setAttribute(
    'style',
    `list-style-type: none; padding: 0; margin: 0; ${
      array.length > 1 ? listStyle : itemStyle
    }`
  );
  return array?.reduce((acc, item) => acc + createList(item), '');
};

const generateContentItemInfo = array => {
  return array?.reduce((acc, item) => acc + createListInfo(item), '');
};

const insertContent = array => {
  const resultList = generateContentList(array);
  refs.list.innerHTML = resultList;
  refs.info.innerHTML = '';
  if (array.length === 1) {
    const resultItemInfo = generateContentItemInfo(array);
    refs.info.innerHTML = resultItemInfo;
  }
};
