import React, {useContext} from 'react'
import {
    SimpleGrid,
    Heading,
    Stat,
    StatGroup,
    Box,
    Alert,
    AlertIcon,
    AlertTitle,
    Text,
    Divider,
    Icon,
    Select,
    Tag,
    TagLabel,
    HStack,
    Skeleton,
    useColorMode,

    Table,
    Thead,
    Tbody,
    Tr,
    Th,
    Td,
    Stack, Spinner, Center
} from '@chakra-ui/react';

import _ from 'lodash';

import {DiseaseContext} from '../pages/app'
import ChartData from '../components/ChartData'
import format from 'date-fns/format'

export default function DiseaseTracker({points, samples, statistics, region, chart}) {

    const {disease, district, regionId, diseaseId, setDiseaseId} = useContext(DiseaseContext);

    let kec = "";
    let kab = "";
    let prov = "";

    // console.log('statistik', statistics);

    const stats = statistics;
    const regionName = region;

    // console.log('region', regionName);

    if (regionName) {
        kec = regionName.district_name;
        kab = regionName.regency_name;
        prov = regionName.province_name;
    }

    const {colorMode} = useColorMode();

    // console.log('total positif', stats.total_positive)
    // console.log('stat', stats);

    return (
        <div >
            <SimpleGrid mt={{
                xl: 1
            }} pt={1}>
                {region && stats.total ? <div>
                    <Box
                        m={{
                        md: 5,
                        sm: 5,
                        lg: 3,
                        base: 3
                    }}
                        p={{
                        sm: 0,
                        base: 1
                    }}>
                        {/* {console.log('total positive', stats.total_positive)} */}
                        
                            <Box>
                                <Heading as="h3" size="xl" mb={0}>{(regionId === "")
                                        ? "Indonesia"
                                        : `${kec !== null && kec !== undefined
                                            ? _.startCase(kec.toLowerCase()) + `, `
                                            : ""}` + `${kab !== null && kab !== undefined
                                                ? _.startCase(kab.toLowerCase())
                                                : prov !== undefined
                                                    ? _.startCase(prov.toLowerCase())
                                                    : 'memuat...'}`}</Heading>
                                <Heading as="h4" size="md" mb={2}>{(regionId === "")
                                        ? ""
                                        : `${kab !== null && kab !== undefined
                                            ? _.startCase(prov.toLowerCase())
                                            : ""}`}</Heading>
                            </Box>

                        <Box
                            display={{
                            lg: "none"
                        }}>
                            <Divider mb={4}/>
                        </Box>
                        <SimpleGrid columns={2} spacing={3}>
                            <Box>
                                <Text fontSize="md" color="gray.500" fontWeight={700}>Total Positif
                                </Text>
                                <Heading as="h3" size="xl" color="blue.400">
                                    <strong>{stats.total_positive}</strong>
                                </Heading>

                                <Text fontSize="sm" color="gray.500">
                                    {(stats.total_positive === 0)
                                        ? 0
                                        : ((stats.total_positive / stats.total) * 100).toFixed(2)}% Positif
                                </Text>
                            </Box>

                            <Box>
                                <Text fontSize="md" color="gray.500" fontWeight={700}>Total Sampel
                                </Text>
                                <Heading as="h3" size="xl" color="blue.400">
                                    <strong>{stats.total}</strong>
                                </Heading>
                                <Text fontSize="sm" color="gray.500">
                                    dari {stats.total_ponds}{' '}
                                    kolam
                                </Text>
                            </Box>
                        </SimpleGrid>
                    </Box>

                    <Box
                        h="40px"
                        mr={0}
                        ml={0}
                        mb={2}
                        bg={colorMode === 'light'
                        ? "gray.100"
                        : "gray.700"}>
                        <Text fontSize="md" p={2} fontWeight={700} m={2}>Penyakit</Text>
                    </Box>
                    <Box className="overflow-tracker">
                        <SimpleGrid
                            columns={2}
                            spacing={3}
                            m={{
                            sm: 5,
                            md: 5,
                            lg: 3,
                            base: 3
                        }}
                            p={{
                            sm: 0,
                            base: 1
                        }}
                            className="tracker-panel">
                            <Box>
                                <Stat>
                                    <Text fontSize="md" color="gray.500">AHPND
                                        <a
                                            href="https://app.jala.tech/diseases/acute-hepatopancreatic-necrosis-disease"
                                            target="_blank">
                                            {` `}<Icon focusable="true" name="question" size="14px" color="blue.400"/></a>
                                    </Text>
                                    <HStack>
                                        <Heading as="h3" size="xl">
                                            <strong>{stats.total_disease_id_1_positive}</strong>
                                        </Heading>
                                        <Tag
                                            size="md"
                                            borderRadius="full"
                                            variant="solid"
                                            colorScheme={stats.last_week_total_disease_id_1_positive === 0
                                            ? "gray"
                                            : "red"}>
                                            <TagLabel>+{stats.last_week_total_disease_id_1_positive}</TagLabel>
                                        </Tag>
                                    </HStack>
                                    <Text fontSize="sm" color="gray.500">
                                        {stats.total_disease_id_1}{' '}
                                        sampel
                                    </Text>
                                    <Text fontSize="sm" color="gray.500">
                                        {(stats.total_disease_id_1_positive === 0)
                                            ? 0
                                            : ((stats.total_disease_id_1_positive / stats.total_disease_id_1) * 100).toFixed(2)}% Positif
                                    </Text>
                                </Stat>
                            </Box>
                            <Box>
                                <Stat>
                                    <Text fontSize="md" color="gray.500">EHP
                                        <a
                                            href="https://app.jala.tech/diseases/hepatopancreatic%20-microsporidiosis"
                                            target="_blank">
                                            {` `}<Icon focusable="true" name="question" size="16px" color="blue.400"/></a>
                                    </Text>
                                    <HStack>
                                        <Heading as="h3" size="xl">
                                            <strong>{stats.total_disease_id_6_positive}</strong>
                                        </Heading>
                                        <Tag
                                            size="md"
                                            borderRadius="full"
                                            variant="solid"
                                            colorScheme={stats.last_week_total_disease_id_6_positive === 0
                                            ? "gray"
                                            : "red"}>
                                            <TagLabel>+{stats.last_week_total_disease_id_6_positive}</TagLabel>
                                        </Tag>
                                    </HStack>

                                    <Text fontSize="sm" color="gray.500">
                                        {stats.total_disease_id_6}{' '}
                                        sampel
                                    </Text>
                                    <Text fontSize="sm" color="gray.500">
                                        {(stats.total_disease_id_6_positive === 0)
                                            ? 0
                                            : ((stats.total_disease_id_6_positive / stats.total_disease_id_6) * 100).toFixed(2)}% Positif
                                    </Text>
                                </Stat>
                            </Box>
                            <Box>
                                <Stat>
                                    <Text fontSize="md" color="gray.500">IMNV/Myo
                                        <a
                                            href="https://app.jala.tech/diseases/infectious-myonecrosis-virus"
                                            target="_blank">
                                            {` `}<Icon focusable="true" name="question" size="16px" color="blue.400"/></a>
                                    </Text>
                                    <HStack>
                                        <Heading as="h3" size="xl">
                                            <strong>{stats.total_disease_id_8_positive}</strong>
                                        </Heading>
                                        <Tag
                                            size="md"
                                            borderRadius="full"
                                            variant="solid"
                                            colorScheme={stats.last_week_total_disease_id_8_positive === 0
                                            ? "gray"
                                            : "red"}>
                                            <TagLabel>+{stats.last_week_total_disease_id_8_positive}</TagLabel>
                                        </Tag>
                                    </HStack>
                                    <Text fontSize="sm" color="gray.500">
                                        {stats.total_disease_id_8}{' '}
                                        sampel
                                    </Text>
                                    <Text fontSize="sm" color="gray.500">
                                        {(stats.total_disease_id_8_positive === 0)
                                            ? 0
                                            : ((stats.total_disease_id_8_positive / stats.total_disease_id_8) * 100).toFixed(2)}% Positif
                                    </Text>
                                </Stat>
                            </Box>
                            <Box>
                                <Stat pr={1}>
                                    <Text fontSize="md" color="gray.500">WSSV/Bintik Putih
                                        <a href="https://app.jala.tech/diseases/white-spot-syndrome" target="_blank">
                                            {` `}<Icon focusable="true" name="question" size="16px" color="blue.400"/></a>
                                    </Text>
                                    <HStack>
                                        <Heading as="h3" size="xl">
                                            <strong>{stats.total_disease_id_11_positive}</strong>
                                        </Heading>
                                        <Tag
                                            size="md"
                                            borderRadius="full"
                                            variant="solid"
                                            colorScheme={stats.last_week_total_disease_id_11_positive === 0
                                            ? "gray"
                                            : "red"}>
                                            <TagLabel>+{stats.last_week_total_disease_id_11_positive}</TagLabel>
                                        </Tag>
                                    </HStack>
                                    <Text fontSize="sm" color="gray.500">
                                        {stats.total_disease_id_11}{' '}
                                        sampel
                                    </Text>
                                    <Text fontSize="sm" color="gray.500">
                                        {(stats.total_disease_id_11_positive === 0)
                                            ? 0
                                            : ((stats.total_disease_id_11_positive / stats.total_disease_id_11) * 100).toFixed(2)}% Positif
                                    </Text>
                                </Stat>
                            </Box>
                        </SimpleGrid>
                        <Box
                            bg="gray.100"
                            h="40px"
                            mr={0}
                            ml={0}
                            mb={2}
                            bg={colorMode === 'light'
                            ? "gray.100"
                            : "gray.700"}>
                            <Text fontSize="md" p={2} fontWeight={700} m={2}>Trend Penyakit</Text>
                        </Box>
                        <Box
                            m={{
                            sm: 5,
                            md: 5,
                            lg: 3
                        }}
                            p={{
                            sm: 0,
                            base: 1
                        }}>
                            <Box mb={2} w="100%" mr={4}>
                                <Select
                                    size="md"
                                    value={diseaseId}
                                    onChange={(e) => {
                                    setDiseaseId(e.target.value)
                                }}>
                                    <option value=''>Semua Positif</option>
                                    <option value='1'>AHPND</option>
                                    <option value='6'>EHP</option>
                                    <option value='8'>IMNV/Myo</option>
                                    <option value='11'>WSSV/Bintik Putih</option>
                                </Select>
                            </Box>
                            {/* <DataTable chart={chart} /> */}
                            <ChartData chart={chart}/> {/* <Alert
                                status="warning"
                                variant="subtle"
                                flexDirection="column"
                                justifyContent="center"
                                textAlign="center"
                                height="200px">
                                <AlertIcon boxSize="40px" mr={0}/>
                                <AlertTitle mt={4} mb={1} fontSize="lg">
                                    Coming Soon!
                                </AlertTitle>
                            </Alert> */}
                        </Box>
                    </Box>
                </div> : <Center w="100%" h={500}>
                    <Spinner 
                thickness="4px"
                speed="0.65s"
                emptyColor="gray.200"
                color="blue.500"
                size="xl"/>
                
                </Center>}
                {!region || !stats && <Box mt={3}>
                    <Alert
                        status="error"
                        variant="subtle"
                        flexDirection="column"
                        justifyContent="center"
                        textAlign="center">
                        <AlertIcon/>
                        Tidak ada data penyakit {disease === "Semua Positif"
                            ? " "
                            : disease}
                        di {district === "Semua"
                            ? "semua daerah"
                            : district}
                        😞
                    </Alert>
                </Box>
}
            </SimpleGrid>
        </div>
    );
}

function DataTable(chart) {
    const chartData = chart;
    console.log('chart data', chartData);

    return (
        <Box mt="2" mb="2">
            <Table size="sm">
                <Thead>
                    <Tr>
                        <Th>Bulan</Th>
                        <Th>Sampel</Th>
                        <Th>Positif</Th>
                    </Tr>
                </Thead>
                <Tbody>
                    {chartData
                        .chart
                        .map(data => {

                            return (
                                <Tr key={data.last_logged_at}>
                                    <Td>{format(new Date(data.last_logged_at), 'MMM yy')}</Td>
                                    <Td>{data.total}</Td>
                                    <Td>{data.total_positive}</Td>
                                </Tr>
                            )
                        })}
                </Tbody>
            </Table>
        </Box>
    )
}
