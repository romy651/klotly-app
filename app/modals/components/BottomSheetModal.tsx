/**
 * @Project Summarised
 * @File BottomSheetModal.tsx
 * @Path app/components
 * @Author BRICE ZELE
 * @Date 16/04/2023
 */
import {
    BottomSheetBackdrop,
    BottomSheetBackdropProps,
    BottomSheetModal as BaseModal,
    BottomSheetView,
    useBottomSheetDynamicSnapPoints,
} from '@gorhom/bottom-sheet'
import React, {ComponentProps, PropsWithChildren, useCallback, useEffect, useRef} from 'react'
import {useSafeAreaInsets} from 'react-native-safe-area-context'
import {BlurView} from '@react-native-community/blur'
import {Keyboard, StyleSheet} from 'react-native'
import HandleBar from './HandleBar'
import {useAppTheme} from '../../hooks/theme/useAppTheme'
import useDarkMode from '../../hooks/theme/useDarkMode'
import {ModalName} from '../../routes/modals/Modals'
import {dimensions} from '../../themes/Sizing'
import {theme as FixedTheme} from '../../themes/Theme'

type Props = PropsWithChildren<{
    disableSwipe?: boolean
    hideHandlebar?: boolean
    name: ModalName
    onClose?: () => void
    snapPoints?: Array<string | number>
    stackBehavior?: ComponentProps<typeof BaseModal>['stackBehavior']
    fullScreen?: boolean
    backgroundColor?: string
    blurredBackground?: boolean
    isDismissible?: boolean
    renderBehindInset?: boolean
    hideKeyboardOnDismiss?: boolean
}>

const APPEARS_ON_INDEX = 0
const DISAPPEARS_ON_INDEX = -1

const Backdrop = (props: BottomSheetBackdropProps): JSX.Element => {
    return (
        <BottomSheetBackdrop
            {...props}
            appearsOnIndex={APPEARS_ON_INDEX}
            disappearsOnIndex={DISAPPEARS_ON_INDEX}
            opacity={0.4}
        />
    )
}

const CONTENT_HEIGHT_SNAP_POINTS = ['CONTENT_HEIGHT']
const FULL_HEIGHT = 0.91

export const BottomSheetModal: React.FC<Props> = ({
    children,
    onClose,
    snapPoints = CONTENT_HEIGHT_SNAP_POINTS,
    stackBehavior = 'push',
    fullScreen,
    hideHandlebar,
    backgroundColor,
    blurredBackground = false,
    isDismissible = true,
    renderBehindInset = false,
    hideKeyboardOnDismiss = false,
}): JSX.Element => {
    const insets = useSafeAreaInsets()
    const modalRef = useRef<BaseModal>(null)
    const {animatedHandleHeight, animatedSnapPoints, animatedContentHeight, handleContentLayout} =
        useBottomSheetDynamicSnapPoints(snapPoints)
    const theme = useAppTheme()
    const isDarkMode = useDarkMode()

    const backgroundColorValue = blurredBackground
        ? theme.colors.none
        : backgroundColor ?? theme.colors.background1

    const renderBackdrop = useCallback(
        (props: BottomSheetBackdropProps) => (
            <BottomSheetBackdrop
                {...props}
                appearsOnIndex={APPEARS_ON_INDEX}
                disappearsOnIndex={DISAPPEARS_ON_INDEX}
                opacity={blurredBackground ? 0.2 : 0.4}
                pressBehavior={isDismissible ? 'close' : 'none'}
            />
        ),
        [blurredBackground, isDismissible],
    )

    const renderHandleBar = useCallback(
        (props: any) => {
            if (renderBehindInset && hideHandlebar) return null

            return (
                <HandleBar
                    {...props}
                    backgroundColor={backgroundColorValue}
                    containerFlexStyles={{
                        marginBottom: theme.spacing.spacing12,
                        marginTop: theme.spacing.spacing16,
                    }}
                    hidden={hideHandlebar}
                />
            )
        },
        [backgroundColorValue, hideHandlebar, renderBehindInset],
    )

    useEffect(() => {
        modalRef.current?.present()
    }, [modalRef])

    const fullScreenContentHeight = (renderBehindInset ? 1 : FULL_HEIGHT) * dimensions.fullHeight

    const renderBlurredBg = useCallback(
        () => (
            <BlurView
                blurAmount={10}
                blurRadius={25}
                blurType={isDarkMode ? 'dark' : 'xlight'}
                overlayColor="transparent"
                style={[BlurViewStyle.base]}
            />
        ),
        [isDarkMode],
    )

    const background = blurredBackground ? {backgroundComponent: renderBlurredBg} : undefined
    const backdrop = {backdropComponent: renderBackdrop}

    const onAnimate = useCallback(
        (fromIndex: number, toIndex: number): void => {
            if (
                hideKeyboardOnDismiss &&
                fromIndex === APPEARS_ON_INDEX &&
                toIndex === DISAPPEARS_ON_INDEX
            )
                Keyboard.dismiss
        },
        [hideKeyboardOnDismiss],
    )

    return (
        <BaseModal
            {...background}
            {...backdrop}
            ref={modalRef}
            backgroundStyle={{
                backgroundColor: backgroundColorValue,
            }}
            contentHeight={animatedContentHeight}
            enableContentPanningGesture={isDismissible}
            enableHandlePanningGesture={isDismissible}
            handleComponent={renderHandleBar}
            handleHeight={animatedHandleHeight}
            snapPoints={animatedSnapPoints}
            stackBehavior={stackBehavior}
            topInset={renderBehindInset ? undefined : insets.top}
            onAnimate={onAnimate}
            onDismiss={onClose}>
            <BottomSheetView
                style={[
                    {height: fullScreen ? fullScreenContentHeight : undefined},
                    BottomSheetStyle.view,
                    renderBehindInset ? BottomSheetStyle.rounded : undefined,
                ]}
                onLayout={handleContentLayout}>
                {children}
            </BottomSheetView>
        </BaseModal>
    )
}

