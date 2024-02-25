import { Entity, PrimaryGeneratedColumn, Column, OneToMany } from 'typeorm';
import { Link } from 'src/link/entities/link.entity';

@Entity()
export class User {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  username: string;

  @Column()
  email: string;

  @Column({ nullable: true })
  refresh_token: string;

  @Column({ nullable: true })
  access_token: string;

  @OneToMany(() => Link, (link) => link.user)
  linkList: Link;
}
