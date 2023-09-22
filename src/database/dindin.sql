-- Active: 1695125802095@@127.0.0.1@1433

create database dindin;

create table
    usuarios (
        id serial primary key unique,
        nome text not null,
        email varchar(50) unique not null,
        senha text not null
    );

create table
    categorias (
        id serial primary key unique,
        descricao text not null
    );

create table
    transacoes (
        id serial primary key unique,
        descricao text not null,
        valor integer not null,
        data timestamp not null,
        categoria_id integer references categorias(id),
        usuario_id integer references usuarios(id),
        tipo text not null
    );

insert into
    categorias (descricao)
values ('Alimentação'), ('Assinaturas e Serviços'), ('Casa'), ('Mercado'), ('Cuidados Pessoais'), ('Educação'), ('Família'), ('Lazer'), ('Pets'), ('Presentes'), ('Roupas'), ('Saúde'), ('Transporte'), ('Salário'), ('Vendas'), ('Outras receitas'), ('Outras despesas');

SELECT * FROM usuarios;

SELECT * FROM categorias clear 