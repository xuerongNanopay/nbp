create table login(
    id serial primary key,
    ownerId bigint unsigned unique null,
    # login_type enum('email', 'username', 'sms') default 'email',

    # field for email login
    email varchar(255) unique not null,
    password varchar(255) not null,
    verifyCode varchar(8) null,
    verifyCodeAt timestamp null,
    status enum('active', 'await_verify', 'suspend', 'delete') default 'await_verify',
#     suspendType enum('none', 'max_passwd_attempts', 'max_recover_attempts', 'business') null,

#     passwd_attempts int default 0,
#     recover_attempts int default 0,
    recoverToken varchar(255) null,
    recoverTokenExpireAt timestamp null,
    lastLoginAt timestamp null,
#     loginAttempts
#     lastLogin timestamp,

    createdAt timestamp default current_timestamp,
    updatedAt timestamp default current_timestamp on update current_timestamp,

    foreign key (ownerId) references user(id)
);

create table user(
    id serial primary key,
    status enum('active', 'await_verify', 'suspend', 'delete') default 'active',
    role enum('admin', 'nbp_client') default 'nbp_client',

    firstName varchar(255) not null,
    middleName varchar(255) null,
    lastName varchar(255) not null,
    dob date not null,
    address1 varchar(255) not null,
    address2 varchar(255) null,
    city varchar(64) not null,
    provinceCode char(5) not null,
    countryCode char(2) not null,
    postalCode varchar(16) not null,
    phoneNumber varchar(32) not null,

    pob varchar(4) not null,
    nationality varchar(4) not null,

    occupationId bigint unsigned not null,
    avatarUrl varchar(255) null,
#     primaryAddress int, # reference to userAddress.
#     primaryPhone int, # reference to userPhone

    createdAt timestamp default current_timestamp,
    updatedAt timestamp default current_timestamp on update current_timestamp,

    foreign key (provinceCode) references region(isoCode),
    foreign key (countryCode) references country(iso2Code),
    foreign key (pob) references country(iso2Code),
    foreign key (nationality) references country(iso2Code),
    foreign key (occupationId) references occupation(id)

);

create table identification(
    id serial primary key,
    status enum('active', 'suspend', 'await_verify', 'delete') default 'active',
    type enum('passport', 'driver_license', 'provincial_id', 'national_id') not null,

    value varchar(64) not null,
    addition_info varchar(128) null,

    ownerId bigint unsigned not null,

    createdAt timestamp default current_timestamp,
    updatedAt timestamp default current_timestamp on update current_timestamp,

    foreign key (ownerId) references user(id)
);

create table contact(
    id serial primary key,
    status enum('active', 'await_verify', 'suspend', 'delete', 'invalid') default 'await_verify',
    type enum('cash_pickup', 'bank_account') not null,

    firstName varchar(255) not null,
    middleName varchar(255),
    lastName varchar(255) not null,
    address1 varchar(255) not null,
    address2 varchar(255),
    city varchar(128) not null,
    provinceCode char(5) not null,
    countryCode char(2) not null,
    postCode varchar(64),
    phoneNumber varchar(64),

    institutionId bigint unsigned null,
    bankAccountNum varchar(32) null,
    branchNum varchar(32) null,
    iban varchar(32) null,
    currency char(3) not null,

    ownerId bigint unsigned not null,
    relationshipId bigint unsigned not null,

    deletedAt timestamp null,
    createdAt timestamp default current_timestamp,
    updatedAt timestamp default current_timestamp on update current_timestamp,

    foreign key (provinceCode) references region(isoCode),
    foreign key (countryCode) references country(iso2Code),
    foreign key (currency) references currency(isoCode),
    foreign key (institutionId) references institution(id),
    foreign key (ownerId) references user(id),
    foreign key (relationshipId) references personal_relationship(id)
);

create table account (
    id serial primary key,
    status enum('active', 'await_verify', 'invalid', 'suspend', 'delete') default 'await_verify',
    type enum('interac', 'bank_account') not null,

    email varchar(255) null,
    isDefault boolean default false,

    ownerId bigint unsigned not null,
    currency char(3) not null,

    deletedAt timestamp null,
    createdAt timestamp default current_timestamp,
    updatedAt timestamp default current_timestamp on update current_timestamp,

    foreign key (ownerId) references user(id),
    foreign key (currency) references currency(isoCode)
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

create table reverse_transaction(
    id serial primary key,

    ownerId int not null references user(id),
    originTransactionId int not null references transaction(id),
    curTransferId int null references reverse_transfer(id),

    createdAt timestamp default current_timestamp,
    updatedAt timestamp default current_timestamp on update current_timestamp
);

create table reverse_transfer(
    id serial primary key,
    status enum('start', 'wait', 'success', 'failed', 'retry', 'cancel') not null default 'start',

    name varchar(255) not null,
    retryAttempt int,

    ownerId int not null references user(id),
    reverseTransactionId int not null references reverse_transaction(id),
    preTransferId int null references reverse_transaction(id),
    nextTransferId int null references reverse_transaction(id),

    createdAt timestamp default current_timestamp,
    updatedAt timestamp default current_timestamp on update current_timestamp
);