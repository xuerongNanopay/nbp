# login table
create table login(
    id serial primary key,
    # login_type enum('email', 'username', 'sms') default 'email',

    # field for email login
    email varchar(255) unique not null,
    password varchar(255) not null,
    verifyCode varchar(16),
    isEmailLoginVerified boolean default false,
    status enum('active', 'disable', 'unVerified') default 'unVerified',

    ownId int null references user(id),
    lastUse timestamp,

    createAt timestamp default current_timestamp,
    updateAt timestamp default current_timestamp on update current_timestamp
);

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
    province varchar(8) references region(isoCode),
    country varchar(4) references country(isoCode),
    postCode varchar(64),
    phoneNumber varchar(64),
    pob varchar(4) references country(isoCode),
    nationality varchar(4) references country(isoCode),

#     occupation: string,
#     identityType: string,
#     identityNumber: string

    avatarUrl varchar(255),
#     primaryAddress int, # reference to userAddress.
#     primaryPhone int, # reference to userPhone
    status enum('active', 'suspend', 'delete') default 'active',

    createAt timestamp default current_timestamp,
    updateAt timestamp default current_timestamp on update current_timestamp
);

create table account (
    id serial primary key,
    ownerId int not null references user(id),

    type enum('interac', 'bankAccount') not null,
    bankId int not null references institution(id),
    accountNo varchar(100),
    branchNo varchar(100),
    Iban varchar(100),
    interacEmail varchar(255),
    isDefault boolean default false,

    status enum('active', 'pending', 'invalid', 'delete') default 'active',
    createAt timestamp default current_timestamp,
    updateAt timestamp default current_timestamp on update current_timestamp
);


create table contact(
    id serial primary key,
    ownerId int not null references user(id),

    type enum('cashPickup', 'bankAccount') not null,
    firstName varchar(255) not null,
    middleName varchar(255),
    lastName varchar(255) not null,
    dob date not null,
    address1 varchar(255),
    address2 varchar(255),
    province varchar(8) references region(isoCode),
    country varchar(4) references country(isoCode),
    postCode varchar(64),
    phoneNumber varchar(64),
    relationshipToOwner int not null references personRelationship(id),

    status enum('active', 'pending', 'invalid', 'delete') default 'pending',

    createAt timestamp default current_timestamp,
    updateAt timestamp default current_timestamp on update current_timestamp
);

create table feeDetail(
    id serial primary key,
    ownerId int not null references user(id),
    transactionId int not null references transaction(id),

    name varchar(255) not null,
    amount integer not null,
    currency varchar(8) not null references currency(isoCode),

    createAt timestamp default current_timestamp,
    updateAt timestamp default current_timestamp on update current_timestamp
);

# SummaryTransaction only contain info that need for frontEnd
create table summaryTransaction(
    id serial primary key,
    ownerId int not null references user(id),
    transactionId int references transaction(id),

    errorMessage varchar(255) null,
    sourceAccount int not null references account(id),
    destinationAccount int not null references contact(id),
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

    createAt timestamp default current_timestamp,
    updateAt timestamp default current_timestamp on update current_timestamp

);

# Let Application code control status and step.
# Transaction contain info that transfer needs.
create table transaction(
    id serial primary key,
    ownerId int not null references user(id),

    fromIp varchar(255) null,
    sourceAccount int not null references account(id),
    destinationAccount int not null references contact(id),
    sourceAmount INTEGER not null,
    destinationAmount INTEGER not null,
    sourceCurrency varchar(8) not null references currency(isoCode),
    destinationCurrency varchar(8) not null references currency(isoCode),

    #     Initial Status for all transaction
    transferState int not null references transferState(id),

    createAt timestamp default current_timestamp,
    updateAt timestamp default current_timestamp on update current_timestamp
);


create table transferState(
    id serial primary key,
    ownerId int not null references user(id),
    transactionId int not null references transaction(id),
    name varchar(255) not null,

    previousState int null references transferState(id),
    retryAttempt int,
    transferStatus enum('initial', 'processing', 'pending', 'complete', 'rejected', 'retry', 'cancel') not null default 'initial',

    createAt timestamp default current_timestamp,
    updateAt timestamp default current_timestamp on update current_timestamp
);

create table transferLog(
    id serial primary key,
    ownerId int not null references user(id),
    stateId int not null references transferState(id),
    preState  int null references transferState(id),

    transferStatus enum('initial', 'processing', 'pending', 'complete', 'rejected', 'retry', 'cancel') not null,
    severity enum('info', 'warming', 'error', 'debug') not null default 'info',

    subject varchar(255) not null,
    description TEXT,

    createAt timestamp default current_timestamp,
    updateAt timestamp default current_timestamp on update current_timestamp
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

    createAt timestamp default current_timestamp,
    updateAt timestamp default current_timestamp on update current_timestamp
);

create table notification(
    id serial primary key,
    ownerId int not null references user(id),
    level enum('info', 'warming', 'error') default 'info',
    subject varchar(250) null,
    content varchar(250) null,
    status enum('read', 'unread') default 'unread',
    createAt timestamp default current_timestamp,
    updateAt timestamp default current_timestamp on update current_timestamp
);

create table currency(
    id serial primary key,
    isoCode varchar(8) not null unique,
    "decimal" smallint not null default 2,
    name varchar(40) not null,
    status enum('disable', 'enable') default 'enable',

    createAt timestamp default current_timestamp,
    updateAt timestamp default current_timestamp on update current_timestamp
);
create index currency._isoCode_idx on currency(isoCode);

create table country (
    id serial primary key,
    isoCode varchar(4) not null unique,
    name varchar(100) not null,
    status enum('disable', 'enable') default 'enable',

    createAt timestamp default current_timestamp,
    updateAt timestamp default current_timestamp on update current_timestamp
);

create index country_isoCode_idx on country(isoCode);

create table region (
    id          serial primary key,
    isoCode     varchar(8)   not null unique,
    countryCode varchar(4)   not null references country(isoCode),
    abbreviation varchar(10) not null,
    name        varchar(100) not null,
    status enum('disable', 'enable') default 'enable',
    createAt timestamp default current_timestamp,
    updateAt timestamp default current_timestamp on update current_timestamp
);
create index region_isoCode_idx on region(isoCode);

create table institution (
    id serial primary key,
    countryCode varchar(4)  not null references country(isoCode),
    abbreviation varchar(10) null,
    name varchar(100) not null,
    institutionNumber varchar(50),
    status enum('disable', 'enable') default 'enable',
    createAt timestamp default current_timestamp,
    updateAt timestamp default current_timestamp on update current_timestamp
);

create table occupation(
    id serial primary key,
    name varchar(255) not null,
    status enum('disable', 'enable') default 'enable',
    createAt timestamp default current_timestamp,
    updateAt timestamp default current_timestamp on update current_timestamp
);

create table apiLog (
    id serial primary key,
    ownerId int not null references user(id),
    transferId int references transferState(id),
    provider varchar(255) not null,
    name varchar(255) not null,
    requestPayload TEXT null,
    responsePayload TEXT null,
    httpStatus varchar(10) null,
    errorMessage TEXT null,
    createAt timestamp default current_timestamp,
    updateAt timestamp default current_timestamp on update current_timestamp
);

create table personRelationship(
    id serial primary key,
    name varchar(255) not null,
    description varchar(255) not null,
    status enum('disable', 'enable') default 'enable',
    createAt timestamp default current_timestamp,
    updateAt timestamp default current_timestamp on update current_timestamp
);