create database indianDB;
use indianDB;

create table users(
	id int not null auto_increment primary key,
    name varchar(55) not null,
    email varchar(55) unique 
);

alter table users
ADD password varchar(55) not null;

ALTER TABLE users ADD COLUMN perfil ENUM('admin', 'usuario') DEFAULT 'usuario';



INSERT INTO users (name, email, password, perfil)
VALUES ('PDiddy', 'diddy@gmail.com', 'diddyparty', 'admin');

select * from users;

CREATE TABLE produtos (
    id INT AUTO_INCREMENT PRIMARY KEY,
    title VARCHAR(255) NOT NULL,
    price DECIMAL(10, 2) NOT NULL,
    image text not null, 
    createda_at timestamp default current_timestamp
);
ALTER TABLE produtos ADD COLUMN description varchar(255) not null;

INSERT INTO produtos (nome, preco, description, imagem)
VALUES ('Vinil MonarkCAST', 25.00, 'Vinil do EP com Raim Santos', 'C:\Users\Filipe\cazaque-project\frontend\fotos\car-1');

ALTER TABLE produtos MODIFY imagem VARCHAR(255) DEFAULT '';

Drop table produtos;

SELECT * from users;

SELECT * from produtos;