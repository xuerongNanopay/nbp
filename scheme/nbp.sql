# login table
create table login(
    id serial primary key,
    ownId int null references user(id),
    # login_type enum('email', 'username', 'sms') default 'email',

    # field for email login
    email varchar(255) unique not null,
    password varchar(255) not null,
    verifyCode varchar(8),
#     verifyCodeAt timestamp null,
    isEmailLoginVerified boolean default false,
    status enum('active', 'disable', 'pending', 'delete') default 'pending',

    retrieveToken varchar(255) null,
    retrieveTokenExpireAt timestamp null,
    lastLoginAt timestamp null,
#     loginAttempts
#     lastLogin timestamp,

    createdAt timestamp default current_timestamp,
    updatedAt timestamp default current_timestamp on update current_timestamp
);
alter table login change column retrieveTokenExpire retrieveTokenExpireAt timestamp null;
alter table login change column lastLogin lastLoginAt timestamp null;
alter table login change column createAt createdAt timestamp default current_timestamp;
alter table login change column updateAt updatedAt timestamp default current_timestamp on update current_timestamp;

# user one to one with login
create table user(
    id serial primary key,
#     user_type enum('admin', 'general') not null,

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
    status enum('active', 'suspend', 'delete') default 'active',

    createdAt timestamp default current_timestamp,
    updatedAt timestamp default current_timestamp on update current_timestamp
);

create table account (
    id serial primary key,
    ownerId int not null references user(id),

    type enum('interac', 'bankAccount') not null,
#     bankId int not null references institution(id),
#     accountNo varchar(100) null,
#     branchNo varchar(100) null,
#     Iban varchar(100) null,
    interacEmail varchar(255) null,
    isDefault boolean default false,

    status enum('active', 'pending', 'disable', 'invalid', 'delete') default 'active',
    createdAt timestamp default current_timestamp,
    updatedAt timestamp default current_timestamp on update current_timestamp
);


create table contact(
    id serial primary key,
    ownerId int not null references user(id),

    type enum('cashPickup', 'bankAccount') not null,
    firstName varchar(255) not null,
    middleName varchar(255),
    lastName varchar(255) not null,
    dob date not null,
    address1 varchar(255) not null,
    address2 varchar(255),
    province varchar(8) not null references region(isoCode),
    country varchar(4) not null references country(iso2Code),
    postCode varchar(64),
    phoneNumber varchar(64),
    relationshipToOwner varchar(64) not null references personal_relationship(type),

    status enum('active', 'pending', 'invalid', 'delete') default 'pending',

    createdAt timestamp default current_timestamp,
    updatedAt timestamp default current_timestamp on update current_timestamp
);

create table fee_detail(
    id serial primary key,
    ownerId int not null references user(id),
    transactionId int not null references transaction(id),

    type varchar(255) not null,
    amount integer not null,
    currency varchar(8) not null references currency(isoCode),

    createdAt timestamp default current_timestamp,
    updatedAt timestamp default current_timestamp on update current_timestamp
);

# SummaryTransaction only contain info that need for frontEnd
create table summary_transaction(
    id serial primary key,
    ownerId int not null references user(id),
    transactionId int not null references transaction(id),

    errorMessage varchar(255) null,
    senderName varchar(255) null,
    sourceAccountId int not null references account(id),
    sourceAccountSummary varchar(255) null,
    receiverName varchar(255) null,
    destinationContactId int not null references contact(id),
    destinationContactSummary varchar(255) null,
    sourceAmount INTEGER not null,
    destinationAmount INTEGER not null,
    sourceCurrency varchar(8) not null references currency(isoCode),
    destinationCurrency varchar(8) not null references currency(isoCode),
    fee Integer null,
    feeCurrency varchar(8) not null references currency(isoCode),
    debitAmount Integer not null,
    debitCurrency varchar(8) not null references currency(isoCode),
    nbpReference varchar(100),

    # intial process success failed pending cancel.
    status enum('initial','waitingForPayment', 'process', 'complete', 'failed', 'refundInProgress', 'cancel') default 'initial',

    createdAt timestamp default current_timestamp,
    updatedAt timestamp default current_timestamp on update current_timestamp

);

# Let Application code control status and step.
# Transaction contain info that transfer needs.
create table transaction(
    id serial primary key,
    ownerId int not null references user(id),

    fromIp varchar(255) null,
    sourceAccountId int not null references account(id),
    destinationContactId int not null references contact(id),
    sourceAmount INTEGER not null,
    destinationAmount INTEGER not null,
    sourceCurrency varchar(8) not null references currency(isoCode),
    destinationCurrency varchar(8) not null references currency(isoCode),

    #     Initial Status for all transaction
    curTransferId int not null references transfer(id),

    createdAt timestamp default current_timestamp,
    updatedAt timestamp default current_timestamp on update current_timestamp
);


