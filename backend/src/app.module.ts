import { Module } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AppController } from './app.controller';
import { AppService } from './app.service';

// Modules
import { RedisModule } from './modules/redis/redis.module';
import { AuthModule } from './modules/auth/auth.module';
import { MailModule } from './modules/mail/mail.module';
import { StorageModule } from './modules/storage/storage.module';
import { ProductsModule } from './modules/products/products.module';
import { OrdersModule } from './modules/orders/orders.module';

// Entities
import { User } from './modules/users/entities/user.entity';
import { Product } from './modules/products/entities/product.entity';
import { Color } from './modules/products/entities/color.entity';
import { Size } from './modules/products/entities/size.entity';
import { ProductVariant } from './modules/products/entities/variant.entity';
import { ProductImage } from './modules/products/entities/image.entity';
import { Order } from './modules/orders/entities/order.entity';
import { OrderItem } from './modules/orders/entities/order-item.entity';

@Module({
  imports: [
    // Configure global config module loading environment variables
    ConfigModule.forRoot({
      isGlobal: true,
      envFilePath: '.env',
    }),

    // Configure database layer via TypeORM Async options
    TypeOrmModule.forRootAsync({
      imports: [ConfigModule],
      inject: [ConfigService],
      useFactory: (configService: ConfigService) => ({
        type: 'postgres',
        host: configService.get<string>('DB_HOST', 'localhost'),
        port: configService.get<number>('DB_PORT', 5432),
        username: configService.get<string>('DB_USERNAME', 'ananas_admin'),
        password: configService.get<string>('DB_PASSWORD', 'ananas_password_99'),
        database: configService.get<string>('DB_DATABASE', 'ananas_db'),
        entities: [
          User,
          Product,
          Color,
          Size,
          ProductVariant,
          ProductImage,
          Order,
          OrderItem,
        ],
        synchronize: configService.get<boolean>('DB_SYNCHRONIZE', false),
        logging: configService.get<string>('NODE_ENV') === 'development',
      }),
    }),

    // Global Redis Module
    RedisModule,

    // Authentication Module
    AuthModule,

    // Global Mail Module
    MailModule,

    // Global Storage Module
    StorageModule,

    // Products Catalog Module
    ProductsModule,

    // Transactions Order Module
    OrdersModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
