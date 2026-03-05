# DATA_MODEL_INFERENCE.md — CineLove Database Structure

## Inferred Tables

### users
```sql
id           UUID PRIMARY KEY
email        VARCHAR UNIQUE NOT NULL
password     VARCHAR -- hashed
full_name    VARCHAR
phone        VARCHAR
bio          TEXT
avatar_url   VARCHAR
birth_date   DATE
plan_id      UUID REFERENCES plans(id)
auth_method  ENUM('email', 'google', 'facebook')
email_verified BOOLEAN DEFAULT false
created_at   TIMESTAMP
updated_at   TIMESTAMP
```

### plans
```sql
id           UUID PRIMARY KEY
name         VARCHAR  -- 'free', 'basic', 'premium'
display_name VARCHAR  -- 'Free', 'Basic', 'Premium'
price        INTEGER  -- in VND (0, 199000, 299000)
max_projects INTEGER  -- 1, 3, 5
max_photos   INTEGER  -- 10, 50, 100
max_views    INTEGER  -- 300, 10000, 50000
storage_days INTEGER  -- 180, 730, 1825
has_watermark BOOLEAN
custom_music BOOLEAN
custom_font  BOOLEAN
bg_removal   BOOLEAN
youtube_embed BOOLEAN
custom_form  BOOLEAN
auto_guest_name BOOLEAN
created_at   TIMESTAMP
```

### templates
```sql
id           UUID PRIMARY KEY
slug         VARCHAR UNIQUE NOT NULL
name         VARCHAR NOT NULL
thumbnail_url VARCHAR
category     ENUM('wedding', 'birthday', 'graduation', 'event', 'anniversary', 'wish', 'other')
tier         ENUM('basic', 'premium')
layout_json  JSONB   -- Full layout definition
usage_count  INTEGER DEFAULT 0
likes_count  INTEGER DEFAULT 0
is_active    BOOLEAN DEFAULT true
created_at   TIMESTAMP
```

### projects
```sql
id           UUID PRIMARY KEY
user_id      UUID REFERENCES users(id) ON DELETE CASCADE
template_id  UUID REFERENCES templates(id)
title        VARCHAR
slug         VARCHAR UNIQUE
status       ENUM('draft', 'published', 'archived')
layout_json  JSONB   -- Customized layout data
category     VARCHAR -- Project category override
is_public    BOOLEAN DEFAULT false
published_at TIMESTAMP
published_url VARCHAR
view_count   INTEGER DEFAULT 0
created_at   TIMESTAMP
updated_at   TIMESTAMP
```

### media_assets
```sql
id           UUID PRIMARY KEY
user_id      UUID REFERENCES users(id) ON DELETE CASCADE
project_id   UUID REFERENCES projects(id) ON DELETE SET NULL
file_name    VARCHAR
file_type    ENUM('image', 'music')
file_size    INTEGER  -- bytes
storage_url  VARCHAR  -- img.cinelove.me/uploads/...
thumbnail_url VARCHAR
created_at   TIMESTAMP
```

### wishes (Guest Interactions)
```sql
id           UUID PRIMARY KEY
project_id   UUID REFERENCES projects(id) ON DELETE CASCADE
guest_name   VARCHAR NOT NULL
message      TEXT NOT NULL
emoji        VARCHAR -- optional emoji
is_approved  BOOLEAN DEFAULT true
ip_address   INET    -- for rate limiting
created_at   TIMESTAMP
```

### rsvps
```sql
id           UUID PRIMARY KEY
project_id   UUID REFERENCES projects(id) ON DELETE CASCADE
guest_name   VARCHAR NOT NULL
status       ENUM('confirmed', 'declined', 'maybe')
guest_count  INTEGER DEFAULT 1
notes        TEXT
ip_address   INET
created_at   TIMESTAMP
```

### gifts
```sql
id           UUID PRIMARY KEY
project_id   UUID REFERENCES projects(id) ON DELETE CASCADE
guest_name   VARCHAR
amount       INTEGER  -- in VND
note         TEXT
method       VARCHAR  -- 'bank_transfer', 'cash'
confirmed    BOOLEAN DEFAULT false
created_at   TIMESTAMP
```

### orders
```sql
id           UUID PRIMARY KEY
user_id      UUID REFERENCES users(id)
type         ENUM('plan_upgrade', 'addon', 'full_service')
plan_id      UUID REFERENCES plans(id)
amount       INTEGER
status       ENUM('pending', 'paid', 'failed', 'refunded')
payment_method VARCHAR
payment_ref  VARCHAR
created_at   TIMESTAMP
```

### addons
```sql
id           UUID PRIMARY KEY
user_id      UUID REFERENCES users(id)
type         VARCHAR  -- 'extra_views', 'extra_photos', 'priority_support'
quantity     INTEGER
purchased_at TIMESTAMP
expires_at   TIMESTAMP
```

### page_views (Analytics)
```sql
id           UUID PRIMARY KEY
project_id   UUID REFERENCES projects(id) ON DELETE CASCADE
ip_address   INET
user_agent   VARCHAR
referrer     VARCHAR
country      VARCHAR
viewed_at    TIMESTAMP
```

---

## Entity Relationships

```
users 1:N projects
users 1:N media_assets
users 1:N orders
users 1:1 plans (via plan_id FK)
users 1:N addons
templates 1:N projects
projects 1:N wishes
projects 1:N rsvps
projects 1:N gifts
projects 1:N page_views
projects N:N media_assets
```

---

## Key Observations

1. **JSON-based layouts:** Invitations are stored as JSONB, making the schema flexible
2. **No video tables:** Confirms CineLove has no video generation feature
3. **Add-on system:** Separate table for purchasable extras beyond the plan
4. **View counting:** Dedicated analytics table for page views
5. **Multi-category:** Templates support 8 categories, not just weddings
