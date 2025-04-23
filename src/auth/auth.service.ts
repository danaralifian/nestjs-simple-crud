import { BadRequestException, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';

import { User } from 'src/user/entities/user.entity';
import { Repository } from 'typeorm';
import { AuthDto } from './dto/auth.dto';
import { JwtService } from '@nestjs/jwt';
import * as bcrypt from 'bcrypt';
import { result } from 'src/utils/response-result';

@Injectable()
export class AuthService {
  constructor(
    @InjectRepository(User)
    private readonly userRepository: Repository<AuthDto>,
    private jwtService: JwtService,
  ) {}

  async validateUser(email: string, password: string): Promise<AuthDto> {
    const user = await this.userRepository.findOneBy({ email });
    if (!user) {
      throw new BadRequestException('User not found');
    }
    const isMatch: boolean = bcrypt.compareSync(password, user.password);
    if (!isMatch) {
      throw new BadRequestException('Password does not match');
    }
    return user;
  }

  async signUp(auth: AuthDto): Promise<IResult<AuthDto>> {
    const user: User = new User();
    const existingUser = await this.userRepository.findOneBy({
      email: auth.email,
    });
    if (existingUser) {
      throw new BadRequestException('email already exists');
    }

    const hashedPassword = bcrypt.hashSync(auth.password, 10);
    user.email = auth.email;
    user.username = auth.email.split('@')[0];
    user.password = hashedPassword;

    await this.userRepository.save(user);

    return this.signIn(auth);
  }

  async signIn(auth: AuthDto): Promise<IResult<AuthDto>> {
    const payload = { email: auth.email };

    return result({
      ...auth,
      accessToken: this.jwtService.sign(payload),
    });
  }
}
