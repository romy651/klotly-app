/**
 * @Project Summarised
 * @File OnboardingHeader.tsx
 * @Path app/screen/OnBoardingStack/components
 * @Author BRICE ZELE
 * @Date 28/03/2023
 */
import React, {PropsWithChildren} from 'react'
import {HeaderTitleProps} from '@react-navigation/elements'
import {getOnboardingStepNumber, OnboardingSteps} from '../utils/utils'
import {Indicator} from '../../../components/Carousel/Indicator'
import {OnBoardingScreens} from '../../../routes/screens/Stack'

const OnboardingHeader: React.FC<PropsWithChildren<HeaderTitleProps>> = ({
    children: routeName,
}): JSX.Element | null => {
    const stepNumber = getOnboardingStepNumber(routeName as OnBoardingScreens)
    const stepCount = OnboardingSteps.length

    if (stepCount !== 0 && stepNumber !== undefined)
        return <Indicator currentStep={stepNumber} stepCount={stepCount} />
    return null
}

export default OnboardingHeader
