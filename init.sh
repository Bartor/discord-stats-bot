#!/bin/bash

#check parameters
if (( $# != 2 )); then
	echo "Usage: init.sh [discord bot key] [password to use in mysql]"
	exit 1
fi

#create schema.sql
cp sqlinit.sql schema.sql
echo $1 | xargs -I {} sh -c "sed -i -e 's/???/{}/g' schema.sql"

#run docker-compose build
echo "--build-arg pass=$2 --build-arg token=$1 database app" | xargs -d '\n' -I {} sh -c "docker-compose build {}"