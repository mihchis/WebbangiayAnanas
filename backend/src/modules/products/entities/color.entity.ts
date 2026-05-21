import { Entity, PrimaryGeneratedColumn, Column, OneToMany } from 'typeorm';
import { ProductVariant } from './variant.entity';
import { ProductImage } from './image.entity';

@Entity('colors')
export class Color {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ unique: true })
  name: string; // e.g., "Red", "Evergreen", "Black"

  @Column({ unique: true })
  hexCode: string; // e.g., "#FF0000"

  @OneToMany(() => ProductVariant, (variant) => variant.color)
  variants: ProductVariant[];

  @OneToMany(() => ProductImage, (image) => image.color)
  images: ProductImage[];
}
