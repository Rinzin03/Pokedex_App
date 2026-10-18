// src/api.js
const BASE_URL = 'https://pokeapi.co/api/v2';

export const fetchPokemonList = async (offset = 0, limit = 20) => {
  try {
    const response = await fetch(`${BASE_URL}/pokemon?offset=${offset}&limit=${limit}`);
    const data = await response.json();
    
    // Extract ID from the URL and attach official artwork
    return data.results.map((pokemon) => {
      const id = pokemon.url.split('/').filter(Boolean).pop();
      return {
        id: Number(id),
        name: pokemon.name,
        image: `https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/other/official-artwork/${id}.png`,
      };
    });
  } catch (error) {
    throw new Error('Failed to fetch Pokémon list.');
  }
};

export const fetchAllPokemonNames = async () => {
  try {
    const response = await fetch(`${BASE_URL}/pokemon?limit=1025`);
    const data = await response.json();
    return data.results.map((pokemon) => {
      const id = pokemon.url.split('/').filter(Boolean).pop();
      return {
        id: Number(id),
        name: pokemon.name,
        image: `https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/other/official-artwork/${id}.png`,
      };
    });
  } catch (error) {
    throw new Error('Failed to fetch all Pokémon for search.');
  }
};

export const fetchPokemonDetails = async (idOrName) => {
  try {
    const response = await fetch(`${BASE_URL}/pokemon/${idOrName}`);
    const data = await response.json();
    return {
      id: data.id,
      name: data.name,
      height: data.height / 10, // convert decimetres to meters
      weight: data.weight / 10, // convert hectograms to kilograms
      types: data.types.map((t) => t.type.name),
      stats: data.stats.map((s) => ({
        name: s.stat.name,
        value: s.base_stat,
      })),
      image: data.sprites.other['official-artwork'].front_default || data.sprites.front_default,
    };
  } catch (error) {
    throw new Error('Failed to fetch Pokémon details.');
  }
};