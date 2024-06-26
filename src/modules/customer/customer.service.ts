import { Injectable } from '@nestjs/common';
import { FirebaseService } from '../../lib/firebase/firebase.service';
import { GetCustomersDto } from './dtos';
import { COLLECTIONS } from '../../constants';
import { Customer } from '../../interfaces';

@Injectable()
export class CustomerService {
  constructor(private readonly firebaseService: FirebaseService) {}

  async getCustomers(data: GetCustomersDto) {
    let customerCollection: any = this.firebaseService
      .getFirestore()
      .collection(COLLECTIONS.CUSTOMERS);
    if (data.name) {
      customerCollection = customerCollection.where('name', '==', data.name);
    }
    if (data.phone_number) {
      customerCollection = customerCollection.where(
        'phone_number',
        '==',
        data.phone_number,
      );
    }

    const querySnapshot = await customerCollection.get();
    return querySnapshot.docs.map((doc) => ({
      ...doc.data(),
      id: doc.id,
    }));
  }

  async getCustomer(id: string) {
    const customerSnapshot = await this.firebaseService
      .getFirestore()
      .collection(COLLECTIONS.CUSTOMERS)
      .doc(id)
      .get();

    if (!customerSnapshot.exists) {
      throw new Error('Customer not found');
    }

    return customerSnapshot.data();
  }

  async createCustomer(data: Customer) {
    return await this.firebaseService
      .getFirestore()
      .collection(COLLECTIONS.CUSTOMERS)
      .add(data);
  }

  async updateCustomer(id: string, data: Partial<Customer>) {
    const customerSnapshot = await this.firebaseService
      .getFirestore()
      .collection(COLLECTIONS.CUSTOMERS)
      .doc(id)
      .get();

    if (!customerSnapshot.exists) {
      throw new Error('Customer not found');
    }

    return await this.firebaseService
      .getFirestore()
      .collection(COLLECTIONS.CUSTOMERS)
      .doc(id)
      .update(data);
  }

  async deleteCustomer(id: string) {
    const customerSnapshot = await this.firebaseService
      .getFirestore()
      .collection(COLLECTIONS.CUSTOMERS)
      .doc(id)
      .get();

    if (!customerSnapshot.exists) {
      throw new Error('Customer not found');
    }

    return await this.firebaseService
      .getFirestore()
      .collection(COLLECTIONS.CUSTOMERS)
      .doc(id)
      .delete();
  }
}