export const BottomSheetDetachedModal: React.FC<Props> = ({
    children,
    onClose,
    snapPoints = CONTENT_HEIGHT_SNAP_POINTS,
    stackBehavior = 'push',
    fullScreen,
    hideHandlebar,
    backgroundColor,
}): JSX.Element => {
    const insets = useSafeAreaInsets()
    const modalRef = useRef<BaseModal>(null)
    const {animatedHandleHeight, animatedSnapPoints, animatedContentHeight, handleContentLayout} =
        useBottomSheetDynamicSnapPoints(snapPoints)
    const theme = useAppTheme()

    const fullScreenContentHeight = FULL_HEIGHT * dimensions.fullHeight

    useEffect(() => {
        modalRef.current?.present()
    }, [modalRef])

    const renderHandleBar = useCallback(
        (props: any) => {
            return <HandleBar {...props} backgroundColor={backgroundColor} hidden={hideHandlebar} />
        },
        [backgroundColor, hideHandlebar],
    )

    return (
        <BaseModal
            ref={modalRef}
            backdropComponent={Backdrop}
            backgroundStyle={{
                backgroundColor: backgroundColor ?? theme.colors.background0,
            }}
            bottomInset={theme.spacing.spacing48}
            contentHeight={animatedContentHeight}
            detached={true}
            handleComponent={renderHandleBar}
            handleHeight={animatedHandleHeight}
            snapPoints={animatedSnapPoints}
            stackBehavior={stackBehavior}
            style={BottomSheetStyle.detached}
            topInset={insets.top}
            onDismiss={onClose}>
            <BottomSheetView
                style={[
                    {
                        height: fullScreen ? fullScreenContentHeight : undefined,
                    },
                    BottomSheetStyle.view,
                ]}
                onLayout={handleContentLayout}>
                {children}
            </BottomSheetView>
        </BaseModal>
    )
}

const BottomSheetStyle = StyleSheet.create({
    detached: {
        marginHorizontal: FixedTheme.spacing.spacing12,
    },
    rounded: {
        borderRadius: FixedTheme.borderRadii.rounded24,
        overflow: 'hidden',
    },
    view: {
        flex: 1,
    },
})

const BlurViewStyle = StyleSheet.create({
    base: {
        ...StyleSheet.absoluteFillObject,
        borderRadius: FixedTheme.borderRadii.rounded24,
        overflow: 'hidden',
    },
})
