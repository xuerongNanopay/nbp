create table country (
    id serial primary key,
    status enum('disable', 'active') default 'active',

    iso2Code char(2) not null unique,
    iso3Code char(3) not null unique,
    numCode char(3) not null unique,
    name varchar(128) not null,

    createdAt timestamp default current_timestamp,
    updatedAt timestamp default current_timestamp on update current_timestamp
);
create index country_iso2Code_idx on country(iso2Code);

insert into country(iso2Code, iso3Code, numCode, name) values
('CA', 'CAN', '124', 'Canada'),
('US', 'USA', '840', 'United States of America'),
('GB', 'GBR', '826', 'United Kingdom of Great Britain and Northern Ireland'),
('PK', 'PAK', '586', 'Pakistan');