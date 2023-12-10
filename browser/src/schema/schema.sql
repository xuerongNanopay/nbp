create table login(
    id serial primary key,
    ownerId int null references user(id),
    # login_type enum('email', 'username', 'sms') default 'email',

    # field for email login
    email varchar(255) unique not null,
    password varchar(255) not null,
    verifyCode varchar(8),
    verifyCodeAt timestamp null,
#     verifyCodeAt timestamp null,
    isEmailLoginVerified boolean default false,
    status enum('active', 'await_verify', 'suspend', 'delete') default 'await_verify',

    recoverToken varchar(255) null,
    recoverTokenExpireAt timestamp null,
    lastLoginAt timestamp null,
#     loginAttempts
#     lastLogin timestamp,

    createdAt timestamp default current_timestamp,
    updatedAt timestamp default current_timestamp on update current_timestamp
);

create table user(
    id serial primary key,
    status enum('active', 'await_verify', 'suspend', 'delete') default 'active',
    role enum('admin', 'nbp_client') default 'nbp_client',

    firstName varchar(255) not null,
    middleName varchar(255),
    lastName varchar(255) not null,
    dob date not null,
    address1 varchar(255),
    address2 varchar(255),
    province varchar(4) references region(isoCode),
    country varchar(4) references country(iso2Code),
    postCode varchar(16),
    phoneNumber varchar(32),

    pob varchar(4) references country(iso2Code),
    nationality varchar(4) references country(iso2Code),

    occupationId int references occupation(id),
    avatarUrl varchar(255),
#     primaryAddress int, # reference to userAddress.
#     primaryPhone int, # reference to userPhone

    createdAt timestamp default current_timestamp,
    updatedAt timestamp default current_timestamp on update current_timestamp
);

create table identification(
    id serial primary key,
    status enum('active', 'suspend', 'await_verify', 'delete') default 'active',
    type enum('password', 'driver_license', 'identification') not null,

    value varchar(64) not null,
    addition_info varchar(128) null,

    ownerId int not null references user(id),

    createdAt timestamp default current_timestamp,
    updatedAt timestamp default current_timestamp on update current_timestamp
);

create table personal_relationship(
    id serial primary key,
    status enum('disable', 'active') default 'active',

    type varchar(64) not null,
    description varchar(255) null,

    createdAt timestamp default current_timestamp,
    updatedAt timestamp default current_timestamp on update current_timestamp
);

create table occupation(
    id serial primary key,
    status enum('disable', 'active') default 'active',
    type varchar(64) not null,
    description varchar(255) null,
    
    createdAt timestamp default current_timestamp,
    updatedAt timestamp default current_timestamp on update current_timestamp
);

create table currency(
    id serial primary key,
    status enum('disable', 'active') default 'active',

    isoCode char(3) not null unique,
    numCode char(3) not null,
    "decimal" smallint not null default 2,
    name varchar(128) not null,

    createdAt timestamp default current_timestamp,
    updatedAt timestamp default current_timestamp on update current_timestamp
);
create index currency_isoCode_idx on currency(isoCode);

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

create table region (
    id          serial primary key,
    status enum('disable', 'active') default 'active',

    isoCode     varchar(8)   not null unique,
    country char(2)   not null references country(iso2Code),
    abbr        varchar(10) not null,
    name        varchar(128) not null,

    createdAt timestamp default current_timestamp,
    updatedAt timestamp default current_timestamp on update current_timestamp
);
create index region_isoCode_idx on region(isoCode);

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