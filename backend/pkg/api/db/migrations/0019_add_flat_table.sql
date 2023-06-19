-- +migrate Up

create table instance_fact (
    timestamp timestamptz,
    channel_name text,
    arch text,
    version text,
    instances int
);

create index idx_instance_fact on instance_fact(timestamp, channel_name, arch, version);

-- +migrate Down

drop index if exists idx_instance_fact;

drop table if exists instance_fact;
