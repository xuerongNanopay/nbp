create table institution (
    id serial primary key,
    status enum('disable', 'active') default 'active',
    
    country varchar(4)  not null references country(iso2Code),
    abbr varchar(10) null,
    name varchar(100) not null,
    institutionNum varchar(50),

    createdAt timestamp default current_timestamp,
    updatedAt timestamp default current_timestamp on update current_timestamp
);

insert into institution(country, abbr, name) values
('PK', 'ABL', 'ALLIED BANK LIMITED'),
('PK', 'AJK', 'AZAD JAMMU KASHMIR BANK');