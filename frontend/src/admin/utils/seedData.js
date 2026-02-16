// Seed data for admin panel - All translations (RU, EN, TJ)

export const heroSeedData = {
  title_ru: 'Четвёртая Международная конференция высокого уровня по Международному десятилетию действий «Вода для устойчивого развития» 2018-2028',
  title_en: 'Fourth High-Level International Conference on the International Decade for Action "Water for Sustainable Development" 2018-2028',
  title_tj: 'Конфронси чоруми байналмилалии сатҳи баланд оид ба Даҳсолаи байналмилалии амал «Об барои рушди устувор» 2018-2028',
  dates_ru: '25-28 мая 2026',
  dates_en: 'May 25-28, 2026',
  dates_tj: '25-28 майи 2026',
  location_ru: 'Душанбе, Таджикистан',
  location_en: 'Dushanbe, Tajikistan',
  location_tj: 'Душанбе, Тоҷикистон',
  quote_ru: 'Вода — это движущая сила всей природы',
  quote_en: 'Water is the driving force of all nature',
  quote_tj: 'Об — қувваи ҳаракатдиҳандаи тамоми табиат аст',
  quote_author_ru: 'Леонардо да Винчи',
  quote_author_en: 'Leonardo da Vinci',
  quote_author_tj: 'Леонардо да Винчи',
  registration_btn_ru: 'Зарегистрироваться',
  registration_btn_en: 'Register Now',
  registration_btn_tj: 'Бақайдгирӣ',
  video_btn_ru: 'Смотреть видео',
  video_btn_en: 'Watch Video',
  video_btn_tj: 'Видеоро тамошо кунед',
  video_url: '/assets/video/hero-background.mp4',
  youtube_url: '',
  video_source: 'url'
}

export const speakersSeedData = [
  {
    name_ru: 'Кохир Расулзода',
    name_en: 'Kohir Rasulzoda',
    name_tj: 'Қоҳир Расулзода',
    title_ru: 'Премьер-Министр Республики Таджикистан',
    title_en: 'Prime Minister of the Republic of Tajikistan',
    title_tj: 'Сарвазири Ҷумҳурии Тоҷикистон',
    image: '/assets/images/speaker-rasulzoda.png',
    image_source: 'url',
    image_position: 'center center',
    flag_url: 'https://flagcdn.com/w80/tj.png',
    flag_source: 'url',
    flag_alt_ru: 'Флаг Таджикистана',
    flag_alt_en: 'Flag of Tajikistan',
    flag_alt_tj: 'Парчами Тоҷикистон',
    sort_order: 0
  },
  {
    name_ru: 'Ли Цзюньхуа',
    name_en: 'Li Junhua',
    name_tj: 'Ли Ҷунхуа',
    title_ru: 'Заместитель Генерального секретаря ООН',
    title_en: 'United Nations Under-Secretary-General',
    title_tj: 'Муовини Котиби генералии СММ',
    image: '/assets/images/speaker-li.jpg',
    image_source: 'url',
    image_position: 'center center',
    flag_url: 'https://flagcdn.com/w80/un.png',
    flag_source: 'url',
    flag_alt_ru: 'Флаг ООН',
    flag_alt_en: 'UN Flag',
    flag_alt_tj: 'Парчами СММ',
    sort_order: 1
  }
]

export const partnersSeedData = [
  {
    name: 'The World Bank',
    logo: '/assets/images/1_world_bank.png',
    website: 'https://www.worldbank.org',
    partner_type: 'partner',
    sort_order: 0
  },
  {
    name: 'UNDP',
    logo: '/assets/images/2_undp.png',
    website: 'https://www.undp.org',
    partner_type: 'partner',
    sort_order: 1
  },
  {
    name: 'UN',
    logo: '/assets/images/3_un.png',
    website: 'https://www.un.org',
    partner_type: 'partner',
    sort_order: 2
  },
  {
    name: 'UNESCO',
    logo: '/assets/images/4_unesco.png',
    website: 'https://www.unesco.org',
    partner_type: 'partner',
    sort_order: 3
  }
]

export const partnerTypesSeedData = [
  { value: 'organizer', label: { ru: 'Организатор', en: 'Organizer', tj: 'Ташкилотчӣ' } },
  { value: 'partner', label: { ru: 'Партнёр', en: 'Partner', tj: 'Шарик' } },
  { value: 'sponsor', label: { ru: 'Спонсор', en: 'Sponsor', tj: 'Сарпараст' } },
  { value: 'media', label: { ru: 'Медиа партнёр', en: 'Media Partner', tj: 'Шарики медиа' } },
]

