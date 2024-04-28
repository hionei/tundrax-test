import { Column, CreateDateColumn, Entity, PrimaryGeneratedColumn } from "typeorm";
import { Exclude } from "class-transformer";
import { ApiProperty } from "@nestjs/swagger";
import { IsEmail } from "class-validator";
import { Role } from "src/utils/types";

@Entity("users")
class UserEntity {
  @ApiProperty()
  @PrimaryGeneratedColumn()
  id: number;

  @ApiProperty()
  @Column({ unique: true })
  username: string;

  @ApiProperty()
  @IsEmail()
  @Column({ unique: true })
  email: string;

  @Column({
    type: "enum",
    enum: Role,
    default: Role.User,
  })
  role: Role;

  @Column()
  @Exclude()
  password: string;

  @Column({ nullable: true })
  @Exclude()
  hashedRT: string;

  @ApiProperty()
  @CreateDateColumn({ type: "timestamptz" })
  createdAt: Date;
}

export default UserEntity;
