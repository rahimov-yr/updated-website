use axum::{
    extract::{Multipart, Path, Query, State},
    http::StatusCode,
    Json,
};
use serde::{Deserialize, Serialize};
use sqlx::FromRow;
use std::sync::Arc;
use tokio::fs;
use tokio::io::AsyncWriteExt;

use crate::auth::AuthUser;
use crate::AppState;

// ============================================
// COMMON TYPES
// ============================================

#[derive(Debug, Serialize)]
pub struct ApiResponse<T> {
    pub success: bool,
    pub data: Option<T>,
    pub message: Option<String>,
}

#[derive(Debug, Serialize)]
pub struct DeleteResponse {
    pub success: bool,
    pub message: String,
}

#[derive(Debug, Deserialize)]
pub struct PaginationQuery {
    pub page: Option<i64>,
    pub limit: Option<i64>,
    pub search: Option<String>,
}

#[derive(Debug, Serialize)]
pub struct PaginatedResponse<T> {
    pub items: Vec<T>,
    pub total: i64,
    pub page: i64,
    pub limit: i64,
    pub total_pages: i64,
}

// ============================================
// NEWS ADMIN
// ============================================

#[derive(Debug, Serialize, Deserialize, FromRow)]
pub struct NewsItem {
    pub id: i64,
    pub slug: String,
    pub category: String,
    pub title_ru: String,
    pub title_en: String,
    pub title_tj: String,
    pub excerpt_ru: String,
    pub excerpt_en: String,
    pub excerpt_tj: String,
    pub content_ru: String,
    pub content_en: String,
    pub content_tj: String,
    pub image: String,
    pub published_at: String,
    pub created_at: Option<String>,
    pub updated_at: Option<String>,
}

#[derive(Debug, Deserialize)]
pub struct CreateNewsRequest {
    pub slug: String,
    pub category: String,
    pub title_ru: String,
    pub title_en: String,
    pub title_tj: String,
    pub excerpt_ru: String,
    pub excerpt_en: String,
    pub excerpt_tj: String,
    pub content_ru: String,
    pub content_en: String,
    pub content_tj: String,
    pub image: String,
    pub published_at: String,
}

#[derive(Debug, FromRow)]
struct CountResult {
    count: i64,
}

pub async fn list_news_admin(
    State(state): State<Arc<AppState>>,
    _auth: AuthUser,
    Query(query): Query<PaginationQuery>,
) -> Result<Json<PaginatedResponse<NewsItem>>, (StatusCode, String)> {
    let page = query.page.unwrap_or(1);
    let limit = query.limit.unwrap_or(10);
    let offset = (page - 1) * limit;

    let search = query.search.unwrap_or_default();
    let search_pattern = format!("%{}%", search);

    let items: Vec<NewsItem> = sqlx::query_as(
        r#"SELECT * FROM news
           WHERE title_ru LIKE ? OR title_en LIKE ? OR slug LIKE ?
           ORDER BY published_at DESC
           LIMIT ? OFFSET ?"#
    )
    .bind(&search_pattern)
    .bind(&search_pattern)
    .bind(&search_pattern)
    .bind(limit)
    .bind(offset)
    .fetch_all(&state.db)
    .await
    .map_err(|e| (StatusCode::INTERNAL_SERVER_ERROR, e.to_string()))?;

    let total: CountResult = sqlx::query_as(
        "SELECT COUNT(*) as count FROM news WHERE title_ru LIKE ? OR title_en LIKE ? OR slug LIKE ?"
    )
    .bind(&search_pattern)
    .bind(&search_pattern)
    .bind(&search_pattern)
    .fetch_one(&state.db)
    .await
    .map_err(|e| (StatusCode::INTERNAL_SERVER_ERROR, e.to_string()))?;

    let total_pages = (total.count as f64 / limit as f64).ceil() as i64;

    Ok(Json(PaginatedResponse {
        items,
        total: total.count,
        page,
        limit,
        total_pages,
    }))
}

pub async fn get_news_admin(
    State(state): State<Arc<AppState>>,
    _auth: AuthUser,
    Path(id): Path<i64>,
) -> Result<Json<NewsItem>, (StatusCode, String)> {
    let news: Option<NewsItem> = sqlx::query_as("SELECT * FROM news WHERE id = ?")
        .bind(id)
        .fetch_optional(&state.db)
        .await
        .map_err(|e| (StatusCode::INTERNAL_SERVER_ERROR, e.to_string()))?;

    news.map(Json).ok_or((StatusCode::NOT_FOUND, "News not found".to_string()))
}

