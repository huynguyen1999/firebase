import { Injectable } from '@nestjs/common';
import {
  LoginDto,
  ChangePasswordDto,
  RegisterDto,
  GoogleLoginDto,
} from './dtos';
import { UserService } from '../user/user.service';
import { JwtService } from '@nestjs/jwt';
import { User } from '../../interfaces';
import { STATUS, USER_ROLES } from '../../constants';
import { FirebaseService } from '../../lib/firebase/firebase.service';
import { COLLECTIONS } from '../../constants/collection.constant';
import { UserPayload } from '../../interfaces/user-payload.interface';

@Injectable()
export class AuthService {
  constructor(
    private userService: UserService,
    private jwtService: JwtService,
    private firebaseService: FirebaseService,
  ) {}
  async validateUser(data: LoginDto) {
    const { email, password } = data;
    const user = await this.userService.getUserByEmail(email);
    if (!user) {
      throw new Error('Email not found');
    }
    if (user.password !== password) {
      throw new Error('Password is incorrect');
    }
    return user;
  }

  async register(data: RegisterDto) {
    const result = await this.userService.createUser({
      ...data,
      role: data.role ?? USER_ROLES.EMPLOYEE,
    });
    return result;
  }

  async login(data: LoginDto) {
    const user = await this.validateUser(data);
    const payload: UserPayload = {
      email: user.email,
    };
    const accessToken = this.jwtService.sign(payload);
    await this.firebaseService
      .getFirestore()
      .collection(COLLECTIONS.ACCESS_TOKENS)
      .add({
        token: accessToken,
        email: user.email,
        status: STATUS.ACTIVE,
      });
    return { token: accessToken };
  }

  async googleLogin(data: GoogleLoginDto) {
    // Verify ID Token from GoogleAuthProvider login
    const googleUser = await this.firebaseService
      .getAuth()
      .verifyIdToken(data.id_token);

    if (!googleUser?.uid) {
      throw new Error('User not found');
    }
    // Verify if the user has existed in firebase authentication service
    const existedUser = await this.firebaseService
      .getAuth()
      .getUser(googleUser.uid);

    if (!existedUser) {
      throw new Error('User not found');
    }

    // Verify if the user has existed in our database
    const dbUser = await this.firebaseService
      .getFirestore()
      .collection(COLLECTIONS.USERS)
      .where('google_uid', '==', existedUser.uid)
      .where('email', '==', existedUser.email)
      .get();

    // If user not found in our database, create new user
    if (dbUser.empty) {
      // Create new user
      await this.userService.createUser({
        email: existedUser.email,
        name: existedUser.displayName,
        google_uid: existedUser.uid,
        role: USER_ROLES.EMPLOYEE,
      } as User);
    }

    // Create access token
    const payload: UserPayload = {
      email: existedUser.email,
    };
    const accessToken = this.jwtService.sign(payload);
    return { token: accessToken };
  }

  async changePassword(data: ChangePasswordDto, reqUser: Partial<User>) {
    const { current_password, new_password, confirm_password } = data;
    if (new_password !== confirm_password) {
      throw new Error('Password not match');
    }
    if (current_password === new_password) {
      throw new Error('New password must be different from old password');
    }

    const user = await this.userService.getUserByEmail(reqUser.email);

    if (user.password !== current_password) {
      throw new Error('Old password is incorrect');
    }
    user.password = new_password;

    await this.userService.updateUser(user);
    delete user.password;
    return { user };
  }

  async logout(token: string) {
    const tokenSnapshot = await this.firebaseService
      .getFirestore()
      .collection(COLLECTIONS.ACCESS_TOKENS)
      .where('token', '==', token)
      .get();

    if (!tokenSnapshot.empty && tokenSnapshot.docs[0]?.id) {
      await this.firebaseService
        .getFirestore()
        .collection(COLLECTIONS.ACCESS_TOKENS)
        .doc(tokenSnapshot.docs[0].id)
        .update({ status: STATUS.BLOCKED });
    }
  }

  async getProfile(user: Partial<User>) {
    return this.userService.getUser(user.id);
  }
}
