import { DynamicModule, Global, Module } from '@nestjs/common';
import { FirebaseService } from './firebase.service';
import { FirebaseAsyncModuleOptions } from '../../interfaces';
import { FIREBASE_ADMIN_OPTIONS } from '../../constants';

@Global()
@Module({})
export class FirebaseModule {
  static forRootAsync(options: FirebaseAsyncModuleOptions): DynamicModule {
    return {
      module: FirebaseModule,
      imports: options.imports, // Ensure ConfigModule is globally available or imported here if used
      providers: [
        {
          provide: FIREBASE_ADMIN_OPTIONS,
          useFactory: options.useFactory,
          inject: options.inject,
        },
        FirebaseService,
      ],
      exports: [FirebaseService],
    };
  }
}
