-- Sprint G + H: background music + YouTube embed columns
ALTER TABLE projects 
  ADD COLUMN IF NOT EXISTS music_url TEXT DEFAULT NULL,
  ADD COLUMN IF NOT EXISTS music_name TEXT DEFAULT NULL,
  ADD COLUMN IF NOT EXISTS youtube_url TEXT DEFAULT NULL;
