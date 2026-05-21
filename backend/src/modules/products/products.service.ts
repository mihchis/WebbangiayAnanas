import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Product, ProductStyle, ProductGender } from './entities/product.entity';
import { Color } from './entities/color.entity';
import { Size } from './entities/size.entity';
import { ProductVariant } from './entities/variant.entity';
import { ProductImage } from './entities/image.entity';

@Injectable()
export class ProductsService {
  constructor(
    @InjectRepository(Product)
    private productRepository: Repository<Product>,
    @InjectRepository(Color)
    private colorRepository: Repository<Color>,
    @InjectRepository(Size)
    private sizeRepository: Repository<Size>,
    @InjectRepository(ProductVariant)
    private variantRepository: Repository<ProductVariant>,
    @InjectRepository(ProductImage)
    private imageRepository: Repository<ProductImage>,
  ) {}

  // 1. Get all products with dynamic filter parameters
  async findAll(filters: {
    style?: ProductStyle;
    gender?: ProductGender;
    isSale?: boolean;
    minPrice?: number;
    maxPrice?: number;
    colorId?: number;
    sizeId?: number;
    sortBy?: 'price_asc' | 'price_desc' | 'newest';
    search?: string;
    line?: string;
  }) {
    const qb = this.productRepository.createQueryBuilder('product')
      .leftJoinAndSelect('product.images', 'image')
      .leftJoinAndSelect('product.variants', 'variant')
      .leftJoinAndSelect('variant.color', 'color')
      .leftJoinAndSelect('variant.size', 'size');

    // Filter by Style (high-top, low-top, slip-on)
    if (filters.style) {
      qb.andWhere('product.style = :style', { style: filters.style });
    }

    // Filter by Gender target (men, women, unisex)
    if (filters.gender) {
      if (filters.gender === ProductGender.UNISEX) {
        qb.andWhere('product.gender = :gender', { gender: ProductGender.UNISEX });
      } else {
        // e.g., Filter for Men includes Men and Unisex products
        qb.andWhere('(product.gender = :gender OR product.gender = :unisex)', {
          gender: filters.gender,
          unisex: ProductGender.UNISEX,
        });
      }
    }

    // Filter by Sale-off products
    if (filters.isSale !== undefined) {
      qb.andWhere('product.isSale = :isSale', { isSale: filters.isSale });
    }

    // Filter by Min/Max Price range
    if (filters.minPrice !== undefined) {
      qb.andWhere('product.price >= :minPrice', { minPrice: filters.minPrice });
    }
    if (filters.maxPrice !== undefined) {
      qb.andWhere('product.price <= :maxPrice', { maxPrice: filters.maxPrice });
    }

    // Filter by Color selection
    if (filters.colorId !== undefined) {
      // Check if product has a variant with this color
      qb.andWhere((subQb) => {
        const subQuery = subQb
          .subQuery()
          .select('v.product_id')
          .from(ProductVariant, 'v')
          .where('v.color_id = :colorId')
          .getQuery();
        return `product.id IN ${subQuery}`;
      }, { colorId: filters.colorId });
    }

    // Filter by Size selection
    if (filters.sizeId !== undefined) {
      qb.andWhere((subQb) => {
        const subQuery = subQb
          .subQuery()
          .select('v.product_id')
          .from(ProductVariant, 'v')
          .where('v.size_id = :sizeId')
          .getQuery();
        return `product.id IN ${subQuery}`;
      }, { sizeId: filters.sizeId });
    }

    // Filter by Product Line (e.g. Vintas, Urbas, Track 6, Pattas)
    if (filters.line) {
      qb.andWhere('product.name ILIKE :line', { line: `%${filters.line}%` });
    }

    // Filter by PostgreSQL GIN Full-Text Search
    if (filters.search && filters.search.trim()) {
      const formattedSearch = filters.search
        .trim()
        .replace(/[&|!():*]/g, '')
        .split(/\s+/)
        .filter(Boolean)
        .map((word) => `${word}:*`)
        .join(' & ');

      if (formattedSearch) {
        qb.andWhere(`product.search_vector @@ to_tsquery('simple', :search)`, {
          search: formattedSearch,
        });
      }
    }

    // Sorting
    if (filters.sortBy) {
      if (filters.sortBy === 'price_asc') {
        qb.orderBy('product.price', 'ASC');
      } else if (filters.sortBy === 'price_desc') {
        qb.orderBy('product.price', 'DESC');
      } else if (filters.sortBy === 'newest') {
        qb.orderBy('product.createdAt', 'DESC');
      }
    } else if (filters.search && filters.search.trim()) {
      // If there's a search term, sort by relevance rank by default
      const formattedSearch = filters.search
        .trim()
        .replace(/[&|!():*]/g, '')
        .split(/\s+/)
        .filter(Boolean)
        .map((word) => `${word}:*`)
        .join(' & ');
      
      if (formattedSearch) {
        qb.orderBy(
          `ts_rank_cd(product.search_vector, to_tsquery('simple', :search))`,
          'DESC',
        );
      } else {
        qb.orderBy('product.createdAt', 'DESC');
      }
    } else {
      qb.orderBy('product.createdAt', 'DESC'); // Default sort
    }

    return qb.getMany();
  }

