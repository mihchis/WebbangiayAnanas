import {
  Controller,
  Get,
  Post,
  Body,
  Query,
  Param,
  UseGuards,
  ParseIntPipe,
} from '@nestjs/common';
import { ProductsService } from './products.service';
import { ProductStyle, ProductGender } from './entities/product.entity';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { RolesGuard } from '../auth/guards/roles.guard';
import { Roles } from '../auth/decorators/roles.decorator';
import { UserRole } from '../users/entities/user.entity';

@Controller('products')
export class ProductsController {
  constructor(private productsService: ProductsService) {}

  // 1. Get products listing with optional e-commerce filtering
  @Get()
  async getProducts(
    @Query('style') style?: ProductStyle,
    @Query('gender') gender?: ProductGender,
    @Query('isSale') isSale?: string,
    @Query('minPrice') minPrice?: string,
    @Query('maxPrice') maxPrice?: string,
    @Query('colorId') colorId?: string,
    @Query('sizeId') sizeId?: string,
    @Query('sortBy') sortBy?: 'price_asc' | 'price_desc' | 'newest',
    @Query('search') search?: string,
    @Query('line') line?: string,
  ) {
    const isSaleBool = isSale === 'true' ? true : isSale === 'false' ? false : undefined;
    const minVal = minPrice ? parseFloat(minPrice) : undefined;
    const maxVal = maxPrice ? parseFloat(maxPrice) : undefined;
    const colorVal = colorId ? parseInt(colorId, 10) : undefined;
    const sizeVal = sizeId ? parseInt(sizeId, 10) : undefined;

    return this.productsService.findAll({
      style,
      gender,
      isSale: isSaleBool,
      minPrice: minVal,
      maxPrice: maxVal,
      colorId: colorVal,
      sizeId: sizeVal,
      sortBy,
      search,
      line,
    });
  }

  // 2. High-speed GIN index full-text search query
  @Get('search')
  async search(@Query('q') query: string) {
    return this.productsService.search(query);
  }

  // 3. Fetch all colors
  @Get('colors')
  async getColors() {
    return this.productsService.getColors();
  }

  // 4. Fetch all sizes
  @Get('sizes')
  async getSizes() {
    return this.productsService.getSizes();
  }

  // 5. Get detailed single product info
  @Get(':id')
  async getProduct(@Param('id') id: string) {
    return this.productsService.findOne(id);
  }

  // 6. Admin endpoint to add products - Protected by Auth
  @Post()
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(UserRole.STAFF, UserRole.ADMIN)
  async create(
    @Body()
    data: {
      name: string;
      sku: string;
      description?: string;
      price: number;
      originalPrice?: number;
      style: ProductStyle;
      gender: ProductGender;
      isSale?: boolean;
      discountPercent?: number;
      variants: Array<{ colorId: number; sizeId: number; stock: number }>;
      images: Array<{ colorId?: number; url: string; isPrimary?: boolean }>;
    },
  ) {
    return this.productsService.createProduct(data);
  }

  // 7. Public endpoint to seed database
  @Post('seed')
  async seed() {
    return this.productsService.seed();
  }
}

