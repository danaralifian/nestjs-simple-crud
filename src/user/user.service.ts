import { Injectable } from '@nestjs/common';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { User } from './entities/user.entity';
import { Repository, UpdateResult } from 'typeorm';
import { calculatePagination } from 'src/utils/calculate-pagination';

import { plainToInstance } from 'class-transformer';
import { result } from 'src/utils/response-result';

@Injectable()
export class UserService {
  /**
   * Here, we have used data mapper approch for this tutorial that is why we
   * injecting repository here. Another approch can be Active records.
   */
  constructor(
    @InjectRepository(User) private readonly userRepository: Repository<User>,
  ) {}

  /**
   * this is function is used to create User in User Entity.
   * @param createUserDto this will type of createUserDto in which
   * we have defined what are the keys we are expecting from body
   * @returns promise of user
   */
  async create(createUserDto: CreateUserDto): Promise<IResult<User>> {
    const user: User = new User();
    user.email = createUserDto.email;
    user.username = createUserDto.username;
    user.password = createUserDto.password;
    const createdUser = await this.userRepository.save(user);
    return result(createdUser);
  }

  /**
   * this function is used to get all the user's list
   * @returns promise of array of users
   */
  async findAll(
    page: number = 1,
    limit: number = 10,
  ): Promise<IResult<CreateUserDto[]>> {
    const skip = (page - 1) * limit; //offset

    const [users, total] = await this.userRepository.findAndCount({
      take: limit,
      skip,
    });
    const pagination = calculatePagination(total, page, limit);

    return result(
      plainToInstance(CreateUserDto, users, {
        excludeExtraneousValues: true,
      }),
      pagination,
    );
  }

  async findOne(id: number): Promise<IResult<User | null>> {
    const user = await this.userRepository.findOneBy({ id });
    return result(user);
  }

  /**
   * this function is used to updated specific user whose id is passed in
   * parameter along with passed updated data
   * @param id is type of number, which represent the id of user.
   * @param updateUserDto this is partial type of createUserDto.
   * @returns promise of udpate user
   */
  async update(
    id: number,
    updateUserDto: UpdateUserDto,
  ): Promise<IResult<UpdateResult>> {
    const user: User = new User();
    user.email = updateUserDto.email;
    user.username = updateUserDto.username;
    user.password = updateUserDto.password;
    const updatedUser = await this.userRepository.update(id, user);
    return result(updatedUser);
  }

  /**
   * this function is used to remove or delete user from database.
   * @param id is the type of number, which represent id of user
   * @returns nuber of rows deleted or affected
   */
  async remove(id: number): Promise<IResult<{ affected?: number | null }>> {
    const deletedUser = await this.userRepository.delete(id);

    if (deletedUser.affected === 0) {
      return result({ affected: 0, message: 'User not found' });
    }
    return result({ affected: deletedUser.affected });
  }
}
