create table personal_relationship(
    id serial primary key,
    status enum('disable', 'active') default 'active',

    type varchar(64) not null,
    description varchar(255) null,

    createdAt timestamp default current_timestamp,
    updatedAt timestamp default current_timestamp on update current_timestamp
);

insert into personal_relationship(type) values
('Father'),
('Mother'),
('Brother'),
('Sister'),
('Son'),
('Daughter'),
('Wife'),
('Grand Child'),
('Grand Parent'),
('Husband'),
('Cousin'),
('Father In Law'),
('Mother In Law'),
('Brother In Law'),
('Sister In Law'),
('Friend');