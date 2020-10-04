import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, FindOneOptions, FindManyOptions, UpdateResult } from 'typeorm';
import { Delivery } from './Delivery.entity';
import { Courier } from '../user/courier.entity';
import { debug } from 'console';

@Injectable()
export class DeliveryService {
    constructor(
        @InjectRepository(Delivery)
        private readonly deliveryRepository: Repository<Delivery>
      ){}
    
      async create(data: Partial<Delivery>): Promise<Delivery> {
        return this.deliveryRepository.save(new Delivery(data));
      }

      async findOne(where: FindOneOptions<Delivery>): Promise<Delivery> {
        const delivery = await this.deliveryRepository.findOne(where);
    
        return delivery;
      }

      async assign(sender , deliveryId: string, courierId: string): Promise<number> {
        const courierDeliveries = await this.deliveryRepository.find({where:{courier: courierId}});
        let affected = 0;
        if(courierDeliveries.length > 5) return affected;

        const delivery = await this.deliveryRepository.findOne({where:{id: deliveryId, sender}});
        if(delivery){
          const courier = new Courier({id: +courierId} as Partial<Courier>);
          const update = await this.deliveryRepository.update(deliveryId, {courier});
          affected = update?.affected;
        }
        return affected;
      }

      async find(where: FindManyOptions<Delivery>): Promise<Delivery[]> {
        return await this.deliveryRepository.find(where);
      }

      public async findAll(): Promise<Delivery[]> {
        return await this.deliveryRepository.find();
      }

      public async revenue(courier: Courier, from: string, to: string, page: string): Promise<any>{
        const { sum } = await this.deliveryRepository
        .createQueryBuilder("delivery")
        .select("SUM(delivery.cost)", "sum")
        .where("delivery.courier = :courier and delivery.date between :from and :to", { courier: courier.id, from, to })
        .getRawOne();
        return sum;
      }
}