pub async fn create_news(
    State(state): State<Arc<AppState>>,
    _auth: AuthUser,
    Json(payload): Json<CreateNewsRequest>,
) -> Result<(StatusCode, Json<NewsItem>), (StatusCode, String)> {
    sqlx::query(
        r#"INSERT INTO news (slug, category, title_ru, title_en, title_tj, excerpt_ru, excerpt_en, excerpt_tj,
           content_ru, content_en, content_tj, image, published_at)
           VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)"#
    )
    .bind(&payload.slug)
    .bind(&payload.category)
    .bind(&payload.title_ru)
    .bind(&payload.title_en)
    .bind(&payload.title_tj)
    .bind(&payload.excerpt_ru)
    .bind(&payload.excerpt_en)
    .bind(&payload.excerpt_tj)
    .bind(&payload.content_ru)
    .bind(&payload.content_en)
    .bind(&payload.content_tj)
    .bind(&payload.image)
    .bind(&payload.published_at)
    .execute(&state.db)
    .await
    .map_err(|e| (StatusCode::INTERNAL_SERVER_ERROR, e.to_string()))?;

    let news: NewsItem = sqlx::query_as("SELECT * FROM news WHERE slug = ?")
        .bind(&payload.slug)
        .fetch_one(&state.db)
        .await
        .map_err(|e| (StatusCode::INTERNAL_SERVER_ERROR, e.to_string()))?;

    Ok((StatusCode::CREATED, Json(news)))
}

pub async fn update_news(
    State(state): State<Arc<AppState>>,
    _auth: AuthUser,
    Path(id): Path<i64>,
    Json(payload): Json<CreateNewsRequest>,
) -> Result<Json<NewsItem>, (StatusCode, String)> {
    sqlx::query(
        r#"UPDATE news SET slug = ?, category = ?, title_ru = ?, title_en = ?, title_tj = ?,
           excerpt_ru = ?, excerpt_en = ?, excerpt_tj = ?, content_ru = ?, content_en = ?, content_tj = ?,
           image = ?, published_at = ?, updated_at = datetime('now') WHERE id = ?"#
    )
    .bind(&payload.slug)
    .bind(&payload.category)
    .bind(&payload.title_ru)
    .bind(&payload.title_en)
    .bind(&payload.title_tj)
    .bind(&payload.excerpt_ru)
    .bind(&payload.excerpt_en)
    .bind(&payload.excerpt_tj)
    .bind(&payload.content_ru)
    .bind(&payload.content_en)
    .bind(&payload.content_tj)
    .bind(&payload.image)
    .bind(&payload.published_at)
    .bind(id)
    .execute(&state.db)
    .await
    .map_err(|e| (StatusCode::INTERNAL_SERVER_ERROR, e.to_string()))?;

    let news: NewsItem = sqlx::query_as("SELECT * FROM news WHERE id = ?")
        .bind(id)
        .fetch_one(&state.db)
        .await
        .map_err(|e| (StatusCode::INTERNAL_SERVER_ERROR, e.to_string()))?;

    Ok(Json(news))
}

pub async fn delete_news(
    State(state): State<Arc<AppState>>,
    _auth: AuthUser,
    Path(id): Path<i64>,
) -> Result<Json<DeleteResponse>, (StatusCode, String)> {
    sqlx::query("DELETE FROM news WHERE id = ?")
        .bind(id)
        .execute(&state.db)
        .await
        .map_err(|e| (StatusCode::INTERNAL_SERVER_ERROR, e.to_string()))?;

    Ok(Json(DeleteResponse {
        success: true,
        message: "News deleted successfully".to_string(),
    }))
}

// ============================================
// SPEAKERS ADMIN
// ============================================

#[derive(Debug, Serialize, Deserialize, FromRow)]
pub struct Speaker {
    pub id: i64,
    pub name_ru: String,
    pub name_en: String,
    pub name_tj: String,
    pub title_ru: String,
    pub title_en: String,
    pub title_tj: String,
    pub bio_ru: Option<String>,
    pub bio_en: Option<String>,
    pub bio_tj: Option<String>,
    pub organization_ru: Option<String>,
    pub organization_en: Option<String>,
    pub organization_tj: Option<String>,
    pub country_ru: Option<String>,
    pub country_en: Option<String>,
    pub country_tj: Option<String>,
    pub email: Option<String>,
    pub expertise: Option<String>,
    pub achievements: Option<String>,
    pub publications: Option<String>,
    pub session_title_ru: Option<String>,
    pub session_title_en: Option<String>,
    pub session_title_tj: Option<String>,
    pub session_time_ru: Option<String>,
    pub session_time_en: Option<String>,
    pub session_time_tj: Option<String>,
    pub session_description_ru: Option<String>,
    pub session_description_en: Option<String>,
    pub session_description_tj: Option<String>,
    pub image: String,
    pub image_source: Option<String>,
    pub image_position: Option<String>,
    pub flag_url: Option<String>,
    pub flag_alt_ru: Option<String>,
    pub flag_alt_en: Option<String>,
    pub flag_alt_tj: Option<String>,
    pub sort_order: i64,
    pub clickable: i64,
}

