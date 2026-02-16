use axum::{
    extract::{Path, State},
    Json,
};
use serde::{Deserialize, Serialize};
use sqlx::FromRow;
use std::sync::Arc;

use crate::AppState;

#[derive(Debug, Serialize, Deserialize, FromRow)]
pub struct ProgramDay {
    pub id: i64,
    pub day_number: i64,
    pub date: String,
    pub title_ru: String,
    pub title_en: String,
    pub title_tj: String,
    pub short_title_ru: String,
    pub short_title_en: String,
    pub short_title_tj: String,
}

#[derive(Debug, Serialize, Deserialize, FromRow)]
pub struct ProgramEvent {
    pub id: i64,
    pub day_id: i64,
    pub event_type: String,
    pub time_start: String,
    pub time_end: String,
    pub title_ru: String,
    pub title_en: String,
    pub title_tj: String,
    pub description_ru: Option<String>,
    pub description_en: Option<String>,
    pub description_tj: Option<String>,
    pub location_ru: String,
    pub location_en: String,
    pub location_tj: String,
    pub sort_order: i64,
}

#[derive(Debug, Serialize)]
pub struct ProgramResponse {
    pub days: Vec<DayWithEvents>,
}

#[derive(Debug, Serialize)]
pub struct DayWithEvents {
    pub day: i64,
    pub date: String,
    pub title: LocalizedText,
    pub short_title: LocalizedText,
    pub events: Vec<EventResponse>,
}

#[derive(Debug, Serialize)]
pub struct EventResponse {
    pub id: i64,
    pub event_type: String,
    pub time: String,
    pub title: LocalizedText,
    pub description: Option<LocalizedText>,
    pub location: LocalizedText,
}

#[derive(Debug, Serialize)]
pub struct LocalizedText {
    pub ru: String,
    pub en: String,
    pub tj: String,
}

pub async fn get_program(
    State(state): State<Arc<AppState>>,
) -> Result<Json<ProgramResponse>, (axum::http::StatusCode, String)> {
    let days: Vec<ProgramDay> = sqlx::query_as::<_, ProgramDay>(
        "SELECT * FROM program_days ORDER BY day_number"
    )
    .fetch_all(&state.db)
    .await
    .map_err(|e| (axum::http::StatusCode::INTERNAL_SERVER_ERROR, e.to_string()))?;

    let mut days_with_events = Vec::new();

    for day in days {
        let events: Vec<ProgramEvent> = sqlx::query_as::<_, ProgramEvent>(
            "SELECT * FROM program_events WHERE day_id = ? ORDER BY sort_order"
        )
        .bind(day.id)
        .fetch_all(&state.db)
        .await
        .map_err(|e| (axum::http::StatusCode::INTERNAL_SERVER_ERROR, e.to_string()))?;

        let event_responses: Vec<EventResponse> = events
            .into_iter()
            .map(|e| EventResponse {
                id: e.id,
                event_type: e.event_type,
                time: format!("{} - {}", e.time_start, e.time_end),
                title: LocalizedText {
                    ru: e.title_ru,
                    en: e.title_en,
                    tj: e.title_tj,
                },
                description: if e.description_ru.is_some() {
                    Some(LocalizedText {
                        ru: e.description_ru.unwrap_or_default(),
                        en: e.description_en.unwrap_or_default(),
                        tj: e.description_tj.unwrap_or_default(),
                    })
                } else {
                    None
                },
                location: LocalizedText {
                    ru: e.location_ru,
                    en: e.location_en,
                    tj: e.location_tj,
                },
            })
            .collect();

        days_with_events.push(DayWithEvents {
            day: day.day_number,
            date: day.date,
            title: LocalizedText {
                ru: day.title_ru,
                en: day.title_en,
                tj: day.title_tj,
            },
            short_title: LocalizedText {
                ru: day.short_title_ru,
                en: day.short_title_en,
                tj: day.short_title_tj,
            },
            events: event_responses,
        });
    }

    Ok(Json(ProgramResponse {
        days: days_with_events,
    }))
}

pub async fn get_days(
    State(state): State<Arc<AppState>>,
) -> Result<Json<Vec<ProgramDay>>, (axum::http::StatusCode, String)> {
    let days: Vec<ProgramDay> = sqlx::query_as::<_, ProgramDay>(
        "SELECT * FROM program_days ORDER BY day_number"
    )
    .fetch_all(&state.db)
    .await
    .map_err(|e| (axum::http::StatusCode::INTERNAL_SERVER_ERROR, e.to_string()))?;

    Ok(Json(days))
}

pub async fn get_day_events(
    State(state): State<Arc<AppState>>,
    Path(day): Path<i64>,
) -> Result<Json<DayWithEvents>, (axum::http::StatusCode, String)> {
    let day_record: Option<ProgramDay> = sqlx::query_as::<_, ProgramDay>(
        "SELECT * FROM program_days WHERE day_number = ?"
    )
    .bind(day)
    .fetch_optional(&state.db)
    .await
    .map_err(|e| (axum::http::StatusCode::INTERNAL_SERVER_ERROR, e.to_string()))?;

    match day_record {
        Some(d) => {
            let events: Vec<ProgramEvent> = sqlx::query_as::<_, ProgramEvent>(
                "SELECT * FROM program_events WHERE day_id = ? ORDER BY sort_order"
            )
            .bind(d.id)
            .fetch_all(&state.db)
            .await
            .map_err(|e| (axum::http::StatusCode::INTERNAL_SERVER_ERROR, e.to_string()))?;

            let event_responses: Vec<EventResponse> = events
                .into_iter()
                .map(|e| EventResponse {
                    id: e.id,
                    event_type: e.event_type,
                    time: format!("{} - {}", e.time_start, e.time_end),
                    title: LocalizedText {
                        ru: e.title_ru,
                        en: e.title_en,
                        tj: e.title_tj,
                    },
                    description: if e.description_ru.is_some() {
                        Some(LocalizedText {
                            ru: e.description_ru.unwrap_or_default(),
                            en: e.description_en.unwrap_or_default(),
                            tj: e.description_tj.unwrap_or_default(),
                        })
                    } else {
                        None
                    },
                    location: LocalizedText {
                        ru: e.location_ru,
                        en: e.location_en,
                        tj: e.location_tj,
                    },
                })
                .collect();

            Ok(Json(DayWithEvents {
                day: d.day_number,
                date: d.date,
                title: LocalizedText {
                    ru: d.title_ru,
                    en: d.title_en,
                    tj: d.title_tj,
                },
                short_title: LocalizedText {
                    ru: d.short_title_ru,
                    en: d.short_title_en,
                    tj: d.short_title_tj,
                },
                events: event_responses,
            }))
        }
        None => Err((axum::http::StatusCode::NOT_FOUND, "Day not found".to_string())),
    }
}
