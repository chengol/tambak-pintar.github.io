import React from 'react'
import {
    Box,
    Flex,
    Heading,
    Icon,
    Text,
    useColorMode, Spacer
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
                    <Box className="legend-scale" w="100%" h={5} pr={4} pl={4}></Box>
                    <Flex>
                        <Box>
                            <Text fontSize="md">0</Text>
                        </Box>
                        <Spacer />
                        <Box>
                            <Text fontSize="md">10</Text>
                        </Box>
                        <Spacer />
                        <Box>
                            <Text fontSize="md">{` > 20`}</Text>
                        </Box>
                    </Flex>
                    

                </Box>

            </Box>

        </div>
    )
}
