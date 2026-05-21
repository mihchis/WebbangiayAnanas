import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ProductsController } from './products.controller';
import { ProductsService } from './products.service';
import { Product } from './entities/product.entity';
import { Color } from './entities/color.entity';
import { Size } from './entities/size.entity';
import { ProductVariant } from './entities/variant.entity';
import { ProductImage } from './entities/image.entity';
import { AuthModule } from '../auth/auth.module';

@Module({
  imports: [
    TypeOrmModule.forFeature([
      Product,
      Color,
      Size,
      ProductVariant,
      ProductImage,
    ]),
    AuthModule,
  ],
  controllers: [ProductsController],
  providers: [ProductsService],
  exports: [ProductsService],
})
export class ProductsModule {}
