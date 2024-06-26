import { Injectable } from '@nestjs/common';
import { FirebaseService } from '../../lib/firebase/firebase.service';
import { COLLECTIONS } from '../../constants';
import { GetProductsDto } from './dtos';

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
    if (data.stock_quantity?.from) {
      productCollection = productCollection.where(
        'stock_quantity',
        '>=',
        data.stock_quantity.from,
      );
    }
    if (data.stock_quantity?.to) {
      productCollection = productCollection.where(
        'stock_quantity',
        '<=',
        data.stock_quantity.to,
      );
    }
    if (data.price?.from) {
      productCollection = productCollection.where(
        'price',
        '>=',
        data.price.from,
      );
    }
    if (data.price?.to) {
      productCollection = productCollection.where('price', '<=', data.price.to);
    }

    const querySnapshot = await productCollection.get();
    return querySnapshot.docs.map((doc) => ({
      ...doc.data(),
      id: doc.id,
    }));
  }
}
