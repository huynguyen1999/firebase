import { Inject, Injectable } from '@nestjs/common';
import { FirebaseOptions } from '../../interfaces';
import * as admin from 'firebase-admin';
import { FIREBASE_ADMIN_OPTIONS } from '../../constants';
import { getAuth } from 'firebase-admin/auth';

@Injectable()
export class FirebaseService {
  private readonly adminInstance: admin.app.App;
  private readonly db: admin.firestore.Firestore;
  private readonly auth: admin.auth.Auth;
  constructor(
    @Inject(FIREBASE_ADMIN_OPTIONS)
    private options: FirebaseOptions,
  ) {
    this.adminInstance = admin.initializeApp({
      credential: admin.credential.cert(this.options.credential),
    });
    this.db = this.adminInstance.firestore();
    this.auth = getAuth();
  }
  getAdmin() {
    return this.adminInstance;
  }

  getFirestore() {
    return this.db;
  }

  getAuth() {
    return this.auth;
  }
}
