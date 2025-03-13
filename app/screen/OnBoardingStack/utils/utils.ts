/**
 * @Project Summarised
 * @File LazyModalRenderer.tsx
 * @Path app/screen/OnBoardingStack/utils
 * @Author BRICE ZELE
 * @Date 28/03/2023
 */
import {OnBoardingScreens} from '../../../routes/screens/Stack'

export const OnboardingSteps: OnBoardingScreens[] = [
    OnBoardingScreens.SelectThematicScreen,
    OnBoardingScreens.SelectCategoriesScreen,
    OnBoardingScreens.SelectAchievments,
    OnBoardingScreens.NotificationSetupScreen,
]

export const getOnboardingStepNumber = (screenName?: OnBoardingScreens): number | undefined => {
    if (!screenName) return undefined
    const stepNumber = OnboardingSteps.indexOf(screenName)

    return stepNumber === -1 ? undefined : stepNumber
}
