CREATE EXTENSION btree_gist;
CREATE ROLE tracking;
CREATE ROLE "tracking-worker" LOGIN PASSWORD 'change-this';

CREATE DATABASE tracking OWNER tracking TEMPLATE template0 ENCODING "UTF-8" LC_COLLATE "C" LC_CTYPE "C";
