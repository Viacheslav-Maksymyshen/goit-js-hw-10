const FULL_NAME = 'name';
const CAPITAL = 'capital';
const POPULATION = 'population';
const FLAGS = 'flags';
const LANG = 'languages';

const fetchCountries = name => {
  const url = `https://restcountries.com/v3.1/name/${name}?fields=${FULL_NAME},${CAPITAL},${POPULATION},${FLAGS},${LANG}`;
  return fetch(url).then(response => response.json());
};

export { fetchCountries };
