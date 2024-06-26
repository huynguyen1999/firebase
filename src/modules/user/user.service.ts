import { Injectable } from '@nestjs/common';
import { GetUsersDto } from './dtos';
import { FirebaseService } from '../../lib/firebase/firebase.service';
import { User } from '../../interfaces';
import { COLLECTIONS } from '../../constants/collection.constant';

@Injectable()
export class UserService {
  constructor(private firebaseService: FirebaseService) {}

  async getUsers(data: GetUsersDto) {
    let userCollection: any = this.firebaseService
      .getFirestore()
      .collection(COLLECTIONS.USERS);
    if (data.email) {
      userCollection = userCollection.where('email', '==', data.email);
    }
    if (data.phone_number) {
      userCollection = userCollection.where(
        'phone_number',
        '==',
        data.phone_number,
      );
    }
    if (data.name) {
      userCollection = userCollection.where('name', '==', data.name);
    }
    if (data.role) {
      userCollection = userCollection.where('role', '==', data.role);
    }
    const querySnapshot = await userCollection.get();
    return querySnapshot.docs.map((doc) => ({
      ...doc.data(),
      id: doc.id,
      password: undefined,
    }));
  }

  async getUser(id: string) {
    const userSnapshot = await this.firebaseService
      .getFirestore()
      .collection(COLLECTIONS.USERS)
      .doc(id)
      .get();

    if (!userSnapshot.exists) {
      throw new Error('User not found');
    }

    return {
      ...userSnapshot.data(),
      password: undefined,
    };
  }

  async getUserByEmail(email: string) {
    const querySnapshot = await this.firebaseService
      .getFirestore()
      .collection(COLLECTIONS.USERS)
      .where('email', '==', email)
      .limit(1)
      .get();

    if (querySnapshot.empty) {
      return null;
    }

    return {
      ...querySnapshot.docs[0].data(),
      id: querySnapshot.docs[0].id,
    } as User;
  }

  async createUser(data: User) {
    const existedUser = await this.getUserByEmail(data.email);

    if (existedUser) {
      throw new Error('Email has already been used.');
    }

    return this.firebaseService
      .getFirestore()
      .collection(COLLECTIONS.USERS)
      .add(data);
  }

  async updateUser(data: Partial<User>) {
    const { id, ...restData } = data;

    const userSnapshot = await this.firebaseService
      .getFirestore()
      .collection(COLLECTIONS.USERS)
      .doc(id)
      .get();

    if (!userSnapshot.exists) {
      throw new Error('User not found');
    }

    return this.firebaseService
      .getFirestore()
      .collection(COLLECTIONS.USERS)
      .doc(id)
      .update(restData);
  }

  async deleteUser(id: string) {
    const userSnapshot = await this.firebaseService
      .getFirestore()
      .collection(COLLECTIONS.USERS)
      .doc(id)
      .get();

    if (!userSnapshot.exists) {
      throw new Error('User not found');
    }

    return await this.firebaseService
      .getFirestore()
      .collection(COLLECTIONS.USERS)
      .doc(id)
      .delete();
  }
}
