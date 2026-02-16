# Events Subpages - Page Builder Guide

## Overview

A comprehensive page builder system has been created for managing all Events and Excursions subpages from the admin panel. You can now add/remove/edit content blocks (text, images, sliders, schedules, etc.) for the following pages:

1. **Параллельные мероприятия** (Parallel Events) - `/events/parallel`
2. **Культурные мероприятия** (Cultural Events) - `/events/cultural`
3. **Хисор** (Khisor Excursion) - `/excursions/khisor`
4. **Рогун** (Rogun Excursion) - `/excursions/rogun`
5. **Душанбе** (Dushanbe Excursion) - `/excursions/dushanbe`

## How to Access

1. Log in to the admin panel: `http://your-domain.com/admin`
2. Navigate to **Мероприятия** section in the sidebar
3. You'll see a new route: **`/admin/events/subpages`**
4. Or you can directly access: `http://localhost:5174/admin/events/subpages`

## Available Block Types

The page builder supports 8 types of content blocks:

### 1. Hero Block
- **Purpose**: Page header with title and subtitle
- **Fields**:
  - Title (RU, EN, TJ)
  - Subtitle (RU, EN, TJ)
  - Background image URL

### 2. Text Block
- **Purpose**: Rich text content section
- **Fields**:
  - Heading (RU, EN, TJ)
  - Content (RU, EN, TJ) - HTML supported
  - Background: White or Gray

### 3. Image Block
- **Purpose**: Single image with caption
- **Fields**:
  - Image URL (or upload file)
  - Alt text (RU, EN, TJ)
  - Caption (RU, EN, TJ)

### 4. Info Cards Block
- **Purpose**: Grid of information cards (like duration, distance, group size)
- **Fields**: Add multiple cards, each with:
  - Icon (calendar, map, users, info)
  - Title (RU, EN, TJ)
  - Text (RU, EN, TJ)

### 5. Schedule Block
- **Purpose**: List of time-based items (program schedule)
- **Fields**:
  - Heading (RU, EN, TJ)
  - Items: Each with time and description (RU, EN, TJ)

### 6. List Block
- **Purpose**: Bulleted or numbered list
- **Fields**:
  - Heading (RU, EN, TJ)
  - List items (RU, EN, TJ) - One per line

### 7. Facts Block
- **Purpose**: Interesting facts section
- **Fields**:
  - Heading (RU, EN, TJ)
  - Facts (RU, EN, TJ) - One per line

### 8. Call-to-Action (CTA) Block
- **Purpose**: Centered text with button
- **Fields**:
  - Text (RU, EN, TJ)
  - Button text (RU, EN, TJ)
  - Button link (e.g., `/registration`)

## How to Use the Page Builder

### Step 1: Select a Page
- Click on one of the page tabs at the top:
  - Параллельные мероприятия
  - Культурные мероприятия
  - Хисор
  - Рогун
  - Душанбе

### Step 2: Add Blocks
- In the "Добавить блок" section, click on the type of block you want to add
- A new block will appear at the bottom of the page

### Step 3: Edit Block Content
- Each block has language tabs (RU, EN, TJ)
- Fill in the content for each language
- Use the language tabs to switch between languages

### Step 4: Arrange Blocks
- Use ↑ and ↓ buttons to move blocks up or down
- Use ✕ button to delete a block
- Blocks appear on the frontend in the order they appear in the admin

### Step 5: Save
- Click the **"Сохранить"** button at the top right
- Changes are saved to the database
- Refresh the frontend page to see your changes

## Example: Creating a Khisor Excursion Page

1. Select **"Хисор"** tab
2. Add blocks in this order:
   - **Hero Block**: Title="Историческая крепость Хисор", Subtitle="Путешествие в историю"
   - **Text Block**: Introduction paragraph
   - **Info Cards**: Duration, Distance, Group Size, Difficulty
   - **Text Block**: Description and program
   - **Schedule Block**: Excursion timeline
   - **List Block**: Main attractions
   - **Facts Block**: Interesting facts
   - **CTA Block**: Registration call-to-action
3. Click **"Сохранить"**
4. Visit `/excursions/khisor` to see the result

## Tips

### Multi-language Content
- Always fill in content for all three languages (RU, EN, TJ)
- The frontend will display the appropriate language based on user selection

### HTML Support
- Text blocks support HTML markup
- You can use tags like `<strong>`, `<em>`, `<ul>`, `<li>`, `<p>`, etc.
- Example: `<p>This is <strong>bold</strong> text.</p>`

### Image Upload
- You can either enter an image URL or upload a file
- Uploaded files are stored on the server
- Image uploads work for Image blocks

### Reordering Blocks
- The order of blocks matters
- Typically start with a Hero block
- Alternate between white and gray backgrounds for visual variety

### Info Cards
- Perfect for displaying key information (duration, distance, etc.)
- Icons available: calendar, map, users, info
- Up to 4 cards per grid looks best

## Default Content

If no blocks are configured for a page, it shows a default message:
> "Страница настраивается из админ-панели. Перейдите в раздел 'Мероприятия → Подстраницы' для добавления контента."

## Technical Details

### Frontend Files
- `frontend/src/admin/pages/EventsSubpagesManager.jsx` - Admin page builder
- `frontend/src/admin/pages/EventsSubpagesManager.css` - Styles
- `frontend/src/components/BlockRenderer.jsx` - Frontend block renderer
- `frontend/src/pages/events/ParallelEvents.jsx` - Parallel events page
- `frontend/src/pages/events/CulturalEvents.jsx` - Cultural events page
- `frontend/src/pages/excursions/Khisor.jsx` - Khisor excursion page
- `frontend/src/pages/excursions/Rogun.jsx` - Rogun excursion page
- `frontend/src/pages/excursions/Dushanbe.jsx` - Dushanbe excursion page

### Database
- Settings are stored in the `settings` table
- Keys: `parallel_events`, `cultural_events`, `khisor_excursion`, `rogun_excursion`, `dushanbe_excursion`
- Format: JSON string containing `{ blocks: [...] }`

### Routes
- Admin: `/admin/events/subpages`
- Frontend:
  - `/events/parallel`
  - `/events/cultural`
  - `/excursions/khisor`
  - `/excursions/rogun`
  - `/excursions/dushanbe`

## Troubleshooting

### Changes Don't Appear
- Make sure you clicked "Сохранить" (Save) button
- Refresh the frontend page (clear cache if needed)
- Check browser console for errors

### Images Don't Load
- Verify the image URL is correct
- For uploaded images, check the server uploads directory
- Ensure the image file is accessible

### Content Not in All Languages
- Remember to fill content for RU, EN, and TJ
- Use the language tabs to switch and enter content for each language

## Future Enhancements

Potential additions to the page builder:
- Slider/Gallery block
- Video embed block
- Map/Location block
- Download/Files block
- Testimonials block
- FAQ accordion block

---

**Version**: 1.0
**Last Updated**: 2026-02-01
