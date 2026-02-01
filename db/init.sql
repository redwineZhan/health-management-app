-- Create users table
CREATE TABLE IF NOT EXISTS users (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    email VARCHAR(255) UNIQUE NOT NULL,
    password_hash VARCHAR(255) NOT NULL,
    first_name VARCHAR(100) NOT NULL,
    last_name VARCHAR(100) NOT NULL,
    date_of_birth DATE,
    gender VARCHAR(20),
    height DECIMAL(5,2), -- in cm
    weight DECIMAL(5,2), -- in kg
    is_active BOOLEAN DEFAULT TRUE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- Create health_metrics table
CREATE TABLE IF NOT EXISTS health_metrics (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    measurement_date TIMESTAMP WITH TIME ZONE NOT NULL,
    systolic_bp INTEGER CHECK (systolic_bp >= 70 AND systolic_bp <= 250), -- Blood pressure: systolic
    diastolic_bp INTEGER CHECK (diastolic_bp >= 40 AND diastolic_bp <= 150), -- Blood pressure: diastolic
    heart_rate INTEGER CHECK (heart_rate >= 30 AND heart_rate <= 200),
    bmi DECIMAL(4,2) CHECK (bmi >= 10.0 AND bmi <= 60.0),
    blood_sugar DECIMAL(6,2) CHECK (blood_sugar >= 50.0 AND blood_sugar <= 600.0), -- mg/dL
    cholesterol_total DECIMAL(6,2) CHECK (cholesterol_total >= 100.0 AND cholesterol_total <= 500.0),
    cholesterol_hdl DECIMAL(6,2) CHECK (cholesterol_hdl >= 20.0 AND cholesterol_hdl <= 150.0),
    cholesterol_ldl DECIMAL(6,2) CHECK (cholesterol_ldl >= 30.0 AND cholesterol_ldl <= 300.0),
    weight_kg DECIMAL(6,2) CHECK (weight_kg > 0),
    notes TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- Create weight_loss_plans table
CREATE TABLE IF NOT EXISTS weight_loss_plans (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    start_date DATE NOT NULL,
    end_date DATE,
    target_weight DECIMAL(6,2),
    daily_calorie_target INTEGER CHECK (daily_calorie_target > 0),
    tcm_recommendations TEXT,
    notes TEXT,
    status VARCHAR(20) DEFAULT 'active' CHECK (status IN ('active', 'completed', 'paused', 'cancelled')),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- Create habits_tracking table
CREATE TABLE IF NOT EXISTS habits_tracking (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    date_recorded DATE NOT NULL,
    morning_measurements JSONB,
    evening_measurements JSONB,
    daily_habits JSONB, -- { diet_quality, exercise_minutes, sleep_hours, water_intake, stress_level }
    mood_rating INTEGER CHECK (mood_rating >= 1 AND mood_rating <= 10),
    sleep_hours DECIMAL(4,2),
    water_intake_liters DECIMAL(4,2),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    UNIQUE(user_id, date_recorded)
);

-- Create communities table
CREATE TABLE IF NOT EXISTS communities (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    name VARCHAR(200) NOT NULL,
    description TEXT,
    creator_user_id UUID NOT NULL REFERENCES users(id),
    max_members INTEGER DEFAULT 50,
    start_date DATE,
    end_date DATE,
    is_active BOOLEAN DEFAULT TRUE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- Create community_members table
CREATE TABLE IF NOT EXISTS community_members (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    community_id UUID NOT NULL REFERENCES communities(id) ON DELETE CASCADE,
    user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    join_date DATE DEFAULT CURRENT_DATE,
    role VARCHAR(20) DEFAULT 'member' CHECK (role IN ('member', 'moderator', 'admin')),
    is_active BOOLEAN DEFAULT TRUE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    UNIQUE(community_id, user_id)
);

-- Create community_posts table
CREATE TABLE IF NOT EXISTS community_posts (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    community_id UUID NOT NULL REFERENCES communities(id) ON DELETE CASCADE,
    author_user_id UUID NOT NULL REFERENCES users(id),
    title VARCHAR(300),
    content TEXT NOT NULL,
    post_type VARCHAR(20) DEFAULT 'discussion' CHECK (post_type IN ('discussion', 'achievement', 'challenge', 'resource')),
    likes_count INTEGER DEFAULT 0,
    comments_count INTEGER DEFAULT 0,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- Create indexes for better performance
CREATE INDEX idx_health_metrics_user_id ON health_metrics(user_id);
CREATE INDEX idx_health_metrics_measurement_date ON health_metrics(measurement_date);
CREATE INDEX idx_users_email ON users(email);
CREATE INDEX idx_habits_tracking_user_id_date ON habits_tracking(user_id, date_recorded);
CREATE INDEX idx_weight_loss_plans_user_id ON weight_loss_plans(user_id);
CREATE INDEX idx_community_posts_community_id ON community_posts(community_id);
CREATE INDEX idx_community_members_user_id ON community_members(user_id);
CREATE INDEX idx_community_members_community_id ON community_members(community_id);

-- Function to update the updated_at timestamp
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = CURRENT_TIMESTAMP;
    RETURN NEW;
END;
$$ language 'plpgsql';

-- Triggers to automatically update the updated_at column
CREATE TRIGGER update_users_updated_at BEFORE UPDATE ON users FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_health_metrics_updated_at BEFORE UPDATE ON health_metrics FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_weight_loss_plans_updated_at BEFORE UPDATE ON weight_loss_plans FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_habits_tracking_updated_at BEFORE UPDATE ON habits_tracking FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_communities_updated_at BEFORE UPDATE ON communities FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_community_members_updated_at BEFORE UPDATE ON community_members FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_community_posts_updated_at BEFORE UPDATE ON community_posts FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();