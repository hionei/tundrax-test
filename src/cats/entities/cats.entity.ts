import { Column, Entity, PrimaryGeneratedColumn } from "typeorm";
import { ApiProperty } from "@nestjs/swagger";
import { IsInt, IsString } from "class-validator";

@Entity("cats")
class CatEntity {
  @ApiProperty()
  @PrimaryGeneratedColumn()
  id: number;

  @ApiProperty()
  @IsString()
  @Column({ unique: false })
  name: string;

  @ApiProperty()
  @IsInt()
  @Column({ unique: false })
  age: number;

  @ApiProperty()
  @IsString()
  @Column({ unique: false })
  breed: string;
}

export default CatEntity;
