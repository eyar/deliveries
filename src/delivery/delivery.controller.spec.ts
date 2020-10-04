import { Test, TestingModule } from '@nestjs/testing';
import { build, fake, perBuild, sequence } from '@jackfranklin/test-data-bot';
import { mock } from 'jest-mock-extended';
import { Repository } from 'typeorm';
import { getRepositoryToken } from '@nestjs/typeorm';
import { DeliveryController } from './delivery.controller';
import { Delivery } from './delivery.entity';
import { Sender } from '../user/sender.entity';
import { Courier } from '../user/courier.entity';
import { UserService } from '../user/user.service';
import { DeliveryService } from './delivery.service';
import { User } from '../user/user.entity';


const userBuilder = build<Partial<Sender>>({
  fields: {
    email: fake(f => f.internet.exampleEmail()),
    password: fake(f => f.internet.password()),
  },
  postBuild: u => new Sender(u),
});
const deliveryBuilder = build<Partial<Delivery>>({
  fields: {
    packageSize: fake(f => f.lorem.sentence()),
    cost: fake(f => f.random.boolean()),
    sender: userBuilder(),
    description: perBuild(() => new Date()),
  },
  postBuild: t => Object.assign(new Delivery(), t),
});

describe('DeliveryController', () => {
  let controller: DeliveryController;
  const repositoryMock = mock<Repository<Sender>>();

  beforeEach(async () => {
    repositoryMock.save.mockImplementation((entity: any) =>
      Promise.resolve(userBuilder({ overrides: entity }) as Sender),
    );

    const module: TestingModule = await Test.createTestingModule({
      controllers: [DeliveryController],
      providers: [
        UserService,
        DeliveryService,
        {
          provide: getRepositoryToken(Sender),
          useValue: repositoryMock,
        },
        {
          provide: getRepositoryToken(Courier),
          useValue: repositoryMock,
        },
        {
          provide: getRepositoryToken(User),
          useValue: repositoryMock,
        },
        {
          provide: getRepositoryToken(Delivery),
          useValue: repositoryMock,
        },
      ],
    }).compile();

    controller = module.get<DeliveryController>(DeliveryController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
