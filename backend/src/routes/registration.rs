use axum::{
    extract::{Path, State},
    http::StatusCode,
    Json,
};
use serde::{Deserialize, Serialize};
use sqlx::FromRow;
use std::sync::Arc;
use uuid::Uuid;
use validator::Validate;

use crate::AppState;

#[derive(Debug, Serialize, Deserialize, FromRow)]
pub struct Registration {
    pub id: i64,
    pub uuid: String,
    pub first_name: String,
    pub last_name: String,
    pub email: String,
    pub phone: Option<String>,
    pub organization: Option<String>,
    pub position: Option<String>,
    pub country: String,
    pub participation_type: String,
    pub dietary_requirements: Option<String>,
    pub accessibility_needs: Option<String>,
    pub status: String,
    pub created_at: Option<String>,
    pub updated_at: Option<String>,
}

#[derive(Debug, Deserialize, Validate)]
pub struct CreateRegistration {
    #[validate(length(min = 1, max = 100))]
    pub first_name: String,
    #[validate(length(min = 1, max = 100))]
    pub last_name: String,
    #[validate(email)]
    pub email: String,
    #[validate(length(max = 20))]
    pub phone: Option<String>,
    #[validate(length(max = 200))]
    pub organization: Option<String>,
    #[validate(length(max = 100))]
    pub position: Option<String>,
    #[validate(length(min = 2, max = 100))]
    pub country: String,
    pub participation_type: String,
    pub dietary_requirements: Option<String>,
    pub accessibility_needs: Option<String>,
}

#[derive(Debug, Serialize)]
pub struct RegistrationResponse {
    pub id: String,
    pub message: String,
    pub status: String,
}

#[derive(Debug, FromRow)]
struct ExistingCheck {
    id: i64,
}

pub async fn register(
    State(state): State<Arc<AppState>>,
    Json(payload): Json<CreateRegistration>,
) -> Result<(StatusCode, Json<RegistrationResponse>), (StatusCode, String)> {
    // Validate input
    payload.validate().map_err(|e| (StatusCode::BAD_REQUEST, e.to_string()))?;

    // Check for existing registration
    let existing: Option<ExistingCheck> = sqlx::query_as::<_, ExistingCheck>(
        "SELECT id FROM registrations WHERE email = ?"
    )
    .bind(&payload.email)
    .fetch_optional(&state.db)
    .await
    .map_err(|e| (StatusCode::INTERNAL_SERVER_ERROR, e.to_string()))?;

    if existing.is_some() {
        return Err((StatusCode::CONFLICT, "Email already registered".to_string()));
    }

    // Generate UUID
    let uuid = Uuid::new_v4().to_string();

    // Insert registration
    sqlx::query(
        r#"
        INSERT INTO registrations (
            uuid, first_name, last_name, email, phone,
            organization, position, country, participation_type,
            dietary_requirements, accessibility_needs, status
        ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, 'pending')
        "#
    )
    .bind(&uuid)
    .bind(&payload.first_name)
    .bind(&payload.last_name)
    .bind(&payload.email)
    .bind(&payload.phone)
    .bind(&payload.organization)
    .bind(&payload.position)
    .bind(&payload.country)
    .bind(&payload.participation_type)
    .bind(&payload.dietary_requirements)
    .bind(&payload.accessibility_needs)
    .execute(&state.db)
    .await
    .map_err(|e| (StatusCode::INTERNAL_SERVER_ERROR, e.to_string()))?;

    tracing::info!("New registration created: {}", uuid);

    Ok((
        StatusCode::CREATED,
        Json(RegistrationResponse {
            id: uuid,
            message: "Registration successful".to_string(),
            status: "pending".to_string(),
        }),
    ))
}

pub async fn get_registration(
    State(state): State<Arc<AppState>>,
    Path(id): Path<String>,
) -> Result<Json<Registration>, (StatusCode, String)> {
    let registration = sqlx::query_as::<_, Registration>(
        "SELECT * FROM registrations WHERE uuid = ?"
    )
    .bind(&id)
    .fetch_optional(&state.db)
    .await
    .map_err(|e| (StatusCode::INTERNAL_SERVER_ERROR, e.to_string()))?;

    match registration {
        Some(r) => Ok(Json(r)),
        None => Err((StatusCode::NOT_FOUND, "Registration not found".to_string())),
    }
}
