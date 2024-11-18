import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Patch,
  Post,
  Query,
  UseGuards,
} from '@nestjs/common';
import { ApiBearerAuth, ApiTags } from '@nestjs/swagger';
import { CreateUserDto } from '../dtos/create-user.dto';
import { UsersService } from '../services/users.service';
import { Public } from 'src/modules/auth/decorators/public.decorator';
import { JwtAuthGuard } from 'src/modules/auth/guard/auth.guard';
import { QueryParams } from '@utils/';
import { User } from '../entities/user.entity';

@UseGuards(JwtAuthGuard)
@ApiBearerAuth()
@Controller('users')
@ApiTags('users')
export class UsersController {
  constructor(private userService: UsersService) {}

  @Public()
  @Post()
  create(@Body() createUserDto: CreateUserDto) {
    return this.userService.create(createUserDto);
  }

  @Get()
  findAll(@Query() params?:QueryParams<User>) {
    return this.userService.findAll(params);
  }

  @Get(':id')
 async findOne(@Param('id') id: string) {
    return await this.userService.findOneById(+id);
  }

  @Patch(':id')
  async update(@Param('id') id: string, @Body() updateUserDto: any) {
    return await this.userService.updateAfterPopulation(+id, updateUserDto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.userService.remove(+id);
  }
}