#[derive(Debug, Deserialize)]
pub struct CreateSpeakerRequest {
    pub name_ru: String,
    pub name_en: String,
    pub name_tj: String,
    pub title_ru: String,
    pub title_en: String,
    pub title_tj: String,
    pub bio_ru: Option<String>,
    pub bio_en: Option<String>,
    pub bio_tj: Option<String>,
    pub organization_ru: Option<String>,
    pub organization_en: Option<String>,
    pub organization_tj: Option<String>,
    pub country_ru: Option<String>,
    pub country_en: Option<String>,
    pub country_tj: Option<String>,
    pub email: Option<String>,
    pub expertise: Option<String>,
    pub achievements: Option<String>,
    pub publications: Option<String>,
    pub session_title_ru: Option<String>,
    pub session_title_en: Option<String>,
    pub session_title_tj: Option<String>,
    pub session_time_ru: Option<String>,
    pub session_time_en: Option<String>,
    pub session_time_tj: Option<String>,
    pub session_description_ru: Option<String>,
    pub session_description_en: Option<String>,
    pub session_description_tj: Option<String>,
    pub image: String,
    pub image_source: Option<String>,
    pub image_position: Option<String>,
    pub flag_url: Option<String>,
    pub flag_alt_ru: Option<String>,
    pub flag_alt_en: Option<String>,
    pub flag_alt_tj: Option<String>,
    pub sort_order: Option<i64>,
    #[serde(default = "default_clickable")]
    pub clickable: i64,
}

fn default_clickable() -> i64 {
    1
}

pub async fn list_speakers_admin(
    State(state): State<Arc<AppState>>,
    _auth: AuthUser,
) -> Result<Json<Vec<Speaker>>, (StatusCode, String)> {
    let speakers: Vec<Speaker> = sqlx::query_as("SELECT * FROM speakers ORDER BY sort_order")
        .fetch_all(&state.db)
        .await
        .map_err(|e| (StatusCode::INTERNAL_SERVER_ERROR, e.to_string()))?;

    Ok(Json(speakers))
}

pub async fn get_speaker_admin(
    State(state): State<Arc<AppState>>,
    _auth: AuthUser,
    Path(id): Path<i64>,
) -> Result<Json<Speaker>, (StatusCode, String)> {
    let speaker: Option<Speaker> = sqlx::query_as("SELECT * FROM speakers WHERE id = ?")
        .bind(id)
        .fetch_optional(&state.db)
        .await
        .map_err(|e| (StatusCode::INTERNAL_SERVER_ERROR, e.to_string()))?;

    speaker.map(Json).ok_or((StatusCode::NOT_FOUND, "Speaker not found".to_string()))
}

pub async fn create_speaker(
    State(state): State<Arc<AppState>>,
    _auth: AuthUser,
    Json(payload): Json<CreateSpeakerRequest>,
) -> Result<(StatusCode, Json<Speaker>), (StatusCode, String)> {
    let sort_order = payload.sort_order.unwrap_or(0);
    let clickable = payload.clickable;

    let image_source = payload.image_source.clone().unwrap_or_else(|| "url".to_string());
    let image_position = payload.image_position.clone().unwrap_or_else(|| "center center".to_string());

    sqlx::query(
        r#"INSERT INTO speakers (
           name_ru, name_en, name_tj,
           title_ru, title_en, title_tj,
           bio_ru, bio_en, bio_tj,
           organization_ru, organization_en, organization_tj,
           country_ru, country_en, country_tj,
           email, expertise, achievements, publications,
           session_title_ru, session_title_en, session_title_tj,
           session_time_ru, session_time_en, session_time_tj,
           session_description_ru, session_description_en, session_description_tj,
           image, image_source, image_position,
           flag_url, flag_alt_ru, flag_alt_en, flag_alt_tj,
           sort_order, clickable)
           VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)"#
    )
    .bind(&payload.name_ru)
    .bind(&payload.name_en)
    .bind(&payload.name_tj)
    .bind(&payload.title_ru)
    .bind(&payload.title_en)
    .bind(&payload.title_tj)
    .bind(&payload.bio_ru)
    .bind(&payload.bio_en)
    .bind(&payload.bio_tj)
    .bind(&payload.organization_ru)
    .bind(&payload.organization_en)
    .bind(&payload.organization_tj)
    .bind(&payload.country_ru)
    .bind(&payload.country_en)
    .bind(&payload.country_tj)
    .bind(&payload.email)
    .bind(&payload.expertise)
    .bind(&payload.achievements)
    .bind(&payload.publications)
    .bind(&payload.session_title_ru)
    .bind(&payload.session_title_en)
    .bind(&payload.session_title_tj)
    .bind(&payload.session_time_ru)
    .bind(&payload.session_time_en)
    .bind(&payload.session_time_tj)
    .bind(&payload.session_description_ru)
    .bind(&payload.session_description_en)
    .bind(&payload.session_description_tj)
    .bind(&payload.image)
    .bind(&image_source)
    .bind(&image_position)
    .bind(&payload.flag_url)
    .bind(&payload.flag_alt_ru)
    .bind(&payload.flag_alt_en)
    .bind(&payload.flag_alt_tj)
    .bind(sort_order)
    .bind(clickable)
    .execute(&state.db)
    .await
    .map_err(|e| (StatusCode::INTERNAL_SERVER_ERROR, e.to_string()))?;

    let speaker: Speaker = sqlx::query_as("SELECT * FROM speakers ORDER BY id DESC LIMIT 1")
        .fetch_one(&state.db)
        .await
        .map_err(|e| (StatusCode::INTERNAL_SERVER_ERROR, e.to_string()))?;

    Ok((StatusCode::CREATED, Json(speaker)))
}

