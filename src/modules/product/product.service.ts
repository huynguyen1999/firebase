import { Injectable } from '@nestjs/common';
import { FirebaseService } from '../../lib/firebase/firebase.service';
import { COLLECTIONS } from '../../constants';
import { GetProductsDto, UpdateProductDto } from './dtos';
import { Product } from '../../interfaces';

@Injectable()
export class ProductService {
  constructor(private readonly firebaseService: FirebaseService) {}

  async getProducts(data: GetProductsDto) {
    let productCollection: any = this.firebaseService
      .getFirestore()
      .collection(COLLECTIONS.PRODUCTS);

    if (data.name) {
      productCollection = productCollection.where('name', '==', data.name);
    }
    if (data.description) {
      productCollection = productCollection.where(
        'description',
        '==',
        data.description,
      );
    }
    // Needs complex indexing
    // if (data.stock_quantity?.from) {
    //   productCollection = productCollection.where(
    //     'stock_quantity',
    //     '>=',
    //     data.stock_quantity.from,
    //   );
    // }
    // if (data.stock_quantity?.to) {
    //   productCollection = productCollection.where(
    //     'stock_quantity',
    //     '<=',
    //     data.stock_quantity.to,
    //   );
    // }
    // if (data.price?.from) {
    //   productCollection = productCollection.where(
    //     'price',
    //     '>=',
    //     data.price.from,
    //   );
    // }
    // if (data.price?.to) {
    //   productCollection = productCollection.where('price', '<=', data.price.to);
    // }

    const querySnapshot = await productCollection.get();
    return querySnapshot.docs.map((doc) => ({
      ...doc.data(),
      id: doc.id,
    }));
  }

  async getProduct(id: string) {
    const productSnapshot = await this.firebaseService
      .getFirestore()
      .collection(COLLECTIONS.PRODUCTS)
      .doc(id)
      .get();

    if (!productSnapshot.exists) {
      throw new Error('Product not found');
    }

    return productSnapshot.data();
  }

  async createProduct(data: Product) {
    return await this.firebaseService
      .getFirestore()
      .collection(COLLECTIONS.PRODUCTS)
      .add(data);
  }

  async updateProduct(id: string, data: UpdateProductDto) {
    const productSnapshot = await this.firebaseService
      .getFirestore()
      .collection(COLLECTIONS.PRODUCTS)
      .doc(id)
      .get();

    if (!productSnapshot.exists) {
      throw new Error('Product not found');
    }

    return await this.firebaseService
      .getFirestore()
      .collection(COLLECTIONS.PRODUCTS)
      .doc(id)
      .update({ ...data });
  }

  async deleteProduct(id: string) {
    const productSnapshot = await this.firebaseService
      .getFirestore()
      .collection(COLLECTIONS.PRODUCTS)
      .doc(id)
      .get();

    if (!productSnapshot.exists) {
      throw new Error('Product not found');
    }

    return await this.firebaseService
      .getFirestore()
      .collection(COLLECTIONS.PRODUCTS)
      .doc(id)
      .delete();
  }
}
