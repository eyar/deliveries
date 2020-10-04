import { Request, Body, Response, Controller, Post, UseGuards, HttpStatus, SetMetadata, Get } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { User, UserType } from '../user/user.entity';
import { DeliveryService } from './delivery.service';
import { RolesGuard } from '../guards/roles.guard';
import { debug } from 'console';
import { MoreThan, Between } from 'typeorm';
const take = 5;

@Controller('delivery')
export class DeliveryController {
    
    constructor(
        private readonly deliveryService: DeliveryService,
    ) {}
    
    @Post('/')
    @UseGuards(AuthGuard('jwt'), RolesGuard)
    @SetMetadata('roles', ['Sender'])
    public async create(@Request() {user}, @Body() {packageSize, cost, description}, @Response() res) {
        const delivery = {packageSize, cost, description, sender: user};
        try{
            await this.deliveryService.create(delivery);
        } catch(err){
            res.send(err);
        }
        res.send(delivery);
    }

    @Get('/')
    @UseGuards(AuthGuard('jwt'), RolesGuard)
    @SetMetadata('roles', ['Sender'])
    public async getSenderDeliveries(@Request() {user, query:{page, date}}, @Response() res) {
        page = page > 0 ? page-1 : 0;
        const deliveries = await this.deliveryService.find({where:{sender: user, date: MoreThan(date.split('T')[0])}, skip: page*take, take});
        res.json(deliveries);
    }

    @Get('/')
    @UseGuards(AuthGuard('jwt'), RolesGuard)
    @SetMetadata('roles', ['Courier'])
    public async getCourierDeliveries(@Request() {user, query:{page, date}}, @Response() res) {
        page = page > 0 ? page-1 : 0;
        const deliveries = await this.deliveryService.find({where:{sender: user, date: MoreThan(date.split('T')[0])}, skip: page*take, take});
        res.json(deliveries);
    }

    @Post('/assign')
    @UseGuards(AuthGuard('jwt'), RolesGuard)
    @SetMetadata('roles', ['Sender'])
    public async assign(@Request() {user}, @Body() {deliveryId, courierId}, @Response() res){
        const affected = await this.deliveryService.assign(user, deliveryId, courierId);
        const respone = affected ? 'delivery successfully assigned' : 'delivery assign failed';
        res.json(respone);
    }

    @Get('/revenue')
    @UseGuards(AuthGuard('jwt'), RolesGuard)
    @SetMetadata('roles', ['Courier'])
    public async revenue(@Request() {user, query:{from, to}}, @Response() res){
        if(from > to || new Date().toISOString() < to) res.status(HttpStatus.BAD_REQUEST).send('bad date range');
        const sum = await this.deliveryService.revenue(user, from, to);
        res.send(sum);
    }
}
