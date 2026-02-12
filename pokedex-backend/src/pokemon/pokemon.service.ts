import { Injectable, NotFoundException } from '@nestjs/common';
import { HttpService } from '@nestjs/axios';
import { firstValueFrom } from 'rxjs';
import { Pokemon } from './interfaces/pokemon.interface';


@Injectable()
export class PokemonService {
  private cachedPokemon: Pokemon[] | null = null;

  constructor(private readonly httpService: HttpService) {}

  async getPokemonList(): Promise<Pokemon[]> {
  if (this.cachedPokemon) {
    return this.cachedPokemon;
  }

  const listResponse = await firstValueFrom(
    this.httpService.get(
      'https://pokeapi.co/api/v2/pokemon?limit=300',
    ),
  );

  const pokemonList = listResponse.data.results;

  const detailedPokemon: Pokemon[] = [];

  const batchSize = 20;

  for (let i = 0; i < pokemonList.length; i += batchSize) {
    const batch = pokemonList.slice(i, i + batchSize);

    const batchResults = await Promise.all(
      batch.map(async (pokemon) => {
        const detailResponse = await firstValueFrom(
          this.httpService.get(pokemon.url),
        );

        const data = detailResponse.data;

        return {
          id: data.id,
          name: data.name,
          image: data.sprites.front_default,
          height: data.height,
          weight: data.weight,
          types: data.types.map(t => t.type.name),
          abilities: data.abilities.map(a => a.ability.name),
          stats: data.stats.map(s => ({
            name: s.stat.name,
            value: s.base_stat,
          })),
        };
      }),
    );

    detailedPokemon.push(...batchResults);
  }

  this.cachedPokemon = detailedPokemon;

  return detailedPokemon;
}


  async getPaginatedPokemon(
    page: number = 1,
    limit: number = 10,
    search?: string,
    type?: string,
  ) {
    let allPokemon = await this.getPokemonList();

    // 🔍 Search by name
    if (search) {
      allPokemon = allPokemon.filter(p =>
        p.name.toLowerCase().includes(search.toLowerCase()),
      );
    }

    // 🔥 Filter by type
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
      throw new NotFoundException('Pokemon not found');
    }

    return pokemon;
  }
}
