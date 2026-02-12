import axios from 'axios';

const API = axios.create({
  baseURL: 'http://localhost:3000',
});

export const getPokemon = (params: any) =>
  API.get('/pokemon', { params });

export const getPokemonById = (id: number) =>
  API.get(`/pokemon/${id}`);
