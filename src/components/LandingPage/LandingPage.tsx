import React from 'react'
import { ProblemHighlights } from './ProblemHighlights'
import { HowItWorks } from './HowItWorks'
import StatsBar from './StatusBar'
import FeatureGrid from './FeatureGrid'
import FooterSection from './FooterSection'
import HeroSection from './HeroSection'
import HeaderSection from './HeaderSection'

const LandingPage = () => {
  return (
    <div>
      
        <HeaderSection />
        <HeroSection />
        <ProblemHighlights />
        <FeatureGrid />
        <HowItWorks />
        <StatsBar />
        <FooterSection />
     
    </div>
  )
}

export default LandingPage
