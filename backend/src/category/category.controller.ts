import { Controller, Get, Post, Body, Patch, Param, Delete, UseGuards } from '@nestjs/common';
import { ApiBearerAuth, ApiTags } from '@nestjs/swagger';
import { AuthGuard } from '../auth.guard';
import { RolesGuard } from '../roles/guard';
import { Roles } from '../roles/decorator';
import { Role } from '@prisma/client';
import { CategoryService } from './category.service';
import { CreateCategoryDto } from './dto/create-category.dto';
import { UpdateCategoryDto } from './dto/update-category.dto';

@ApiTags('category')
@Controller('category')
export class CategoryController {
  constructor(private readonly categoryService: CategoryService) { }

  @ApiBearerAuth()
  @UseGuards(AuthGuard, RolesGuard)
  @Roles(Role.ADMINISTRATEUR, Role.SUPER_ADMINISTRATEUR)
  @Post()
  create(@Body() createCategoryDto: CreateCategoryDto) {
    return this.categoryService.create(createCategoryDto);
  }

  @Get()
  findAll() {
    return this.categoryService.findAll();
  }

  @ApiBearerAuth()
  @UseGuards(AuthGuard, RolesGuard)
  @Roles(Role.ADMINISTRATEUR, Role.SUPER_ADMINISTRATEUR)
  @Patch(':id')
  update(@Param('id') id: string, @Body() updateCategoryDto: UpdateCategoryDto) {
    return this.categoryService.update(+id, updateCategoryDto);
  }

  @ApiBearerAuth()
  @UseGuards(AuthGuard, RolesGuard)
  @Roles(Role.ADMINISTRATEUR, Role.SUPER_ADMINISTRATEUR)
  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.categoryService.remove(+id);
  }
}

/**
 * Documentation du fichier
 *
 * - Role : Controleur des categories expose sur /category. La liste est publique pour remplir les filtres du catalogue.
 * - Fonctionnement : La creation, modification et suppression sont protegees par role administrateur ou super administrateur.
 * - A retenir : Il utilise les DTO de creation et mise a jour pour structurer les entrees.
 */
