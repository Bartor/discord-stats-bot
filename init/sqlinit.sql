CREATE DATABASE DiscordStats;
CREATE USER 'app'@'localhost' IDENTIFIED BY '${appConnectionPassword}';
GRANT SELECT, INSERT, UPDATE, DELETE, CREATE_VIEW, CREATE_USER, DROP ON DiscordStats.* TO 'app'@'localhost';

CREATE TABLE Users(
    id          INT             NOT NULL PRIMARY KEY,
    userName    VARCHAR(32)     NOT NULL,
    userTage    INT             NOT NULL
);

CREATE TABLE Guilds(
    id          INT             NOT NULL PRIMARY KEY,
    name        VARCHAR(100)    NOT NULL,
    ownerID     INT             NOT NULL
);

CREATE TABLE GuildUser(
    guildId     INT             NOT NULL,
    userId      INT             NOT NULL,
    nickname    VARCHAR(100)    NOT NULL,

    FOREIGN KEY (guildId)
        REFERENCES Guilds(id),

    FOREIGN KEY (userId)
        REFERENCES Users(id)
);

CREATE TABLE Channels(
    id          INT                     NOT NULL PRIMARY KEY,
    name        VARCHAR(100)            NOT NULL,
    guildId     INT                     NOT NULL,
    type        ENUM('Voice', 'Text')   NOT NULL,

    FOREIGN KEY (guildId)
        REFERENCES Guilds(id)
);

CREATE TABLE Messages(
    id      INT     NOT NULL PRIMARY KEY AUTO_INCREMENT,
    time    DATE    NOT NULL,
    author  INT     NOT NULL,
    channel INT     NOT NULL,

    FOREIGN KEY (author)
        REFERENCES GuildUser(userId),

    FOREIGN KEY (channel)
        REFERENCES Channels(id)
);

CREATE TABLE ChannelLog(
    event       ENUM('ChannelNameChanged', 'ChannelCreated', 'ChannelDeleted')  NOT NULL,
    guildId     INT                                                             NOT NULL,
    name        VARCHAR(100)                                                    NOT NULL,
    time        DATE                                                            NOT NULL
);

CREATE TABLE GuildLog(
    event       ENUM('GuildNameChanged','GuildCreated', 'GuildDeleted') NOT NULL,
    guildId     INT                                                     NOT NULL,
    name        VARCHAR(100)                                            NOT NULL,
    time        DATE                                                    NOT NULL
);

CREATE TABLE GuildUserLog(
    event       ENUM('GuildUserNameChanged', 'GuildUserCreated', 'GuildUserDeleted')    NOT NULL,
    guildUser   INT                                                                     NOT NULL,
    nickname    VARCHAR(100)                                                            NOT NULL,
    time        DATE                                                                    NOT NULL
);

CREATE MessageLog(
    event       ENUM('MessageEdited', 'MessageDeleted') NOT NULL,
    channelId   INT                                     NOT NULL,
    guildUser   INT                                     NOT NULL,
    time        DATE                                    NOT NULL
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
END;

CREATE TRIGGER ChannelEdited AFTER UPDATE ON Channels FOR EACH ROW
BEGIN
    INSERT INTO ChannelLog VALUES(
        'ChannelNameChanged',
        NEW.guildId,
        NEW.name,
        NOW()
    );
END;

CREATE TRIGGER ChannelDeleted AFTER DELETE ON Channels FOR EACH ROW
BEGIN
    INSERT INTO ChannelLog VALUES(
        'ChannelDeleted',
        OLD.guildId,
        OLD.name,
        NOW()
    );
END;

CREATE TRIGGER GuildCreated ON Guilds AFTER INSERT FOR EACH ROW
BEGIN
    INSERT INTO GuildLog VALUES(
        'GuildCreated',
        NEW.id,
        NEW.name,
        NOW()
    );
END;

CREATE TRIGGER GuildDeleted ON Guilds AFTER DELETE FOR EACH ROW
BEGIN
    INSERT INTO GuildLog VALUES(
        'GuildDeleted',
        OLD.id,
        OLD.name,
        NOW()
    );
END;

CREATE TRIGGER GuildEdited ON Guilds AFTER UPDATE FOR EACH ROW
BEGIN
    INSERT INTO GuildLog VALUES(
        'GuildNameChanged',
        NEW.id,
        NEW.name,
        NOW()
    );
END;

CREATE TRIGGER GuildUserCreated ON GuildUser AFTER INSERT FOR EACH ROW
BEGIN
    INSERT INTO GuildUserLog VALUES(
        'GuildUserCreated',
        NEW.userId,
        NEW.nickname,
        NOW()
    );
END;

CREATE TRIGGER GuildUserNameChanged ON GuildUser AFTER UPDATE FOR EACH ROW
BEGIN
    INSERT INTO GuildUserLog VALUES(
        'GuildUserNameChanged',
        NEW.userID,
        NEW.nickname,
        NOW()
    );
END;

CREATE TRIGGER GuildUserDeleted ON GuildUser AFTER DELETE FOR EACH ROW
BEGIN
    INSERT INTO GuildUserLog VALUES(
        'GuildUserDeleted',
        OLD.userID,
        OLD.nickname,
        NOW()
    );
END;