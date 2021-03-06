import {
	FindConditions,
	getRepository,
	Repository
} from 'typeorm';
import {
	Get,
	JsonController,
	Param,
	Post,
	Body,
	Put,
	OnUndefined,
	Delete,
	QueryParams,
	OnNull,
	Authorized
} from 'routing-controllers';

import UserParams from '../web/UserParams';

import CreateUserService,
	{ CreateUserProps }
from '../services/CreateUserService';

import UpdateUserService, { UpdateUserProps } from '../services/UpdateUserService';

import { Page } from '../shared/Page';
import { User } from '../models/User';

@Authorized(['ADM'])
@JsonController('/users')
export class UsersController {
	
	repository: Repository<User> = getRepository(User);

	createUserService = new CreateUserService();
	updateUserService = new UpdateUserService();

	@Get()
	async index(@QueryParams() pageable: UserParams): Promise<Page<User>> {
		
		const where: FindConditions<User> = {};

		if (pageable.name) {
			where.name = pageable.name;
		}

		const options = pageable.paginate<User>({
			select: [
				"id",
				"name",
				"email"
			],
			relations: ["roles"],
			where,
		});
		const select = await this.repository.findAndCount(options);
		return new Page({ select, pageable });
	}

	@Get('/:id')
	@OnUndefined(404)
	async show(@Param('id') id: number) {
		return await this.repository.findOne({
			where: { id },
			select: [
				"id",
				"name",
				"email"
			],
			relations: ["roles"]
		});
	}

	@Post()
	async store(@Body() user: CreateUserProps) {
		return this.createUserService.create(user);
	}

	@Put('/:id')
	async update(
		@Param('id') id: number,
		@Body() user: UpdateUserProps
	) {		
		return this.updateUserService.update(id, user)
	}

	@Delete('/:id')
	@OnUndefined(200)
	@OnNull(404)
	async destroy(@Param('id') id: number): Promise<void> {

		const user = await this.repository.findOne({ where: { id } });

		if (!user) {
			return null
		}

		await this.repository.delete(user.id);
	}
}