export const newsSeedData = [
  {
    slug: 'tajikistan-prepares-un-water-conference',
    category: 'conference',
    title_ru: 'Таджикистан готовится принять водную конференцию ООН',
    title_en: 'Tajikistan prepares to host UN Water Conference',
    title_tj: 'Тоҷикистон омодагӣ мебинад барои қабули конфронси обии СММ',
    excerpt_ru: 'Подготовка к крупнейшему международному событию в сфере водных ресурсов идет полным ходом.',
    excerpt_en: 'Preparations for the largest international event in the field of water resources are in full swing.',
    excerpt_tj: 'Омодагӣ ба бузургтарин чорабинии байналмилалӣ дар соҳаи захираҳои обӣ бо суръати пурра идома дорад.',
    image: '/assets/images/news-meeting.png',
    published_at: '2026-01-14',
    content_ru: `<p>Республика Таджикистан активно готовится к проведению Четвертой Международной конференции высокого уровня по Международному десятилетию действий «Вода для устойчивого развития» 2018-2028, которая состоится 25-28 мая 2026 года в Душанбе.</p>

<h3>Масштаб подготовки</h3>
<p>Правительство Таджикистана совместно с международными партнерами проводит масштабную работу по организации конференции. Ожидается участие делегаций из более чем 150 стран мира, включая глав государств и правительств, министров, представителей международных организаций и экспертного сообщества.</p>

<h3>Инфраструктурные проекты</h3>
<p>В рамках подготовки к конференции реализуется ряд инфраструктурных проектов:</p>
<ul>
  <li>Модернизация конференц-залов Дворца наций «Кохи Сомон»</li>
  <li>Обновление гостиничной инфраструктуры столицы</li>
  <li>Улучшение транспортной доступности</li>
  <li>Подготовка культурной программы для участников</li>
</ul>

<h3>Ключевые темы конференции</h3>
<p>Конференция будет посвящена обсуждению критически важных вопросов глобальной водной повестки, включая водную безопасность, изменение климата и его влияние на водные ресурсы, трансграничное сотрудничество и инновационные решения в водном секторе.</p>

<blockquote>«Таджикистан как инициатор Международного десятилетия действий «Вода для устойчивого развития» продолжает играть ключевую роль в продвижении глобальной водной повестки», — отметил представитель Министерства иностранных дел.</blockquote>`,
    content_en: `<p>The Republic of Tajikistan is actively preparing to host the Fourth High-Level International Conference on the International Decade for Action "Water for Sustainable Development" 2018-2028, which will take place on May 25-28, 2026 in Dushanbe.</p>

<h3>Scale of Preparation</h3>
<p>The Government of Tajikistan, together with international partners, is carrying out extensive work to organize the conference. Delegations from more than 150 countries are expected to participate, including heads of state and government, ministers, representatives of international organizations and the expert community.</p>

<h3>Infrastructure Projects</h3>
<p>As part of the preparation for the conference, a number of infrastructure projects are being implemented:</p>
<ul>
  <li>Modernization of conference halls at the Palace of Nations "Kohi Somon"</li>
  <li>Renovation of the capital's hotel infrastructure</li>
  <li>Improvement of transport accessibility</li>
  <li>Preparation of a cultural program for participants</li>
</ul>

<h3>Key Conference Topics</h3>
<p>The conference will be dedicated to discussing critically important issues of the global water agenda, including water security, climate change and its impact on water resources, transboundary cooperation and innovative solutions in the water sector.</p>

<blockquote>"Tajikistan, as the initiator of the International Decade for Action 'Water for Sustainable Development,' continues to play a key role in promoting the global water agenda," noted a representative of the Ministry of Foreign Affairs.</blockquote>`,
    content_tj: `<p>Ҷумҳурии Тоҷикистон фаъолона омодагӣ мебинад барои баргузории Конфронси чоруми байналмилалии сатҳи баланд оид ба Даҳсолаи байналмилалии амал «Об барои рушди устувор» 2018-2028, ки 25-28 маи соли 2026 дар Душанбе баргузор мешавад.</p>

<h3>Миқёси омодагӣ</h3>
<p>Ҳукумати Тоҷикистон якҷоя бо шарикони байналмилалӣ корҳои васеъро барои ташкили конфронс анҷом медиҳад. Интизор меравад, ки ҳайатҳо аз зиёда аз 150 кишвари ҷаҳон, аз ҷумла сарони давлатҳо ва ҳукуматҳо, вазирон, намояндагони созмонҳои байналмилалӣ ва ҷомеаи коршиносон иштирок кунанд.</p>

<h3>Лоиҳаҳои инфрасохторӣ</h3>
<p>Дар доираи омодагӣ ба конфронс як қатор лоиҳаҳои инфрасохторӣ амалӣ карда мешаванд:</p>
<ul>
  <li>Навсозии толорҳои конфронсии Қасри миллат «Кохи Сомон»</li>
  <li>Навсозии инфрасохтори меҳмонхонаҳои пойтахт</li>
  <li>Беҳтар кардани дастрасии нақлиётӣ</li>
  <li>Омода кардани барномаи фарҳангӣ барои иштироккунандагон</li>
</ul>

<h3>Мавзӯъҳои асосии конфронс</h3>
<p>Конфронс ба муҳокимаи масъалаҳои муҳими барномаи ҷаҳонии об бахшида мешавад, аз ҷумла амнияти обӣ, тағйирёбии иқлим ва таъсири он ба захираҳои обӣ, ҳамкории трансмарзӣ ва ҳалли навоварона дар соҳаи об.</p>

<blockquote>«Тоҷикистон ҳамчун ибтидогузори Даҳсолаи байналмилалии амал «Об барои рушди устувор» нақши калидиро дар пешбурди барномаи ҷаҳонии об идома медиҳад», — қайд кард намояндаи Вазорати корҳои хориҷӣ.</blockquote>`
  },
  {
    slug: 'preliminary-program-published',
    category: 'program',
    title_ru: 'Опубликована предварительная программа мероприятий',
    title_en: 'Preliminary program of events published',
    title_tj: 'Барномаи пешакии чорабиниҳо нашр шуд',
    excerpt_ru: 'Ознакомьтесь с расписанием пленарных заседаний, тематических сессий и культурных мероприятий.',
    excerpt_en: 'Check out the schedule of plenary sessions, thematic sessions and cultural events.',
    excerpt_tj: 'Бо ҷадвали ҷаласаҳои пленарӣ, сессияҳои мавзӯъӣ ва чорабиниҳои фарҳангӣ шинос шавед.',
    image: '/assets/images/news-glacier.png',
    published_at: '2026-01-10',
    content_ru: `<p>Организационный комитет конференции опубликовал предварительную программу мероприятий Четвертой Международной конференции высокого уровня «Вода для устойчивого развития».</p>

<h3>Структура программы</h3>
<p>Программа конференции рассчитана на четыре дня и включает:</p>
<ul>
  <li><strong>День 1 (25 мая):</strong> Церемония открытия, приветственные выступления глав государств</li>
  <li><strong>День 2 (26 мая):</strong> Пленарные заседания высокого уровня</li>
  <li><strong>День 3 (27 мая):</strong> Тематические сессии и круглые столы</li>
  <li><strong>День 4 (28 мая):</strong> Подведение итогов, принятие декларации</li>
</ul>

<h3>Тематические направления</h3>
<p>Основные тематические направления конференции включают:</p>
<ul>
  <li>Водная безопасность и изменение климата</li>
  <li>Трансграничное водное сотрудничество</li>
  <li>Инновации и технологии в водном секторе</li>
  <li>Финансирование водной инфраструктуры</li>
  <li>Роль молодежи в устойчивом управлении водными ресурсами</li>
</ul>

<h3>Культурная программа</h3>
<p>Для участников конференции также подготовлена насыщенная культурная программа, включающая экскурсии по достопримечательностям Таджикистана и традиционный гала-ужин.</p>`,
    content_en: `<p>The organizing committee of the conference has published the preliminary program of events for the Fourth High-Level International Conference "Water for Sustainable Development".</p>

<h3>Program Structure</h3>
<p>The conference program spans four days and includes:</p>
<ul>
  <li><strong>Day 1 (May 25):</strong> Opening ceremony, welcome speeches by heads of state</li>
  <li><strong>Day 2 (May 26):</strong> High-level plenary sessions</li>
  <li><strong>Day 3 (May 27):</strong> Thematic sessions and round tables</li>
  <li><strong>Day 4 (May 28):</strong> Summing up, adoption of declaration</li>
</ul>

<h3>Thematic Areas</h3>
<p>The main thematic areas of the conference include:</p>
<ul>
  <li>Water security and climate change</li>
  <li>Transboundary water cooperation</li>
  <li>Innovation and technology in the water sector</li>
  <li>Financing water infrastructure</li>
  <li>Role of youth in sustainable water resource management</li>
</ul>

<h3>Cultural Program</h3>
<p>A rich cultural program has also been prepared for conference participants, including excursions to Tajikistan's attractions and a traditional gala dinner.</p>`,
    content_tj: `<p>Кумитаи ташкилии конфронс барномаи пешакии чорабиниҳои Конфронси чоруми байналмилалии сатҳи баланд «Об барои рушди устувор»-ро нашр кард.</p>

<h3>Сохтори барнома</h3>
<p>Барномаи конфронс ба чор рӯз пешбинӣ шудааст ва дар бар мегирад:</p>
<ul>
  <li><strong>Рӯзи 1 (25 май):</strong> Маросими кушод, суханрониҳои хайрамақдами сарони давлатҳо</li>
  <li><strong>Рӯзи 2 (26 май):</strong> Ҷаласаҳои пленарии сатҳи баланд</li>
  <li><strong>Рӯзи 3 (27 май):</strong> Сессияҳои мавзӯъӣ ва мизҳои мудаввар</li>
  <li><strong>Рӯзи 4 (28 май):</strong> Ҷамъбасткунӣ, қабули эъломия</li>
</ul>

<h3>Самтҳои мавзӯъӣ</h3>
<p>Самтҳои асосии мавзӯъии конфронс дар бар мегиранд:</p>
<ul>
  <li>Амнияти обӣ ва тағйирёбии иқлим</li>
  <li>Ҳамкории трансмарзии обӣ</li>
  <li>Навовариҳо ва технологияҳо дар соҳаи об</li>
  <li>Маблағгузории инфрасохтори обӣ</li>
  <li>Нақши ҷавонон дар идоракунии устувори захираҳои обӣ</li>
</ul>

<h3>Барномаи фарҳангӣ</h3>
<p>Барои иштироккунандагони конфронс инчунин барномаи фарҳангии ғанӣ омода карда шудааст, ки сайру гаштҳо ба ҷойҳои дидании Тоҷикистон ва шоми анъанавии галаро дар бар мегирад.</p>`
  },
  {
    slug: 'registration-open-international-delegations',
    category: 'registration',
    title_ru: 'Открыта регистрация для международных делегаций',
    title_en: 'Registration open for international delegations',
    title_tj: 'Бақайдгирӣ барои ҳайатҳои байналмилалӣ оғоз ёфт',
    excerpt_ru: 'Представители более 150 стран смогут принять участие в конференции.',
    excerpt_en: 'Representatives from more than 150 countries will be able to participate in the conference.',
    excerpt_tj: 'Намояндагони зиёда аз 150 кишвар дар конфронс иштирок карда метавонанд.',
    image: '/assets/images/news-tech.png',
    published_at: '2026-01-05',
    content_ru: `<p>Секретариат конференции официально объявил об открытии регистрации для международных делегаций, желающих принять участие в Четвертой Международной конференции высокого уровня «Вода для устойчивого развития».</p>

<h3>Порядок регистрации</h3>
<p>Регистрация осуществляется через официальный портал конференции. Для регистрации необходимо:</p>
<ul>
  <li>Заполнить онлайн-форму с указанием персональных данных</li>
  <li>Прикрепить официальное письмо от направляющей организации</li>
  <li>Указать предпочтительный формат участия</li>
  <li>Выбрать тематические сессии для посещения</li>
</ul>

<h3>Категории участников</h3>
<p>Регистрация открыта для следующих категорий участников:</p>
<ul>
  <li>Официальные делегации государств-членов ООН</li>
  <li>Представители международных организаций</li>
  <li>Эксперты и ученые в области водных ресурсов</li>
  <li>Представители частного сектора</li>
  <li>Представители гражданского общества и НКО</li>
  <li>Представители СМИ</li>
</ul>

<h3>Визовая поддержка</h3>
<p>Секретариат конференции обеспечивает визовую поддержку для официальных делегаций. Для получения визовой поддержки необходимо направить соответствующий запрос через систему регистрации.</p>`,
    content_en: `<p>The conference secretariat has officially announced the opening of registration for international delegations wishing to participate in the Fourth High-Level International Conference "Water for Sustainable Development".</p>

<h3>Registration Procedure</h3>
<p>Registration is carried out through the official conference portal. To register, you need to:</p>
<ul>
  <li>Fill out an online form with personal details</li>
  <li>Attach an official letter from the sending organization</li>
  <li>Indicate the preferred participation format</li>
  <li>Select thematic sessions to attend</li>
</ul>

<h3>Participant Categories</h3>
<p>Registration is open for the following categories of participants:</p>
<ul>
  <li>Official delegations of UN member states</li>
  <li>Representatives of international organizations</li>
  <li>Experts and scientists in the field of water resources</li>
  <li>Private sector representatives</li>
  <li>Representatives of civil society and NGOs</li>
  <li>Media representatives</li>
</ul>

<h3>Visa Support</h3>
<p>The conference secretariat provides visa support for official delegations. To obtain visa support, you need to submit a corresponding request through the registration system.</p>`,
    content_tj: `<p>Котибияти конфронс расман дар бораи оғози бақайдгирӣ барои ҳайатҳои байналмилалие, ки мехоҳанд дар Конфронси чоруми байналмилалии сатҳи баланд «Об барои рушди устувор» иштирок кунанд, эълон кард.</p>

<h3>Тартиби бақайдгирӣ</h3>
<p>Бақайдгирӣ тавассути портали расмии конфронс анҷом дода мешавад. Барои бақайдгирӣ лозим аст:</p>
<ul>
  <li>Шакли онлайнро бо маълумоти шахсӣ пур кунед</li>
  <li>Мактуби расмии ташкилоти фиристанда замима кунед</li>
  <li>Формати дилхоҳи иштирокро нишон диҳед</li>
  <li>Сессияҳои мавзӯъиро барои ҳузур интихоб кунед</li>
</ul>

<h3>Категорияҳои иштироккунандагон</h3>
<p>Бақайдгирӣ барои категорияҳои зерини иштироккунандагон кушода аст:</p>
<ul>
  <li>Ҳайатҳои расмии давлатҳои аъзои СММ</li>
  <li>Намояндагони созмонҳои байналмилалӣ</li>
  <li>Коршиносон ва олимон дар соҳаи захираҳои обӣ</li>
  <li>Намояндагони бахши хусусӣ</li>
  <li>Намояндагони ҷомеаи шаҳрвандӣ ва СҶТ</li>
  <li>Намояндагони ВАО</li>
</ul>

<h3>Дастгирии раводид</h3>
<p>Котибияти конфронс дастгирии раводидро барои ҳайатҳои расмӣ таъмин мекунад. Барои гирифтани дастгирии раводид лозим аст дархости мувофиқро тавассути системаи бақайдгирӣ пешниҳод кунед.</p>`
  },
  {
    slug: 'youth-role-water-management',
    category: 'youth',
    title_ru: 'Роль молодежи в управлении водными ресурсами',
    title_en: 'Role of youth in water resource management',
    title_tj: 'Нақши ҷавонон дар идоракунии захираҳои обӣ',
    excerpt_ru: 'Молодые лидеры со всего мира поделятся своим видением устойчивого развития.',
    excerpt_en: 'Young leaders from around the world will share their vision of sustainable development.',
    excerpt_tj: 'Роҳбарони ҷавон аз саросари ҷаҳон дидгоҳи худро оид ба рушди устувор мубодила хоҳанд кард.',
    image: '/assets/images/news-youth.png',
    published_at: '2025-12-28',
    content_ru: `<p>В рамках конференции особое внимание будет уделено роли молодежи в решении глобальных водных проблем. Молодежный форум соберет молодых лидеров и активистов со всего мира.</p>

<h3>Молодежный форум</h3>
<p>Специальная программа для молодежи включает:</p>
<ul>
  <li>Молодежный саммит с участием представителей более 100 стран</li>
  <li>Хакатон по разработке инновационных решений в водной сфере</li>
  <li>Менторские сессии с ведущими экспертами отрасли</li>
  <li>Конкурс молодежных проектов с призовым фондом</li>
</ul>

<h3>Тематические направления</h3>
<p>Молодые участники будут работать над проектами по следующим направлениям:</p>
<ul>
  <li>Цифровые технологии для мониторинга водных ресурсов</li>
  <li>Социальное предпринимательство в водном секторе</li>
  <li>Образование и повышение осведомленности</li>
  <li>Климатическая адаптация и устойчивость</li>
</ul>

<h3>Как принять участие</h3>
<p>Молодые люди в возрасте от 18 до 35 лет могут подать заявку на участие в молодежном форуме через специальную форму на сайте конференции. Отбор участников будет проводиться на конкурсной основе.</p>`,
    content_en: `<p>The conference will pay special attention to the role of youth in solving global water problems. The youth forum will bring together young leaders and activists from around the world.</p>

<h3>Youth Forum</h3>
<p>The special program for youth includes:</p>
<ul>
  <li>Youth summit with representatives from more than 100 countries</li>
  <li>Hackathon for developing innovative solutions in the water sector</li>
  <li>Mentoring sessions with leading industry experts</li>
  <li>Youth project competition with a prize fund</li>
</ul>

<h3>Thematic Areas</h3>
<p>Young participants will work on projects in the following areas:</p>
<ul>
  <li>Digital technologies for water resource monitoring</li>
  <li>Social entrepreneurship in the water sector</li>
  <li>Education and awareness raising</li>
  <li>Climate adaptation and resilience</li>
</ul>

<h3>How to Participate</h3>
<p>Young people aged 18 to 35 can apply to participate in the youth forum through a special form on the conference website. Selection of participants will be conducted on a competitive basis.</p>`,
    content_tj: `<p>Дар доираи конфронс таваҷҷуҳи махсус ба нақши ҷавонон дар ҳалли мушкилоти ҷаҳонии обӣ дода хоҳад шуд. Форуми ҷавонон роҳбарон ва фаъолони ҷавонро аз саросари ҷаҳон ҷамъ хоҳад овард.</p>

<h3>Форуми ҷавонон</h3>
<p>Барномаи махсус барои ҷавонон дар бар мегирад:</p>
<ul>
  <li>Саммити ҷавонон бо иштироки намояндагон аз зиёда аз 100 кишвар</li>
  <li>Ҳакатон барои таҳияи ҳалли навоварона дар соҳаи об</li>
  <li>Сессияҳои менторӣ бо коршиносони пешбари соҳа</li>
  <li>Озмуну лоиҳаҳои ҷавонон бо фонди ҷоизавӣ</li>
</ul>

<h3>Самтҳои мавзӯъӣ</h3>
<p>Иштироккунандагони ҷавон рӯи лоиҳаҳо дар самтҳои зерин кор хоҳанд кард:</p>
<ul>
  <li>Технологияҳои рақамӣ барои мониторинги захираҳои обӣ</li>
  <li>Соҳибкории иҷтимоӣ дар соҳаи об</li>
  <li>Маълумот ва баланд бардоштани огоҳӣ</li>
  <li>Мутобиқшавӣ ба иқлим ва устуворӣ</li>
</ul>

<h3>Чӣ тавр иштирок кардан мумкин аст</h3>
<p>Ҷавонони синни 18 то 35-сола метавонанд барои иштирок дар форуми ҷавонон тавассути шакли махсус дар сомонаи конфронс ариза диҳанд. Интихоби иштироккунандагон дар асоси озмун гузаронида мешавад.</p>`
  },
  {
    slug: 'drinking-water-project-launched',
    category: 'projects',
    title_ru: 'Запущен новый проект по обеспечению питьевой водой',
    title_en: 'New drinking water project launched',
    title_tj: 'Лоиҳаи нав оид ба таъмини оби нӯшокӣ оғоз ёфт',
    excerpt_ru: 'Инициатива направлена на улучшение доступа к чистой воде в отдаленных регионах.',
    excerpt_en: 'The initiative aims to improve access to clean water in remote regions.',
    excerpt_tj: 'Ташаббус ба беҳтар кардани дастрасӣ ба оби тоза дар минтақаҳои дурдаст нигаронида шудааст.',
    image: '/assets/images/news-project.png',
    published_at: '2025-12-15',
    content_ru: `<p>В преддверии конференции правительство Таджикистана совместно с международными партнерами запустило новый проект по улучшению доступа к питьевой воде в отдаленных горных регионах страны.</p>

<h3>Цели проекта</h3>
<p>Основные цели проекта:</p>
<ul>
  <li>Обеспечить доступ к чистой питьевой воде для 500 000 жителей</li>
  <li>Построить и модернизировать 200 водопроводных систем</li>
  <li>Обучить местных специалистов обслуживанию инфраструктуры</li>
  <li>Внедрить системы мониторинга качества воды</li>
</ul>

<h3>Партнеры проекта</h3>
<p>Проект реализуется при поддержке:</p>
<ul>
  <li>Всемирного банка</li>
  <li>Программы развития ООН (ПРООН)</li>
  <li>Азиатского банка развития</li>
  <li>Правительства Таджикистана</li>
</ul>

<h3>Ожидаемые результаты</h3>
<p>К 2028 году проект позволит значительно улучшить качество жизни населения горных районов и достичь показателей Целей устойчивого развития в области водоснабжения.</p>`,
    content_en: `<p>In the run-up to the conference, the Government of Tajikistan, together with international partners, has launched a new project to improve access to drinking water in the country's remote mountain regions.</p>

<h3>Project Goals</h3>
<p>The main goals of the project:</p>
<ul>
  <li>Provide access to clean drinking water for 500,000 residents</li>
  <li>Build and upgrade 200 water supply systems</li>
  <li>Train local specialists in infrastructure maintenance</li>
  <li>Implement water quality monitoring systems</li>
</ul>

<h3>Project Partners</h3>
<p>The project is implemented with the support of:</p>
<ul>
  <li>World Bank</li>
  <li>United Nations Development Programme (UNDP)</li>
  <li>Asian Development Bank</li>
  <li>Government of Tajikistan</li>
</ul>

<h3>Expected Results</h3>
<p>By 2028, the project will significantly improve the quality of life for the population of mountain areas and achieve the Sustainable Development Goals indicators in the field of water supply.</p>`,
    content_tj: `<p>Дар остонаи конфронс Ҳукумати Тоҷикистон якҷоя бо шарикони байналмилалӣ лоиҳаи нав оид ба беҳтар кардани дастрасӣ ба оби нӯшокӣ дар минтақаҳои дурдасти кӯҳии кишварро оғоз кард.</p>

<h3>Ҳадафҳои лоиҳа</h3>
<p>Ҳадафҳои асосии лоиҳа:</p>
<ul>
  <li>Таъмини дастрасӣ ба оби тозаи нӯшокӣ барои 500,000 сокинон</li>
  <li>Сохтмон ва навсозии 200 системаи обрасонӣ</li>
  <li>Омӯзиши мутахассисони маҳаллӣ оид ба нигоҳдории инфрасохтор</li>
  <li>Ҷорӣ кардани системаҳои мониторинги сифати об</li>
</ul>

<h3>Шарикони лоиҳа</h3>
<p>Лоиҳа бо дастгирии:</p>
<ul>
  <li>Бонки ҷаҳонӣ</li>
  <li>Барномаи рушди СММ (БРСММ)</li>
  <li>Бонки рушди Осиё</li>
  <li>Ҳукумати Тоҷикистон татбиқ карда мешавад</li>
</ul>

<h3>Натиҷаҳои интизоршаванда</h3>
<p>То соли 2028 лоиҳа имкон медиҳад, ки сифати зиндагии аҳолии минтақаҳои кӯҳӣ хеле беҳтар карда шавад ва нишондиҳандаҳои Ҳадафҳои рушди устувор дар соҳаи обрасонӣ ба даст оварда шаванд.</p>`
  },
  {
    slug: 'international-water-cooperation',
    category: 'diplomacy',
    title_ru: 'Укрепление международного сотрудничества в водной сфере',
    title_en: 'Strengthening international cooperation in the water sector',
    title_tj: 'Мустаҳкам кардани ҳамкории байналмилалӣ дар соҳаи об',
    excerpt_ru: 'Новые соглашения между странами Центральной Азии открывают перспективы сотрудничества.',
    excerpt_en: 'New agreements between Central Asian countries open up prospects for cooperation.',
    excerpt_tj: 'Созишномаҳои нав байни кишварҳои Осиёи Марказӣ дурнамои ҳамкориро мекушоянд.',
    image: '/assets/images/news-diplomacy.png',
    published_at: '2025-12-01',
    content_ru: `<p>Страны Центральной Азии достигли значительного прогресса в укреплении регионального сотрудничества по вопросам управления трансграничными водными ресурсами.</p>

<h3>Новые соглашения</h3>
<p>В ходе подготовки к конференции были подписаны важные двусторонние и многосторонние соглашения:</p>
<ul>
  <li>Меморандум о взаимопонимании по совместному управлению бассейном реки Сырдарья</li>
  <li>Соглашение о обмене гидрологическими данными в режиме реального времени</li>
  <li>Протокол о совместных мерах по адаптации к изменению климата</li>
</ul>

<h3>Механизмы сотрудничества</h3>
<p>Для реализации достигнутых договоренностей созданы новые механизмы сотрудничества:</p>
<ul>
  <li>Региональный центр обмена данными о водных ресурсах</li>
  <li>Совместная комиссия по мониторингу качества воды</li>
  <li>Фонд поддержки водных инфраструктурных проектов</li>
</ul>

<h3>Значение для региона</h3>
<p>Эксперты отмечают, что достигнутые соглашения создают прочную основу для устойчивого управления водными ресурсами в регионе и могут служить примером для других стран мира.</p>`,
    content_en: `<p>Central Asian countries have made significant progress in strengthening regional cooperation on transboundary water resource management.</p>

<h3>New Agreements</h3>
<p>During the preparation for the conference, important bilateral and multilateral agreements were signed:</p>
<ul>
  <li>Memorandum of Understanding on joint management of the Syr Darya river basin</li>
  <li>Agreement on real-time exchange of hydrological data</li>
  <li>Protocol on joint measures for climate change adaptation</li>
</ul>

<h3>Cooperation Mechanisms</h3>
<p>New cooperation mechanisms have been created to implement the agreements reached:</p>
<ul>
  <li>Regional water resources data exchange center</li>
  <li>Joint commission for water quality monitoring</li>
  <li>Fund to support water infrastructure projects</li>
</ul>

<h3>Importance for the Region</h3>
<p>Experts note that the agreements reached create a solid foundation for sustainable water resource management in the region and can serve as an example for other countries around the world.</p>`,
    content_tj: `<p>Кишварҳои Осиёи Марказӣ дар мустаҳкам кардани ҳамкории минтақавӣ оид ба идоракунии захираҳои трансмарзии обӣ пешрафти назаррас ба даст оварданд.</p>

<h3>Созишномаҳои нав</h3>
<p>Дар давоми омодагӣ ба конфронс созишномаҳои муҳими дуҷониба ва бисёрҷониба имзо шуданд:</p>
<ul>
  <li>Ёддошти тафоҳум оид ба идоракунии муштараки ҳавзаи дарёи Сирдарё</li>
  <li>Созишнома оид ба мубодилаи маълумоти гидрологӣ дар режими вақти воқеӣ</li>
  <li>Протокол оид ба чораҳои муштарак барои мутобиқшавӣ ба тағйирёбии иқлим</li>
</ul>

<h3>Механизмҳои ҳамкорӣ</h3>
<p>Барои татбиқи созишномаҳои ба дастовардашуда механизмҳои нави ҳамкорӣ таъсис дода шуданд:</p>
<ul>
  <li>Маркази минтақавии мубодилаи маълумот дар бораи захираҳои обӣ</li>
  <li>Комиссияи муштарак оид ба мониторинги сифати об</li>
  <li>Фонд барои дастгирии лоиҳаҳои инфрасохтори обӣ</li>
</ul>

<h3>Аҳамият барои минтақа</h3>
<p>Коршиносон қайд мекунанд, ки созишномаҳои ба дастовардашуда асоси мустаҳкамро барои идоракунии устувори захираҳои обӣ дар минтақа таъсис медиҳанд ва метавонанд барои дигар кишварҳои ҷаҳон намуна бошанд.</p>`
  }
]

