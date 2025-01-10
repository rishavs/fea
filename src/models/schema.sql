CREATE TABLE IF NOT EXISTS users ( 
    id            uuid DEFAULT uuid_generate_v4() PRIMARY KEY,
    google_id     text UNIQUE, 
    apple_id      text UNIQUE,
    ext_id        text UNIQUE, -- for use with 3p services like image hosting etc.

    slug          text NOT NULL UNIQUE, 
    name          text NOT NULL, 
    thumb         text NOT NULL, 

    pronouns      text,
    honorific     text NOT NULL, 
    flair         text NOT NULL, 
    role          text NOT NULL, 
    level         text NOT NULL,
    stars         int NOT NULL DEFAULT 0, 
    creds         int NOT NULL DEFAULT 0,
    gil           int NOT NULL DEFAULT 0,

    banned_at             timestamp,
    banned_till           timestamp,
    banned_note           text,    -- note to self. not to be shown to end users
    total_banned_count    int DEFAULT 0, -- total number of times banned

    created_at    timestamp DEFAULT CURRENT_TIMESTAMP, 
    updated_at    timestamp DEFAULT CURRENT_TIMESTAMP, 
    deleted_at    timestamp 

    CONSTRAINT atleast_one_oauth_id_check CHECK ((google_id IS NOT NULL) OR (apple_id IS NOT NULL))
);

CREATE TABLE IF NOT EXISTS sessions ( 
    id            text PRIMARY KEY, -- Stronger bits as this is public
    user_id       uuid REFERENCES "users", -- Nullable for anonymous sessions
    
    sec_token     text NOT NULL, -- for establishing oauth session
    nonce         text NOT NULL, -- for establishing oauth session

    user_agent    text,
    brands        text, -- from navigator api
    is_mobile     BOOLEAN,  -- from navigator api
    platform      text,  -- from navigator api

    created_at    timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP,
    initiated_at  timestamp, -- when the session was initiated
    deleted_at    timestamp
);

INSERT INTO users 
(google_id, slug, name, thumb, pronouns, honorific, flair, role, level)
VALUES 
('eva@gmail.com', 'eva-green', 'Eva Green', 'https://hyszdrccjghkiiasipsr.supabase.co/storage/v1/object/public/avatars/default.jpg', 'She/Her', 'Divine Majesty', 'Empress of Humanity', 'user', 'leaf'),
('monica@gmail.com', 'monica-bellucci', 'Monica Anna Maria Bellucci', 'https://hyszdrccjghkiiasipsr.supabase.co/storage/v1/object/public/avatars/default.jpg', 'She/Her', 'Holy Mother', 'Holy Mother of Humanity of Humanity', 'user', 'leaf')

CREATE TABLE IF NOT EXISTS posts ( 
    id            uuid DEFAULT uuid_generate_v4() PRIMARY KEY,
    user_id       uuid REFERENCES "users", -- Nullable for anonymous sessions
    ext_id        text UNIQUE, -- for use with 3p services like image hosting etc.

    type          text NOT NULL, -- link, text, media, poll, etc.
    slug          text UNIQUE, 
    category      text NOT NULL, 
    title         text NOT NULL, 
    link          text, 
    thumb         text, 
    content       text, 
    is_anonymous  boolean NOT NULL DEFAULT false,

    og_title      text,
	og_description text,
	og_image       text,
	og_image_alt  text,
	og_icon       text,
    og_url        text,

    body_image    text,

    display_score int NOT NULL DEFAULT 1,

    is_locked     boolean NOT NULL DEFAULT false,
    locked_for    text,

    created_at    timestamp DEFAULT CURRENT_TIMESTAMP, 
    updated_at    timestamp DEFAULT CURRENT_TIMESTAMP, 
    archived_at   timestamp , -- after n days, archive posts. archived posts are not shown in feed and are read only
    locked_at     timestamp , -- similar to archived_at but is done intentionally for posts which are running off course
    deleted_at    timestamp 
);

CREATE TABLE IF NOT EXISTS posts_dug (
    post_id       uuid REFERENCES "posts" NOT NULL, 
    user_id       uuid REFERENCES "users" NOT NULL, 
    UNIQUE (post_id, user_id)
);


CREATE TABLE IF NOT EXISTS posts_reported (
    id            uuid DEFAULT uuid_generate_v4() PRIMARY KEY,
    post_id       uuid REFERENCES "posts", 
    reporter_id   uuid REFERENCES "users",
    reported_for  text NOT NULL,
    details         text,

    resolved_by uuid REFERENCES "users" ,
    resolved_note   text ,
    
    reported_at  TIMESTAMP DEFAULT CURRENT_TIMESTAMP
    resolved_at  TIMESTAMP
);