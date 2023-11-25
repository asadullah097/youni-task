import { Test, TestingModule } from '@nestjs/testing';
import { ProductService } from './product.service';
import { Repository } from 'typeorm';
import { ProductEntity } from '../entities/product.entity';
import { getRepositoryToken } from '@nestjs/typeorm';
import { constant } from '../utils/constant';

const mockProductRepository = {
  save: jest.fn().mockImplementation((productObject) => ({
    ...productObject,
  })),
  findOne: jest.fn().mockImplementation((options) => {
    // Simulate finding a product based on the provided options
    if (options.where.id === 1) {
      return {
        id: 1,
        name: 'Product 1',
      };
    }
    // Simulate not finding a product
    return undefined;
  }),
  delete: jest.fn().mockImplementation(() => ({ affected: 1 })),
};
describe('ProductService', () => {
  let productService: ProductService;
  let productRepository: Repository<ProductEntity>;

  beforeEach(async () => {
    jest.clearAllMocks();
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        ProductService,
        {
          provide: getRepositoryToken(ProductEntity),
          useValue: mockProductRepository,
        },
      ],
    }).compile();

    productService = module.get<ProductService>(ProductService);
    productRepository = module.get<Repository<ProductEntity>>(
      getRepositoryToken(ProductEntity),
    );
  });

  describe('createProduct', () => {
    it('should create a new product', async () => {
      // Arrange
      const params = {
        name: 'Testing Product',
        description: 'Test description',
        price: 11,
      };

      // Act
      const result = await productService.createProduct(params);

      // Assert
      expect(result).toEqual({
        data: {
          // Assuming the save function returns the saved entity
          id: result?.data?.id,
          ...params,
        },
        message: constant.PRODUCT_CREATE,
      });

      // Ensure that the repository's save method was called with the correct parameters
      expect(productRepository.save).toHaveBeenCalledWith(
        expect.objectContaining(params),
      );
    });
  });

  describe('productDetails', () => {
    it('should return product details if found', async () => {
      // Arrange
      const productId = 1;

      // Act
      const result = await productService.productDetails(productId);

      // Assert
      expect(result).toEqual({
        data: {
          id: 1,
          name: 'Product 1',
        },
      });

      // Ensure that the repository's findOne method was called with the correct parameters
      expect(productRepository.findOne).toHaveBeenCalledWith({
        where: { id: productId },
      });
    });

    it('should return PRODUCT_NOT_FOUND message if the product is not found', async () => {
      // Arrange
      const productId = 2;

      // Act
      const result = await productService.productDetails(productId);

      // Assert
      expect(result).toEqual({
        message: constant.PRODUCT_NOT_FOUND,
      });

      // Ensure that the repository's findOne method was called with the correct parameters
      expect(productRepository.findOne).toHaveBeenCalledWith({
        where: { id: productId },
      });
    });
  });

  describe('deleteProduct', () => {
    it(`should delete the product and return  ${constant.PRODUCT_DELETED} message if the product is found`, async () => {
      // Arrange
      const productId = 1;

      // Act
      const result = await productService.deleteProduct(productId);

      // Assert
      expect(result).toEqual({
        message: constant.PRODUCT_DELETED,
      });

      expect(productRepository.findOne).toHaveBeenCalledWith({
        where: { id: productId },
      });

      expect(productRepository.delete).toHaveBeenCalledWith({
        id: productId,
      });
    });

    it(`should return ${constant.PRODUCT_NOT_FOUND} message if the product is not found`, async () => {
      // Arrange
      const productId = 4;

      // Act
      const result = await productService.deleteProduct(productId);
      // Assert
      expect(result).toEqual({
        message: constant.PRODUCT_NOT_FOUND,
      });

      // Ensure that the repository's findOne method was called with the correct parameters
      expect(productRepository.findOne).toHaveBeenCalledWith({
        where: { id: productId },
      });

      // Ensure that the repository's delete method was not called in this case
      expect(productRepository.delete).not.toHaveBeenCalled();
    });
  });
});
