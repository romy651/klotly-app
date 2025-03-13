/**
 * @Project Summarised
 * @File GridList.ts
 * @Path app/components
 * @Author BRICE ZELE
 * @Date 19/06/2023
 */
import React, {useMemo} from 'react'
import {Box} from '../layout/Box'
import {Flex, FlexProps} from '../layout/Flex'

interface Item<T> {
    item: T
    index: number
    indexRow: number
}

interface ListRenderProps<T> {
    data: Array<T>
    columns: number
    renderItem: (item: Item<T>) => JSX.Element | null | React.ReactElement
}

type GridListProps<T> = ListRenderProps<T> & FlexProps
const GridList = <T extends unknown>({
    data,
    columns = 2,
    renderItem,
    ...rest
}: GridListProps<T>): JSX.Element => {
    const dataCustom = useMemo(() => {
        if (Array.isArray(data)) {
            const dataOutput = []
            let item = []
            for (let index = 0; index < data.length; index++) {
                const no = index + 1
                item.push(data[index])
                if (no % columns === 0) {
                    dataOutput.push(item)
                    item = []
                }
                if (no === data.length) {
                    if (item.length < columns)
                        [...Array(columns - item.length).keys()].forEach(_ => item.push(null))
                    dataOutput.push(item)
                    item = []
                }
            }
            return dataOutput
        }
        return []
    }, [data, columns])

    return (
        <Flex {...rest}>
            {dataCustom.map((items, indexRow) => (
                <Flex key={indexRow.toString()} flexDirection="row">
                    {items.map((item, index) => (
                        <Box key={index.toString()} flex={1}>
                            {item && renderItem?.({item, index, indexRow})}
                        </Box>
                    ))}
                </Flex>
            ))}
        </Flex>
    )
}

export default GridList
