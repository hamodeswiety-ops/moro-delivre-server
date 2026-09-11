import { IsString, IsEnum, IsNumber, IsArray, IsJSON, IsOptional } from 'class-validator';
import { DesignStyle } from '../../entities/project-design.entity';

export class CreateDesignDto {
  @IsString()
  designName: string;

  @IsEnum(DesignStyle)
  style: DesignStyle;

  @IsArray()
  @IsString({ each: true })
  colorPalette: string[];

  @IsJSON()
  materials: {
    exterior: string;
    roofing: string;
    flooring: string;
    walls: string;
    doors: string;
    windows: string;
  };

  @IsOptional()
  @IsArray()
  @IsString({ each: true })
  features?: string[];

  @IsNumber()
  totalCost: number;

  @IsOptional()
  @IsJSON()
  visualizationUrl?: {
    thumbnail: string;
    preview2d: string;
    preview3d: string;
  };
}
