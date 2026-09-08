import { IsString, IsObject, IsOptional, IsArray, IsNumber } from 'class-validator';

export class CreateDesignDto {
  @IsString()
  name: string;

  @IsString()
  description: string;

  @IsObject()
  design: {
    roomType: 'living' | 'bedroom' | 'kitchen' | 'bathroom' | 'office';
    furniture: Array<{
      id: string;
      name: string;
      color: string;
      position: { x: number; y: number };
      size: { width: number; height: number };
      image: string;
    }>;
    walls: {
      color: string;
      pattern?: string;
    };
    floor: {
      color: string;
      material: string;
    };
    lighting: {
      brightness: number;
      color: string;
    };
    accessories: Array<{
      id: string;
      name: string;
      color: string;
      image: string;
      position: { x: number; y: number };
    }>;
  };

  @IsOptional()
  @IsString()
  backgroundImage?: string;
}

export class UpdateDesignDto {
  @IsOptional()
  @IsString()
  name?: string;

  @IsOptional()
  @IsString()
  description?: string;

  @IsOptional()
  @IsObject()
  design?: CreateDesignDto['design'];

  @IsOptional()
  @IsString()
  backgroundImage?: string;
}

export class RateDesignDto {
  @IsNumber()
  rating: number;
}
