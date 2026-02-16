use axum::{
    extract::{Query, State},
    response::Json,
};
use serde::{Deserialize, Serialize};
use sqlx::FromRow;
use std::sync::Arc;

use crate::AppState;

#[derive(Debug, Serialize, Deserialize, FromRow)]
pub struct NavigationItem {
    pub id: i64,
    pub parent_id: Option<i64>,
    pub label_ru: String,
    pub label_en: String,
    pub label_tj: String,
    pub path: String,
    pub nav_type: String,
    pub sort_order: i32,
    pub is_register_btn: i32,
}

#[derive(Debug, Serialize)]
pub struct NavItemResponse {
    pub id: i64,
    pub label: String,
    pub path: String,
    #[serde(skip_serializing_if = "Option::is_none")]
    pub dropdown: Option<Vec<NavDropdownItem>>,
    #[serde(skip_serializing_if = "std::ops::Not::not")]
    pub is_register: bool,
}

#[derive(Debug, Serialize)]
pub struct NavDropdownItem {
    pub label: String,
    pub path: String,
}

#[derive(Debug, Deserialize)]
pub struct NavQuery {
    #[serde(default = "default_lang")]
    pub lang: String,
    #[serde(rename = "type", default = "default_nav_type")]
    pub nav_type: String,
}

fn default_lang() -> String {
    "ru".to_string()
}

fn default_nav_type() -> String {
    "header".to_string()
}

pub async fn get_navigation(
    State(state): State<Arc<AppState>>,
    Query(query): Query<NavQuery>,
) -> Result<Json<Vec<NavItemResponse>>, (axum::http::StatusCode, String)> {
    // Get all navigation items
    let items = sqlx::query_as::<_, NavigationItem>(
        "SELECT * FROM navigation_items WHERE nav_type = ? ORDER BY sort_order ASC"
    )
    .bind(&query.nav_type)
    .fetch_all(&state.db)
    .await
    .map_err(|e| (axum::http::StatusCode::INTERNAL_SERVER_ERROR, e.to_string()))?;

    // Build navigation tree
    let parent_items: Vec<&NavigationItem> = items.iter().filter(|i| i.parent_id.is_none()).collect();

    let response: Vec<NavItemResponse> = parent_items
        .into_iter()
        .map(|item| {
            let label = match query.lang.as_str() {
                "en" => item.label_en.clone(),
                "tj" => item.label_tj.clone(),
                _ => item.label_ru.clone(),
            };

            // Find children
            let children: Vec<NavDropdownItem> = items
                .iter()
                .filter(|i| i.parent_id == Some(item.id))
                .map(|child| {
                    let child_label = match query.lang.as_str() {
                        "en" => child.label_en.clone(),
                        "tj" => child.label_tj.clone(),
                        _ => child.label_ru.clone(),
                    };
                    NavDropdownItem {
                        label: child_label,
                        path: child.path.clone(),
                    }
                })
                .collect();

            NavItemResponse {
                id: item.id,
                label,
                path: item.path.clone(),
                dropdown: if children.is_empty() { None } else { Some(children) },
                is_register: item.is_register_btn == 1,
            }
        })
        .collect();

    Ok(Json(response))
}

// Social links
#[derive(Debug, Serialize, Deserialize, FromRow)]
pub struct SocialLink {
    pub id: i64,
    pub name: String,
    pub url: String,
    pub icon: String,
    pub sort_order: i32,
}

pub async fn get_social_links(
    State(state): State<Arc<AppState>>,
) -> Result<Json<Vec<SocialLink>>, (axum::http::StatusCode, String)> {
    let links = sqlx::query_as::<_, SocialLink>(
        "SELECT * FROM social_links ORDER BY sort_order ASC"
    )
    .fetch_all(&state.db)
    .await
    .map_err(|e| (axum::http::StatusCode::INTERNAL_SERVER_ERROR, e.to_string()))?;

    Ok(Json(links))
}
