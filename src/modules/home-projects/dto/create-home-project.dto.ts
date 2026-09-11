import { IsString, IsEnum, IsNumber, IsOptional, IsJSON } from 'class-validator';
import { PropertyType } from '../entities/home-project.entity';

export class CreateHomeProjectDto {
  @IsString()
  projectName: string;

  @IsString()
  description: string;

  @IsEnum(PropertyType)
  propertyType: PropertyType;

  @IsNumber()
  totalArea: number;

  @IsNumber()
  numberOfFloors: number;

  @IsNumber()
  numberOfRooms: number;

  @IsNumber()
  numberOfBathrooms: number;

  @IsNumber()
  estimatedBudget: number;

  @IsOptional()
  @IsJSON()
  location?: {
    latitude: number;
    longitude: number;
    address: string;
    city: string;
    country: string;
  };

  @IsOptional()
  @IsJSON()
  specifications?: {
    architecture: string;
    style: string;
    colors: string[];
    features: string[];
  };
}
