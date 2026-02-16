# Updated Menu Structure

## Main Navigation

### 1. Конференции (Conference)
- Введение (Introduction)
- Цели (Goals)
- Дата и место проведения (Date and Venue)
- Участие (Participation)

### 2. Программа (Program)
- Структура программы (Program Structure)
- Пленарное заседание (Plenary Session)
- Мероприятия в рамках конференции (Conference Events)
- Форумы (Forums)

### 3. Мероприятия (Events)
- Параллельные мероприятия (Parallel Events)
- Культурные мероприятия (Cultural Events)
- **Экскурсии (Excursions):**
  - Хисор (Hisor)
  - Рогун (Rogun)
  - Душанбе (Dushanbe)

### 4. Выставка (Exhibition)
Single page - no dropdown

### 5. Логистика (Logistics)
- Практическая информация (Practical Information)
- Виза в Таджикистан (Visa to Tajikistan)
- Аккредитация прессы (Press Accreditation)
- Авиарейсы (Flights)
- Размещение в гостинице (Hotel Accommodation)
- Погода (Weather)

### 6. Регистрация (Registration)
**Special button** - Highlighted for visibility

### 7. Контакты (Contacts)
Single page - no dropdown

### 8. Водное десятилетие (Water Decade)
**Special attractive button** - Blue gradient style with shine effect
- 2018-2028
- Links to `/water-decade` page

---

## Special Button Styles

### Registration Button
- Standard accent color
- Displayed as prominent button in navigation

### Water Decade Button
- **Blue gradient background** (Linear gradient from #00A8E8 to #0077B6)
- **Rounded pill shape** (border-radius: full)
- **Animated shine effect** on hover
- **Shadow effect** for depth
- **Lifts up on hover** (translateY)
- Makes it highly attractive and noticeable

---

## Technical Implementation

### Desktop Navigation
- Registration: Normal button style
- Water Decade: Blue gradient pill button with animation

### Mobile Navigation
- Both buttons maintain special styling
- Water Decade appears below Registration with same attractive design

### Multi-language Support
All menu items have translations for:
- Russian (RU)
- English (EN)
- Tajik (TJ)

---

## Changes Made

1. ✅ Renamed "Конференция" to "Конференции"
2. ✅ Updated Conference submenu items to match requirements
3. ✅ Updated Program submenu items
4. ✅ Merged Excursions into Events submenu
5. ✅ Updated Logistics submenu items
6. ✅ Removed dropdown from Exhibition
7. ✅ Removed dropdown from Contacts
8. ✅ Added Water Decade as special button with attractive styling
9. ✅ Maintained Registration as special button

---

## File Locations

- Navigation structure: `frontend/src/components/Layout/Header.jsx`
- Styles: `frontend/src/styles/globals.css`
- Water Decade page: `frontend/src/pages/WaterDecade.jsx`
- Routes: `frontend/src/App.jsx`
