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

create table account (
    id serial primary key,
    status enum('active', 'await_verify', 'suspend', 'delete') default 'await_verify',
    type enum('interac', 'bank_account') not null,

    email varchar(255) null,
    isDefault boolean default false,

    ownerId int not null references user(id),

    createdAt timestamp default current_timestamp,
    updatedAt timestamp default current_timestamp on update current_timestamp
);

create table contact(
    id serial primary key,
    status enum('active', 'pending', 'invalid', 'delete') default 'pending',
    type enum('cash_pickup', 'bank_account') not null,

    firstName varchar(255) not null,
    middleName varchar(255),
    lastName varchar(255) not null,
    address1 varchar(255) not null,
    address2 varchar(255),
    province varchar(8) not null references region(isoCode),
    country varchar(4) not null references country(iso2Code),
    postCode varchar(64),
    phoneNumber varchar(64),
    dob date not null,

    ownerId int not null references user(id),
    relationshipToOwner varchar(64) not null references personal_relationship(type),

    createdAt timestamp default current_timestamp,
    updatedAt timestamp default current_timestamp on update current_timestamp
);

create table summary_transaction(
    id serial primary key,
    status enum('initial','waiting_for_payment', 'process', 'complete', 'rejected', 'refund_in_progress', 'cancel') default 'initial',

    sourceAccountId int not null references account(id),
    destinationContactId int not null references contact(id),

    sourceAmount INTEGER not null,
    sourceCurrency varchar(8) not null references currency(isoCode),

    destinationAmount INTEGER not null,
    destinationCurrency varchar(8) not null references currency(isoCode),

    fee Integer null,
    feeCurrency varchar(8) not null references currency(isoCode),

    debitAmount Integer not null,
    debitCurrency varchar(8) not null references currency(isoCode),

    errorMessage varchar(255) null,

    nbpReference varchar(100),
    ownerId int not null references user(id),
    transactionId int not null references transaction(id),

    createdAt timestamp default current_timestamp,
    updatedAt timestamp default current_timestamp on update current_timestamp

);

create table fee_detail(
    id serial primary key,
    type varchar(255) not null,
    
    description varchar(255) null,
    amount integer not null,
    currency varchar(8) not null references currency(isoCode),

    ownerId int not null references user(id),
    transactionId int not null references transaction(id),

    createdAt timestamp default current_timestamp,
    updatedAt timestamp default current_timestamp on update current_timestamp
);

create table transaction(
    id serial primary key,
    status enum('quote', 'confirmed') default 'quote',

    sourceAccountId int not null references account(id),
    destinationContactId int not null references contact(id),

    sourceAmount INTEGER not null,
    sourceCurrency varchar(8) not null references currency(isoCode),

    destinationAmount INTEGER not null,
    destinationCurrency varchar(8) not null references currency(isoCode),

    fromIp varchar(255) null,
    nbpReference varchar(255) null unique,

    #     Initial Status for all transaction
    ownerId int not null references user(id),
    curTransferId int null references transfer(id),

    quoteExpired datetime not null,

    createdAt timestamp default current_timestamp,
    updatedAt timestamp default current_timestamp on update current_timestamp
);

create table transfer(
    id serial primary key,
    status enum('start', 'wait', 'success', 'failed', 'retry', 'cancel') not null default 'start',

    name varchar(255) not null,
    retryAttempt int,

    ownerId int not null references user(id),
    transactionId int not null references transaction(id),
    preTransferId int null references transfer(id),
    nextTransferId int null references transfer(id),

    createdAt timestamp default current_timestamp,
    updatedAt timestamp default current_timestamp on update current_timestamp
);