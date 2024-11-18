import { BaseEntity } from '@utils/';
import { Column, Entity, ManyToOne, OneToMany } from 'typeorm';
import { Menu } from './menu.entity';
import { Company } from 'src/modules/company/entities/company.entity';

@Entity()
export class Category extends BaseEntity {
  @Column({
    type: 'varchar',
  })
  categoryName: string;

  @Column({
    type: 'varchar',
    nullable: true,
  })
  icon: string;

  @Column({
    type: 'varchar',
    nullable: true,
  })
  color: string;

  @OneToMany(() => Menu, (menuitems) => menuitems.category)
  menus: Menu[];

  @ManyToOne(()=>Company, company => company.categories)
  company:Company
}
 
