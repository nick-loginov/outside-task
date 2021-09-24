DROP SCHEMA public CASCADE;
CREATE SCHEMA public;
GRANT ALL ON SCHEMA public TO postgres;
GRANT ALL ON SCHEMA public TO public;

CREATE TABLE "users" (
  "user_uid" uuid PRIMARY KEY,
  "user_email" varchar(100) NOT NULL,
  "user_password" varchar(100) NOT NULL,
  "user_nickname" varchar(30) NOT NULL
);
CREATE TABLE "tags" (
  "tag_id" serial PRIMARY KEY,
  "tag_creator" uuid NOT NULL,
  "tag_name" varchar(40) NOT NULL,
  "tag_sort_order" integer DEFAULT 0 NOT NULL
);
CREATE TABLE "user_tag" (
  "ut_id" serial PRIMARY KEY,
  "ut_user_uid" uuid NOT NULL REFERENCES users (user_uid) ON DELETE CASCADE,
  "ut_tag_id" integer NOT NULL REFERENCES tags (tag_id) ON DELETE CASCADE
);
ALTER TABLE "user_tag"
  ADD CONSTRAINT user_rel_tag UNIQUE (ut_user_uid, ut_tag_id)

