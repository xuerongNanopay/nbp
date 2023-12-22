create table notification(
    id serial primary key,
    ownerId int not null references user(id),
    level enum('info', 'warming', 'error') default 'info',
    subject varchar(128) null,
    content varchar(512) null,
    status enum('read', 'unread') default 'unread',
    readAt timestamp default null,
    createdAt timestamp default current_timestamp,
    updatedAt timestamp default current_timestamp on update current_timestamp
);