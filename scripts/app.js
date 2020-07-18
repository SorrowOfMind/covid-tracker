//apis
const apiCountries = "https://restcountries.eu/rest/v2/";

//select elements
const search = document.getElementById('search-bar');
const lists = [...document.getElementsByClassName('country-list')];
const x = document.getElementById('close-list');

//global vars
let countries = [];

window.addEventListener('load', () => {
    fetchCountries(apiCountries)
});

const fetchCountries = url => {
    let countriesArr = [];
    axios.get(url)
        .then(res => countries = res.data.reduce((acc, country) => acc.concat({country: country.name, code: country.alpha2Code}), []))
        .then(() => populateCountriesList(countries))
        .catch(err => console.log(err));
}

const populateCountriesList = countriesArr => {
    console.log(countriesArr);
    countriesArr.forEach((country, idx) => {
        let item = `<li>${country.country}</li>`
        const countriesPerList = Math.ceil(countriesArr.length/3);
        let i = 0;
        while (i < 3) {
            if (i % countriesPerList === 0) {
                lists[i].insertAdjacentHTML('beforeend', item);
            }
            i++;
        }
    })
}

//show list on focus
search.addEventListener('focus', () => {
    list.classList.remove('hidden');
});

search.addEventListener('blur', () => {
    list.classList.add('hidden');
});

search.addEventListener('input', e => {
    console.log(e.target.value)
})