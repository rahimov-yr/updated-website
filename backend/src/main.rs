use axum::{
    http::{header, Method},
    routing::{get, post, put, delete},
    Router,
};
use sqlx::sqlite::SqlitePool;
use std::sync::Arc;
use tower_http::cors::{Any, CorsLayer};
use tower_http::trace::TraceLayer;
use tracing_subscriber::{layer::SubscriberExt, util::SubscriberInitExt};

mod routes;
mod models;
mod db;
mod error;
mod auth;

use routes::{news, program, registration, health, speakers, partners, countries, navigation, excursions, settings, admin};

// Application state shared across handlers
pub struct AppState {
    pub db: SqlitePool,
}

// Ensure default admin user exists on startup
async fn ensure_admin_user(pool: &SqlitePool) -> anyhow::Result<()> {
    // Check if admin user exists
    let admin: Option<(i64, String)> = sqlx::query_as(
        "SELECT id, password_hash FROM admin_users WHERE username = 'admin'"
    )
    .fetch_optional(pool)
    .await?;

    match admin {
        Some((id, hash)) => {
            // Verify the hash is valid for 'admin123'
            if !auth::verify_password("admin123", &hash) {
                // Hash is invalid, update it
                let new_hash = auth::hash_password("admin123")
                    .map_err(|e| anyhow::anyhow!("Failed to hash password: {}", e))?;

                sqlx::query("UPDATE admin_users SET password_hash = ? WHERE id = ?")
                    .bind(&new_hash)
                    .bind(id)
                    .execute(pool)
                    .await?;

                tracing::info!("Updated admin user password hash");
            }
        }
        None => {
            // Create default admin user with password 'admin123'
            let password_hash = auth::hash_password("admin123")
                .map_err(|e| anyhow::anyhow!("Failed to hash password: {}", e))?;

            sqlx::query(
                "INSERT INTO admin_users (username, password_hash, email, full_name, role, is_active)
                 VALUES (?, ?, ?, ?, ?, 1)"
            )
            .bind("admin")
            .bind(&password_hash)
            .bind("admin@waterconference.tj")
            .bind("Administrator")
            .bind("superadmin")
            .execute(pool)
            .await?;

            tracing::info!("Created default admin user (username: admin, password: admin123)");
        }
    }

    Ok(())
}

#[tokio::main]
async fn main() -> anyhow::Result<()> {
    // Load environment variables
    dotenvy::dotenv().ok();

    // Initialize tracing
    tracing_subscriber::registry()
        .with(tracing_subscriber::EnvFilter::new(
            std::env::var("RUST_LOG").unwrap_or_else(|_| "info,tower_http=debug".into()),
        ))
        .with(tracing_subscriber::fmt::layer())
        .init();

    // Database connection
    let database_url = std::env::var("DATABASE_URL")
        .unwrap_or_else(|_| "sqlite:./data/conference.db?mode=rwc".to_string());

    let pool = SqlitePool::connect(&database_url).await?;

    // Run migrations
    sqlx::migrate!("./migrations").run(&pool).await?;

    tracing::info!("Database connected and migrations applied");

    // Ensure default admin user exists
    ensure_admin_user(&pool).await?;

    let state = Arc::new(AppState { db: pool });

    // CORS configuration
    let cors = CorsLayer::new()
        .allow_origin(Any)
        .allow_methods([Method::GET, Method::POST, Method::PUT, Method::DELETE])
        .allow_headers([header::CONTENT_TYPE, header::AUTHORIZATION]);

    // Build router
    let app = Router::new()
        // Health check
        .route("/api/health", get(health::health_check))
        // News routes
        .route("/api/news", get(news::list_news))
        .route("/api/news/:id", get(news::get_news))
        // Program routes
        .route("/api/program", get(program::get_program))
        .route("/api/program/days", get(program::get_days))
        .route("/api/program/day/:day", get(program::get_day_events))
        // Registration routes
        .route("/api/registration", post(registration::register))
        .route("/api/registration/:id", get(registration::get_registration))
        // Speakers routes
        .route("/api/speakers", get(speakers::list_speakers))
        .route("/api/speakers/:id", get(speakers::get_speaker))
        // Partners routes
        .route("/api/partners", get(partners::list_partners))
        // Countries routes
        .route("/api/countries", get(countries::list_countries))
        // Navigation routes
        .route("/api/navigation", get(navigation::get_navigation))
        .route("/api/social-links", get(navigation::get_social_links))
        // Excursions routes
        .route("/api/excursions", get(excursions::list_excursions))
        .route("/api/excursions/:slug", get(excursions::get_excursion))
        // Settings routes
        .route("/api/settings", get(settings::get_settings))
        .route("/api/hotels", get(settings::list_hotels))
        // ============================================
        // ADMIN ROUTES (Protected by JWT)
        // ============================================
        // Auth routes
        .route("/api/admin/login", post(auth::login))
        .route("/api/admin/me", get(auth::me))
        .route("/api/admin/change-password", post(auth::change_password))
        // Dashboard
        .route("/api/admin/dashboard", get(admin::get_dashboard_stats))
        .route("/api/admin/dashboard/trends", get(admin::get_dashboard_trends))
        // News admin - combine methods for same path
        .route("/api/admin/news", get(admin::list_news_admin).post(admin::create_news))
        .route("/api/admin/news/:id", get(admin::get_news_admin).put(admin::update_news).delete(admin::delete_news))
        // Speakers admin
        .route("/api/admin/speakers", get(admin::list_speakers_admin).post(admin::create_speaker))
        .route("/api/admin/speakers/:id", get(admin::get_speaker_admin).put(admin::update_speaker).delete(admin::delete_speaker))
        // Partners admin
        .route("/api/admin/partners", get(admin::list_partners_admin).post(admin::create_partner))
        .route("/api/admin/partners/:id", put(admin::update_partner).delete(admin::delete_partner))
        // Registrations admin
        .route("/api/admin/registrations", get(admin::list_registrations_admin))
        .route("/api/admin/registrations/:id/status", put(admin::update_registration_status))
        .route("/api/admin/registrations/:id", delete(admin::delete_registration))
        // Settings admin
        .route("/api/admin/settings", get(admin::list_settings_admin).put(admin::update_settings))
        // File upload
        .route("/api/admin/upload", post(admin::upload_file))
        // Serve uploaded files
        .nest_service("/uploads", tower_http::services::ServeDir::new("./uploads"))
        // Serve static files (frontend build) with SPA fallback
        // In production (Railway), frontend is in ./static; in dev, it's in ../frontend/dist
        .fallback_service({
            let static_dir = if std::path::Path::new("./static").exists() { "./static" } else { "../frontend/dist" };
            let index_file = if std::path::Path::new("./static").exists() { "./static/index.html" } else { "../frontend/dist/index.html" };
            tower_http::services::ServeDir::new(static_dir)
                .fallback(tower_http::services::ServeFile::new(index_file))
        })
        .layer(cors)
        .layer(TraceLayer::new_for_http())
        .with_state(state);

    // Start server
    // Railway uses PORT env variable, fallback to SERVER_ADDR or default
    let port = std::env::var("PORT").unwrap_or_else(|_| "3000".to_string());
    let addr = std::env::var("SERVER_ADDR").unwrap_or_else(|_| format!("0.0.0.0:{}", port));
    let listener = tokio::net::TcpListener::bind(&addr).await?;

    tracing::info!("Server running on http://{}", addr);

    axum::serve(listener, app).await?;

    Ok(())
}
