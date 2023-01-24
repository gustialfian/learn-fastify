create table if not exists users (
    id serial,
    username varchar(255) unique,
    password varchar(255),
    created_at timestamp default current_timestamp
)

create table if not exists savings_log (
    id varchar(255) primary key, 
    type varchar(255), 
    saving_id varchar(255), 
    payload jsonb,
    created_at timestamp default current_timestamp
)

create table if not exists savings_snapshot (
    last_id varchar(255) primary key, 
    payload jsonb,
    created_at timestamp default current_timestamp
)