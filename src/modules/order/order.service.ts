import { Injectable } from '@nestjs/common';
import { FirebaseService } from '../../lib/firebase/firebase.service';
import { GetOrdersDto } from './dtos';
import { COLLECTIONS } from '../../constants';

@Injectable()
export class OrderService {
  constructor(private readonly firebaseService: FirebaseService) {}
  async getOrders(data: GetOrdersDto) {
    let orderCollection: any = this.firebaseService
      .getFirestore()
      .collection(COLLECTIONS.ORDERS);

    if (data.employee_id) {
      orderCollection = orderCollection.where(
        'employee_id',
        '==',
        data.employee_id,
      );
    }
    if (data.status) {
      orderCollection = orderCollection.where('status', '==', data.status);
    }
    if (data.customer_id) {
      orderCollection = orderCollection.where(
        'customer_id',
        '==',
        data.customer_id,
      );
    }
    if (data.product_id) {
      orderCollection = orderCollection.where(
        'product_id',
        '==',
        data.product_id,
      );
    }
    if (data.quantity?.from) {
      orderCollection = orderCollection.where(
        'quantity',
        '>=',
        data.quantity.from,
      );
    }
    if (data.quantity?.to) {
      orderCollection = orderCollection.where(
        'quantity',
        '<=',
        data.quantity.to,
      );
    }
    if (data.order_date?.from) {
      orderCollection = orderCollection.where(
        'order_date',
        '>=',
        data.order_date.from,
      );
    }
    if (data.order_date?.to) {
      orderCollection = orderCollection.where(
        'order_date',
        '<=',
        data.order_date.to,
      );
    }
    if (data.total_amount?.from) {
      orderCollection = orderCollection.where(
        'total_amount',
        '>=',
        data.total_amount.from,
      );
    }
    if (data.total_amount?.to) {
      orderCollection = orderCollection.where(
        'total_amount',
        '<=',
        data.total_amount.to,
      );
    }

    const querySnapshot = await orderCollection.get();
    return querySnapshot.docs
      .map((doc) => ({
        ...doc.data(),
        id: doc.id,
      }))
      .sort((a, b) => b.order_date - a.order_date);
  }
}
