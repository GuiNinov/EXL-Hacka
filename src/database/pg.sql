create type roles as enum ('ADMIN', 'DEV');

create table team (
    id serial primary key,
    name varchar(255),
    created_at timestamp default now(),
    updated_at timestamp default now()
);

create table users (
    id serial primary key,
    email varchar(255),
    password varchar(255),
    role roles,
    team_id int,
    created_at timestamp default now(),
    updated_at timestamp default now(),
    deleted boolean
);

create table file (
    id serial primary key,
    file_name varchar(255),
    url varchar(255),
    storaged_at varchar(255),
    folder int,
    elapsed_time numeric,
    deleted boolean,
    user_id int,
    team_id int,
    created_at timestamp default now(),
    updated_at timestamp default now()
);

create table folder (
    id serial primary key,
    name varchar(255),
    dir int,
    team_id int,
    created_at timestamp default now(),
    updated_at timestamp default now(),
    deleted boolean
);

create table file_permissions(
  id serial primary key,
  file_id int,
  user_id int,
  block_read boolean,
  block_update boolean,
  block_delete boolean,
  allow_read_till boolean,
  allow_update_till boolean,
  allow_delete_till boolean,
  access_till Date,
  created_at timestamp default now(),
  updated_at timestamp default now()
);

create table folder_permissions(
  id serial primary key,
  file_id int,
  user_id int,
  block_read boolean,
  block_write boolean,
  block_delete boolean,
  allow_read_till boolean,
  allow_write_till boolean,
  allow_delete_till boolean,
  access_till Date,
  created_at timestamp default now(),
  updated_at timestamp default now()
);