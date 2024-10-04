/* eslint-disable prettier/prettier */

import { Body, Controller, Delete, Get, Param, Post, Put } from '@nestjs/common';
import { Player } from 'src/player/schemas/palyer/palyer.schema';
import { PlayerService } from 'src/player/services/player/player.service';

@Controller('players')
export class PlayerController {
  constructor(private readonly playerService: PlayerService) {}

  @Post()
  async create(@Body() createPlayerDto: Partial<Player>): Promise<Player> {
    return this.playerService.createPlayer(createPlayerDto);
  }

  @Get()
  async findAll(): Promise<Player[]> {
    return this.playerService.findAllPlayers();
  }

  @Get(':id')
  async findOne(@Param('id') id: string): Promise<Player> {
    return this.playerService.findPlayerById(id);
  }

  @Put(':id')
  async update(@Param('id') id: string, @Body() updatePlayerDto: Partial<Player>): Promise<Player> {
    return this.playerService.updatePlayer(id, updatePlayerDto);
  }

  @Delete(':id')
  async remove(@Param('id') id: string): Promise<void> {
    return this.playerService.deletePlayer(id);
  }

  @Get(':id/parent')
  async findParent(@Param('id') playerId: string) {
    return this.playerService.findParentByPlayer(playerId);
  }

}
