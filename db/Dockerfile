FROM mysql:latest

MAINTAINER me 

ARG pass

COPY . /docker-entrypoint-initdb.d/
RUN sed -i "s|???|$pass|g" /docker-entrypoint-initdb.d/sqlinit.sql