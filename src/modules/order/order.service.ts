import { Injectable } from '@nestjs/common';
import { FirebaseService } from '../../lib/firebase/firebase.service';
import { CreateOrderDto, GetOrdersDto, UpdateOrderDto } from './dtos';
import { COLLECTIONS, ORDER_STATUS, USER_ROLES } from '../../constants';
import { Order } from '../../interfaces';

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
    // Needs complex indexing
    // if (data.quantity?.from) {
    //   orderCollection = orderCollection.where(
    //     'quantity',
    //     '>=',
    //     data.quantity.from,
    //   );
    // }
    // if (data.quantity?.to) {
    //   orderCollection = orderCollection.where(
    //     'quantity',
    //     '<=',
    //     data.quantity.to,
    //   );
    // }
    // if (data.order_date?.from) {
    //   orderCollection = orderCollection.where(
    //     'order_date',
    //     '>=',
    //     data.order_date.from,
    //   );
    // }
    // if (data.order_date?.to) {
    //   orderCollection = orderCollection.where(
    //     'order_date',
    //     '<=',
    //     data.order_date.to,
    //   );
    // }
    // if (data.total_amount?.from) {
    //   orderCollection = orderCollection.where(
    //     'total_amount',
    //     '>=',
    //     data.total_amount.from,
    //   );
    // }
    // if (data.total_amount?.to) {
    //   orderCollection = orderCollection.where(
    //     'total_amount',
    //     '<=',
    //     data.total_amount.to,
    //   );
    // }

    const querySnapshot = await orderCollection.get();

    if (querySnapshot.empty) {
      return [];
    }

    const joinedData = [];

    const promises = [];
    for (const doc of querySnapshot.docs) {
      const data = { ...doc.data(), id: doc.id };

      const productRef = this.firebaseService
        .getFirestore()
        .collection(COLLECTIONS.PRODUCTS)
        .doc(data.product_id);
      const customerRef = this.firebaseService
        .getFirestore()
        .collection(COLLECTIONS.CUSTOMERS)
        .doc(data.customer_id);
      const userRef = this.firebaseService
        .getFirestore()
        .collection(COLLECTIONS.USERS)
        .doc(data.employee_id);
      promises.push(
        productRef.get().then((snapshot) => {
          data['product'] = snapshot?.data() ?? null;
        }),
      );
      promises.push(
        customerRef.get().then((snapshot) => {
          data['customer'] = snapshot?.data() ?? null;
        }),
      );
      promises.push(
        userRef.get().then((snapshot) => {
          const employeeData = {
            ...snapshot?.data(),
            password: undefined,
          };
          data['employee'] = snapshot?.exists ? employeeData : null;
        }),
      );

      joinedData.push(data);
    }

    await Promise.all(promises);

    return joinedData.sort((a, b) => b.order_date - a.order_date);
  }

  async getOrder(id: string) {
    const orderSnapshot = await this.firebaseService
      .getFirestore()
      .collection(COLLECTIONS.ORDERS)
      .doc(id)
      .get();

    if (!orderSnapshot.exists) {
      throw new Error('Order not found');
    }

    const [productSnapshot, customerSnapshot, employeeSnapshot] =
      await Promise.all([
        this.firebaseService
          .getFirestore()
          .collection(COLLECTIONS.PRODUCTS)
          .doc(orderSnapshot.data().product_id)
          .get(),
        this.firebaseService
          .getFirestore()
          .collection(COLLECTIONS.CUSTOMERS)
          .doc(orderSnapshot.data().customer_id)
          .get(),
        this.firebaseService
          .getFirestore()
          .collection(COLLECTIONS.USERS)
          .doc(orderSnapshot.data().employee_id)
          .get(),
      ]);

    return {
      ...orderSnapshot.data(),
      product: productSnapshot.data(),
      customer: customerSnapshot.data(),
      employee: {
        ...employeeSnapshot.data(),
        password: undefined,
      },
    };
  }

  async createOrder(data: CreateOrderDto) {
    const [productSnapshot, customerSnapshot, employeeSnapshot] =
      await Promise.all([
        this.firebaseService
          .getFirestore()
          .collection(COLLECTIONS.PRODUCTS)
          .doc(data.product_id)
          .get(),
        this.firebaseService
          .getFirestore()
          .collection(COLLECTIONS.CUSTOMERS)
          .doc(data.customer_id)
          .get(),
        this.firebaseService
          .getFirestore()
          .collection(COLLECTIONS.USERS)
          .doc(data.employee_id)
          .get(),
      ]);

    if (!productSnapshot.exists) {
      throw new Error('Product not found');
    }

    if (!customerSnapshot.exists) {
      throw new Error('Customer not found');
    }

    if (!employeeSnapshot.exists) {
      throw new Error('Employee not found');
    }

    const orderData: Order = {
      ...data,
      total_amount: productSnapshot.data().price * data.quantity,
      status: ORDER_STATUS.PENDING,
      order_date: Date.now(),
    };

    return await this.firebaseService
      .getFirestore()
      .collection(COLLECTIONS.ORDERS)
      .add(orderData);
  }

  async updateOrder(id: string, data: UpdateOrderDto) {
    const orderSnapshot = await this.firebaseService
      .getFirestore()
      .collection(COLLECTIONS.ORDERS)
      .doc(id)
      .get();

    if (!orderSnapshot.exists) {
      throw new Error('Order not found');
    }
    const currentProductSnapshot = await this.firebaseService
      .getFirestore()
      .collection(COLLECTIONS.PRODUCTS)
      .doc(orderSnapshot.data().product_id)
      .get();

    const orderUpdateData = { ...data };
    const [newProductSnapshot, newCustomerSnapshot, newEmployeeSnapshot] =
      await Promise.all([
        data.product_id
          ? this.firebaseService
              .getFirestore()
              .collection(COLLECTIONS.PRODUCTS)
              .doc(data.product_id)
              .get()
          : null,
        data.customer_id
          ? this.firebaseService
              .getFirestore()
              .collection(COLLECTIONS.CUSTOMERS)
              .doc(data.customer_id)
              .get()
          : null,
        data.employee_id
          ? this.firebaseService
              .getFirestore()
              .collection(COLLECTIONS.USERS)
              .doc(data.employee_id)
              .get()
          : null,
      ]);
    if (data.product_id && !newProductSnapshot.exists) {
      throw new Error('Product not found');
    }

    if (data.customer_id && !newCustomerSnapshot.exists) {
      throw new Error('Customer not found');
    }
    if (
      data.employee_id &&
      (!newEmployeeSnapshot.exists ||
        (newEmployeeSnapshot.exists &&
          newEmployeeSnapshot.data().role !== USER_ROLES.EMPLOYEE))
    ) {
      throw new Error('Employee not found');
    }

    if (newProductSnapshot) {
      orderUpdateData['total_amount'] =
        newProductSnapshot.data().price *
        (data.quantity ?? orderSnapshot.data().quantity);
    } else {
      orderUpdateData['total_amount'] =
        currentProductSnapshot.data().price *
        (data.quantity ?? orderSnapshot.data().quantity);
    }

    return await this.firebaseService
      .getFirestore()
      .collection(COLLECTIONS.ORDERS)
      .doc(id)
      .update(orderUpdateData);
  }

  async deleteOrder(id: string) {
    return await this.firebaseService
      .getFirestore()
      .collection(COLLECTIONS.ORDERS)
      .doc(id)
      .delete();
  }
}
