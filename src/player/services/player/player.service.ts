/* eslint-disable prettier/prettier */

import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { CategoryService } from 'src/category/services/category/category.service';
import { CoachService } from 'src/coach/services/coach/coach.service';
import { ParentService } from 'src/parent/services/parent/parent.service';
import { Player } from 'src/player/schemas/palyer/palyer.schema';

@Injectable()
export class PlayerService {
  constructor(
    @InjectModel(Player.name) private readonly playerModel: Model<Player>,
    private readonly parentService: ParentService,
    private readonly coachService: CoachService,
    private readonly categoryService: CategoryService
  ) {}

  // Rechercher la catégorie basée sur la date de naissance
  private async findCategoryByBirthDate(birthDate: Date): Promise<string> {
    const birthYear = birthDate.getFullYear();
    const categories = await this.categoryService.getCategories();
    
    const matchingCategory = categories.find(category =>
      category.birthYears.includes(birthYear)
    );

    if (!matchingCategory) {
      throw new NotFoundException(`No category found for birth year ${birthYear}`);
    }

    return matchingCategory._id as string; // Retourne l'ID de la catégorie correspondante
  }
  
  async createPlayer(createPlayerDto: Partial<Player>): Promise<Player> {
    // Convert birthDate to Date object if it exists
    if (createPlayerDto.birthDate) {
        const birthDate = new Date(createPlayerDto.birthDate); // Convert to Date object
        if (isNaN(birthDate.getTime())) { // Check if the conversion was successful
            throw new NotFoundException(`Invalid birth date: ${createPlayerDto.birthDate}`);
        }
        createPlayerDto.categoryId = await this.findCategoryByBirthDate(birthDate);
    }

    const createdPlayer = new this.playerModel(createPlayerDto);
    const savedPlayer = await createdPlayer.save();

    if (createPlayerDto.coachId) {
        await this.coachService.update(createPlayerDto.coachId, {
            $addToSet: { playerIds: savedPlayer._id }
        });
    }

    if (createPlayerDto.parentId) {
        await this.parentService.update(createPlayerDto.parentId, {
            $addToSet: { childIds: savedPlayer._id }
        });
    }

    return savedPlayer;
}

  async updatePlayer(id: string, updatePlayerDto: Partial<Player>): Promise<Player> {
    const updatedPlayer = await this.playerModel.findByIdAndUpdate(id, updatePlayerDto, { new: true }).exec();
    if (!updatedPlayer) {
      throw new NotFoundException(`Player with id ${id} not found`);
    }

    if (updatePlayerDto.coachId) {
      // Remove from old coach if necessary
      const oldCoachId = updatedPlayer.coachId;
      if (oldCoachId && oldCoachId !== updatePlayerDto.coachId) {
        await this.coachService.update(oldCoachId, {
          $pull: { playerIds: updatedPlayer._id }
        });
      }
      // Add to new coach
      await this.coachService.update(updatePlayerDto.coachId, {
        $addToSet: { playerIds: updatedPlayer._id }
      });
    }

    if (updatePlayerDto.parentId) {
      // Remove from old parent if necessary
      const oldParentId = updatedPlayer.parentId;
      if (oldParentId && oldParentId !== updatePlayerDto.parentId) {
        await this.parentService.update(oldParentId, {
          $pull: { childIds: updatedPlayer._id }
        });
      }
      // Add to new parent
      await this.parentService.update(updatePlayerDto.parentId, {
        $addToSet: { childIds: updatedPlayer._id }
      });
    }

    return updatedPlayer;
  }

  async findAllPlayers(): Promise<Player[]> {
    return this.playerModel.find().exec();
  }

  async findPlayerById(id: string): Promise<Player> {
    const player = await this.playerModel.findById(id).exec();
    if (!player) {
      throw new NotFoundException(`Player with id ${id} not found`);
    }
    return player;
  }

  async deletePlayer(id: string): Promise<void> {
    const result = await this.playerModel.findByIdAndDelete(id).exec();
    if (!result) {
      throw new NotFoundException(`Player with id ${id} not found`);
    }
  }

  async findParentByPlayer(playerId: string) {
    const player = await this.findPlayerById(playerId);
    if (!player.parentId) {
      throw new NotFoundException(`Parent for player with ID ${playerId} not found`);
    }
    return this.parentService.findById(player.parentId);
  }

}