pub async fn update_speaker(
    State(state): State<Arc<AppState>>,
    _auth: AuthUser,
    Path(id): Path<i64>,
    Json(payload): Json<CreateSpeakerRequest>,
) -> Result<Json<Speaker>, (StatusCode, String)> {
    let sort_order = payload.sort_order.unwrap_or(0);
    let clickable = payload.clickable;
    println!("UPDATE speaker {}: clickable = {}", id, clickable);
    let image_source = payload.image_source.clone().unwrap_or_else(|| "url".to_string());
    let image_position = payload.image_position.clone().unwrap_or_else(|| "center center".to_string());

    sqlx::query(
        r#"UPDATE speakers SET
           name_ru = ?, name_en = ?, name_tj = ?,
           title_ru = ?, title_en = ?, title_tj = ?,
           bio_ru = ?, bio_en = ?, bio_tj = ?,
           organization_ru = ?, organization_en = ?, organization_tj = ?,
           country_ru = ?, country_en = ?, country_tj = ?,
           email = ?, expertise = ?, achievements = ?, publications = ?,
           session_title_ru = ?, session_title_en = ?, session_title_tj = ?,
           session_time_ru = ?, session_time_en = ?, session_time_tj = ?,
           session_description_ru = ?, session_description_en = ?, session_description_tj = ?,
           image = ?, image_source = ?, image_position = ?,
           flag_url = ?, flag_alt_ru = ?, flag_alt_en = ?, flag_alt_tj = ?,
           sort_order = ?, clickable = ?
           WHERE id = ?"#
    )
    .bind(&payload.name_ru)
    .bind(&payload.name_en)
    .bind(&payload.name_tj)
    .bind(&payload.title_ru)
    .bind(&payload.title_en)
    .bind(&payload.title_tj)
    .bind(&payload.bio_ru)
    .bind(&payload.bio_en)
    .bind(&payload.bio_tj)
    .bind(&payload.organization_ru)
    .bind(&payload.organization_en)
    .bind(&payload.organization_tj)
    .bind(&payload.country_ru)
    .bind(&payload.country_en)
    .bind(&payload.country_tj)
    .bind(&payload.email)
    .bind(&payload.expertise)
    .bind(&payload.achievements)
    .bind(&payload.publications)
    .bind(&payload.session_title_ru)
    .bind(&payload.session_title_en)
    .bind(&payload.session_title_tj)
    .bind(&payload.session_time_ru)
    .bind(&payload.session_time_en)
    .bind(&payload.session_time_tj)
    .bind(&payload.session_description_ru)
    .bind(&payload.session_description_en)
    .bind(&payload.session_description_tj)
    .bind(&payload.image)
    .bind(&image_source)
    .bind(&image_position)
    .bind(&payload.flag_url)
    .bind(&payload.flag_alt_ru)
    .bind(&payload.flag_alt_en)
    .bind(&payload.flag_alt_tj)
    .bind(sort_order)
    .bind(clickable)
    .bind(id)
    .execute(&state.db)
    .await
    .map_err(|e| (StatusCode::INTERNAL_SERVER_ERROR, e.to_string()))?;

    let speaker: Speaker = sqlx::query_as("SELECT * FROM speakers WHERE id = ?")
        .bind(id)
        .fetch_one(&state.db)
        .await
        .map_err(|e| (StatusCode::INTERNAL_SERVER_ERROR, e.to_string()))?;

    Ok(Json(speaker))
}

