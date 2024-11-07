const searchForm = document.getElementById("search-form");
const pokemonNameInput = document.getElementById("pokemon-name");
const pokemonInfoContainer = document.getElementById("pokemon-info");
const pokemonListContainer = document.getElementById("pokemon-list");

async function fetchPokemonData(pokemonName) {
    const url = `https://pokeapi.co/api/v2/pokemon/${pokemonName.toLowerCase()}`;
    try {
        const response = await fetch(url);
        if (!response.ok) {
            throw new Error('Pokémon no encontrado');
        }
        const data = await response.json();
        displayPokemonData(data);
    } catch (error) {
        pokemonInfoContainer.innerHTML = `<p style="color: red;">${error.message}</p>`;
    }
}

function displayPokemonData(data) {
    const { name, sprites, types, stats, abilities, moves } = data;

    const pokemonImage = sprites.front_default;
    const pokemonTypes = types.map(typeInfo => typeInfo.type.name).join(", ");
    const pokemonStats = stats.map(stat => {
        return `${stat.stat.name}: ${stat.base_stat}`;
    }).join(", ");
    const pokemonAbilities = abilities.map(ability => ability.ability.name).join(", ");
    const pokemonMoves = moves.slice(0, 3).map(move => move.move.name).join(", ");

    pokemonInfoContainer.innerHTML = `
        <h2>${name.charAt(0).toUpperCase() + name.slice(1)}</h2>
        <img src="${pokemonImage}" alt="${name}" width="200">
        <p><strong>Tipos:</strong> ${pokemonTypes}</p>
        <p><strong>Estadísticas:</strong> ${pokemonStats}</p>
        <p><strong>Habilidades:</strong> ${pokemonAbilities}</p>
        <p><strong>Movimientos:</strong> ${pokemonMoves}</p>
    `;
}

searchForm.addEventListener("submit", (event) => {
    event.preventDefault();
    const pokemonName = pokemonNameInput.value.trim();
    if (pokemonName) {
        fetchPokemonData(pokemonName);
    }
});

async function fetchAllPokemonNames() {
    const url = 'https://pokeapi.co/api/v2/pokemon?limit=1000';
    try {
        const response = await fetch(url);
        if (!response.ok) {
            throw new Error('Error al obtener la lista de Pokémon');
        }
        const data = await response.json();
        const pokemonNames = data.results.map(pokemon => pokemon.name);
        displayPokemonNames(pokemonNames);
    } catch (error) {
        pokemonListContainer.innerHTML = `<p style="color: red;">${error.message}</p>`;
    }
}

function displayPokemonNames(names) {
    pokemonListContainer.innerHTML = '';
    names.forEach(name => {
        const listItem = document.createElement("li");
        listItem.textContent = name;
        pokemonListContainer.appendChild(listItem);
    });
}

document.getElementById('load-pokemon-btn').addEventListener('click', fetchAllPokemonNames);
