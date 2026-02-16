use axum::{
    async_trait,
    extract::{FromRequestParts, State},
    http::{request::Parts, StatusCode},
    response::{IntoResponse, Response},
    Json, RequestPartsExt,
};
use axum_extra::{
    headers::{authorization::Bearer, Authorization},
    TypedHeader,
};
use jsonwebtoken::{decode, encode, DecodingKey, EncodingKey, Header, Validation};
use serde::{Deserialize, Serialize};
use sqlx::FromRow;
use std::sync::Arc;

use crate::AppState;

// JWT secret - in production, use environment variable
fn get_jwt_secret() -> String {
    std::env::var("JWT_SECRET").unwrap_or_else(|_| "water_conference_2026_secret_key_change_in_production".to_string())
}

// JWT expiration time in hours
const JWT_EXPIRATION_HOURS: i64 = 24;

#[derive(Debug, Serialize, Deserialize)]
pub struct Claims {
    pub sub: i64,           // user id
    pub username: String,
    pub role: String,
    pub exp: usize,         // expiration time
    pub iat: usize,         // issued at
}

#[derive(Debug, Serialize, Deserialize, FromRow)]
pub struct AdminUser {
    pub id: i64,
    pub username: String,
    pub password_hash: String,
    pub email: Option<String>,
    pub full_name: Option<String>,
    pub role: String,
    pub is_active: i64,
    pub last_login: Option<String>,
    pub created_at: Option<String>,
    pub updated_at: Option<String>,
}

#[derive(Debug, Serialize)]
pub struct AdminUserResponse {
    pub id: i64,
    pub username: String,
    pub email: Option<String>,
    pub full_name: Option<String>,
    pub role: String,
}

impl From<AdminUser> for AdminUserResponse {
    fn from(user: AdminUser) -> Self {
        Self {
            id: user.id,
            username: user.username,
            email: user.email,
            full_name: user.full_name,
            role: user.role,
        }
    }
}

#[derive(Debug, Deserialize)]
pub struct LoginRequest {
    pub username: String,
    pub password: String,
}

#[derive(Debug, Serialize)]
pub struct LoginResponse {
    pub token: String,
    pub user: AdminUserResponse,
}

#[derive(Debug, Serialize)]
pub struct AuthError {
    pub message: String,
}

impl IntoResponse for AuthError {
    fn into_response(self) -> Response {
        (StatusCode::UNAUTHORIZED, Json(self)).into_response()
    }
}

// Generate JWT token
pub fn create_token(user: &AdminUser) -> Result<String, jsonwebtoken::errors::Error> {
    let now = chrono::Utc::now();
    let exp = now + chrono::Duration::hours(JWT_EXPIRATION_HOURS);

    let claims = Claims {
        sub: user.id,
        username: user.username.clone(),
        role: user.role.clone(),
        exp: exp.timestamp() as usize,
        iat: now.timestamp() as usize,
    };

    encode(
        &Header::default(),
        &claims,
        &EncodingKey::from_secret(get_jwt_secret().as_bytes()),
    )
}

// Verify JWT token
pub fn verify_token(token: &str) -> Result<Claims, jsonwebtoken::errors::Error> {
    let token_data = decode::<Claims>(
        token,
        &DecodingKey::from_secret(get_jwt_secret().as_bytes()),
        &Validation::default(),
    )?;
    Ok(token_data.claims)
}

// Verify password
pub fn verify_password(password: &str, hash: &str) -> bool {
    bcrypt::verify(password, hash).unwrap_or(false)
}

// Hash password
pub fn hash_password(password: &str) -> Result<String, bcrypt::BcryptError> {
    bcrypt::hash(password, 12)
}

// Auth extractor - extracts and validates JWT from request
pub struct AuthUser {
    pub user_id: i64,
    pub username: String,
    pub role: String,
}

#[async_trait]
impl<S> FromRequestParts<S> for AuthUser
where
    S: Send + Sync,
{
    type Rejection = AuthError;

    async fn from_request_parts(parts: &mut Parts, _state: &S) -> Result<Self, Self::Rejection> {
        // Extract the Authorization header
        let TypedHeader(Authorization(bearer)) = parts
            .extract::<TypedHeader<Authorization<Bearer>>>()
            .await
            .map_err(|_| AuthError {
                message: "Missing or invalid authorization header".to_string(),
            })?;

        // Verify the token
        let claims = verify_token(bearer.token()).map_err(|_| AuthError {
            message: "Invalid or expired token".to_string(),
        })?;

        Ok(AuthUser {
            user_id: claims.sub,
            username: claims.username,
            role: claims.role,
        })
    }
}

