import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { ProductEntity } from '../entities/product.entity';
import { Like, Repository } from 'typeorm';
import { ProductCreateDto, QueryParamsDto } from './dto/product.dto';
import { constant } from '../utils/constant';

@Injectable()
export class ProductService {
  constructor(
    @InjectRepository(ProductEntity)
    private readonly productEntityRepo: Repository<ProductEntity>,
  ) {}
  async createProduct(params: ProductCreateDto) {
    const productObject = new ProductEntity(params);
    const productCreated = await this.productEntityRepo.save(productObject);
    return {
      data: productCreated,
      message: constant.PRODUCT_CREATE,
    };
  }

  async getAllProducts(params: QueryParamsDto) {
    const { searchKeyword, page, limit } = params;
    let whereClause = {};
    if (searchKeyword) {
      whereClause = {
        name: Like(`%${searchKeyword}%`),
      };
    }
    const [products, totalCount] = await this.productEntityRepo.findAndCount({
      where: whereClause,
      take: limit,
      skip: (page - 1) * limit,
    });

    return {
      data: products,
      total: totalCount,
      page,
      limit,
    };
  }

  async productDetails(id) {
    const productFound = await this.productEntityRepo.findOne({
      where: {
        id,
      },
    });
    if (productFound) {
      return { data: productFound };
    }
    return {
      message: constant.PRODUCT_NOT_FOUND,
    };
  }

  async updateProduct(id, payload) {
    const { name, description, price } = payload;
    const productFound = await this.productEntityRepo.findOne({
      where: {
        id,
      },
    });
    if (productFound) {
      if (productFound) {
        productFound.name = name;
        productFound.description = description;
        productFound.price = price;

        const updatedProduct = await this.productEntityRepo.save(productFound);
        return {
          data: updatedProduct,
          message: constant.PRODUCT_UPDATED,
        };
      }
      return {
        data: productFound,
        message: constant.PRODUCT_UPDATED,
      };
    }
    return {
      message: constant.PRODUCT_NOT_FOUND,
    };
  }

  async deleteProduct(id) {
    const productFound = await this.productEntityRepo.findOne({
      where: {
        id,
      },
    });
    if (productFound) {
      const updateProduct = await this.productEntityRepo.delete({
        id: productFound?.id,
      });
      return {
        message: constant.PRODUCT_DELETED,
      };
    }
    return {
      message: constant.PRODUCT_NOT_FOUND,
    };
  }
}
