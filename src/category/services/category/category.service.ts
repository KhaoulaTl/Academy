/* eslint-disable prettier/prettier */
import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Category } from 'src/category/schemas/category/category.schema';

@Injectable()
export class CategoryService {
  constructor(@InjectModel(Category.name) private categoryModel: Model<Category>) {}

  // Créer une nouvelle catégorie
  async createCategory(categoryData: Partial<Category>): Promise<Category> {
    const newCategory = new this.categoryModel(categoryData);
    return await newCategory.save();
  }

  // Récupérer toutes les catégories
  async getCategories(): Promise<Category[]> {
    return await this.categoryModel.find().exec();
  }

  // Récupérer une catégorie par ID
  async getCategoryById(id: string): Promise<Category> {
    return await this.categoryModel.findById(id).exec();
  }

  // Mettre à jour une catégorie par ID
  async updateCategory(id: string, categoryData: Partial<Category>): Promise<Category> {
    return await this.categoryModel.findByIdAndUpdate(id, categoryData, { new: true }).exec();
  }

  // Supprimer une catégorie par ID
  async deleteCategory(id: string): Promise<void> {
    await this.categoryModel.findByIdAndDelete(id).exec();
  }

  
}