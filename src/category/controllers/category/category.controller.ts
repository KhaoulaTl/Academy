/* eslint-disable prettier/prettier */
import { Controller, Get, Post, Put, Delete, Body, Param } from '@nestjs/common';
import { Category } from 'src/category/schemas/category/category.schema';
import { CategoryService } from 'src/category/services/category/category.service';


@Controller('categories')
export class CategoryController {
  constructor(private readonly categoryService: CategoryService) {}

  // Créer une nouvelle catégorie
  @Post()
  async createCategory(@Body() categoryData: Partial<Category>): Promise<Category> {
    return await this.categoryService.createCategory(categoryData);
  }

  // Récupérer toutes les catégories
  @Get()
  async getCategories(): Promise<Category[]> {
    return await this.categoryService.getCategories();
  }

  // Récupérer une catégorie par ID
  @Get(':id')
  async getCategoryById(@Param('id') id: string): Promise<Category> {
    return await this.categoryService.getCategoryById(id);
  }

  // Mettre à jour une catégorie par ID
  @Put(':id')
  async updateCategory(@Param('id') id: string, @Body() categoryData: Partial<Category>): Promise<Category> {
    return await this.categoryService.updateCategory(id, categoryData);
  }

  // Supprimer une catégorie par ID
  @Delete(':id')
  async deleteCategory(@Param('id') id: string): Promise<void> {
    return await this.categoryService.deleteCategory(id);
  }
}

