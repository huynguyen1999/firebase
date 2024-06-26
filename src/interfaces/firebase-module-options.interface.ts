import { ModuleMetadata } from '@nestjs/common';
import * as admin from 'firebase-admin';
// firebase-admin.interface.ts
export interface FirebaseOptions {
  credential: admin.ServiceAccount;
}

export interface FirebaseAsyncModuleOptions
  extends Pick<ModuleMetadata, 'imports'> {
  inject?: any[];
  useFactory?: (...args: any[]) => Promise<FirebaseOptions> | FirebaseOptions;
}
