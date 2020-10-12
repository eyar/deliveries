import { Request, Body, Response, Controller, Post, UseGuards, HttpStatus, SetMetadata, Get } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { MoreThan } from 'typeorm';
import { AssignDto } from './assign.dto';
import { AddDeliveryDto } from './addDelivery.dto';
import { DeliveryService } from './delivery.service';
import { RolesGuard } from '../guards/roles.guard';
import { debug } from 'console';
const take = 5;

@Controller('delivery')
export class DeliveryController {
    
    constructor(
        private readonly deliveryService: DeliveryService,
    ) {}
    
    @Post('/add')
    @UseGuards(AuthGuard('jwt'), RolesGuard)
    @SetMetadata('roles', ['Sender'])
    public async create(@Request() {user}, @Body() addDelivery: AddDeliveryDto, @Response() res) {
        const delivery = {...addDelivery, sender: user};
        try{
            await this.deliveryService.create(delivery);
        } catch(err){
            res.send(err);
        }
        res.send('delivery successfully added');
    }

    @Get('/get')
    @UseGuards(AuthGuard('jwt'), RolesGuard)
    public async getSenderDeliveries(@Request() {user, query:{page, date}}, @Response() res) {
        page = page > 0 ? page-1 : 0;
        const id = {}; 
        id[user.userType.toLowerCase()] = user;
        date = date ? {date: MoreThan(date.split('T')[0])} : {};
        const skip = page ? {skip: page*take} : {};
        const deliveries = await this.deliveryService.find({where:{...id, ...date }, ...skip, take});
        res.json(deliveries);
    }

    @Post('/assign')
    @UseGuards(AuthGuard('jwt'), RolesGuard)
    @SetMetadata('roles', ['Sender'])
    public async assign(@Request() {user}, @Body() assign: AssignDto, @Response() res){
        const {deliveryId, courierId} = assign;
        const affected = await this.deliveryService.assign(user, deliveryId, courierId);
        const respone = affected ? 'delivery successfully assigned' : 'delivery assign failed';
        res.json(respone);
    }

    @Get('/revenue')
    @UseGuards(AuthGuard('jwt'), RolesGuard)
    @SetMetadata('roles', ['Courier'])
    public async revenue(@Request() {user, query:{from, to}}, @Response() res){
        if(to && !this.isIsoDate(to) || from && !this.isIsoDate(from) ) res.status(HttpStatus.BAD_REQUEST).send('bad date range');
        to = to ? to : new Date().toISOString();
        from = from ? from : new Date(0);
        if(from && from > to || new Date().toISOString() < to) res.status(HttpStatus.BAD_REQUEST).send('bad date range');
        const sum = await this.deliveryService.revenue(user, from, to);
        res.send(sum);
    }

    private isIsoDate(str: string): boolean {
        if (!/\d{4}-\d{2}-\d{2}T\d{2}:\d{2}:\d{2}.\d{3}Z/.test(str)) return false;
        var d = new Date(str); 
        return d.toISOString()===str;
    }
}
