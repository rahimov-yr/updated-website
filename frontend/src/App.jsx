import { Routes, Route, Navigate, useLocation, useParams } from 'react-router-dom'
import { useEffect, useRef } from 'react'
import Layout from './components/Layout/Layout'
import Home from './pages/Home'
import Conference from './pages/Conference'
import Program from './pages/Program'
import Events from './pages/Events'
import Excursions from './pages/Excursions'
import Exhibition from './pages/Exhibition'
import Logistics from './pages/Logistics'
import Contacts from './pages/Contacts'
import Registration from './pages/Registration'
import News from './pages/News'
import NewsDetail from './pages/NewsDetail'
import WaterDecade from './pages/WaterDecade'
import WaterDecadeDetails from './pages/WaterDecadeDetails'
import WaterDecadeConference from './pages/WaterDecadeConference'
import SpeakerDetail from './pages/SpeakerDetail'
import CustomPage from './pages/CustomPage'
import { ScrollToTop, ToastProvider } from './components/UI'

// Conference subpages
import Introduction from './pages/conference/Introduction'
import Goals from './pages/conference/Goals'
import DateVenue from './pages/conference/DateVenue'
import Participation from './pages/conference/Participation'

// Program subpages
import ProgramStructure from './pages/program/ProgramStructure'
import Plenary from './pages/program/Plenary'
import ConferenceEvents from './pages/program/ConferenceEvents'
import Forums from './pages/program/Forums'

// Events subpages
import ParallelEvents from './pages/events/ParallelEvents'
import CulturalEvents from './pages/events/CulturalEvents'

// Excursions subpages
import RogunExcursion from './pages/excursions/Rogun'
import DushanbeExcursion from './pages/excursions/Dushanbe'
import KhisorExcursion from './pages/excursions/Khisor'

// Logistics subpages
import PracticalInfo from './pages/logistics/PracticalInfo'
import Visa from './pages/logistics/Visa'
import Press from './pages/logistics/Press'
import Flights from './pages/logistics/Flights'
import Accommodation from './pages/logistics/Accommodation'
import HotelDetail from './pages/logistics/HotelDetail'
import Weather from './pages/logistics/Weather'

// Admin imports
import { AuthProvider } from './admin/context/AuthContext'
import ProtectedRoute from './admin/components/ProtectedRoute'
import AdminLayout from './admin/components/AdminLayout'
import Login from './admin/pages/Login'
import Dashboard from './admin/pages/Dashboard'
import HomePageManager from './admin/pages/HomePageManager'
import NewsManager from './admin/pages/NewsManager'
import SettingsManager from './admin/pages/SettingsManager'
// Home sub-pages
import HomePageLayout from './admin/pages/home/HomePageLayout'
import HeroManager from './admin/pages/home/HeroManager'
import SpeakersManager from './admin/pages/home/SpeakersManager'
import HomeNewsManager from './admin/pages/home/HomeNewsManager'
import ProgramManager from './admin/pages/home/ProgramManager'
import PartnersManager from './admin/pages/home/PartnersManager'
import AppManager from './admin/pages/home/AppManager'
import LoadingManager from './admin/pages/home/LoadingManager'
import HeaderManager from './admin/pages/home/HeaderManager'
import FooterManager from './admin/pages/home/FooterManager'
import SpeakerDetailEditor from './admin/pages/home/SpeakerDetailEditor'
// Page managers
import PagesManager from './admin/pages/PagesManager'
import ScheduleManager from './admin/pages/ScheduleManager'
import ExcursionsManager from './admin/pages/ExcursionsManager'
import LogisticsManager from './admin/pages/LogisticsManager'
import EventsManager from './admin/pages/EventsManager'
import ContactsManager from './admin/pages/ContactsManager'
import HelpManager from './admin/pages/HelpManager'
import ChangePassword from './admin/pages/ChangePassword'
import EventsSubpagesManager from './admin/pages/EventsSubpagesManager'
import WaterDecadePageEditor from './admin/pages/WaterDecadePageEditor'
import BannerManager from './admin/pages/BannerManager'

function ScrollToHash() {
  const location = useLocation()
  const prevPathRef = useRef(location.pathname)

  useEffect(() => {
    const isNewPage = prevPathRef.current !== location.pathname
    prevPathRef.current = location.pathname

    // Handle hash scrolling
    if (location.hash) {
      // Small delay to ensure DOM is rendered
      const timer = setTimeout(() => {
        const element = document.querySelector(location.hash)
        if (element) {
          const headerOffset = 120 // Account for fixed header
          const elementPosition = element.getBoundingClientRect().top
          const offsetPosition = elementPosition + window.pageYOffset - headerOffset

          window.scrollTo({
            top: offsetPosition,
            behavior: 'smooth'
          })
        }
      }, 100)
      return () => clearTimeout(timer)
    } else if (isNewPage) {
      // Instantly scroll to top when navigating to a new page without hash
      window.scrollTo({ top: 0, behavior: 'instant' })
    }
  }, [location])

  return null
}

function ScrollReveal() {
  const location = useLocation()

  useEffect(() => {
    // Small delay to ensure DOM is rendered
    const timer = setTimeout(() => {
      const revealElements = document.querySelectorAll('.reveal')

      const observer = new IntersectionObserver(
        (entries) => {
          entries.forEach((entry) => {
            if (entry.isIntersecting) {
              entry.target.classList.add('reveal--visible')
            }
          })
        },
        {
          threshold: 0.1,
          rootMargin: '0px 0px -50px 0px',
        }
      )

      revealElements.forEach((el) => observer.observe(el))

      return () => {
        revealElements.forEach((el) => observer.unobserve(el))
      }
    }, 100)

    return () => clearTimeout(timer)
  }, [location.pathname])

  return null
}

