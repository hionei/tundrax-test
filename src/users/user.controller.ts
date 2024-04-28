import { Body, Controller, Patch, Get, UseGuards, Delete } from "@nestjs/common";
import { ApiBearerAuth, ApiOperation, ApiTags } from "@nestjs/swagger";
import { DeleteResult, UpdateResult } from "typeorm";
import { UsersService } from "./user.service";
import { AtGuard } from "../auth/guards";
import { getCurrentUser } from "../auth/decorators";
import { UserUpdateDto } from "./dto/user-update.dto";
import UserEntity from "./entities/user.entity";

@ApiTags("User")
@Controller("users")
export class UsersController {
  constructor(private readonly usersService: UsersService) {}

  @ApiOperation({ summary: "Get User" })
  @Get()
  @UseGuards(AtGuard)
  @ApiBearerAuth()
  getUser(@getCurrentUser("userId") userId: number): Promise<UserEntity> {
    return this.usersService.findOneUser(userId);
  }

  @ApiOperation({ summary: "Update User" })
  @Patch("update")
  @UseGuards(AtGuard)
  @ApiBearerAuth()
  updateUser(@getCurrentUser("userId") userId: number, @Body() userUpdateDto: UserUpdateDto): Promise<UpdateResult> {
    return this.usersService.updateUser(userId, userUpdateDto);
  }

  @ApiOperation({ summary: "Delete User" })
  @Delete("delete")
  @UseGuards(AtGuard)
  @ApiBearerAuth()
  deleteUser(@getCurrentUser("userId") userId: number): Promise<DeleteResult> {
    return this.usersService.deleteUser(userId);
  }
}
