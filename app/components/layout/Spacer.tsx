/**
 * @Project Summarised
 * @File Spacer.tsx
 * @Path app/components/layout
 * @Author BRICE ZELE
 * @Date 16/03/2023
 */
import {Theme} from '../../themes/Theme'
import {Box, BoxProps} from './Box'
import {useAppTheme} from '../../hooks/theme/useAppTheme'

export type SpacerProps = BoxProps & {
    x?: keyof Theme['spacing']
    y?: keyof Theme['spacing']
}

/**
 * Layout component to render physical spacing.
 * Useful to avoid using margin props which break component isolation
 */
export function Spacer({x, y, ...rest}: SpacerProps): JSX.Element {
    const theme = useAppTheme()
    return (
        <Box
            flexGrow={0}
            flexShrink={0}
            height={y ? theme.spacing[y] : undefined}
            width={x ? theme.spacing[x] : undefined}
            {...rest}
        />
    )
}
