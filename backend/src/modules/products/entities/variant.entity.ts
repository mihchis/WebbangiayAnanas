import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  ManyToOne,
  JoinColumn,
  Unique,
} from 'typeorm';
import { Product } from './product.entity';
import { Color } from './color.entity';
import { Size } from './size.entity';

@Entity('product_variants')
@Unique(['product', 'color', 'size']) // A product can only have one variant for a specific color + size combo
export class ProductVariant {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @ManyToOne(() => Product, (product) => product.variants, { onDelete: 'CASCADE' })
  @JoinColumn({ name: 'product_id' })
  product: Product;

  @ManyToOne(() => Color, (color) => color.variants, { onDelete: 'RESTRICT' })
  @JoinColumn({ name: 'color_id' })
  color: Color;

  @ManyToOne(() => Size, (size) => size.variants, { onDelete: 'RESTRICT' })
  @JoinColumn({ name: 'size_id' })
  size: Size;

  @Column({ type: 'int', default: 0 })
  stock: number;
}
