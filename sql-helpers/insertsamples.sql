INSERT INTO users VALUES
	('23093248-1beb-11ec-9621-0242ac130001', 'example@mail.ru', 'pass1', 'nick1'),
	('23093248-1beb-11ec-9621-0242ac130002', 'example@mail.ru', 'pass2', 'nick2'),
	('23093248-1beb-11ec-9621-0242ac130003', 'example@mail.ru', 'pass3', 'nick3');

INSERT INTO tags (tag_creator, tag_name) VALUES
	('23093248-1beb-11ec-9621-0242ac130001', 'tag1'),
	('23093248-1beb-11ec-9621-0242ac130002', 'tag2');

INSERT INTO "user_tag" ("ut_user_id", "ut_tag_id") VALUES
	('23093248-1beb-11ec-9621-0242ac130001', 1),
	('23093248-1beb-11ec-9621-0242ac130001', 2),
	('23093248-1beb-11ec-9621-0242ac130002', 2);
