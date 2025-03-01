import {
  Injectable,
  OnModuleInit,
  Logger,
  NotFoundException,
} from '@nestjs/common';
import { CreateProductDto } from './dto/create-product.dto';
import { UpdateProductDto } from './dto/update-product.dto';
import { PrismaClient } from '@prisma/client';
import { PaginationDto } from 'src/common';

@Injectable()
export class ProductsService extends PrismaClient implements OnModuleInit {
  private readonly logger = new Logger('ProductsService');

  async onModuleInit() {
    await this.$connect();
    this.logger.log('Connected to the database');
  }

  create(createProductDto: CreateProductDto) {
    return this.product.create({
      data: createProductDto,
    });
  }

  async findAll(paginationDto: PaginationDto) {
    const { page, limit } = paginationDto;

    const totalPages = await this.product.count();
    const maxPage = Math.ceil(totalPages / limit);

    return {
      meta: {
        total: totalPages,
        page: page,
        maxPage: maxPage,
      },
      data: await this.product.findMany({
        skip: (page - 1) * limit,
        take: limit,
      }),
    };
  }

  async findOne(id: number) {
    const product = await this.product.findFirst({
      where: {
        id,
      },
    });

    if (!product) {
      throw new NotFoundException(`Product with id ${id} not found`);
    }

    return product;
  }

  async update(id: number, updateProductDto: UpdateProductDto) {
    try {
      return await this.product.update({
        where: {
          id,
        },
        data: updateProductDto,
      });
    } catch (error) {
      throw new NotFoundException(`Product with id ${id} not found`);
    }
  }

  remove(id: number) {
    return `This action removes a #${id} product`;
  }
}
