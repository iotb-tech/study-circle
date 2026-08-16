import React from 'react'
import { ProblemHighlights } from './ProblemHighlights'
import { HowItWorks } from './HowItWorks'
import StatsBar from './StatusBar'

const LandingPage = () => {
  return (
    <div>
      
        {/* <HeaderSection /> */}
        {/* <HeroSection /> */}
        <ProblemHighlights />
        {/* <FeatureGrid /> */}
        <HowItWorks />
        <StatsBar />
        {/* <FooterSection /> */}
     
    </div>
  )
}

export default LandingPage
