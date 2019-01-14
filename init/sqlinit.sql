DROP DATABASE DiscordStats;
DROP USER 'DiscordStatsBot'@'localhost';

CREATE DATABASE IF NOT EXISTS DiscordStats;
USE DiscordStats;
CREATE USER IF NOT EXISTS 'DiscordStatsBot'@'localhost' IDENTIFIED WITH mysql_native_password BY '1234';
GRANT SELECT, INSERT, UPDATE, DELETE, DROP ON DiscordStats.* TO 'DiscordStatsBot'@'localhost';
GRANT CREATE VIEW, CREATE USER ON *.* TO 'DiscordStatsBot'@'localhost';
FLUSH PRIVILEGES;

CREATE TABLE IF NOT EXISTS Users(
    id          VARCHAR(32)             NOT NULL PRIMARY KEY,
    userName    VARCHAR(32)     NOT NULL,
    userTag     VARCHAR(6)             NOT NULL
);

CREATE TABLE IF NOT EXISTS Guilds(
    id          VARCHAR(32)             NOT NULL PRIMARY KEY,
    name        VARCHAR(100)    NOT NULL,
    ownerID     VARCHAR(32)             NOT NULL
);

CREATE TABLE IF NOT EXISTS GuildUser(
    guildId     VARCHAR(32)             NOT NULL,
    userId      VARCHAR(32)             NOT NULL,
    nickname    VARCHAR(100)       DEFAULT NULL
);

CREATE TABLE IF NOT EXISTS Channels(
    id          VARCHAR(32)                     NOT NULL PRIMARY KEY,
    name        VARCHAR(100)            NOT NULL,
    guildId     VARCHAR(32)                     NOT NULL,
    type        ENUM('Voice', 'Text')   NOT NULL
);

CREATE TABLE IF NOT EXISTS Messages(
    id      VARCHAR(32)     NOT NULL,
    time   DATETIME   NOT NULL,
    author  VARCHAR(32)     NOT NULL,
    channel VARCHAR(32)     NOT NULL
);

CREATE TABLE IF NOT EXISTS ChannelLog(
    event       ENUM('ChannelNameChanged', 'ChannelCreated', 'ChannelDeleted')  NOT NULL,
    guildId     VARCHAR(32)                                                             NOT NULL,
    name        VARCHAR(100)                                                    NOT NULL,
    time       DATETIME                                                           NOT NULL
);

CREATE TABLE IF NOT EXISTS GuildLog(
    event       ENUM('GuildNameChanged','GuildCreated', 'GuildDeleted') NOT NULL,
    guildId     VARCHAR(32)                                                     NOT NULL,
    name        VARCHAR(100)                                            NOT NULL,
    time       DATETIME                                                   NOT NULL
);

CREATE TABLE IF NOT EXISTS GuildUserLog(
    event       ENUM('GuildUserNameChanged', 'GuildUserCreated', 'GuildUserDeleted')    NOT NULL,
    guildUser   VARCHAR(32)                                                                     NOT NULL,
    nickname    VARCHAR(100)                                                            DEFAULT NULL,
    time       DATETIME                                                                   NOT NULL
);

CREATE TABLE IF NOT EXISTS MessageLog(
    event       ENUM('MessageEdited', 'MessageDeleted') NOT NULL,
    id          VARCHAR(32)                                    NOT NULL,
    channel   VARCHAR(32)                                     NOT NULL,
    user   VARCHAR(32)                                     NOT NULL,
    time       DATETIME                                      NOT NULL
);

DELIMITER //
CREATE TRIGGER ChannelCreated AFTER INSERT ON Channels FOR EACH ROW
BEGIN
    INSERT INTO ChannelLog VALUES(
        'ChannelCreated',
        NEW.guildId,
        NEW.name,
        NOW()
    );
END;//

CREATE TRIGGER ChannelEdited AFTER UPDATE ON Channels FOR EACH ROW
BEGIN
    INSERT INTO ChannelLog VALUES(
        'ChannelNameChanged',
        NEW.guildId,
        NEW.name,
        NOW()
    );
END;//

CREATE TRIGGER ChannelDeleted AFTER DELETE ON Channels FOR EACH ROW
BEGIN
    INSERT INTO ChannelLog VALUES(
        'ChannelDeleted',
        OLD.guildId,
        OLD.name,
        NOW()
    );
END;//

CREATE TRIGGER GuildCreated AFTER INSERT ON Guilds FOR EACH ROW
BEGIN
    INSERT INTO GuildLog VALUES(
        'GuildCreated',
        NEW.id,
        NEW.name,
        NOW()
    );
END;//

CREATE TRIGGER GuildDeleted AFTER DELETE ON Guilds FOR EACH ROW
BEGIN
    INSERT INTO GuildLog VALUES(
        'GuildDeleted',
        OLD.id,
        OLD.name,
        NOW()
    );
END;//

CREATE TRIGGER GuildEdited AFTER UPDATE ON Guilds FOR EACH ROW
BEGIN
    INSERT INTO GuildLog VALUES(
        'GuildNameChanged',
        NEW.id,
        NEW.name,
        NOW()
    );
END;//

CREATE TRIGGER GuildUserCreated AFTER INSERT ON GuildUser FOR EACH ROW
BEGIN
    INSERT INTO GuildUserLog VALUES(
        'GuildUserCreated',
        NEW.userId,
        NEW.nickname,
        NOW()
    );
END;//

CREATE TRIGGER GuildUserNameChanged AFTER UPDATE ON GuildUser FOR EACH ROW
BEGIN
    INSERT INTO GuildUserLog VALUES(
        'GuildUserNameChanged',
        NEW.userID,
        NEW.nickname,
        NOW()
    );
END;//

CREATE TRIGGER GuildUserDeleted AFTER DELETE ON GuildUser FOR EACH ROW
BEGIN
    INSERT INTO GuildUserLog VALUES(
        'GuildUserDeleted',
        OLD.userID,
        OLD.nickname,
        NOW()
    );
END;//

DELIMITER ;