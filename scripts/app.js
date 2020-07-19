//apis
const apiCountries = "https://restcountries.eu/rest/v2/";

//select elements
const search = document.getElementById('search-bar');
const lists = [...document.getElementsByClassName('country-list')];
const x = document.getElementById('close-list');
const listWrapper = document.getElementById('list');
const countryName = document.getElementById('country-name');

//global vars
let countries = [];
let query = '';

window.addEventListener('load', () => {
    fetchCountries(apiCountries)
});

const fetchCountries = url => {
    let countriesArr = [];
    axios.get(url)
        .then(res => countries = res.data.reduce((acc, country) => acc.concat({name: country.name, code: country.alpha2Code}), []))
        .then(() => populateCountriesList(countries))
        .catch(err => console.log(err));
}

const populateCountriesList = countriesArr => {
    console.log(countriesArr);
    countriesArr.forEach((country, idx) => {
        let item = `<li class="list-item" id=${country.name}>${country.name}</li>`
        const countriesPerList = Math.ceil(countriesArr.length/3);
        let listIdx = Math.floor(idx/countriesPerList);
        lists[listIdx].insertAdjacentHTML('beforeend', item);
    });
    for (let list of lists) {
        list.addEventListener('click', e => {
            if (e.target && e.target.classList.contains('list-item')) {
                query = e.target.textContent;
                countryName.textContent = query;
                listWrapper.classList.add('slide-up');
                search.value = '';
                console.log(query);
            }
        })
    }
}

// const makeList = (arr, ctr, i) => {
//         let item = `<li class="list-item">${ctr.name}</li>`
//         const countriesPerList = Math.ceil(arr.length/3);
//         let listIdx = Math.floor(i/countriesPerList);
//         lists[listIdx].insertAdjacentHTML('beforeend', item);
// }


//show list on focus
search.addEventListener('focus', () => {
    listWrapper.classList.remove('slide-up');
    listWrapper.classList.add('slide-down');
});

//close by x
x.addEventListener('click', () => {
    listWrapper.classList.remove('slide-down');
    listWrapper.classList.add('slide-up');
})

//filter list on input
search.addEventListener('input', e => {
    const {value} = e.target;
    lists.forEach(list => {
        [...list.children].map(country => {
            if (country.textContent.toLowerCase().indexOf(value.toLowerCase()) === -1) country.classList.add('hidden');
            else country.classList.remove('hidden');
        })
    })
});