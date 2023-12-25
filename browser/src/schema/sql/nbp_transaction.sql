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

    feeAmount Integer not null,
    feeCurrency char(3) not null,

    debitAmount Integer not null,
    debitCurrency char(3) not null,

    fromIp varchar(32) null,
    deviceType varchar(128) null,

    ownerId bigint unsigned not null,

    endInfo varchar(255) null,
    confirmQuoteAt datetime null,
    quoteExpired datetime not null,

    completedAt timestamp null,
    failedAt timestamp null,
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
    externalReference varchar(128) null,
    status enum('initial', 'wait', 'success', 'failed', 'retry', 'cancel') not null default 'initial',

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
    currency char(3),

    ownerId bigint unsigned references user(id),
    transactionId bigint unsigned references transaction(id),

    foreign key (currency) references currency(isoCode),
    createdAt timestamp default current_timestamp,
    updatedAt timestamp default current_timestamp on update current_timestamp,

    foreign key (ownerId) references user(id),
    foreign key (transactionId) references transaction(id)
);