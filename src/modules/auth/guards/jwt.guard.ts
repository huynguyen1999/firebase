import { AuthGuard } from '@nestjs/passport';
import { ExecutionContext, Injectable } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { FirebaseService } from '../../../lib/firebase/firebase.service';
import { COLLECTIONS } from '../../../constants/collection.constant';
import { STATUS } from '../../../constants';
import { extractTokenFromHeader } from '../../../utils/process-data';

@Injectable()
export class JwtAuthGuard extends AuthGuard('jwt') {
  constructor(
    private jwtService: JwtService,
    private firebaseService: FirebaseService,
  ) {
    super();
  }

  async canActivate(context: ExecutionContext): Promise<boolean> {
    const request = context.switchToHttp().getRequest();
    const token = extractTokenFromHeader(request.headers['authorization']);

    if (!token) {
      return false;
    }

    const existedToken = await this.firebaseService
      .getFirestore()
      .collection(COLLECTIONS.ACCESS_TOKENS)
      .where('token', '==', token)
      .limit(1)
      .get();
    if (
      !existedToken.empty &&
      existedToken.docs[0].data().status !== STATUS.ACTIVE
    ) {
      return false;
    }

    return super.canActivate(context) as Promise<boolean>;
  }
}
