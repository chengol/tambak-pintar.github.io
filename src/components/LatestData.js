import React from 'react'
import {useColorMode, Box, Text} from '@chakra-ui/react'
import {lightFormat, format} from 'date-fns';

export default function LatestData(data) {
    const {colorMode} = useColorMode();
    return (
        <div>
            <Box
                className="latest-data"
                bg={colorMode === 'dark'
                ? 'gray.800'
                : 'white'}>
                <Text fontSize="sm" m={2} fontWeight={500}>Data diperbarui terakhir {data.latestData.last_logged_at
                        ? format(new Date(data.latestData.last_logged_at), 'dd MMMM yyyy')
                        : ''}</Text>
            </Box>
        </div>
    )
}
