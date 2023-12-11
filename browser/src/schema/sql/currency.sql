create table currency(
    id serial primary key,
    status enum('disable', 'active') default 'active',

    isoCode char(3) not null unique,
    numCode char(3) not null,
    `decimal` int not null default 2,
    name varchar(128) not null,

    createdAt timestamp default current_timestamp,
    updatedAt timestamp default current_timestamp on update current_timestamp
);
create index currency_isoCode_idx on currency(isoCode);

insert into currency(isoCode, numCode, name) values
('CAD', '124', 'Canadian dollar'),
('PKR', '586', 'Pakistani rupee'),
('USD', '840', 'United States dollar');