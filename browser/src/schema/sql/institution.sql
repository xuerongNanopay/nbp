create table institution (
    id serial primary key,
    status enum('disable', 'active') default 'active',

    country varchar(4) not null,
    abbr varchar(10) null,
    name varchar(100) not null,
    institutionNum varchar(50) null,

    createdAt timestamp default current_timestamp,
    updatedAt timestamp default current_timestamp on update current_timestamp,

    foreign key (country) references country(iso2Code)
);

insert into institution(country, abbr, name) values
('PK', 'ABL', 'ALLIED BANK LIMITED'),
('PK', 'AJK', 'AZAD JAMMU KASHMIR BANK');