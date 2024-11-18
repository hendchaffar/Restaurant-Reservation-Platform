import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Patch,
  Post,
  Put,
  Query,
  UseGuards,
} from '@nestjs/common';
import { ReservationService } from '../services/reservation.service';
import { QueryParams } from '@utils/';
import { Reservation } from '../entities/reservation.entity';
import { JwtAuthGuard } from 'src/modules/auth/guard/auth.guard';
import { ApiBearerAuth } from '@nestjs/swagger';
@UseGuards(JwtAuthGuard)
@ApiBearerAuth()
@Controller('reservations')
export class ReservationController {
  constructor(private reservationService: ReservationService) {}


  @Post()
  create(@Body() dto: any) {
    return this.reservationService.saveAfterPopulation(dto);
  }

  @Get()
  findAll(@Query() params?:QueryParams<Reservation>) {
    return this.reservationService.findAll(params);
  }

  @Get('reservationperuser/:id')
  getMyReservation(@Param('id') id: string) {
    return this.reservationService.findreservationsperuser(+id)
  }
  @Get('getreservationbycompany/:id')
  findOne(@Param('id') id: string) {
    return this.reservationService.findreservationsPerCompany(+id);
  }

  @Patch(':id')
  update(@Param('id') id: string, @Body() updateUserDto: any) {
    return this.reservationService.updateAfterPopulation(+id, updateUserDto);
  }

  @Delete(':idReservation/:idUser')
  remove(@Param('idReservation') idReservation: number,@Param('idUser') idUser: number) {
    return this.reservationService.deleteReservation(+idReservation,+idUser);
  }

  @Put('changeStatus/:id')
  changeStatus(@Param('id') id: string,@Body() dto:any) {
    return this.reservationService.changeStatus(+id,dto);
  }
}
