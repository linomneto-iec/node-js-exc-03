CREATE SEQUENCE user_id_seq;
CREATE TABLE public.user (
    id int NOT NULL DEFAULT nextval('user_id_seq'),
    name varchar(200) NOT NULL,
    email varchar(100) NOT NULL,
    login varchar(100) NOT NULL,
    pwd varchar(100) NOT NULL,
    roles varchar (200) NOT NULL DEFAULT 'USER',
    CONSTRAINT user_pk PRIMARY KEY (id)
);
CREATE UNIQUE INDEX user_id_idx ON public.user USING btree (id); 

CREATE SEQUENCE product_id_seq; 
CREATE TABLE product ( 
    id int4 NOT NULL DEFAULT nextval('product_id_seq'), 
    description varchar(200) NOT NULL, 
    value numeric NOT NULL DEFAULT 0, 
    brand varchar(100) NULL, 
    CONSTRAINT product_pk PRIMARY KEY (id) 
); 
CREATE UNIQUE INDEX product_id_idx ON public.product USING btree (id);

