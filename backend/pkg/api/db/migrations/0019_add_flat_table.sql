-- +migrate Up

create table if not exists instance_fact (
    timestamp timestamptz not null,
    channel_name varchar(50) not null,
    arch varchar(50) not null,
    version varchar(50) not null,
    instances int not null check (instances >= 0),
    unique(timestamp, channel_name, arch, version)
);

create index if not exists idx_instance_fact on instance_fact(timestamp, channel_name, arch, version);

-- +migrate Down

drop index if exists idx_instance_fact;
 
drop table if exists instance_fact;