// Validates language prefix in URL - only allows 'ru' and 'tj'
function LanguageLayout() {
  const { lang } = useParams()
  if (!['ru', 'tj'].includes(lang)) {
    return <Navigate to="/" replace />
  }
  return <Layout />
}

// Shared public route definitions
const publicRoutes = (
  <>
    <Route index element={<Home />} />
    <Route path="conference" element={<Conference />} />
    <Route path="conference/introduction" element={<Introduction />} />
    <Route path="conference/goals" element={<Goals />} />
    <Route path="conference/date-venue" element={<DateVenue />} />
    <Route path="conference/participation" element={<Participation />} />
    <Route path="program" element={<Program />} />
    <Route path="program/structure" element={<ProgramStructure />} />
    <Route path="program/plenary" element={<Plenary />} />
    <Route path="program/events" element={<ConferenceEvents />} />
    <Route path="program/forums" element={<Forums />} />
    <Route path="events" element={<Events />} />
    <Route path="events/parallel" element={<ParallelEvents />} />
    <Route path="events/cultural" element={<CulturalEvents />} />
    <Route path="events/rogun" element={<RogunExcursion />} />
    <Route path="events/dushanbe" element={<DushanbeExcursion />} />
    <Route path="events/khisor" element={<KhisorExcursion />} />
    <Route path="excursions" element={<Excursions />} />
    <Route path="excursions/rogun" element={<RogunExcursion />} />
    <Route path="excursions/dushanbe" element={<DushanbeExcursion />} />
    <Route path="excursions/khisor" element={<KhisorExcursion />} />
    <Route path="exhibition" element={<Exhibition />} />
    <Route path="logistics" element={<Logistics />} />
    <Route path="logistics/practical" element={<PracticalInfo />} />
    <Route path="logistics/visa" element={<Visa />} />
    <Route path="logistics/press" element={<Press />} />
    <Route path="logistics/flights" element={<Flights />} />
    <Route path="logistics/accommodation" element={<Accommodation />} />
    <Route path="logistics/accommodation/:hotelId" element={<HotelDetail />} />
    <Route path="logistics/weather" element={<Weather />} />
    <Route path="contacts" element={<Contacts />} />
    <Route path="registration" element={<Registration />} />
    <Route path="news" element={<News />} />
    <Route path="news/:slug" element={<NewsDetail />} />
    <Route path="water-decade" element={<WaterDecade />} />
    <Route path="water-decade/:confId" element={<WaterDecadeConference />} />
    <Route path="water-decade-details" element={<WaterDecadeDetails />} />
    <Route path="speaker/:id" element={<SpeakerDetail />} />
    <Route path="page/:slug" element={<CustomPage />} />
  </>
)

function App() {
  return (
    <ToastProvider>
      <ScrollToHash />
      <ScrollReveal />
      <Routes>
        {/* Public routes - English (default, no prefix) */}
        <Route path="/" element={<Layout />}>
          {publicRoutes}
        </Route>

        {/* Public routes - with language prefix (/ru/..., /tj/...) */}
        <Route path="/:lang/*" element={<LanguageLayout />}>
          {publicRoutes}
        </Route>

        {/* Admin routes */}
        <Route path="/admin/login" element={
          <AuthProvider>
            <Login />
          </AuthProvider>
        } />
        <Route
          path="/admin/*"
          element={
            <AuthProvider>
              <ProtectedRoute>
                <Routes>
                  <Route element={<AdminLayout />}>
                    <Route index element={<Dashboard />} />
                    {/* Home sub-pages with shared layout */}
                    <Route path="home" element={<HomePageLayout />}>
                      <Route index element={<HeaderManager />} />
                      <Route path="header" element={<HeaderManager />} />
                      <Route path="loading" element={<LoadingManager />} />
                      <Route path="hero" element={<HeroManager />} />
                      <Route path="speakers" element={<SpeakersManager />} />
                      <Route path="speakers/:id" element={<SpeakerDetailEditor />} />
                      <Route path="news" element={<HomeNewsManager />} />
                      <Route path="program" element={<ProgramManager />} />
                      <Route path="partners" element={<PartnersManager />} />
                      <Route path="app" element={<AppManager />} />
                      <Route path="footer" element={<FooterManager />} />
                    </Route>
                    {/* Pages manager (unified) */}
                    <Route path="pages" element={<PagesManager />} />
                    {/* Subpages manager with block constructor */}
                    <Route path="subpages" element={<EventsSubpagesManager />} />
                    <Route path="water-decade-editor" element={<WaterDecadePageEditor />} />
                    <Route path="water-decade-editor/:confId" element={<WaterDecadePageEditor />} />
                    {/* Legacy routes for backwards compatibility */}
                    <Route path="program" element={<ScheduleManager />} />
                    <Route path="excursions" element={<ExcursionsManager />} />
                    <Route path="logistics" element={<LogisticsManager />} />
                    <Route path="events" element={<EventsManager />} />
                    <Route path="contacts" element={<ContactsManager />} />
                    {/* Content management */}
                    <Route path="content/news" element={<NewsManager />} />
                    {/* Legacy route for backwards compatibility */}
                    <Route path="news" element={<NewsManager />} />
                    <Route path="banners" element={<BannerManager />} />
                    <Route path="settings" element={<SettingsManager />} />
                    <Route path="help" element={<HelpManager />} />
                    <Route path="change-password" element={<ChangePassword />} />
                  </Route>
                </Routes>
              </ProtectedRoute>
            </AuthProvider>
          }
        />
      </Routes>
      <ScrollToTop />
    </ToastProvider>
  )
}

export default App
