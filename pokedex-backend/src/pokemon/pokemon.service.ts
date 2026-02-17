import { Injectable, NotFoundException } from '@nestjs/common';
import { HttpService } from '@nestjs/axios';
import { firstValueFrom } from 'rxjs';
import { Pokemon } from './interfaces/pokemon.interface';

@Injectable()
export class PokemonService {
  private cachedPokemon: Pokemon[] | null = null;
  private isFetching = false;

  constructor(private readonly httpService: HttpService) {}

  async getPokemonList(): Promise<Pokemon[]> {
    if (this.cachedPokemon) return this.cachedPokemon;
    
    if (this.isFetching) {
       while (this.isFetching) {
         await new Promise(resolve => setTimeout(resolve, 100));
       }
       return this.cachedPokemon || [];
    }

    this.isFetching = true;
    console.log('--- System: Initiating Full Pokedex Sync (1025 Species) ---');

    try {
      const listResponse = await firstValueFrom(
        this.httpService.get('https://pokeapi.co/api/v2/pokemon?limit=1025'),
      );
      const pokemonList = listResponse.data.results;
      const detailedPokemon: Pokemon[] = [];

      const batchSize = 50;
      for (let i = 0; i < pokemonList.length; i += batchSize) {
        const batch = pokemonList.slice(i, i + batchSize);
        
        const batchResults = await Promise.all(
          batch.map(async (pokemon) => {
            try {
              const detailResponse = await firstValueFrom(this.httpService.get(pokemon.url));
              const data = detailResponse.data;

              return {
                id: data.id,
                name: data.name,
                image: data.sprites.other['official-artwork'].front_default || data.sprites.front_default,
                height: data.height,
                weight: data.weight,
                types: data.types.map(t => t.type.name),
                abilities: data.abilities.map(a => a.ability.name),
                stats: data.stats.map(s => ({
                  name: s.stat.name,
                  value: s.base_stat,
                })),
              };
            } catch (e) {
              console.error(`Failed to fetch node: ${pokemon.name}`);
              return null;
            }
          }),
        );

        detailedPokemon.push(...batchResults.filter(p => p !== null));
        console.log(`Synced: ${detailedPokemon.length} / 1025`);
      }

      this.cachedPokemon = detailedPokemon;
      return detailedPokemon;
    } finally {
      this.isFetching = false;
    }
  }

  async getPaginatedPokemon(
  page: number = 1,
  limit: number = 12,
  search?: string,
  type?: string,
) {
  let allPokemon = await this.getPokemonList();

  if (search) {
    const searchLower = search.toLowerCase();
    const searchNumber = parseInt(search);

    allPokemon = allPokemon.filter(p => {
      const matchesName = p.name.toLowerCase().includes(searchLower);
      // Check if the search is a number and matches the ID exactly
      const matchesId = !isNaN(searchNumber) && p.id === searchNumber;
      
      return matchesName || matchesId;
    });
  }

  if (type) {
    allPokemon = allPokemon.filter(p =>
      p.types.includes(type.toLowerCase()),
    );
  }

  const start = (page - 1) * limit;
  const end = start + limit;

  return {
    total: allPokemon.length,
    page,
    limit,
    data: allPokemon.slice(start, end),
  };
}

  async getPokemonById(id: number): Promise<Pokemon> {
    const allPokemon = await this.getPokemonList();
    const pokemon = allPokemon.find(p => p.id === id);

    if (!pokemon) {
      throw new NotFoundException(`Node_${id} not found in database`);
    }

    return pokemon;
  }
}