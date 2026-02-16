use axum::{
    extract::{Path, Query, State},
    response::Json,
};
use serde::{Deserialize, Serialize};
use sqlx::FromRow;
use std::sync::Arc;

use crate::AppState;

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
    pub sort_order: i32,
    pub clickable: i32,
}

#[derive(Debug, Serialize)]
pub struct SpeakerResponse {
    pub id: i64,
    pub name: String,
    pub title: String,
    pub image: String,
    pub image_source: Option<String>,
    pub image_position: Option<String>,
    pub flag_url: Option<String>,
    pub flag_alt: Option<String>,
    pub clickable: bool,
}

#[derive(Debug, Deserialize)]
pub struct LangQuery {
    #[serde(default = "default_lang")]
    pub lang: String,
}

fn default_lang() -> String {
    "ru".to_string()
}

pub async fn list_speakers(
    State(state): State<Arc<AppState>>,
    Query(query): Query<LangQuery>,
) -> Result<Json<Vec<SpeakerResponse>>, (axum::http::StatusCode, String)> {
    let speakers = sqlx::query_as::<_, Speaker>(
        "SELECT * FROM speakers ORDER BY sort_order ASC"
    )
    .fetch_all(&state.db)
    .await
    .map_err(|e| (axum::http::StatusCode::INTERNAL_SERVER_ERROR, e.to_string()))?;

    let response: Vec<SpeakerResponse> = speakers
        .into_iter()
        .map(|s| {
            let (name, title, flag_alt) = match query.lang.as_str() {
                "en" => (s.name_en, s.title_en, s.flag_alt_en),
                "tj" => (s.name_tj, s.title_tj, s.flag_alt_tj),
                _ => (s.name_ru, s.title_ru, s.flag_alt_ru),
            };
            SpeakerResponse {
                id: s.id,
                name,
                title,
                image: s.image,
                image_source: s.image_source,
                image_position: s.image_position,
                flag_url: s.flag_url,
                flag_alt,
                clickable: s.clickable != 0,
            }
        })
        .collect();

    Ok(Json(response))
}

#[derive(Debug, Serialize)]
pub struct SpeakerDetailResponse {
    pub id: i64,
    pub name: String,
    pub title: String,
    pub bio: Option<String>,
    pub organization: Option<String>,
    pub country: Option<String>,
    pub email: Option<String>,
    pub expertise: Vec<String>,
    pub achievements: Vec<String>,
    pub publications: Vec<String>,
    pub session_title: Option<String>,
    pub session_time: Option<String>,
    pub session_description: Option<String>,
    pub image: String,
    pub flag_url: Option<String>,
    pub flag_alt: Option<String>,
}

pub async fn get_speaker(
    State(state): State<Arc<AppState>>,
    Path(id): Path<i64>,
    Query(query): Query<LangQuery>,
) -> Result<Json<SpeakerDetailResponse>, (axum::http::StatusCode, String)> {
    let speaker = sqlx::query_as::<_, Speaker>(
        "SELECT * FROM speakers WHERE id = ?"
    )
    .bind(id)
    .fetch_optional(&state.db)
    .await
    .map_err(|e| (axum::http::StatusCode::INTERNAL_SERVER_ERROR, e.to_string()))?
    .ok_or((axum::http::StatusCode::NOT_FOUND, "Speaker not found".to_string()))?;

    let (name, title, bio, organization, country, flag_alt, session_title, session_time, session_description) = match query.lang.as_str() {
        "en" => (
            speaker.name_en,
            speaker.title_en,
            speaker.bio_en,
            speaker.organization_en,
            speaker.country_en,
            speaker.flag_alt_en,
            speaker.session_title_en,
            speaker.session_time_en,
            speaker.session_description_en,
        ),
        "tj" => (
            speaker.name_tj,
            speaker.title_tj,
            speaker.bio_tj,
            speaker.organization_tj,
            speaker.country_tj,
            speaker.flag_alt_tj,
            speaker.session_title_tj,
            speaker.session_time_tj,
            speaker.session_description_tj,
        ),
        _ => (
            speaker.name_ru,
            speaker.title_ru,
            speaker.bio_ru,
            speaker.organization_ru,
            speaker.country_ru,
            speaker.flag_alt_ru,
            speaker.session_title_ru,
            speaker.session_time_ru,
            speaker.session_description_ru,
        ),
    };

    // Parse JSON arrays for expertise, achievements, publications
    let expertise: Vec<String> = speaker.expertise
        .and_then(|s| serde_json::from_str(&s).ok())
        .unwrap_or_default();

    let achievements: Vec<String> = speaker.achievements
        .and_then(|s| serde_json::from_str(&s).ok())
        .unwrap_or_default();

    let publications: Vec<String> = speaker.publications
        .and_then(|s| serde_json::from_str(&s).ok())
        .unwrap_or_default();

    let response = SpeakerDetailResponse {
        id: speaker.id,
        name,
        title,
        bio,
        organization,
        country,
        email: speaker.email,
        expertise,
        achievements,
        publications,
        session_title,
        session_time,
        session_description,
        image: speaker.image,
        flag_url: speaker.flag_url,
        flag_alt,
    };

    Ok(Json(response))
}
