import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { IsNotEmpty, IsOptional, IsString } from 'class-validator';

// Base DTO containing common fields
class BaseUserParamDto {
  @ApiProperty({
    name: 'id',
    required: true,
    type: String,
    description: 'Unique identifier',
  })
  @IsNotEmpty()
  @IsString()
  id: string;

  @ApiPropertyOptional({
    name: 'userId',
    required: false,
    type: Number, // Aligning with the actual type in the route
    description: 'Optional user ID',
  })
  @IsOptional()
  userId: number;
}

// Extended DTOs with specific descriptions
export class UserCourseParamDto extends BaseUserParamDto {
  @ApiProperty({ description: 'Get the course by id' })
  id: string;
}

export class UserLessonParamDto extends BaseUserParamDto {
  @ApiProperty({ description: 'Get the lesson by id' })
  id: string;
}

export class UserRoadmapParamDto extends BaseUserParamDto {
  @ApiProperty({ description: 'Get the roadmap by id' })
  id: string;
}