pub async fn delete_speaker(
    State(state): State<Arc<AppState>>,
    _auth: AuthUser,
    Path(id): Path<i64>,
) -> Result<Json<DeleteResponse>, (StatusCode, String)> {
    sqlx::query("DELETE FROM speakers WHERE id = ?")
        .bind(id)
        .execute(&state.db)
        .await
        .map_err(|e| (StatusCode::INTERNAL_SERVER_ERROR, e.to_string()))?;

    Ok(Json(DeleteResponse {
        success: true,
        message: "Speaker deleted successfully".to_string(),
    }))
}

// ============================================
// PARTNERS ADMIN
// ============================================

#[derive(Debug, Serialize, Deserialize, FromRow)]
pub struct Partner {
    pub id: i64,
    pub name: String,
    pub logo: String,
    pub website: Option<String>,
    pub partner_type: String,
    pub sort_order: i64,
}

#[derive(Debug, Deserialize)]
pub struct CreatePartnerRequest {
    pub name: String,
    pub logo: String,
    pub website: Option<String>,
    pub partner_type: String,
    pub sort_order: Option<i64>,
}

pub async fn list_partners_admin(
    State(state): State<Arc<AppState>>,
    _auth: AuthUser,
) -> Result<Json<Vec<Partner>>, (StatusCode, String)> {
    let partners: Vec<Partner> = sqlx::query_as("SELECT * FROM partners ORDER BY sort_order")
        .fetch_all(&state.db)
        .await
        .map_err(|e| (StatusCode::INTERNAL_SERVER_ERROR, e.to_string()))?;

    Ok(Json(partners))
}

pub async fn create_partner(
    State(state): State<Arc<AppState>>,
    _auth: AuthUser,
    Json(payload): Json<CreatePartnerRequest>,
) -> Result<(StatusCode, Json<Partner>), (StatusCode, String)> {
    let sort_order = payload.sort_order.unwrap_or(0);

    sqlx::query(
        "INSERT INTO partners (name, logo, website, partner_type, sort_order) VALUES (?, ?, ?, ?, ?)"
    )
    .bind(&payload.name)
    .bind(&payload.logo)
    .bind(&payload.website)
    .bind(&payload.partner_type)
    .bind(sort_order)
    .execute(&state.db)
    .await
    .map_err(|e| (StatusCode::INTERNAL_SERVER_ERROR, e.to_string()))?;

    let partner: Partner = sqlx::query_as("SELECT * FROM partners ORDER BY id DESC LIMIT 1")
        .fetch_one(&state.db)
        .await
        .map_err(|e| (StatusCode::INTERNAL_SERVER_ERROR, e.to_string()))?;

    Ok((StatusCode::CREATED, Json(partner)))
}

pub async fn update_partner(
    State(state): State<Arc<AppState>>,
    _auth: AuthUser,
    Path(id): Path<i64>,
    Json(payload): Json<CreatePartnerRequest>,
) -> Result<Json<Partner>, (StatusCode, String)> {
    let sort_order = payload.sort_order.unwrap_or(0);

    sqlx::query(
        "UPDATE partners SET name = ?, logo = ?, website = ?, partner_type = ?, sort_order = ? WHERE id = ?"
    )
    .bind(&payload.name)
    .bind(&payload.logo)
    .bind(&payload.website)
    .bind(&payload.partner_type)
    .bind(sort_order)
    .bind(id)
    .execute(&state.db)
    .await
    .map_err(|e| (StatusCode::INTERNAL_SERVER_ERROR, e.to_string()))?;

    let partner: Partner = sqlx::query_as("SELECT * FROM partners WHERE id = ?")
        .bind(id)
        .fetch_one(&state.db)
        .await
        .map_err(|e| (StatusCode::INTERNAL_SERVER_ERROR, e.to_string()))?;

    Ok(Json(partner))
}

pub async fn delete_partner(
    State(state): State<Arc<AppState>>,
    _auth: AuthUser,
    Path(id): Path<i64>,
) -> Result<Json<DeleteResponse>, (StatusCode, String)> {
    sqlx::query("DELETE FROM partners WHERE id = ?")
        .bind(id)
        .execute(&state.db)
        .await
        .map_err(|e| (StatusCode::INTERNAL_SERVER_ERROR, e.to_string()))?;

    Ok(Json(DeleteResponse {
        success: true,
        message: "Partner deleted successfully".to_string(),
    }))
}

