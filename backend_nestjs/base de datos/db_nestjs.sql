drop database if exists db_nestjs;
create database db_nestjs CHARACTER SET utf8mb4;
use db_nestjs;

drop table if exists tusuario;
create table tusuario(
id int not null auto_increment,
nombres varchar(50) not null ,
email varchar(100) UNIQUE,
telefono varchar(9),
estado ENUM('activo','inactivo') NOT NULL DEFAULT 'activo',
password text null,
tipo_usuario varchar(15),
primary key (id));

select * from tusuario;
/*
select SHA2('77354960', 256);
CALL IniciarSesion('cuscocode@gmail.com','940500006');
INSERT INTO tusuario (nombres,email,estado,password,tipo_usuario) VALUES 
('cuscocode','cuscocode@gmail.com','activo',SHA2('940500006', 256),'Administrador');



*/



DROP PROCEDURE IF EXISTS IniciarSesion;
DELIMITER $$

CREATE PROCEDURE IniciarSesion(
    IN _email VARCHAR(100),
    IN _password VARCHAR(255)
)
BEGIN
    DECLARE _id INT DEFAULT NULL;
    DECLARE _nombres VARCHAR(50);
    DECLARE _tipo_usuario VARCHAR(15);

    SELECT id, nombres, tipo_usuario
    INTO _id, _nombres, _tipo_usuario
    FROM tusuario
    WHERE email = _email
      AND password = SHA2(_password, 256)
      AND estado = 'activo'
    LIMIT 1;

    IF _id IS NOT NULL THEN
        SELECT 
            _id AS id,
            _nombres AS nombres,
            _tipo_usuario AS tipo_usuario,
            1 AS cod,
            'Inicio de sesión exitoso' AS mensaje;
    ELSE
        SELECT 
            NULL AS id,
            NULL AS nombres,
            NULL AS tipo_usuario,
            0 AS cod,
            'Credenciales inválidas o usuario inactivo' AS mensaje;
    END IF;

END$$
DELIMITER ;
