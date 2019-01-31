FROM node:latest

WORKDIR /usr/src/app
COPY . .

ARG pass
ARG token

RUN mkdir config
RUN echo "{\"host\": \"localhost\",\"port\": 3306,\"user\": \"DiscordStatsBot\",\"webuser\": \"DiscordStatsWeb\",\"password\": \"${pass}\"}" > ./config/db.json
RUN echo "[]" > ./config/dbUsers.json
RUN echo "{\"token\": \"${token}\"}" > ./config/discord.json

RUN cat ./config/discord.json

RUN ls

RUN npm install

EXPOSE 8080
CMD ["node", "."]