create table transfer(
    id serial primary key,
    ownerId int not null references user(id),
    transactionId int not null references transaction(id),
    name varchar(255) not null,

    preTransferId int null references transfer(id),
    retryAttempt int,
    status enum('initial', 'processing', 'pending', 'complete', 'rejected', 'retry', 'cancel') not null default 'initial',

    createdAt timestamp default current_timestamp,
    updatedAt timestamp default current_timestamp on update current_timestamp
);

create table transferLog(
    id serial primary key,
    ownerId int not null references user(id),
    stateId int not null references transfer(id),
    preState  int null references transfer(id),

    transferStatus enum('initial', 'processing', 'pending', 'complete', 'rejected', 'retry', 'cancel') not null,
    severity enum('info', 'warming', 'error', 'debug') not null default 'info',

    subject varchar(255) not null,
    description TEXT,

    createdAt timestamp default current_timestamp,
    updatedAt timestamp default current_timestamp on update current_timestamp
);

create table quote(
    id serial primary key,
    transactionId int references transaction(id),

    sourceAccount int not null references account(id),
    destinationAccount int not null references contact(id),
    sourceAmount INTEGER not null,
    destinationAmount INTEGER not null,
    sourceCurrency varchar(8) not null references currency(isoCode),
    destinationCurrency varchar(8) not null references currency(isoCode),

    expired timestamp,

    createdAt timestamp default current_timestamp,
    updatedAt timestamp default current_timestamp on update current_timestamp
);

create table notification(
    id serial primary key,
    ownerId int not null references user(id),
    level enum('info', 'warming', 'error', 'debug') default 'info',
    subject varchar(250) null,
    content varchar(250) null,
    status enum('read', 'unread') default 'unread',
    createdAt timestamp default current_timestamp,
    updatedAt timestamp default current_timestamp on update current_timestamp
);

create table identification(
    id serial primary key,
    ownerId int not null references user(id),
    type varchar(32) not null,
    num varchar(32) not null,

    status enum('disable', 'active') default 'active',

    createdAt timestamp default current_timestamp,
    updatedAt timestamp default current_timestamp on update current_timestamp
);

create table currency(
    id serial primary key,
    isoCode char(3) not null unique,
    numCode char(3) not null,
    "decimal" smallint not null default 2,
    name varchar(128) not null,
    status enum('disable', 'active') default 'active',

    createdAt timestamp default current_timestamp,
    updatedAt timestamp default current_timestamp on update current_timestamp
);
create index currency_isoCode_idx on currency(isoCode);

create table country (
    id serial primary key,
    iso2Code char(2) not null unique,
    iso3Code char(3) not null unique,
    numCode char(3) not null unique,
    name varchar(128) not null,
    status enum('disable', 'active') default 'active',

    createdAt timestamp default current_timestamp,
    updatedAt timestamp default current_timestamp on update current_timestamp
);

create index country_iso2Code_idx on country(iso2Code);

create table region (
    id          serial primary key,
    isoCode     varchar(8)   not null unique,
    country char(2)   not null references country(iso2Code),
    abbr        varchar(10) not null,
    name        varchar(128) not null,
    status enum('disable', 'active') default 'active',
    createdAt timestamp default current_timestamp,
    updatedAt timestamp default current_timestamp on update current_timestamp
);
create index region_isoCode_idx on region(isoCode);

create table institution (
    id serial primary key,
    country varchar(4)  not null references country(iso2Code),
    abbr varchar(10) null,
    name varchar(100) not null,
    institutionNum varchar(50),
    status enum('disable', 'active') default 'active',
    createdAt timestamp default current_timestamp,
    updatedAt timestamp default current_timestamp on update current_timestamp
);

create table occupation(
    id serial primary key,
    type varchar(64) not null,
    description varchar(255) null,
    status enum('disable', 'active') default 'active',
    createdAt timestamp default current_timestamp,
    updatedAt timestamp default current_timestamp on update current_timestamp
);

create table api_log (
    id serial primary key,
    ownerId int not null references user(id),
    transferId int null references transfer(id),
    externalReference varchar(255) null,
    provider varchar(255) not null,
    apiName varchar(255) not null,
    requestPayload TEXT null,
    responsePayload TEXT null,
    httpResponseCode int null,
    errorMessage TEXT null,
    createdAt timestamp default current_timestamp,
    updatedAt timestamp default current_timestamp on update current_timestamp
);

create table personal_relationship(
    id serial primary key,
    type varchar(64) not null,
    description varchar(255) null,
    status enum('disable', 'active') default 'active',
    createdAt timestamp default current_timestamp,
    updatedAt timestamp default current_timestamp on update current_timestamp
);