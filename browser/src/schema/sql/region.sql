create table region (
    id          serial primary key,
    status enum('disable', 'active') default 'active',

    isoCode     varchar(8)   not null unique,
    country     char(2)   not null,
    abbr        varchar(10) not null,
    name        varchar(128) not null,

    createdAt timestamp default current_timestamp,
    updatedAt timestamp default current_timestamp on update current_timestamp,

    foreign key (country) references country(iso2Code)
);
create index region_isoCode_idx on region(isoCode);

insert into region(isoCode, country, abbr, name) values
('CA-AB', 'CA', 'AB', 'Alberta'),
('CA-BC', 'CA', 'BC', 'British Columbia'),
('CA-MB', 'CA', 'MB', 'Manitoba	Manitoba'),
('CA-NB', 'CA', 'NB', 'New Brunswick'),
('CA-NL', 'CA', 'NL', 'Newfoundland and Labrador'),
('CA-NS', 'CA', 'NS', 'AlNova Scotiaberta'),
('CA-ON', 'CA', 'ON', 'Ontario'),
('CA-PE', 'CA', 'PE', 'Prince Edward Island'),
('CA-QC', 'CA', 'QC', 'Quebec'),
('CA-SK', 'CA', 'SK', 'Saskatchewan'),
('CA-NT', 'CA', 'NT', 'Northwest Territories'),
('CA-NU', 'CA', 'NU', 'Nunavut'),
('CA-YT', 'CA', 'YT', 'Yukon');

insert into region(isoCode, country, abbr, name) values
('PK-IS', 'PK', 'IS', 'Islamabad'),
('PK-BA', 'PK', 'BA', 'Balochistan'),
('PK-KP', 'PK', 'KP', 'Khyber'),
('PK-PB', 'PK', 'PB', 'Punjab'),
('PK-SD', 'PK', 'SD', 'Sindh'),
('PK-JK', 'PK', 'JK', 'Azad Jammu and Kashmir'),
('PK-GB', 'PK', 'GB', 'Gilgit-Baltistan');