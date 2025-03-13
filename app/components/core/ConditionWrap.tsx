/**
 * @Project Summarised
 * @File ConditionWrap.tsx
 * @Path app/components/core
 * @Author BRICE ZELE
 * @Date 19/06/2023
 */
import React from 'react'

interface ConditionalWrapProps {
    condition: boolean
    wrap: (children: JSX.Element) => JSX.Element
    children: JSX.Element
}

export const ConditionalWrap: React.FC<ConditionalWrapProps> = ({
    condition,
    children,
    wrap,
}): JSX.Element => (condition ? React.cloneElement(wrap(children)) : children)

export default ConditionalWrap