  // 2. Full-Text Search Engine on PostgreSQL GIN Index
  async search(query: string) {
    if (!query || !query.trim()) {
      return this.findAll({});
    }

    const qb = this.productRepository.createQueryBuilder('product')
      .leftJoinAndSelect('product.images', 'image')
      .leftJoinAndSelect('product.variants', 'variant')
      .leftJoinAndSelect('variant.color', 'color')
      .leftJoinAndSelect('variant.size', 'size');

    // Format search keywords to support prefix matching (e.g. "Vin" matches "Vintas")
    // and sanitize inputs against full-text operators
    const formattedSearch = query
      .trim()
      .replace(/[&|!():*]/g, '')
      .split(/\s+/)
      .filter(Boolean)
      .map((word) => `${word}:*`)
      .join(' & ');

    if (!formattedSearch) {
      return this.findAll({});
    }

    // Perform high-speed index matching
    qb.andWhere(`product.search_vector @@ to_tsquery('simple', :search)`, {
      search: formattedSearch,
    });

    // Sort by relevance ranking using ts_rank_cd
    qb.orderBy(
      `ts_rank_cd(product.search_vector, to_tsquery('simple', :search))`,
      'DESC',
    );

    return qb.getMany();
  }

  // 3. Find specific Product details
  async findOne(id: string): Promise<Product> {
    const product = await this.productRepository.createQueryBuilder('product')
      .leftJoinAndSelect('product.images', 'image')
      .leftJoinAndSelect('product.variants', 'variant')
      .leftJoinAndSelect('variant.color', 'color')
      .leftJoinAndSelect('variant.size', 'size')
      .where('product.id = :id', { id })
      .getOne();

    if (!product) {
      throw new NotFoundException(`Product with ID '${id}' not found`);
    }

    return product;
  }

  // 4. Retrieve all colors (for frontend filter sidebar)
  async getColors(): Promise<Color[]> {
    return this.colorRepository.find({ order: { name: 'ASC' } });
  }

  // 5. Retrieve all sizes (for frontend filter sidebar)
  async getSizes(): Promise<Size[]> {
    return this.sizeRepository.find({ order: { value: 'ASC' } });
  }

  // 6. Admin Create Product
  async createProduct(data: {
    name: string;
    sku: string;
    description?: string;
    price: number;
    originalPrice?: number;
    style: ProductStyle;
    gender: ProductGender;
    isSale?: boolean;
    discountPercent?: number;
    variants: Array<{ colorId: number; sizeId: number; stock: number }>;
    images: Array<{ colorId?: number; url: string; isPrimary?: boolean }>;
  }): Promise<Product> {
    // 1. Create base product
    const product = this.productRepository.create({
      name: data.name,
      sku: data.sku,
      description: data.description,
      price: data.price,
      originalPrice: data.originalPrice,
      style: data.style,
      gender: data.gender,
      isSale: data.isSale || false,
      discountPercent: data.discountPercent || 0,
    });

    const savedProduct = await this.productRepository.save(product);

    // 2. Create variants
    if (data.variants && data.variants.length > 0) {
      const variants = data.variants.map((v) =>
        this.variantRepository.create({
          product: savedProduct,
          color: { id: v.colorId },
          size: { id: v.sizeId },
          stock: v.stock,
        }),
      );
      await this.variantRepository.save(variants);
    }

    // 3. Create images
    if (data.images && data.images.length > 0) {
      for (const img of data.images) {
        const imageEntity = new ProductImage();
        imageEntity.product = savedProduct;
        imageEntity.url = img.url;
        imageEntity.isPrimary = img.isPrimary || false;
        if (img.colorId) {
          imageEntity.color = { id: img.colorId } as Color;
        } else {
          imageEntity.color = null;
        }
        await this.imageRepository.save(imageEntity);
      }
    }

    return this.findOne(savedProduct.id);
  }

