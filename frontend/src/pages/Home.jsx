import { useState } from 'react'
import {
  HeroSection,
  NewsSection,
  ProgramSection,
  PartnersSection,
  AppDownloadSection,
} from '../components/Sections'
import Loading from '../components/Loading'

export default function Home() {
  const [isLoading, setIsLoading] = useState(true)

  return (
    <>
      {isLoading && <Loading onLoadingComplete={() => setIsLoading(false)} />}
      <HeroSection />
      <NewsSection />
      <ProgramSection />
      <PartnersSection />
      <AppDownloadSection />
    </>
  )
}
