-- +migrate Up

create table channel_dim (
    channel_id serial primary key,
    channel_name varchar(10) not null,
    arch int not null
)

create index idx_channel on channel_dim (channel_name, arch);

create table version_dim (
    version_id serial primary key,
    version varchar(32) not null,
)

create index idx_version on version_dim (version);

create table arch_dim (
    arch_id serial primary key,
    arch_name varchar(5) not null,
)

create index idx_arch on arch_dim (arch_name);

create table instance_fact (
    timestamp timestamptz,
    channel_id int references channel_dim(channel_id),
    version_id int references version_dim(version_id),
    arch_id int references arch_dim(arch_id) not null,
    instances_count int not null
)

create index idx_instance_fact on instance_fact (timestamp, channel_id, version_id, arch_id);

-- +migrate Down

drop table if exists channel_dim;

drop index if exists idx_channel;

drop table if exists version_dim;

drop index if exists idx_version;

drop table if exists arch_dim;

drop index if exists idx_arch;

drop table if exists instance_fact;

drop index if exists idx_instance_fact;
