import { Entity, PrimaryGeneratedColumn, Column, ManyToOne, JoinColumn } from 'typeorm';
import { Product } from './product.entity';
import { Color } from './color.entity';

@Entity('product_images')
export class ProductImage {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @ManyToOne(() => Product, (product) => product.images, { onDelete: 'CASCADE' })
  @JoinColumn({ name: 'product_id' })
  product: Product;

  @ManyToOne(() => Color, (color) => color.images, { nullable: true, onDelete: 'SET NULL' })
  @JoinColumn({ name: 'color_id' })
  color: Color | null;

  @Column()
  url: string; // File URL/Path

  @Column({ default: false })
  isPrimary: boolean; // Is it the main thumbnail?
}
