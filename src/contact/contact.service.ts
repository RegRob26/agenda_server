import { Injectable, NotFoundException, Query } from '@nestjs/common';
import { CreateContactDto } from './dto/create-contact.dto';
import { UpdateContactDto } from './dto/update-contact.dto';
import { Contact } from './entities/contact.entity';
import { DataSource, Repository } from 'typeorm';
import { Phone } from './phones/entities/phone.entity';
import { validateOrReject } from 'class-validator';
import { plainToInstance } from 'class-transformer';
import { CreatePhoneDto } from './phones/dto/create-phone.dto';
import { CreateEmailDto } from './emails/dto/create-email.dto';
import { Email } from './emails/entities/email.entity';
import { QueryParamsDto } from './dto/query-params.dto';
import { User } from '../users/entities/user.entity';
import { InjectRepository } from '@nestjs/typeorm';

@Injectable()
export class ContactService {
	constructor(
		private dataSource: DataSource,
		@InjectRepository(Contact)
		private contactRepository: Repository<Contact>,
	) {}

	async create(createContactDto: CreateContactDto) {
		const { phones, emails, ...contactData } = createContactDto;
		//create a transaction
		const queryRunner = this.dataSource.createQueryRunner();
		await queryRunner.connect();
		await queryRunner.startTransaction();
		console.log('dto: ', createContactDto);

		try {
			console.log('contactData: ', contactData);
			const contact = await queryRunner.manager.create(Contact, contactData);
			const contactSaved = await queryRunner.manager.insert(Contact, contact);
			//save phones
			if (phones) {
				for (const phoneData of phones) {
					console.log("Contact id: ", contact.contact_id);
					const phoneDataExt = {...phoneData, contact_id: contact.contact_id}
					const phoneDto = plainToInstance(CreatePhoneDto, phoneDataExt);
					await validateOrReject(phoneDto);
					const phone = await queryRunner.manager.save(Phone, phoneDto);
				}
			}
			if (emails) {
				//save emails
				for (const emailData of emails) {
					const emailDataExt = {...emailData, contact_id: contact.contact_id}
					const emailDto = plainToInstance(CreateEmailDto, emailDataExt);
					await validateOrReject(emailDto);
					const email = await queryRunner.manager.save(Email, emailDto);
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

	async findAll(query: QueryParamsDto) {
		const { user_id } = query;
		const contacts = await this.contactRepository.createQueryBuilder('contact')
			.leftJoinAndSelect('contact.phones', 'phone')
			.leftJoinAndSelect('contact.emails', 'email')
			.where('contact.user_id = :user_id', { user_id })
			.select()
			.orderBy('contact.first_name', 'ASC')
			.getMany();
		return contacts
	}

	findOne(id: number) {
		const contact = this.contactRepository.createQueryBuilder('contact')
			.leftJoinAndSelect('contact.phones', 'phone')
			.leftJoinAndSelect('contact.emails', 'email')
			.where('contact.contact_id = :id', { id })
			.select()
			.getOne();
		return contact;
	}

	async update(id: number, updateContactDto: UpdateContactDto) {
		try {
			console.log('dto: ', updateContactDto);
			//validate contact
			const dtp = await validateOrReject(updateContactDto);
			console.log('dtp: ', dtp);
			const contact = this.contactRepository.findOneBy({ contact_id: id });
			if (!contact) {
				throw new NotFoundException('Contacto no encontrado');
			}
			const queryRunner = this.dataSource.createQueryRunner();
			await queryRunner.connect();
			await queryRunner.startTransaction();
			const { phones, emails, ...contactData } = updateContactDto;
			try {
				await queryRunner.manager.update(Contact, id, contactData);
				if (phones) {
					for (const phoneData of phones) {
						const _phone = await queryRunner.manager.findOneBy(Phone, {phone_id: phoneData.phone_id});
						if (!_phone) {
							throw new NotFoundException('Telefono no encontrado');
						}
						const phoneDataExt = {...phoneData}
						const phoneDto = plainToInstance(CreatePhoneDto, phoneDataExt);
						console.log('phoneDto: ', phoneDto, Phone);
						await validateOrReject(phoneDto);
						const phone = await queryRunner.manager.save(Phone, phoneDto);
					}
				}
				if (emails) {
					for (const emailData of emails) {
						const emailDataExt = {...emailData, contact_id: id}
						const emailDto = plainToInstance(CreateEmailDto, emailDataExt);
						await validateOrReject(emailDto);
						const email = await queryRunner.manager.save(Email, emailDto);
					}
				}
				await queryRunner.commitTransaction();
			} catch (error) {
				await queryRunner.rollbackTransaction();
				throw error;
			} finally {
				await queryRunner.release();
			}

			await this.contactRepository.update(id, contactData);

			return { message: 'Contacto actualizado con exito', statusCode: 200 };
		} catch (e) {
			throw  e
		}

	}

	remove(id: number) {
		const contact = this.contactRepository.findOneBy({ contact_id: id });
		if (contact) {
			this.contactRepository.delete(id)
		}
		return { message: 'Contacto eliminado con exito', statusCode: 200 };
	}
}
