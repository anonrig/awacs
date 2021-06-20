CREATE ROLE tracking;
CREATE ROLE "tracking-worker" LOGIN PASSWORD 'tracking-password';

CREATE DATABASE tracking OWNER tracking TEMPLATE template0 ENCODING "UTF-8" LC_COLLATE "C" LC_CTYPE "C";
