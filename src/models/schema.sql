-- Create a reusable function to update the updated_at column
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = CURRENT_TIMESTAMP;
    RETURN NEW;
END;
$$ language 'plpgsql';

CREATE TABLE IF NOT EXISTS users ( 
    id            text PRIMARY KEY,
    google_id     text UNIQUE, 
    apple_id      text UNIQUE,
    ext_id        text UNIQUE, -- for use with 3p services like image hosting etc.

    slug          text NOT NULL UNIQUE, 
    name          text NOT NULL, 
    thumb         text, 

    pronouns      text,
    role          text NOT NULL, 
    level         text NOT NULL,

    banned_at             timestamptz,
    banned_till           timestamptz,
    banned_note           text,    -- note to self. not to be shown to end users
    total_banned_count    int DEFAULT 0, -- total number of times banned

    created_at    timestamptz DEFAULT CURRENT_TIMESTAMP, 
    updated_at    timestamptz DEFAULT CURRENT_TIMESTAMP, 
    deleted_at    timestamptz 

    CONSTRAINT atleast_one_oauth_id_check CHECK ((google_id IS NOT NULL) OR (apple_id IS NOT NULL))
);
CREATE TRIGGER update_users_updated_at 
    BEFORE UPDATE ON users 
    FOR EACH ROW 
    EXECUTE FUNCTION update_updated_at_column();


CREATE TABLE IF NOT EXISTS sessions ( 
    id              text PRIMARY KEY, -- Stronger bits as this is public
    type		    text NOT NULL, -- type = [anon, preauth, auth]
    user_id         text REFERENCES users(id), -- Nullable for anonymous sessions
    
    sec_token       text, -- for establishing oauth session
    nonce           text, -- for establishing oauth session

    user_agent      text,

    conn_downlink   text,
    conn_effective_type    text,
    conn_rtt        text,
    conn_save_data  text,

    window_width    text,
    window_height   text,
    window_pixel_ratio    text,
    window_orientation    text,

    nav_user_agent  text,
    nav_brands      text,
    nav_is_mobile   boolean,
    nav_platform    text,
    nav_language    text,
    
    signedin_at     timestamptz, -- when the authenticated session was initiated
    sec_token_set_at timestamptz, -- when the security token was set

    created_at      timestamptz NOT NULL DEFAULT CURRENT_TIMESTAMP,
    updated_at      timestamptz DEFAULT CURRENT_TIMESTAMP
);

INSERT INTO users 
(id, google_id, slug, name, thumb, pronouns, role, level)
VALUES 
('eva_id', 'eva@gmail.com', 'eva-green', 'Eva Green', 'https://hyszdrccjghkiiasipsr.supabase.co/storage/v1/object/public/avatars/default.jpg', 'She/Her', 'user', 'leaf'),
('monica_id', 'monica@gmail.com', 'monica-bellucci', 'Monica Anna Maria Bellucci', 'https://hyszdrccjghkiiasipsr.supabase.co/storage/v1/object/public/avatars/default.jpg', 'She/Her', 'user', 'leaf')

CREATE TABLE IF NOT EXISTS posts (
    id          text PRIMARY KEY,
    ext_id      text UNIQUE, -- for use with 3p services like image hosting etc.
    author_id   text REFERENCES users(id) NOT NULL,

    slug        text NOT NULL UNIQUE,
    category    text NOT NULL,
    type        text NOT NULL,
    title       text NOT NULL,
    link        text,
    hero_image_full       text,
    hero_image_thumb       text,
    hero_image_alt       text,
    content     text NOT NULL,
    digs int DEFAULT 0,
    
    og_title    text,
    og_description text,
    og_image    text,
    og_image_alt text,
    og_icon     text,
    og_url      text,
    body_image  text,
    body_image_alt text,

    locked_for  text, -- reason for locking
    is_anonymous boolean DEFAULT false,
    
    archived_at timestamptz,
    locked_at   timestamptz,
    
    deleted_at  timestamptz,
    created_at  timestamptz DEFAULT CURRENT_TIMESTAMP,
    updated_at  timestamptz DEFAULT CURRENT_TIMESTAMP
);

CREATE TRIGGER update_posts_updated_at 
    BEFORE UPDATE ON posts 
    FOR EACH ROW 
    EXECUTE FUNCTION update_updated_at_column();
