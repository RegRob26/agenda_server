import { Column, Entity, JoinColumn, ManyToOne, PrimaryGeneratedColumn } from 'typeorm';
import { Contact } from '../../entities/contact.entity';

export enum ConstantsLabels {
	WORK = 'Work',
	PERSONAL = 'Personal',
	OTHER = 'Other'

}

@Entity('phones')
export class Phone {
	@PrimaryGeneratedColumn()
	phone_id: number;

	@Column()
	phone_number: string;

	@Column()
	contact_id: number;

	//maybe we can use label table instead of enum
	@Column({
		type: 'enum',
		enum: ConstantsLabels,
		default: ConstantsLabels.PERSONAL
	})
	phone_type: string;

	@Column({
		default: false
	})
	is_primary: boolean;

	@ManyToOne(() => Contact, contact => contact.phones, {
		onDelete: 'CASCADE',
		onUpdate: 'CASCADE'
	})
	@JoinColumn({ name: 'contact_id' })
	contact: Contact;
}
