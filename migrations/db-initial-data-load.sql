INSERT INTO "user" (name, login, pwd, email, roles) VALUES 
    ('user','user','$2a$08$cgWo0k133AqN7bfHTkKK8eedZRBlpZL08piXXQP521KOFXIF4sWha','user@abc.com.br','USER'),
    ('admin','admin','$2a$08$cgWo0k133AqN7bfHTkKK8eedZRBlp','admin@abc.com.br','USER;ADMIN')
;

INSERT INTO product (description, value, brand) VALUES 
    ('Arroz parboilizado 5Kg', 25,'Tio João'),
    ('Maionese 250gr', 7.2,'Helmanns'),
    ('Iogurte Natural 200ml',2.5,'Itambé'),
    ('Nescau 400gr',8, 'Nestlé'),
    ('Batata Palha 180gr',5.20,'Chipps'),
    ('Feijão Carioquinha',5,'Xap')
;