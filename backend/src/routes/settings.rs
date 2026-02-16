use axum::{
    extract::State,
    response::Json,
};
use serde::{Deserialize, Serialize};
use sqlx::FromRow;
use std::collections::HashMap;
use std::sync::Arc;

use crate::AppState;

#[derive(Debug, Serialize, Deserialize, FromRow)]
pub struct SiteSetting {
    pub id: i64,
    pub setting_key: String,
    pub setting_value: String,
}

pub async fn get_settings(
    State(state): State<Arc<AppState>>,
) -> Result<Json<HashMap<String, String>>, (axum::http::StatusCode, String)> {
    let settings = sqlx::query_as::<_, SiteSetting>(
        "SELECT * FROM site_settings"
    )
    .fetch_all(&state.db)
    .await
    .map_err(|e| (axum::http::StatusCode::INTERNAL_SERVER_ERROR, e.to_string()))?;

    let map: HashMap<String, String> = settings
        .into_iter()
        .map(|s| (s.setting_key, s.setting_value))
        .collect();

    Ok(Json(map))
}

// Hotels
#[derive(Debug, Serialize, Deserialize, FromRow)]
pub struct Hotel {
    pub id: i64,
    pub name: String,
    pub description_ru: String,
    pub description_en: String,
    pub description_tj: String,
    pub image: Option<String>,
    pub stars: i32,
    pub is_official: i32,
    pub amenities: Option<String>,
    pub sort_order: i32,
}

#[derive(Debug, Serialize)]
pub struct HotelResponse {
    pub id: i64,
    pub name: String,
    pub description: String,
    pub image: Option<String>,
    pub stars: i32,
    pub is_official: bool,
    pub amenities: Vec<String>,
}

#[derive(Debug, Deserialize)]
pub struct LangQuery {
    #[serde(default = "default_lang")]
    pub lang: String,
}

fn default_lang() -> String {
    "ru".to_string()
}

pub async fn list_hotels(
    State(state): State<Arc<AppState>>,
    axum::extract::Query(query): axum::extract::Query<LangQuery>,
) -> Result<Json<Vec<HotelResponse>>, (axum::http::StatusCode, String)> {
    let hotels = sqlx::query_as::<_, Hotel>(
        "SELECT * FROM hotels ORDER BY sort_order ASC"
    )
    .fetch_all(&state.db)
    .await
    .map_err(|e| (axum::http::StatusCode::INTERNAL_SERVER_ERROR, e.to_string()))?;

    let response: Vec<HotelResponse> = hotels
        .into_iter()
        .map(|h| {
            let description = match query.lang.as_str() {
                "en" => h.description_en,
                "tj" => h.description_tj,
                _ => h.description_ru,
            };

            let amenities: Vec<String> = h.amenities
                .and_then(|a| serde_json::from_str(&a).ok())
                .unwrap_or_default();

            HotelResponse {
                id: h.id,
                name: h.name,
                description,
                image: h.image,
                stars: h.stars,
                is_official: h.is_official == 1,
                amenities,
            }
        })
        .collect();

    Ok(Json(response))
}
