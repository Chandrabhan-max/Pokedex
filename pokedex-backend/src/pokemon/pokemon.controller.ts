import { Controller, Get, Query, Param } from '@nestjs/common';
import { PokemonService } from './pokemon.service';
import { PokemonQueryDto } from './dto/pokemon-query.dto';

@Controller('pokemon')
export class PokemonController {
  constructor(private readonly pokemonService: PokemonService) {}

  @Get()
  getPaginated(@Query() query: PokemonQueryDto) {
    return this.pokemonService.getPaginatedPokemon(
      query.page,
      query.limit,
      query.search,
      query.type,
    );
  }

  @Get(':id')
  getById(@Param('id') id: string) {
    return this.pokemonService.getPokemonById(Number(id));
  }
}
