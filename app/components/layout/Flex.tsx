/**
 * @Project Summarised
 * @File Flex.tsx
 * @Path app/components/layout
 * @Author BRICE ZELE
 * @Date 16/03/2023
 */
import {Spacer, SpacerProps} from './Spacer';
import {Theme} from '../../themes/Theme';
import React, {useMemo} from 'react';
import {Box, BoxProps} from './Box';
import {withAnimated} from '../../hooks/anim/withAnimated';

type CenteredProps =
  | {
      centered?: false;
    }
  | {
      alignItems?: 'center';
      /** shorthand for `alignItems='center' justifyContent='center'` */
      centered: true;
      justifyContent?: 'center';
    };

type DirectionProps =
  | {
      row: true;
    }
  | {
      row?: boolean;
      flexDirection?: BoxProps['flexDirection'];
    };

type LayoutShorthandProps = {
  fill?: boolean; // flex=1
  grow?: boolean; // flexGrow=1
  shrink?: boolean; // flexShrink=1
};

export type FlexProps = BoxProps &
  CenteredProps &
  DirectionProps & {
    /** spacing _between_ elements */
    gap?: keyof Theme['spacing'];
    spacerProps?: SpacerProps;
  } & LayoutShorthandProps;

/**
 * Layout component to place child items with spacing between them
 */
export function Flex({
  alignItems = 'stretch',
  centered = false,
  children,
  fill,
  flexBasis,
  flexDirection = 'column',
  flexGrow,
  flexShrink,
  flexWrap,
  gap = 'spacing16',
  grow,
  justifyContent = 'flex-start',
  row,
  shrink,
  spacerProps,
  ...boxProps
}: FlexProps): JSX.Element {
  const childrenArr = useMemo(
    () => React.Children.toArray(children).filter(Boolean),
    [children],
  );

  const x =
    row || flexDirection === 'row' || flexDirection === 'row-reverse'
      ? gap
      : undefined;
  const y =
    flexDirection === 'column' || flexDirection === 'column-reverse'
      ? gap
      : undefined;

  return (
    <Box
      alignItems={centered ? 'center' : alignItems}
      flex={fill ? 1 : undefined}
      flexBasis={flexBasis}
      flexDirection={row ? 'row' : flexDirection}
      flexGrow={grow ? 1 : flexGrow}
      flexShrink={shrink ? 1 : flexShrink}
      flexWrap={flexWrap}
      justifyContent={centered ? 'center' : justifyContent}
      {...boxProps}>
      {childrenArr.map((child, index, array) => (
        <React.Fragment key={index}>
          {child}
          {gap && index < array.length - 1 && (
            <Spacer {...spacerProps} x={x} y={y} />
          )}
        </React.Fragment>
      ))}
    </Box>
  );
}

export const AnimatedFlex = withAnimated(Flex);
