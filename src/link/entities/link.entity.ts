import { IsNotEmpty } from 'class-validator';
import { User } from 'src/auth/entities/user.entity';
import { Entity, PrimaryGeneratedColumn, Column, ManyToOne } from 'typeorm';

@Entity()
export class Link {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ name: 'image', nullable: true, unique: false })
  image: string;

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
