use axum::{
    extract::{Query, State},
    response::Json,
};
use serde::{Deserialize, Serialize};
use sqlx::FromRow;
use std::sync::Arc;

use crate::AppState;

#[derive(Debug, Serialize, Deserialize, FromRow)]
pub struct Partner {
    pub id: i64,
    pub name: String,
    pub logo: String,
    pub website: Option<String>,
    pub partner_type: String,
    pub sort_order: i32,
}

#[derive(Debug, Deserialize)]
pub struct PartnerQuery {
    #[serde(rename = "type")]
    pub partner_type: Option<String>,
}

pub async fn list_partners(
    State(state): State<Arc<AppState>>,
    Query(query): Query<PartnerQuery>,
) -> Result<Json<Vec<Partner>>, (axum::http::StatusCode, String)> {
    let partners = if let Some(ref pt) = query.partner_type {
        sqlx::query_as::<_, Partner>(
            "SELECT * FROM partners WHERE partner_type = ? ORDER BY sort_order ASC"
        )
        .bind(pt)
        .fetch_all(&state.db)
        .await
    } else {
        sqlx::query_as::<_, Partner>(
            "SELECT * FROM partners ORDER BY sort_order ASC"
        )
        .fetch_all(&state.db)
        .await
    }
    .map_err(|e| (axum::http::StatusCode::INTERNAL_SERVER_ERROR, e.to_string()))?;

    Ok(Json(partners))
}
