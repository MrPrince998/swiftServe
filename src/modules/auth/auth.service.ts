import { Injectable, UnauthorizedException } from '@nestjs/common';
import { CreateAuthDto } from './dto/create-auth.dto';
import * as bcrypt from 'bcrypt';
import { Repository } from 'typeorm';
import { InjectRepository } from '@nestjs/typeorm';
import { User } from '@modules/user/entities/user.entity';
import { JwtService } from '@nestjs/jwt';
import { userRole } from '@interfaces/user.interface';
import { AuthDto } from './dto/auth-dto';

@Injectable()
export class AuthService {
  constructor(
    @InjectRepository(User)
    private userRepo: Repository<User>,
    private jwtService: JwtService,
  ) {}

  async register(createAuthDto: CreateAuthDto) {
    const { email, password, role } = createAuthDto;
    const hashedPassword = await bcrypt.hash(password, 10);
    const user = this.userRepo.create({
      email,
      password: hashedPassword,
      role: role as userRole,
    });
    await this.userRepo.save(user);
    return { message: 'User registered successfully' };
  }

  async login(authDto: AuthDto) {
    const { email, password } = authDto;

    const user = await this.userRepo.findOne({ where: { email } });

    if (!user) {
      throw new UnauthorizedException();
    }

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) throw new UnauthorizedException();

    const payload = { sub: user.id, email: user.email };

    const accessToken = await this.jwtService.sign(payload);
    return { accessToken };
  }
}
