use axum::{
    extract::{Path, Query, State},
    Json,
};
use serde::{Deserialize, Serialize};
use sqlx::FromRow;
use std::sync::Arc;

use crate::AppState;

#[derive(Debug, Serialize, Deserialize, FromRow)]
pub struct News {
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

#[derive(Debug, Serialize)]
pub struct NewsListItem {
    pub id: i64,
    pub slug: String,
    pub category: String,
    pub title: LocalizedText,
    pub excerpt: LocalizedText,
    pub image: String,
    pub published_at: String,
}

#[derive(Debug, Serialize)]
pub struct LocalizedText {
    pub ru: String,
    pub en: String,
    pub tj: String,
}

#[derive(Debug, Deserialize)]
pub struct NewsQuery {
    pub limit: Option<i64>,
    pub offset: Option<i64>,
    pub category: Option<String>,
}

pub async fn list_news(
    State(state): State<Arc<AppState>>,
    Query(query): Query<NewsQuery>,
) -> Result<Json<Vec<NewsListItem>>, (axum::http::StatusCode, String)> {
    let limit = query.limit.unwrap_or(10);
    let offset = query.offset.unwrap_or(0);

    let news: Vec<News> = if let Some(category) = query.category {
        sqlx::query_as::<_, News>(
            "SELECT * FROM news WHERE category = ? ORDER BY published_at DESC LIMIT ? OFFSET ?"
        )
        .bind(category)
        .bind(limit)
        .bind(offset)
        .fetch_all(&state.db)
        .await
        .map_err(|e| (axum::http::StatusCode::INTERNAL_SERVER_ERROR, e.to_string()))?
    } else {
        sqlx::query_as::<_, News>(
            "SELECT * FROM news ORDER BY published_at DESC LIMIT ? OFFSET ?"
        )
        .bind(limit)
        .bind(offset)
        .fetch_all(&state.db)
        .await
        .map_err(|e| (axum::http::StatusCode::INTERNAL_SERVER_ERROR, e.to_string()))?
    };

    let items: Vec<NewsListItem> = news
        .into_iter()
        .map(|n| NewsListItem {
            id: n.id,
            slug: n.slug,
            category: n.category,
            title: LocalizedText {
                ru: n.title_ru,
                en: n.title_en,
                tj: n.title_tj,
            },
            excerpt: LocalizedText {
                ru: n.excerpt_ru,
                en: n.excerpt_en,
                tj: n.excerpt_tj,
            },
            image: n.image,
            published_at: n.published_at,
        })
        .collect();

    Ok(Json(items))
}

pub async fn get_news(
    State(state): State<Arc<AppState>>,
    Path(id): Path<String>,
) -> Result<Json<News>, (axum::http::StatusCode, String)> {
    // Try to parse as ID first, otherwise treat as slug
    let news = if let Ok(id_num) = id.parse::<i64>() {
        sqlx::query_as::<_, News>("SELECT * FROM news WHERE id = ?")
            .bind(id_num)
            .fetch_optional(&state.db)
            .await
            .map_err(|e| (axum::http::StatusCode::INTERNAL_SERVER_ERROR, e.to_string()))?
    } else {
        sqlx::query_as::<_, News>("SELECT * FROM news WHERE slug = ?")
            .bind(&id)
            .fetch_optional(&state.db)
            .await
            .map_err(|e| (axum::http::StatusCode::INTERNAL_SERVER_ERROR, e.to_string()))?
    };

    match news {
        Some(n) => Ok(Json(n)),
        None => Err((axum::http::StatusCode::NOT_FOUND, "News not found".to_string())),
    }
}
