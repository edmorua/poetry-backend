import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
} from 'typeorm';

@Entity('users')
export class User {
  @PrimaryGeneratedColumn('uuid')
  id: string; // Internal unique ID

  @Column({ unique: true, nullable: true })
  firebaseUid?: string; // 🔹 Only for Firebase users

  @Column({ unique: true })
  email: string;

  @Column({ nullable: true })
  password?: string; // 🔹 Only for Local Authentication users (hashed)

  @Column({ unique: true })
  nickname: string;

  @Column()
  realName: string;

  @Column({ default: false })
  shareRealName: boolean; // 🔹 Controls privacy

  @CreateDateColumn()
  createdAt: Date;
}