// Login handler
pub async fn login(
    State(state): State<Arc<AppState>>,
    Json(payload): Json<LoginRequest>,
) -> Result<Json<LoginResponse>, (StatusCode, Json<AuthError>)> {
    // Find user by username
    let user: Option<AdminUser> = sqlx::query_as(
        "SELECT * FROM admin_users WHERE username = ? AND is_active = 1"
    )
    .bind(&payload.username)
    .fetch_optional(&state.db)
    .await
    .map_err(|_| (
        StatusCode::INTERNAL_SERVER_ERROR,
        Json(AuthError { message: "Database error".to_string() })
    ))?;

    let user = user.ok_or((
        StatusCode::UNAUTHORIZED,
        Json(AuthError { message: "Invalid username or password".to_string() })
    ))?;

    // Verify password
    if !verify_password(&payload.password, &user.password_hash) {
        return Err((
            StatusCode::UNAUTHORIZED,
            Json(AuthError { message: "Invalid username or password".to_string() })
        ));
    }

    // Update last login
    let _ = sqlx::query("UPDATE admin_users SET last_login = datetime('now') WHERE id = ?")
        .bind(user.id)
        .execute(&state.db)
        .await;

    // Generate token
    let token = create_token(&user).map_err(|_| (
        StatusCode::INTERNAL_SERVER_ERROR,
        Json(AuthError { message: "Failed to create token".to_string() })
    ))?;

    Ok(Json(LoginResponse {
        token,
        user: user.into(),
    }))
}

// Change password request
#[derive(Debug, Deserialize)]
pub struct ChangePasswordRequest {
    pub current_password: String,
    pub new_password: String,
}

#[derive(Debug, Serialize)]
pub struct ChangePasswordResponse {
    pub success: bool,
    pub message: String,
}

// Change password handler
pub async fn change_password(
    State(state): State<Arc<AppState>>,
    auth: AuthUser,
    Json(payload): Json<ChangePasswordRequest>,
) -> Result<Json<ChangePasswordResponse>, (StatusCode, Json<AuthError>)> {
    // Validate new password length
    if payload.new_password.len() < 6 {
        return Err((
            StatusCode::BAD_REQUEST,
            Json(AuthError { message: "New password must be at least 6 characters".to_string() })
        ));
    }

    // Fetch current user
    let user: Option<AdminUser> = sqlx::query_as(
        "SELECT * FROM admin_users WHERE id = ? AND is_active = 1"
    )
    .bind(auth.user_id)
    .fetch_optional(&state.db)
    .await
    .map_err(|_| (
        StatusCode::INTERNAL_SERVER_ERROR,
        Json(AuthError { message: "Database error".to_string() })
    ))?;

    let user = user.ok_or((
        StatusCode::NOT_FOUND,
        Json(AuthError { message: "User not found".to_string() })
    ))?;

    // Verify current password
    if !verify_password(&payload.current_password, &user.password_hash) {
        return Err((
            StatusCode::BAD_REQUEST,
            Json(AuthError { message: "Current password is incorrect".to_string() })
        ));
    }

    // Hash new password
    let new_hash = hash_password(&payload.new_password).map_err(|_| (
        StatusCode::INTERNAL_SERVER_ERROR,
        Json(AuthError { message: "Failed to hash password".to_string() })
    ))?;

    // Update password in database
    sqlx::query("UPDATE admin_users SET password_hash = ?, updated_at = datetime('now') WHERE id = ?")
        .bind(&new_hash)
        .bind(auth.user_id)
        .execute(&state.db)
        .await
        .map_err(|_| (
            StatusCode::INTERNAL_SERVER_ERROR,
            Json(AuthError { message: "Failed to update password".to_string() })
        ))?;

    Ok(Json(ChangePasswordResponse {
        success: true,
        message: "Password changed successfully".to_string(),
    }))
}

// Get current user handler
pub async fn me(
    State(state): State<Arc<AppState>>,
    auth: AuthUser,
) -> Result<Json<AdminUserResponse>, (StatusCode, Json<AuthError>)> {
    let user: Option<AdminUser> = sqlx::query_as(
        "SELECT * FROM admin_users WHERE id = ? AND is_active = 1"
    )
    .bind(auth.user_id)
    .fetch_optional(&state.db)
    .await
    .map_err(|_| (
        StatusCode::INTERNAL_SERVER_ERROR,
        Json(AuthError { message: "Database error".to_string() })
    ))?;

    let user = user.ok_or((
        StatusCode::NOT_FOUND,
        Json(AuthError { message: "User not found".to_string() })
    ))?;

    Ok(Json(user.into()))
}
