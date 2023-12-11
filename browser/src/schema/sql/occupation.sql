create table occupation(
    id serial primary key,
    status enum('disable', 'active') default 'active',

    type varchar(64) not null,
    description varchar(255) null,

    createdAt timestamp default current_timestamp,
    updatedAt timestamp default current_timestamp on update current_timestamp
);

insert into occupation(type) values
('Accounting and Finance'),
('Agriculture'),
('Arts, Media and Entertainment'),
('Customer Service'),
('Engineering'),
('Environmental'),
('Financial Services'),
('Healthcare Services and Wellness'),
('Hospitality and Food Service'),
('Human Resource and Recruitment'),
('Insurance'),
('Legal'),
('Manufacturing'),
('Marketing'),
('Operations'),
('Project Management and Business Analysis'),
('Retail In-Store'),
('Retiree'),
('Sales and Business Development'),
('Science and Research'),
('Security and Surveillance'),
('Skilled Trades and Labor'),
('Student'),
('Supply Chain and Logistics'),
('Technology and Digital Media'),
('Training and Education'),
('Unemployed'),
('Other');