// API helper to seed data
export async function seedAllData(apiUrl, token) {
  const results = {
    hero: { success: false, error: null },
    speakers: { success: 0, failed: 0, errors: [] },
    partners: { success: 0, failed: 0, errors: [] },
    news: { success: 0, failed: 0, errors: [] },
    partnerTypes: { success: false, error: null }
  }

  const apiRequest = async (endpoint, options = {}) => {
    const response = await fetch(`${apiUrl}${endpoint}`, {
      ...options,
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`,
        ...options.headers,
      },
    })
    if (!response.ok) throw new Error(`HTTP ${response.status}`)
    return response.json()
  }

  // Seed hero settings first
  try {
    const heroSettings = Object.entries(heroSeedData).map(([key, value]) => ({
      key: `hero_${key}`,
      value: value
    }))
    await apiRequest('/api/admin/settings', {
      method: 'PUT',
      body: JSON.stringify({ settings: heroSettings })
    })
    results.hero.success = true
  } catch (err) {
    results.hero.error = err.message
  }

  // Seed partner types
  try {
    await apiRequest('/api/admin/settings', {
      method: 'PUT',
      body: JSON.stringify({
        settings: [
          { key: 'partner_types', value: JSON.stringify(partnerTypesSeedData) }
        ]
      })
    })
    results.partnerTypes.success = true
  } catch (err) {
    results.partnerTypes.error = err.message
  }

  // Seed speakers
  for (const speaker of speakersSeedData) {
    try {
      await apiRequest('/api/admin/speakers', {
        method: 'POST',
        body: JSON.stringify(speaker)
      })
      results.speakers.success++
    } catch (err) {
      results.speakers.failed++
      results.speakers.errors.push(`${speaker.name_en}: ${err.message}`)
    }
  }

  // Seed partners
  for (const partner of partnersSeedData) {
    try {
      await apiRequest('/api/admin/partners', {
        method: 'POST',
        body: JSON.stringify(partner)
      })
      results.partners.success++
    } catch (err) {
      results.partners.failed++
      results.partners.errors.push(`${partner.name}: ${err.message}`)
    }
  }

  // Seed news
  for (const newsItem of newsSeedData) {
    try {
      await apiRequest('/api/admin/news', {
        method: 'POST',
        body: JSON.stringify(newsItem)
      })
      results.news.success++
    } catch (err) {
      results.news.failed++
      results.news.errors.push(`${newsItem.slug}: ${err.message}`)
    }
  }

  return results
}
