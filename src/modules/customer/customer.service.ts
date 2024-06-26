import { Injectable } from '@nestjs/common';
import { FirebaseService } from '../../lib/firebase/firebase.service';
import { GetCustomersDto } from './dtos';
import { COLLECTIONS } from '../../constants';

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
}
