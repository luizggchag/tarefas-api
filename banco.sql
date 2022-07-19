create table tarefas (
    codigo serial not null primary key, 
    descricao varchar(50) not null, 
    situacao integer not null
);

insert into tarefas (descricao, situacao) values ('Trabalho Final SW', 0), ('Trabalho Final PW2', 0);
