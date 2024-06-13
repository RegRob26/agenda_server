import { Column, Entity, JoinColumn, ManyToOne, PrimaryGeneratedColumn } from 'typeorm';
import { Contact } from '../../entities/contact.entity';
import { ConstantsLabels } from '../../phones/entities/phone.entity';

@Entity('emails')
export class Email {
	@PrimaryGeneratedColumn()
	email_id: number;

	@Column()
	contact_id: number;

	@Column()
	email: string;

	//maybe we can use label table instead of enum
	@Column({
		type: 'enum',
		enum: ConstantsLabels,
		default: ConstantsLabels.PERSONAL
	})
	email_type: string;

	@Column({
		default: false
	})
	is_primary: boolean;

	@ManyToOne(() => Contact, contact => contact.contact_id, {
		onDelete: 'CASCADE',
		onUpdate: 'CASCADE'
	})
	@JoinColumn({ name: 'contact_id' })
	contact: Contact;
}
