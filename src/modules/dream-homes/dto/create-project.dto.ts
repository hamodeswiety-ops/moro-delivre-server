import {
  IsString,
  IsEnum,
  IsNumber,
  IsOptional,
  MinLength,
  MaxLength,
  Min,
  Max,
  IsJSON,
} from 'class-validator';
import { PropertyType } from '../entities/dream-home-project.entity';

export class CreateProjectDto {
  @IsString()
  @MinLength(3)
  @MaxLength(255)
  name: string;

  @IsString()
  @MaxLength(2000)
  description: string;

  @IsEnum(PropertyType)
  propertyType: PropertyType;

  @IsNumber()
  @Min(10)
  @Max(100000)
  totalArea: number;

  @IsNumber()
  @Min(1)
  @Max(100)
  floorsCount: number;

  @IsNumber()
  @Min(1)
  @Max(500)
  roomsCount: number;

  @IsNumber()
  @Min(1)
  @Max(200)
  bathroomsCount: number;

  @IsNumber()
  @Min(50000)
  @Max(10000000)
  estimatedBudget: number;

  @IsOptional()
  @IsJSON()
  location?: {
    latitude: number;
    longitude: number;
    address: string;
    city: string;
    country: string;
    zipCode: string;
  };

  @IsOptional()
  @IsJSON()
  specifications?: {
    architecture: string;
    style: string;
    features: string[];
    specialRequirements: string[];
  };
}