// ============================================
// REGISTRATIONS ADMIN
// ============================================

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

#[derive(Debug, Deserialize)]
pub struct RegistrationQuery {
    pub page: Option<i64>,
    pub limit: Option<i64>,
    pub search: Option<String>,
    pub status: Option<String>,
    pub country: Option<String>,
}

#[derive(Debug, Deserialize)]
pub struct UpdateRegistrationStatus {
    pub status: String,
}

pub async fn list_registrations_admin(
    State(state): State<Arc<AppState>>,
    _auth: AuthUser,
    Query(query): Query<RegistrationQuery>,
) -> Result<Json<PaginatedResponse<Registration>>, (StatusCode, String)> {
    let page = query.page.unwrap_or(1);
    let limit = query.limit.unwrap_or(20);
    let offset = (page - 1) * limit;

    let search = query.search.unwrap_or_default();
    let search_pattern = format!("%{}%", search);
    let status = query.status.unwrap_or_default();
    let country = query.country.unwrap_or_default();

    let mut sql = String::from("SELECT * FROM registrations WHERE 1=1");
    let mut count_sql = String::from("SELECT COUNT(*) as count FROM registrations WHERE 1=1");

    if !search.is_empty() {
        let search_clause = " AND (first_name LIKE ? OR last_name LIKE ? OR email LIKE ? OR organization LIKE ?)";
        sql.push_str(search_clause);
        count_sql.push_str(search_clause);
    }
    if !status.is_empty() {
        sql.push_str(" AND status = ?");
        count_sql.push_str(" AND status = ?");
    }
    if !country.is_empty() {
        sql.push_str(" AND country = ?");
        count_sql.push_str(" AND country = ?");
    }

    sql.push_str(" ORDER BY created_at DESC LIMIT ? OFFSET ?");

    // Build query dynamically
    let mut query_builder = sqlx::query_as::<_, Registration>(&sql);
    let mut count_builder = sqlx::query_as::<_, CountResult>(&count_sql);

    if !search.is_empty() {
        query_builder = query_builder
            .bind(&search_pattern)
            .bind(&search_pattern)
            .bind(&search_pattern)
            .bind(&search_pattern);
        count_builder = count_builder
            .bind(&search_pattern)
            .bind(&search_pattern)
            .bind(&search_pattern)
            .bind(&search_pattern);
    }
    if !status.is_empty() {
        query_builder = query_builder.bind(&status);
        count_builder = count_builder.bind(&status);
    }
    if !country.is_empty() {
        query_builder = query_builder.bind(&country);
        count_builder = count_builder.bind(&country);
    }

    let items: Vec<Registration> = query_builder
        .bind(limit)
        .bind(offset)
        .fetch_all(&state.db)
        .await
        .map_err(|e| (StatusCode::INTERNAL_SERVER_ERROR, e.to_string()))?;

    let total: CountResult = count_builder
        .fetch_one(&state.db)
        .await
        .map_err(|e| (StatusCode::INTERNAL_SERVER_ERROR, e.to_string()))?;

    let total_pages = (total.count as f64 / limit as f64).ceil() as i64;

    Ok(Json(PaginatedResponse {
        items,
        total: total.count,
        page,
        limit,
        total_pages,
    }))
}

pub async fn update_registration_status(
    State(state): State<Arc<AppState>>,
    _auth: AuthUser,
    Path(id): Path<i64>,
    Json(payload): Json<UpdateRegistrationStatus>,
) -> Result<Json<Registration>, (StatusCode, String)> {
    sqlx::query("UPDATE registrations SET status = ?, updated_at = datetime('now') WHERE id = ?")
        .bind(&payload.status)
        .bind(id)
        .execute(&state.db)
        .await
        .map_err(|e| (StatusCode::INTERNAL_SERVER_ERROR, e.to_string()))?;

    let registration: Registration = sqlx::query_as("SELECT * FROM registrations WHERE id = ?")
        .bind(id)
        .fetch_one(&state.db)
        .await
        .map_err(|e| (StatusCode::INTERNAL_SERVER_ERROR, e.to_string()))?;

    Ok(Json(registration))
}

pub async fn delete_registration(
    State(state): State<Arc<AppState>>,
    _auth: AuthUser,
    Path(id): Path<i64>,
) -> Result<Json<DeleteResponse>, (StatusCode, String)> {
    sqlx::query("DELETE FROM registrations WHERE id = ?")
        .bind(id)
        .execute(&state.db)
        .await
        .map_err(|e| (StatusCode::INTERNAL_SERVER_ERROR, e.to_string()))?;

    Ok(Json(DeleteResponse {
        success: true,
        message: "Registration deleted successfully".to_string(),
    }))
}

