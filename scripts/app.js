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

//country object
let countryData = {
    _country: '',
    get country () {return this._country;},
    set country (ctry) {this._country = ctry;},

    _deaths: 0,
    get deaths () {return this._deaths;},
    set deaths (arr) {
        let deathsArr = arr.reduce((acc, val) => acc.concat(val.total_deaths), []);
        this._deaths = deathsArr;
    },

    _recovered: 0,
    get recovered () {return this._recovered;},
    set recovered (arr) {
        let recoveredArr = arr.reduce((acc, val) => acc.concat(val.total_recovered), []);
        this._recovered = recoveredArr;
    },

    _total:  0,
    get total () {return this._total;},
    set total(arr) {
        let totalArr = arr.reduce((acc, val) => acc.concat(val.total_cases), []);
        this._total = totalArr;
    },

    _dates: [],
    get dates () {return this._dates;},
    set dates (arr) {
        let datesArr = arr.reduce((acc, val) => acc.concat(val.date.slice(0,10)), []);
        this._dates = datesArr;
    }
};


//fetch countries list - name + code
window.addEventListener('load', () => {
    fetchCountries(apiCountries);
});

const fetchCountries = url => {
    axios.get(url)
        .then(res => countries = res.data.reduce((acc, country) => acc.concat({name: country.name, code: country.alpha2Code}), []))
        .then(() => setUserCountry())
        .then(() => populateCountriesList(countries))
        .catch(err => console.log(err));
}

const fetchCovidData = country => {
    const url = `https://coronavirus-info.p.rapidapi.com/historybycountry?name=${country}`;
    fetch(url , {
	"method": "GET",
	"headers": {
		"x-rapidapi-host": "coronavirus-info.p.rapidapi.com",
		"x-rapidapi-key": apiKey
	}
})
    .then(response => response.json())
    .then(data => {
        countryData.dates = data.history;
        countryData.total = data.history;
        countryData.deaths = data.history;
        countryData.recovered = data.history;
    })
    .catch(err => console.log(err));
}

//find users country code
const setUserCountry = () => {
    let countryCode = geoplugin_countryCode();
    const userCountry = countries.find(country => country.code === countryCode);
    countryName.textContent = userCountry.name;
    countryData.country = userCountry.name;
    fetchCovidData(countryData.country);
}

//populate list with countries
const populateCountriesList = countriesArr => {
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
                countryData.country = query;
                listWrapper.classList.add('slide-up');
                search.value = '';
                listWrapper.addEventListener('animationend', () => resetList(lists));
                fetchCovidData(countryData.country);
            }
        })
    }
}

//show/hide, filter counrty list
const resetList = arr => {
        arr.forEach(list => {
        [...list.children].map(country => {
            country.classList.remove('hidden');
        })
    })
}

const filterList = (arr, qry) => {
        arr.forEach(list => {
        [...list.children].map(country => {
            if (country.textContent.toLowerCase().indexOf(qry.toLowerCase()) === -1) country.classList.add('hidden');
            else country.classList.remove('hidden');
        })
    })
}

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
    filterList(lists, value);
});