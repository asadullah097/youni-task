import {
  Body,
  Controller,
  Delete,
  Get,
  HttpStatus,
  Param,
  Post,
  Put,
  Query,
} from '@nestjs/common';
import { ApiOperation, ApiTags } from '@nestjs/swagger';
import { ProductService } from './product.service';
import {
  ProductCreateDto,
  ProductUpdateDto,
  QueryParamsDto,
  ViewDto,
} from './dto/product.dto';

import { constant } from '../utils/constant';
import { CustomHttpException } from '../core/exception-filters/custom.http.exception';
import { ResponseInterface } from '../core/interfaces/response.interface';

@ApiTags('Product Api')
@Controller('product')
export class ProductController {
  constructor(private readonly productService: ProductService) {}

  @ApiOperation({ summary: 'Get All Products' })
  @Get()
  async getAll(
    @Query() queryParams: QueryParamsDto,
  ): Promise<ResponseInterface> {
    try {
      const response = await this.productService.getAllProducts(queryParams);
      return {
        error: false,
        statusCode: HttpStatus.OK,
        message: constant.SUCCESS,
        displayMessage: false,
        data: response?.data || [],
      };
    } catch (e) {
      throw new CustomHttpException(
        e?.status || HttpStatus.INTERNAL_SERVER_ERROR,
        e?.message || constant.INTERNAL_SERVER_ERROR,
        e?.displayMessage || false,
        true,
        null,
      );
    }
  }

  @ApiOperation({ summary: 'View Product Details' })
  @Get('/:id')
  async view(@Param() params: ViewDto): Promise<ResponseInterface> {
    try {
      const response: any = await this.productService.productDetails(params.id);
      return {
        error: false,
        statusCode: HttpStatus.OK,
        message: response?.message || constant.SUCCESS,
        displayMessage: false,
        data: response?.data || [],
      };
    } catch (e) {
      throw new CustomHttpException(
        e?.status || HttpStatus.INTERNAL_SERVER_ERROR,
        e?.message || constant.INTERNAL_SERVER_ERROR,
        e?.displayMessage || false,
        true,
        null,
      );
    }
  }

  @ApiOperation({ summary: 'Create Product' })
  @Post('create')
  async create(
    @Body() payload: ProductCreateDto, //always use payload variable name in request
  ): Promise<ResponseInterface> {
    try {
      const response: any = await this.productService.createProduct(payload);
      return {
        error: false,
        statusCode: HttpStatus.OK,
        message: response?.message || constant.SUCCESS,
        displayMessage: false,
        data: response?.data || [],
      };
    } catch (e) {
      throw new CustomHttpException(
        e?.status || HttpStatus.INTERNAL_SERVER_ERROR,
        e?.message || constant.INTERNAL_SERVER_ERROR,
        e?.displayMessage || false,
        true,
        null,
      );
    }
  }

  @ApiOperation({ summary: 'Update Product' })
  @Put('/:id')
  async update(
    @Body() payload: ProductUpdateDto,
    @Param() params: ViewDto,
  ): Promise<ResponseInterface> {
    try {
      const response: any = await this.productService.updateProduct(
        params?.id,
        payload,
      );
      return {
        error: false,
        statusCode: HttpStatus.OK,
        message: response?.message || constant.SUCCESS,
        displayMessage: false,
        data: response?.data || [],
      };
    } catch (e) {
      throw new CustomHttpException(
        e?.status || HttpStatus.INTERNAL_SERVER_ERROR,
        e?.message || constant.INTERNAL_SERVER_ERROR,
        e?.displayMessage || false,
        true,
        null,
      );
    }
  }

  @ApiOperation({ summary: 'Delete Product' })
  @Delete('/:id')
  async delete(@Param() params: ViewDto): Promise<ResponseInterface> {
    try {
      const response: any = await this.productService.deleteProduct(params?.id);
      return {
        error: false,
        statusCode: HttpStatus.OK,
        message: response?.message || constant.SUCCESS,
        displayMessage: false,
        data: response?.data || [],
      };
    } catch (e) {
      throw new CustomHttpException(
        e?.status || HttpStatus.INTERNAL_SERVER_ERROR,
        e?.message || constant.INTERNAL_SERVER_ERROR,
        e?.displayMessage || false,
        true,
        null,
      );
    }
  }
}