// ============================================
// SETTINGS ADMIN
// ============================================

#[derive(Debug, Serialize, Deserialize, FromRow)]
pub struct Setting {
    pub id: i64,
    pub setting_key: String,
    pub setting_value: String,
    pub created_at: Option<String>,
    pub updated_at: Option<String>,
}

#[derive(Debug, Deserialize)]
pub struct UpdateSettingsRequest {
    pub settings: Vec<SettingUpdate>,
}

#[derive(Debug, Deserialize)]
pub struct SettingUpdate {
    pub key: String,
    pub value: String,
}

pub async fn list_settings_admin(
    State(state): State<Arc<AppState>>,
    _auth: AuthUser,
) -> Result<Json<Vec<Setting>>, (StatusCode, String)> {
    let settings: Vec<Setting> = sqlx::query_as("SELECT * FROM site_settings ORDER BY setting_key")
        .fetch_all(&state.db)
        .await
        .map_err(|e| (StatusCode::INTERNAL_SERVER_ERROR, e.to_string()))?;

    Ok(Json(settings))
}

pub async fn update_settings(
    State(state): State<Arc<AppState>>,
    _auth: AuthUser,
    Json(payload): Json<UpdateSettingsRequest>,
) -> Result<Json<Vec<Setting>>, (StatusCode, String)> {
    for setting in &payload.settings {
        sqlx::query(
            "INSERT OR REPLACE INTO site_settings (setting_key, setting_value, updated_at) VALUES (?, ?, datetime('now'))"
        )
        .bind(&setting.key)
        .bind(&setting.value)
        .execute(&state.db)
        .await
        .map_err(|e| (StatusCode::INTERNAL_SERVER_ERROR, e.to_string()))?;
    }

    let settings: Vec<Setting> = sqlx::query_as("SELECT * FROM site_settings ORDER BY setting_key")
        .fetch_all(&state.db)
        .await
        .map_err(|e| (StatusCode::INTERNAL_SERVER_ERROR, e.to_string()))?;

    Ok(Json(settings))
}

// ============================================
// DASHBOARD STATS
// ============================================

#[derive(Debug, Serialize)]
pub struct DashboardStats {
    pub total_news: i64,
    pub total_speakers: i64,
    pub total_partners: i64,
    pub total_registrations: i64,
    pub pending_registrations: i64,
    pub approved_registrations: i64,
    pub total_excursions: i64,
    pub total_countries: i64,
}

pub async fn get_dashboard_stats(
    State(state): State<Arc<AppState>>,
    _auth: AuthUser,
) -> Result<Json<DashboardStats>, (StatusCode, String)> {
    let total_news: CountResult = sqlx::query_as("SELECT COUNT(*) as count FROM news")
        .fetch_one(&state.db)
        .await
        .map_err(|e| (StatusCode::INTERNAL_SERVER_ERROR, e.to_string()))?;

    let total_speakers: CountResult = sqlx::query_as("SELECT COUNT(*) as count FROM speakers")
        .fetch_one(&state.db)
        .await
        .map_err(|e| (StatusCode::INTERNAL_SERVER_ERROR, e.to_string()))?;

    let total_partners: CountResult = sqlx::query_as("SELECT COUNT(*) as count FROM partners")
        .fetch_one(&state.db)
        .await
        .map_err(|e| (StatusCode::INTERNAL_SERVER_ERROR, e.to_string()))?;

    let total_registrations: CountResult = sqlx::query_as("SELECT COUNT(*) as count FROM registrations")
        .fetch_one(&state.db)
        .await
        .map_err(|e| (StatusCode::INTERNAL_SERVER_ERROR, e.to_string()))?;

    let pending_registrations: CountResult = sqlx::query_as("SELECT COUNT(*) as count FROM registrations WHERE status = 'pending'")
        .fetch_one(&state.db)
        .await
        .map_err(|e| (StatusCode::INTERNAL_SERVER_ERROR, e.to_string()))?;

    let approved_registrations: CountResult = sqlx::query_as("SELECT COUNT(*) as count FROM registrations WHERE status = 'approved'")
        .fetch_one(&state.db)
        .await
        .map_err(|e| (StatusCode::INTERNAL_SERVER_ERROR, e.to_string()))?;

    let total_excursions: CountResult = sqlx::query_as("SELECT COUNT(*) as count FROM excursions")
        .fetch_one(&state.db)
        .await
        .map_err(|e| (StatusCode::INTERNAL_SERVER_ERROR, e.to_string()))?;

    let total_countries: CountResult = sqlx::query_as("SELECT COUNT(*) as count FROM countries")
        .fetch_one(&state.db)
        .await
        .map_err(|e| (StatusCode::INTERNAL_SERVER_ERROR, e.to_string()))?;

    Ok(Json(DashboardStats {
        total_news: total_news.count,
        total_speakers: total_speakers.count,
        total_partners: total_partners.count,
        total_registrations: total_registrations.count,
        pending_registrations: pending_registrations.count,
        approved_registrations: approved_registrations.count,
        total_excursions: total_excursions.count,
        total_countries: total_countries.count,
    }))
}

