import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  UseGuards,
} from '@nestjs/common';
import { CourseCategoriesService } from './course_categories.service';
import { CreateCourseCategoryDto } from './dto/create-course_category.dto';
import { ApiOperation, ApiTags } from '@nestjs/swagger';
import { SuccessResponse } from '@src/common/dto';
import { JwtAuthGuard } from '../auth/guards';

// using the global prefix from main file (api) and putting versioning here as v1 /api/v1/course-categories
@ApiTags('Course Categories')
@UseGuards(JwtAuthGuard)
@Controller({
  version: '1',
  path: 'course-categories',
})
export class CourseCategoriesController {
  constructor(
    private readonly courseCategoriesService: CourseCategoriesService,
  ) {}

  @Post()
  @ApiOperation({ summary: 'adding course category' })
  async create(
    @Body() createCourseCategoryDto: CreateCourseCategoryDto,
  ): Promise<SuccessResponse> {
    await this.courseCategoriesService.create(createCourseCategoryDto);
    const courseCategories = await this.courseCategoriesService.findAll();
    return new SuccessResponse('Successfully added course category', {
      categories: courseCategories,
    });
  }

  @Get()
  @ApiOperation({ summary: 'get all course categories' })
  async findAll() {
    const courseCategories = await this.courseCategoriesService.findAll();
    return new SuccessResponse('Course Categories', {
      categories: courseCategories,
    });
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.courseCategoriesService.findOne(+id);
  }

  @Patch(':id')
  update(@Param('id') id: string) {
    return this.courseCategoriesService.update(+id);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.courseCategoriesService.remove(+id);
  }
}