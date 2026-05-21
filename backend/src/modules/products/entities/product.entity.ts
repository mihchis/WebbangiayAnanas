import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
  UpdateDateColumn,
  OneToMany,
  Index,
} from 'typeorm';
import { ProductVariant } from './variant.entity';
import { ProductImage } from './image.entity';

export enum ProductStyle {
  HIGH_TOP = 'high-top',
  LOW_TOP = 'low-top',
  SLIP_ON = 'slip-on',
}

export enum ProductGender {
  MEN = 'men',
  WOMEN = 'women',
  UNISEX = 'unisex',
}

@Entity('products')
export class Product {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column()
  name: string;

  @Column({ unique: true })
  sku: string;

  @Column({ type: 'text', nullable: true })
  description: string;

  @Column({ type: 'decimal', precision: 12, scale: 2 })
  price: number;

  @Column({ type: 'decimal', precision: 12, scale: 2, nullable: true })
  originalPrice: number;

  @Column({
    type: 'enum',
    enum: ProductStyle,
  })
  style: ProductStyle;

  @Column({
    type: 'enum',
    enum: ProductGender,
    default: ProductGender.UNISEX,
  })
  gender: ProductGender;

  @Column({ default: false })
  isSale: boolean;

  @Column({ type: 'int', default: 0 })
  discountPercent: number;

  // tsvector column for full-text search in PostgreSQL
  @Column({ type: 'tsvector', select: false, nullable: true })
  @Index('idx_products_search_tsvector', { synchronize: false })
  searchVector: any;

  @OneToMany(() => ProductVariant, (variant) => variant.product, { cascade: true })
  variants: ProductVariant[];

  @OneToMany(() => ProductImage, (image) => image.product, { cascade: true })
  images: ProductImage[];

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;
}
