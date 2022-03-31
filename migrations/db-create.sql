CREATE SEQUENCE product_id_seq; 
CREATE TABLE product ( 
    id int4 NOT NULL DEFAULT nextval('product_id_seq'), 
    description varchar(200) NOT NULL, 
    value numeric NOT NULL DEFAULT 0, 
    brand varchar(100) NULL, 
    CONSTRAINT product_pk PRIMARY KEY (id) 
); 
CREATE UNIQUE INDEX product_id_idx ON public.product USING btree (id); 
