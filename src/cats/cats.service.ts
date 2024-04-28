import { Injectable } from "@nestjs/common";
import CatEntity from "./entities/cats.entity";
import { CreateCatDto } from "./dto/create-cat.dto";
import { Repository } from "typeorm";
import { InjectRepository } from "@nestjs/typeorm";

@Injectable()
export class CatsService {
  constructor(
    @InjectRepository(CatEntity)
    private catRepository: Repository<CatEntity>
  ) {}

  async create(cat: CreateCatDto): Promise<CatEntity> {
    const newCat = new CatEntity();
    return await this.catRepository.save({ id: newCat.id, ...cat });
  }

  async findAll(): Promise<CatEntity[]> {
    return await this.catRepository.find();
  }

  async findOne(id: number): Promise<CatEntity> {
    return await this.catRepository.findOneBy({ id });
  }

  async updateCat(id: number, updateCatDto: CreateCatDto) {
    return await this.catRepository.update(id, { ...updateCatDto });
  }

  async deleteCat(id: number) {
    return await this.catRepository.delete(id);
  }
}
