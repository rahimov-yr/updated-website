use axum::{
    extract::{Path, Query, State},
    response::Json,
};
use serde::{Deserialize, Serialize};
use sqlx::FromRow;
use std::sync::Arc;

use crate::AppState;

#[derive(Debug, Serialize, Deserialize, FromRow)]
pub struct Excursion {
    pub id: i64,
    pub slug: String,
    pub category_ru: String,
    pub category_en: String,
    pub category_tj: String,
    pub title_ru: String,
    pub title_en: String,
    pub title_tj: String,
    pub description_ru: String,
    pub description_en: String,
    pub description_tj: String,
    pub duration_ru: String,
    pub duration_en: String,
    pub duration_tj: String,
    pub image: Option<String>,
    pub sort_order: i32,
}

#[derive(Debug, Serialize, Deserialize, FromRow)]
pub struct ExcursionHighlight {
    pub id: i64,
    pub excursion_id: i64,
    pub highlight_ru: String,
    pub highlight_en: String,
    pub highlight_tj: String,
    pub sort_order: i32,
}

#[derive(Debug, Serialize)]
pub struct ExcursionResponse {
    pub id: i64,
    pub slug: String,
    pub category: String,
    pub title: String,
    pub description: String,
    pub duration: String,
    pub image: Option<String>,
    pub highlights: Vec<String>,
}

#[derive(Debug, Deserialize)]
pub struct LangQuery {
    #[serde(default = "default_lang")]
    pub lang: String,
}

fn default_lang() -> String {
    "ru".to_string()
}

pub async fn list_excursions(
    State(state): State<Arc<AppState>>,
    Query(query): Query<LangQuery>,
) -> Result<Json<Vec<ExcursionResponse>>, (axum::http::StatusCode, String)> {
    let excursions = sqlx::query_as::<_, Excursion>(
        "SELECT * FROM excursions ORDER BY sort_order ASC"
    )
    .fetch_all(&state.db)
    .await
    .map_err(|e| (axum::http::StatusCode::INTERNAL_SERVER_ERROR, e.to_string()))?;

    let mut response = Vec::new();

    for exc in excursions {
        let highlights = sqlx::query_as::<_, ExcursionHighlight>(
            "SELECT * FROM excursion_highlights WHERE excursion_id = ? ORDER BY sort_order ASC"
        )
        .bind(exc.id)
        .fetch_all(&state.db)
        .await
        .map_err(|e| (axum::http::StatusCode::INTERNAL_SERVER_ERROR, e.to_string()))?;

        let (category, title, description, duration) = match query.lang.as_str() {
            "en" => (exc.category_en, exc.title_en, exc.description_en, exc.duration_en),
            "tj" => (exc.category_tj, exc.title_tj, exc.description_tj, exc.duration_tj),
            _ => (exc.category_ru, exc.title_ru, exc.description_ru, exc.duration_ru),
        };

        let highlight_texts: Vec<String> = highlights
            .into_iter()
            .map(|h| match query.lang.as_str() {
                "en" => h.highlight_en,
                "tj" => h.highlight_tj,
                _ => h.highlight_ru,
            })
            .collect();

        response.push(ExcursionResponse {
            id: exc.id,
            slug: exc.slug,
            category,
            title,
            description,
            duration,
            image: exc.image,
            highlights: highlight_texts,
        });
    }

    Ok(Json(response))
}

pub async fn get_excursion(
    State(state): State<Arc<AppState>>,
    Path(slug): Path<String>,
    Query(query): Query<LangQuery>,
) -> Result<Json<ExcursionResponse>, (axum::http::StatusCode, String)> {
    let excursion = sqlx::query_as::<_, Excursion>(
        "SELECT * FROM excursions WHERE slug = ?"
    )
    .bind(&slug)
    .fetch_optional(&state.db)
    .await
    .map_err(|e| (axum::http::StatusCode::INTERNAL_SERVER_ERROR, e.to_string()))?
    .ok_or((axum::http::StatusCode::NOT_FOUND, "Excursion not found".to_string()))?;

    let highlights = sqlx::query_as::<_, ExcursionHighlight>(
        "SELECT * FROM excursion_highlights WHERE excursion_id = ? ORDER BY sort_order ASC"
    )
    .bind(excursion.id)
    .fetch_all(&state.db)
    .await
    .map_err(|e| (axum::http::StatusCode::INTERNAL_SERVER_ERROR, e.to_string()))?;

    let (category, title, description, duration) = match query.lang.as_str() {
        "en" => (excursion.category_en, excursion.title_en, excursion.description_en, excursion.duration_en),
        "tj" => (excursion.category_tj, excursion.title_tj, excursion.description_tj, excursion.duration_tj),
        _ => (excursion.category_ru, excursion.title_ru, excursion.description_ru, excursion.duration_ru),
    };

    let highlight_texts: Vec<String> = highlights
        .into_iter()
        .map(|h| match query.lang.as_str() {
            "en" => h.highlight_en,
            "tj" => h.highlight_tj,
            _ => h.highlight_ru,
        })
        .collect();

    Ok(Json(ExcursionResponse {
        id: excursion.id,
        slug: excursion.slug,
        category,
        title,
        description,
        duration,
        image: excursion.image,
        highlights: highlight_texts,
    }))
}
