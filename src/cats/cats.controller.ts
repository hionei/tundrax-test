import { Body, Controller, Delete, Get, Param, Post, Put, UseGuards } from "@nestjs/common";
import { ParseIntPipe } from "../common/pipes/parse-int.pipe";
import { CatsService } from "./cats.service";
import { CreateCatDto } from "./dto/create-cat.dto";
import { ApiBearerAuth, ApiOperation, ApiTags } from "@nestjs/swagger";
import { AdminAtGuard } from "src/auth/guards/admin-access-token.guard";
import { AtGuard } from "src/auth/guards";
import CatEntity from "./entities/cats.entity";
import { DeleteResult, UpdateResult } from "typeorm";

@ApiTags("Cats")
@Controller("cats")
export class CatsController {
  constructor(private readonly catsService: CatsService) {}

  @ApiOperation({ summary: "Create new Cat(admin)" })
  @Post()
  @UseGuards(AdminAtGuard)
  @ApiBearerAuth()
  create(@Body() createCatDto: CreateCatDto): Promise<CatEntity> {
    return this.catsService.create(createCatDto);
  }

  @ApiOperation({ summary: "Get All Cats" })
  @Get()
  @UseGuards(AtGuard)
  @ApiBearerAuth()
  findAll(): Promise<CatEntity[]> {
    return this.catsService.findAll();
  }

  @ApiOperation({ summary: "Get One Cat" })
  @Get(":id")
  @UseGuards(AtGuard)
  @ApiBearerAuth()
  findOne(@Param("id", new ParseIntPipe()) id: number): Promise<CatEntity> {
    return this.catsService.findOne(id);
  }

  @ApiOperation({ summary: "Update Cat(admin)" })
  @Put(":id")
  @UseGuards(AdminAtGuard)
  @ApiBearerAuth()
  updateCat(@Param("id", new ParseIntPipe()) id: number, @Body() catUpdateDto: CreateCatDto): Promise<UpdateResult> {
    return this.catsService.updateCat(id, catUpdateDto);
  }

  @ApiOperation({ summary: "Delete Cat(admin)" })
  @ApiBearerAuth()
  @Delete(":id")
  @UseGuards(AdminAtGuard)
  removeCat(@Param("id", new ParseIntPipe()) id: number): Promise<DeleteResult> {
    return this.catsService.deleteCat(id);
  }
}
