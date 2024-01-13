create table transaction(
    id serial primary key,
    name varchar(64) not null,
    status enum('quote','initial','waiting_for_payment', 'process', 'complete', 'reject', 'cancel', 'refund_in_progress', 'refund') default 'quote',

    sourceAccountId bigint unsigned,
    destinationContactId bigint unsigned,

    sourceAmount INTEGER not null,
    sourceCurrency char(3) not null,

    destinationAmount INTEGER not null,
    destinationCurrency char(3) not null,
    destinationName varchar(255) not null,
    destinationContactSummary varchar(255) not null,

    feeAmount Integer not null,
    feeCurrency char(3) not null,

    debitAmount Integer not null,
    debitCurrency char(3) not null,

    fromIp varchar(32) null,
    deviceType varchar(128) null,

    ownerId bigint unsigned not null,

    endInfo varchar(255) null,
    transactionPurpose varchar(255) null,
    confirmQuoteAt datetime null,
    quoteExpired datetime not null,

    completedAt timestamp null,
    terminatedAt timestamp null,
    refundedAt timestamp null,
    createdAt timestamp default current_timestamp,
    updatedAt timestamp default current_timestamp on update current_timestamp,

    foreign key (sourceCurrency) references currency(isoCode),
    foreign key (destinationCurrency) references currency(isoCode),
    foreign key (feeCurrency) references currency(isoCode),
    foreign key (debitCurrency) references currency(isoCode),
    foreign key (sourceAccountId) references account(id),
    foreign key (destinationContactId) references contact(id),
    foreign key (ownerId) references user(id)
);

create table transfer(
    id serial primary key,
    name varchar(128) not null,
    externalRef varchar(128) null,
    status enum('initial', 'wait', 'complete', 'fail', 'retry', 'cancel') not null default 'initial',

    retryAttempt int,

    ownerId bigint unsigned not null,
    transactionId bigint unsigned not null,
    nextId bigint unsigned null,

    waitAt timestamp null,
    completeAt timestamp null,
    failAt timestamp null,
    cancelAt timestamp null,
    endInfo varchar(255) null,

    foreign key (ownerId) references user(id),
    foreign key (transactionId) references transaction(id),
    foreign key (nextId) references transfer(id),

    createdAt timestamp default current_timestamp,
    updatedAt timestamp default current_timestamp on update current_timestamp
);

create table fee_detail(
    id serial primary key,
    name varchar(255) not null,

    description varchar(255) null,
    amount integer not null,
    currency char(3) not null,

    ownerId bigint unsigned not null,
    transactionId bigint unsigned not null,

    createdAt timestamp default current_timestamp,
    updatedAt timestamp default current_timestamp on update current_timestamp,

    foreign key (ownerId) references user(id),
    foreign key (currency) references currency(isoCode),
    foreign key (transactionId) references transaction(id)
);

create table cash_in(
    id serial primary key,
    status enum ('initial', 'wait', 'complete', 'fail', 'cancel') not null default 'initial',
    method enum('interac') not null,
    paymentAccountId bigint unsigned not null,

    externalRef varchar(255) null,
    paymentLink varchar(255) null,

    ownerId bigint unsigned not null,
    transactionId bigint unsigned not null,

    endInfo varchar(255) null,

    cashInReceiveAt timestamp null,
    createdAt timestamp default current_timestamp,
    updatedAt timestamp default current_timestamp on update current_timestamp,

    foreign key (paymentAccountId) references account(id),
    foreign key (ownerId) references user(id),
    foreign key (transactionId) references transaction(id)
);

create table transfer(
    id serial primary key,
    name varchar(128) not null,
    externalReference varchar(128) null,
    status enum('initial', 'wait', 'complete', 'fail', 'retry', 'cancel') not null default 'initial',

    retryAttempt int,

    ownerId bigint unsigned not null,
    transactionId bigint unsigned not null,
    nextId bigint unsigned null,

    waitAt timestamp null,
    completeAt timestamp null,
    failAt timestamp null,
    cancelAt timestamp null,
    endInfo varchar(255) null,

    foreign key (ownerId) references user(id),
    foreign key (transactionId) references transaction(id),
    foreign key (nextId) references transfer(id),

    createdAt timestamp default current_timestamp,
    updatedAt timestamp default current_timestamp on update current_timestamp
);

alter table transfer add constraint fk_transfer_transfer_nextId_id foreign key ("nextId") REFERENCES transfer(id);
ALTER TABLE transfer ADD CONSTRAINT transfer_nextId_unique UNIQUE ("nextId");