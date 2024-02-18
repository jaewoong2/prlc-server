import { IsNotEmpty } from 'class-validator';
import { Entity, PrimaryGeneratedColumn, Column, ManyToOne } from 'typeorm';
import { User } from './user.entity';

@Entity()
export class Link {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ name: 'thumbnail', nullable: true, unique: false })
  thumbnail: string;

  @Column({ name: 'title', nullable: true, unique: false })
  title: string;

  @Column({ name: 'description', nullable: true, unique: false })
  description: string;

  @IsNotEmpty()
  @Column({ name: 'origin_url', nullable: false, unique: false })
  origin_url: string;

  @IsNotEmpty()
  @Column({ name: 'custom_url', nullable: false, unique: true })
  custom_url: string;

  @ManyToOne(() => User, (user) => user.linkList)
  user: User;
}
