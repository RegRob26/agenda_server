import { Injectable } from '@nestjs/common';
import { CreateContactDto } from './dto/create-contact.dto';
import { UpdateContactDto } from './dto/update-contact.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { Contact } from './entities/contact.entity';
import { DataSource, Repository } from 'typeorm';
import { PhonesService } from './phones/phones.service';
import { Phone } from './phones/entities/phone.entity';
import { validateOrReject } from 'class-validator';
import { plainToInstance } from 'class-transformer';
import { CreatePhoneDto } from './phones/dto/create-phone.dto';

@Injectable()
export class ContactService {
	constructor(
		@InjectRepository(Contact)
		private contactRepository: Repository<Contact>,
		private phoneService: PhonesService,
		private dataSource: DataSource
	) {}

	async create(createContactDto: CreateContactDto) {
		const { phones, emails, ...contactData } = createContactDto;
		//create a transaction
		const queryRunner = this.dataSource.createQueryRunner();
		await queryRunner.connect();
		await queryRunner.startTransaction();

		try {
			const contact = await queryRunner.manager.save(Contact, contactData);
			//save phones
			console.log();
			if (phones) {
				for (const phoneData of phones) {
					const phoneDataExt = {...phoneData, contact_id: contact.contact_id}
					const phoneDto = plainToInstance(CreatePhoneDto, phoneDataExt);
					await validateOrReject(phoneDto);
					const phone = await queryRunner.manager.save(Phone, phoneDto);
				}
			}
			//commit transaction
			await queryRunner.commitTransaction();
		} catch (error) {
			await queryRunner.rollbackTransaction();
			throw error
		} finally {
			await queryRunner.release();
		}
		return {message: 'Contacto creado con exito', statusCode: 201};
	}

	findAll() {
		return `This action returns all contact`;
	}

	findOne(id: number) {
		return `This action returns a #${id} contact`;
	}

	update(id: number, updateContactDto: UpdateContactDto) {
		return `This action updates a #${id} contact`;
	}

	remove(id: number) {
		return `This action removes a #${id} contact`;
	}
}
