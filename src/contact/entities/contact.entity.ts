import { Column, Entity, JoinColumn, ManyToOne, OneToMany, PrimaryGeneratedColumn } from 'typeorm';
import { User } from '../../users/entities/user.entity';
import { Phone } from '../phones/entities/phone.entity';
import { Email } from '../emails/entities/email.entity';

@Entity('Contacts')
export class Contact {
  @PrimaryGeneratedColumn()
  contact_id: number;

  @Column()
  user_id: number;

  @Column({
    default: ''
  })
  image_link: string;

  @Column()
  first_name: string;

  @Column({
    nullable: true
  })
  middle_name: string;

  @Column()
  last_name: string;

  @Column({
    nullable: true
  })
  second_last_name: string;

  @Column({
    default: false
  })
  is_favorite: boolean;

  @ManyToOne(() => User, user => user.user_id, {
    onDelete: 'CASCADE',
    onUpdate: 'CASCADE'
  })
  @JoinColumn({ name: 'user_id' })
  user: User;

  @OneToMany(() => Phone, (phone) => phone.contact)
  phones: Phone[];

  @OneToMany(() => Email, (email) => email.contact)
  emails: Email[];


}