// ============================================
// DASHBOARD TRENDS
// ============================================

#[derive(Debug, Serialize, sqlx::FromRow)]
pub struct MonthlyCount {
    pub month: String,
    pub total: i64,
    pub pending: i64,
    pub approved: i64,
}

pub async fn get_dashboard_trends(
    State(state): State<Arc<AppState>>,
    _auth: AuthUser,
) -> Result<Json<Vec<MonthlyCount>>, (StatusCode, String)> {
    let trends: Vec<MonthlyCount> = sqlx::query_as(
        "SELECT
            strftime('%Y-%m', created_at) as month,
            COUNT(*) as total,
            SUM(CASE WHEN status = 'pending' THEN 1 ELSE 0 END) as pending,
            SUM(CASE WHEN status = 'approved' THEN 1 ELSE 0 END) as approved
         FROM registrations
         WHERE created_at >= date('now', '-12 months')
         GROUP BY strftime('%Y-%m', created_at)
         ORDER BY month ASC"
    )
    .fetch_all(&state.db)
    .await
    .map_err(|e| (StatusCode::INTERNAL_SERVER_ERROR, e.to_string()))?;

    Ok(Json(trends))
}

// ============================================
// FILE UPLOAD
// ============================================

#[derive(Debug, Serialize)]
pub struct UploadResponse {
    pub success: bool,
    pub url: String,
    pub filename: String,
}

pub async fn upload_file(
    _auth: AuthUser,
    mut multipart: Multipart,
) -> Result<Json<UploadResponse>, (StatusCode, String)> {
    // Create uploads directory if it doesn't exist
    let upload_dir = std::path::Path::new("./uploads");
    if !upload_dir.exists() {
        fs::create_dir_all(upload_dir)
            .await
            .map_err(|e| (StatusCode::INTERNAL_SERVER_ERROR, format!("Failed to create upload directory: {}", e)))?;
    }

    while let Some(field) = multipart
        .next_field()
        .await
        .map_err(|e| (StatusCode::BAD_REQUEST, format!("Failed to read multipart field: {}", e)))?
    {
        let name = field.name().unwrap_or("").to_string();

        if name == "file" {
            let original_filename = field
                .file_name()
                .unwrap_or("unknown")
                .to_string();

            let content_type = field
                .content_type()
                .unwrap_or("application/octet-stream")
                .to_string();

            // Only allow image and PDF files
            if !content_type.starts_with("image/") && content_type != "application/pdf" {
                return Err((StatusCode::BAD_REQUEST, "Only image and PDF files are allowed".to_string()));
            }

            // Generate unique filename
            let extension = std::path::Path::new(&original_filename)
                .extension()
                .and_then(|e| e.to_str())
                .unwrap_or("jpg");

            let unique_filename = format!("{}_{}.{}",
                chrono::Utc::now().timestamp_millis(),
                uuid::Uuid::new_v4().to_string().split('-').next().unwrap_or("file"),
                extension
            );

            let file_path = upload_dir.join(&unique_filename);

            // Read file data
            let data = field
                .bytes()
                .await
                .map_err(|e| (StatusCode::BAD_REQUEST, format!("Failed to read file data: {}", e)))?;

            // Check file size (max 10MB)
            if data.len() > 10 * 1024 * 1024 {
                return Err((StatusCode::BAD_REQUEST, "File size exceeds 10MB limit".to_string()));
            }

            // Write file to disk
            let mut file = fs::File::create(&file_path)
                .await
                .map_err(|e| (StatusCode::INTERNAL_SERVER_ERROR, format!("Failed to create file: {}", e)))?;

            file.write_all(&data)
                .await
                .map_err(|e| (StatusCode::INTERNAL_SERVER_ERROR, format!("Failed to write file: {}", e)))?;

            // Return the URL path
            let url = format!("/uploads/{}", unique_filename);

            return Ok(Json(UploadResponse {
                success: true,
                url,
                filename: unique_filename,
            }));
        }
    }

    Err((StatusCode::BAD_REQUEST, "No file field found in request".to_string()))
}
