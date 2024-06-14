import {
    Entity,
    PrimaryGeneratedColumn,
    Column,
} from 'typeorm';

@Entity('users')
export class User {
    @PrimaryGeneratedColumn()
    user_id: number;

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
          unique: true
      })
    email: string;

    @Column()
    password: string;

    @Column()
    phone: string;
}
