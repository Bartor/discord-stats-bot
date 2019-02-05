FROM node:latest

LABEL MAINTAINER="Bartosz Rajczyk"

ADD . /app
WORKDIR /app

ARG pass
ARG token

RUN mkdir config
RUN echo "{\"host\": \"localhost\",\"port\": 3306,\"user\": \"DiscordStatsBot\",\"webuser\": \"DiscordStatsWeb\",\"password\": \"${pass}\"}" > ./config/db.json
RUN echo "[]" > ./config/dbUsers.json
RUN echo "{\"token\": \"${token}\"}" > ./config/discord.json

RUN npm install

EXPOSE 2137

CMD ["node", "main"]