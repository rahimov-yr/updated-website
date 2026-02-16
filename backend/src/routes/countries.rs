use axum::{
    extract::{Query, State},
    response::Json,
};
use serde::{Deserialize, Serialize};
use sqlx::FromRow;
use std::sync::Arc;

use crate::AppState;

#[derive(Debug, Serialize, Deserialize, FromRow)]
pub struct Country {
    pub id: i64,
    pub code: String,
    pub name_ru: String,
    pub name_en: String,
    pub name_tj: String,
    pub sort_order: i32,
}

#[derive(Debug, Serialize)]
pub struct CountryResponse {
    pub code: String,
    pub name: String,
    pub flag: String,
}

#[derive(Debug, Deserialize)]
pub struct LangQuery {
    #[serde(default = "default_lang")]
    pub lang: String,
}

fn default_lang() -> String {
    "ru".to_string()
}

pub async fn list_countries(
    State(state): State<Arc<AppState>>,
    Query(query): Query<LangQuery>,
) -> Result<Json<Vec<CountryResponse>>, (axum::http::StatusCode, String)> {
    let countries = sqlx::query_as::<_, Country>(
        "SELECT * FROM countries ORDER BY sort_order ASC, name_ru ASC"
    )
    .fetch_all(&state.db)
    .await
    .map_err(|e| (axum::http::StatusCode::INTERNAL_SERVER_ERROR, e.to_string()))?;

    let response: Vec<CountryResponse> = countries
        .into_iter()
        .map(|c| {
            let name = match query.lang.as_str() {
                "en" => c.name_en,
                "tj" => c.name_tj,
                _ => c.name_ru,
            };
            CountryResponse {
                code: c.code.clone(),
                name,
                flag: format!("https://flagcdn.com/w40/{}.png", c.code.to_lowercase()),
            }
        })
        .collect();

    Ok(Json(response))
}
