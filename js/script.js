async function getPokemon(page) {
    try {
        const response = await fetch(`https://pokeapi.co/api/v2/pokemon?offset=${page}&limit=10`);
        if(!response.ok) {
            console.log(`Er is een error opgetreden: ${response.status}`);
        }
        const data = await response.json();
        return data;
    }
    catch(error) {
        console.error('Er is een errror opgetreden ', error);
    }
}

async function getSpecificPokemon(num) {
    try {
        const response = await fetch(`https://pokeapi.co/api/v2/pokemon/${num}`);
        if(!response.ok) {
            console.log(`Er is een error opgetreden: ${response.status}`);
        }
        const data = await response.json();
        return data;
    }
    catch(error) {
        console.error('Er is een errror opgetreden ', error);
    }
};

let pokefound;

async function getPokeByName(name) {
    try {
        const response = await fetch(`https://pokeapi.co/api/v2/pokemon/${name}`);
        if (!response.ok) {
            console.log(`HTTP Error: ${response.status}`);
        }
        const data = await response.json();
        pokefound = true;
        return data;
    }
    catch(error) {
        console.error('Er is een error opgetreden ', error);
        pokefound = false;
    }
}

const nextBtn = document.getElementById('nextBtn');
const prevBtn = document.getElementById('prevBtn');
const resetBtn = document.getElementById('resetBtn');
const searchInput = document.getElementById('searchInput');
const searchBtn = document.getElementById('searchBtn');
const svdPokes = document.getElementById('svdPokes');
const app = document.getElementById('app');

let pagenumber = 0;

svdPokes.addEventListener('click', () => {
    app.innerHTML = "";
    const favorites = JSON.parse(localStorage.getItem('favorites')) || [];
        const favoritesList = document.createElement('ul');
        favorites.forEach(favPokemon => {
            const li = document.createElement('li');
            const img = document.createElement('img');
            li.innerText = favPokemon.name;
            favoritesList.appendChild(li);
            img.src = favPokemon.url;
            li.appendChild(img);
        });
        app.appendChild(favoritesList);
    
})

searchBtn.addEventListener('click', () => {
    console.log(searchInput.value);
    app.innerHTML = "";
    getPokeByName(searchInput.value).then((response) => {
        console.log(pokefound);
        if(pokefound==true) {
            const ul = document.createElement('ul');
            const li = document.createElement('li');
            li.innerText = `${searchInput.value}`;
            ul.appendChild(li);
            const img = response.sprites.front_default;
            console.log(img);
            const imgdoc = document.createElement('img');
            imgdoc.src = img;
            li.appendChild(imgdoc);
            app.appendChild(ul);
        }
        else if (pokefound==false) {
            const tekst = document.createElement('p');
            tekst.innerText = `Pokémon no ha encontrado`;
            app.appendChild(tekst);
        }
    })
});


resetBtn.addEventListener('click', () => {
    app.innerHTML="";
    loadPokemon(0);
})

nextBtn.addEventListener('click', () => {
    console.log(pagenumber);
    pagenumber +=10;
    console.log(pagenumber);
    if(pagenumber == -10) {
        pagenumber = 0;
    }
    console.log(pagenumber);
    app.innerHTML="";
    loadPokemon(pagenumber);
})

prevBtn.addEventListener('click', () => {
    console.log(pagenumber);
    pagenumber -=10;
    console.log(pagenumber);
    if(pagenumber == -10) {
        pagenumber = -20;
    }
    console.log(pagenumber);
    app.innerHTML="";
    loadPokemon(pagenumber);
})

function loadPokemon(page) {
    getPokemon(page).then((response) => {
        console.log(response);
        const ul = document.createElement('ul');
        response.results.forEach(element => {
            const pokeName = element.name;
            console.log(pokeName);
            const li = document.createElement('li');
            li.innerText = `${pokeName}`;
            ul.appendChild(li);
            const pokeId = response.results.indexOf(element)+1;
            getSpecificPokemon(pokeId).then((result) => {
                console.log(result);
                const img = result.sprites.front_default;
                console.log(img);
                const imgdoc = document.createElement('img');
                imgdoc.src = img;
                li.appendChild(imgdoc);
            })

            li.addEventListener('click', () => {
                addToLocalStorage(element);
                alert(`Has guardado ${pokeName}!`);

            });

        });
        app.appendChild(ul);
    })
}

function addToLocalStorage(pokemon) {
    let favorites = JSON.parse(localStorage.getItem('favorites')) || [];
    favorites.push(pokemon);
    localStorage.setItem('favorites', JSON.stringify(favorites));
}

loadPokemon(0);



