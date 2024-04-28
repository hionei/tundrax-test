import { Injectable } from "@nestjs/common";
import UserEntity from "./entities/user.entity";
import { DeleteResult, Repository, UpdateResult } from "typeorm";
import { InjectRepository } from "@nestjs/typeorm";
import { UserUpdateDto } from "./dto/user-update.dto";
import { generateArgonHash } from "../utils";

@Injectable()
export class UsersService {
  constructor(
    @InjectRepository(UserEntity)
    private userRepository: Repository<UserEntity>
  ) {}

  async create(user: Partial<UserEntity>): Promise<UserEntity> {
    return await this.userRepository.save(user);
  }

  async updateUser(userId: number, userUpdateDto: UserUpdateDto): Promise<UpdateResult> {
    if (userUpdateDto.password) {
      userUpdateDto.password = await generateArgonHash(userUpdateDto.password);
    }
    return await this.userRepository.update(
      { id: userId },
      {
        ...userUpdateDto,
      }
    );
  }

  async deleteUser(userId: number): Promise<DeleteResult> {
    return await this.userRepository.delete({ id: userId });
  }

  async findOneUser(userId: number): Promise<UserEntity> {
    const user = await this.userRepository.findOneBy({ id: userId });
    delete user.password;
    delete user.hashedRT;
    return user;
  }

  async findOne(usernameOrEmail: string) {
    return await this.userRepository.findOne({
      where: [{ username: usernameOrEmail }, { email: usernameOrEmail }],
    });
  }
}
