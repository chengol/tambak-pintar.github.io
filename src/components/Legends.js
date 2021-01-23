import React from 'react'
import {
    Box,
    Flex,
    Heading,
    Icon,
    Text,
    useColorMode
} from '@chakra-ui/react'
import {FaCircle} from 'react-icons/fa'

export default function Legends() {
    const {colorMode} = useColorMode();
    return (
        <div>
            <Box
                style={{
                position: "absolute",
                bottom: 0,
                right: 0
            }}>
                <Box
                    display={{
                    base: "none",
                    md: "none",
                    sm: "none",
                    lg: "block",
                    xl: "block"
                }}
                    className="legend-panel"
                    bg={colorMode === 'dark'
                    ? 'gray.800'
                    : 'white'}>
                    <Heading as="h4" size="sm" fontWeight={500} mb={2}>Zona Kasus (jumlah positif)</Heading>
                    <Flex>
                        <Box mb={2} mr={2}>
                            <Text fontSize="md"><Icon w={8} h={8} as={FaCircle} color="green.300"/>{` < 25%`}</Text>
                        </Box>
                        <Box mb={2} mr={2}>
                            <Text fontSize="md"><Icon w={8} h={8} as={FaCircle} color="orange.300"/>{` 25% - 50%`}</Text>
                        </Box>
                        <Box mb={2} mr={2}>
                            <Text fontSize="md"><Icon w={8} h={8} as={FaCircle} color="red.300"/>{` > 50%`}</Text>
                        </Box>
                    </Flex>

                </Box>

            </Box>

        </div>
    )
}
