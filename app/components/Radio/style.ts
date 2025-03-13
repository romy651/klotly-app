import {theme} from 'app/themes/Theme'
import {StyleSheet, Platform} from 'react-native'

export const radioStyle = () =>
    StyleSheet.create({
        fullView: {
            width: '100%',
            height: '100%',
        },
        text: {
            color: theme.colors.textPrimary,
            fontSize: 16,
        },
        viewItem: {},
        globalItem: {
            width: '94%',
            height: 60,
            justifyContent: 'flex-end',
            overflow: 'hidden',
        },
        nonChecked: {
            width: 23,
            height: 23,
            borderRadius: 12,
            borderWidth: 2,
        },
        textItem: {
            marginRight: 'auto',
        },
        container: {
            width: '100%',
        },
        item: {
            flexDirection: 'row',
            justifyContent: 'space-between',
            alignItems: 'center',
            height: 50,
            paddingHorizontal: 15,
            width: '100%',
        },
        circle: {
            overflow: 'hidden',
            height: 24,
            width: 24,
            borderRadius: 24,
            borderWidth: 1,
        },
        blueBorder: {
            position: 'absolute',
            left: 0,
            zIndex: -1,
            top: 0,
            borderRadius: 999,
            height: '100%',
            width: '100%',
        },
        whitePoint: {
            position: 'absolute',
            left: (24 - 2 - 10) / 2,
            zIndex: 1,
            top: (24 - 2 - 10) / 2,
            borderRadius: 999,
            height: 10,
            width: 10,
        },
    })
