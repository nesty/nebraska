-- +migrate Up

create table instance_fact (
    timestamp timestamptz,
    channel_name varchar(10) not null,
    arch varchar(5) not null,
    version varchar(20) not null,
    instances int not null
);

create index idx_instance_fact on instance_fact(timestamp, channel_name, arch, version);

-- +migrate Down

drop index if exists idx_instance_fact;

drop table if exists instance_fact;
