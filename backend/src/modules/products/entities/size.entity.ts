import { Entity, PrimaryGeneratedColumn, Column, OneToMany } from 'typeorm';
import { ProductVariant } from './variant.entity';

@Entity('sizes')
export class Size {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ unique: true })
  value: string; // e.g., "35", "36", "37", "38", "39", "40", "41", "42", "43"

  @OneToMany(() => ProductVariant, (variant) => variant.size)
  variants: ProductVariant[];
}