  // 7. Seed Database catalog
  async seed() {
    // Colors
    const defaultColors = [
      { name: 'Navy Peony/Gum', hexCode: '#223344' },
      { name: 'Black', hexCode: '#000000' },
      { name: 'Olive', hexCode: '#556B2F' },
      { name: 'White/Sunrise 50th', hexCode: '#FFA500' },
      { name: 'White/Corydalis 50th', hexCode: '#E6E6FA' },
      { name: 'Grey Pebble', hexCode: '#808080' },
      { name: 'Beige', hexCode: '#F5F5DC' },
      { name: 'Fossil', hexCode: '#A9A9A9' },
      { name: 'LL Morris White', hexCode: '#FFFFFF' },
      { name: 'Evergreen', hexCode: '#006400' },
    ];

    const colors: Color[] = [];
    for (const c of defaultColors) {
      let color = await this.colorRepository.findOne({ where: { name: c.name } });
      if (!color) {
        color = this.colorRepository.create(c);
        color = await this.colorRepository.save(color);
      }
      colors.push(color);
    }

    // Sizes
    const defaultSizes = ['35', '36', '37', '38', '39', '40', '41', '42', '43', '44', '45'];
    const sizes: Size[] = [];
    for (const val of defaultSizes) {
      let size = await this.sizeRepository.findOne({ where: { value: val } });
      if (!size) {
        size = this.sizeRepository.create({ value: val });
        size = await this.sizeRepository.save(size);
      }
      sizes.push(size);
    }

    // Clear existing order and product records to avoid foreign key violations
    await this.productRepository.query('TRUNCATE TABLE order_items, orders, product_variants, product_images, products CASCADE');

    // Products Data
    const productsData = [
      {
        name: 'Track 6 Utility Gum Sole - Low Top',
        sku: 'A6UT001',
        description: 'Dòng sản phẩm Track 6 với thiết kế lấy cảm hứng từ nhạc Jazz cổ điển, kết hợp đế Gum và mũ giày Canvas pha da lộn siêu bền bỉ.',
        price: 1090000,
        originalPrice: 1090000,
        style: ProductStyle.LOW_TOP,
        gender: ProductGender.UNISEX,
        isSale: false,
        discountPercent: 0,
        colorName: 'Navy Peony/Gum',
        imageUrl: '/images/1.jpg',
      },
      {
        name: 'Vintas Yesterday - High Top - Black',
        sku: 'AVT002',
        description: 'Đặc trưng hoài cổ với phối màu đen tuyền cổ điển của dòng Vintas. Thiết kế cổ cao cá tính bộc lộ rõ phong cách bụi bặm đường phố.',
        price: 1190000,
        originalPrice: 1190000,
        style: ProductStyle.HIGH_TOP,
        gender: ProductGender.MEN,
        isSale: false,
        discountPercent: 0,
        colorName: 'Black',
        imageUrl: '/images/12.jpg',
      },
      {
        name: 'Urbas Corluray - High Top - Beige',
        sku: 'AUB001',
        description: 'Sự sáng tạo đột phá từ chất liệu Corduroy (nhung tăm) mềm mại. Cổ cao phối màu Beige ngọt ngào tôn vinh nét năng động tinh tế.',
        price: 990000,
        originalPrice: 990000,
        style: ProductStyle.HIGH_TOP,
        gender: ProductGender.WOMEN,
        isSale: false,
        discountPercent: 0,
        colorName: 'Beige',
        imageUrl: '/images/17.jpg',
      },
      {
        name: 'Vintas Yesterday - Slip-on - Grey Pebble',
        sku: 'AVT003',
        description: 'Trải nghiệm xỏ chân tiện lợi nhanh chóng của dòng giày lười Slip-on. Màu xám Pebble nhã nhặn phối ghép canvas sớ lớn cao cấp.',
        price: 890000,
        originalPrice: 890000,
        style: ProductStyle.SLIP_ON,
        gender: ProductGender.UNISEX,
        isSale: false,
        discountPercent: 0,
        colorName: 'Grey Pebble',
        imageUrl: '/images/10.jpg',
      },
      {
        name: 'Track 6 Utility Gum Sole - Low Top - White/Sunrise',
        sku: 'A6UT002',
        description: 'Sự kết hợp giữa gam màu trắng tinh khôi và sắc cam bình minh nổi bật tạo điểm nhấn tươi mới trên từng bước chân.',
        price: 950000,
        originalPrice: 950000,
        style: ProductStyle.LOW_TOP,
        gender: ProductGender.UNISEX,
        isSale: false,
        discountPercent: 0,
        colorName: 'White/Sunrise 50th',
        imageUrl: '/images/14.jpg',
      },
      {
        name: 'Ananas x Doraemon 50 Years Pattas - Low Top',
        sku: 'ADR001',
        description: 'Phiên bản giới hạn kỷ niệm 50 năm chú mèo máy Doraemon. Độc đáo từ họa tiết cho tới lót giày êm ái màu xanh da trời.',
        price: 890000,
        originalPrice: 890000,
        style: ProductStyle.LOW_TOP,
        gender: ProductGender.UNISEX,
        isSale: false,
        discountPercent: 0,
        colorName: 'White/Corydalis 50th',
        imageUrl: '/images/15.jpg',
      },
      {
        name: 'Vintas Temperate - Low Top - Grey',
        sku: 'AVT001',
        description: 'Dòng sản phẩm Vintas mang hơi thở retro cổ điển thập niên 70. Thiết kế tối giản tinh tế thanh lịch với màu xám thanh lịch.',
        price: 1090000,
        originalPrice: 1090000,
        style: ProductStyle.LOW_TOP,
        gender: ProductGender.MEN,
        isSale: false,
        discountPercent: 0,
        colorName: 'Grey Pebble',
        imageUrl: '/images/3.jpg',
      },
      {
        name: 'Ananas Track 6 Suede Moonphase - Low Top - Grey Pebble',
        sku: 'A6SD001',
        description: 'Chất liệu da lộn Suede cao cấp mịn màng như nhung. Gam màu xám Pebble nhã nhặn cực kỳ tôn dáng chân.',
        price: 990000,
        originalPrice: 990000,
        style: ProductStyle.LOW_TOP,
        gender: ProductGender.UNISEX,
        isSale: false,
        discountPercent: 0,
        colorName: 'Grey Pebble',
        imageUrl: '/images/3.jpg',
      },
      {
        name: 'Ananas Track 6 Suede Moonphase - Low Top - Fossil',
        sku: 'A6SD002',
        description: 'Màu xám Fossil bụi bặm phong trần, chất da lộn cực ôm chân và thời thượng mang chất thời trang cao cấp.',
        price: 990000,
        originalPrice: 990000,
        style: ProductStyle.LOW_TOP,
        gender: ProductGender.UNISEX,
        isSale: false,
        discountPercent: 0,
        colorName: 'Fossil',
        imageUrl: '/images/11.jpg',
      },
      {
        name: 'Urbas Corluray - Low Top - Evergreen',
        sku: 'AUB002',
        description: 'Màu xanh lục Evergreen trẻ trung ngập tràn sức sống trên nền chất liệu nhung tăm ấm áp.',
        price: 920000,
        originalPrice: 920000,
        style: ProductStyle.LOW_TOP,
        gender: ProductGender.UNISEX,
        isSale: false,
        discountPercent: 0,
        colorName: 'Evergreen',
        imageUrl: '/images/13.jpg',
      },
      {
        name: 'Ananas x Lucky Luke Pattas - Low Top',
        sku: 'ALL001',
        description: 'Phiên bản collab độc quyền với chàng cao bồi Lucky Luke huyền thoại. Trẻ trung, bụi bặm, phá cách và tinh nghịch.',
        price: 801000,
        originalPrice: 890000,
        style: ProductStyle.LOW_TOP,
        gender: ProductGender.UNISEX,
        isSale: true,
        discountPercent: 10,
        colorName: 'LL Morris White',
        imageUrl: '/images/6.jpg',
      },
      {
        name: 'Track 6 Unnamed No.1 In C Minor - Low Top - Black',
        sku: 'A6UN001',
        description: 'Lấy cảm hứng từ bản giao hưởng cung Đô thứ của Beethoven, phối màu đen tuyền cá tính mang lại vẻ đẹp tối giản quyến rũ.',
        price: 1090000,
        originalPrice: 1090000,
        style: ProductStyle.LOW_TOP,
        gender: ProductGender.UNISEX,
        isSale: false,
        discountPercent: 0,
        colorName: 'Black',
        imageUrl: '/images/12.jpg',
      },
    ];

    for (const pData of productsData) {
      const { colorName, imageUrl, ...prod } = pData;
      const color = colors.find((c) => c.name === colorName) || colors[0];

      // Create product
      const product = this.productRepository.create(prod);
      const saved = await this.productRepository.save(product);

      // Create variants for all sizes
      const variants = sizes.map((size) =>
        this.variantRepository.create({
          product: saved,
          color,
          size,
          stock: Math.floor(Math.random() * 80) + 20, // 20 to 100 stock
        }),
      );
      await this.variantRepository.save(variants);

      // Create primary image
      const primaryImage = this.imageRepository.create({
        product: saved,
        color,
        url: imageUrl,
        isPrimary: true,
      });
      await this.imageRepository.save(primaryImage);

      // Create detailed images
      const detailImage = this.imageRepository.create({
        product: saved,
        color,
        url: imageUrl,
        isPrimary: false,
      });
      await this.imageRepository.save(detailImage);
    }

    return { message: 'Database seeded successfully!', count: productsData.length };
  }
}
