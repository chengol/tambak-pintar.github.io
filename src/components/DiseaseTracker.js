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
    useColorMode
} from '@chakra-ui/react';


import {DiseaseContext} from '../pages/app'

export default function DiseaseTracker({points, samples}) {

    const {disease, district} = useContext(DiseaseContext);

    let kec = "";
    // let kab = "";
    let prov = "";


    let tracker = {};

    if (!samples || !samples.length || !points || !points.features.length) {
        console.log('titik tracker 1', samples);
    } else {
        // console.log('titik tracker 2', points.features);
        tracker = {
            total_s: samples.length,
            total_p: points
                .features
                .filter(d => {
                    return d.properties.fields.Status === 1
                }),
            AHPND_p: points
                .features
                .filter(d => {
                    return d.properties.fields.Penyakit === "AHPND" && d.properties.fields.Status === 1
                }),
            AHPND_s: samples.filter(d => {
                return d.fields.Penyakit === "AHPND"
            }),
            EHP_p: points
                .features
                .filter(d => {
                    return d.properties.fields.Penyakit === "EHP" && d.properties.fields.Status === 1
                }),
            EHP_s: samples.filter(d => {
                return d.fields.Penyakit === "EHP"
            }),
            IMNV_p: points
                .features
                .filter(d => {
                    return d.properties.fields.Penyakit === "IMNV" && d.properties.fields.Status === 1
                }),
            IMNV_s: samples.filter(d => {
                return d.fields.Penyakit === "IMNV"
            }),
            WSSV_p: points
                .features
                .filter(d => {
                    return d.properties.fields.Penyakit === "WSSV" && d.properties.fields.Status === 1
                }),
            WSSV_s: samples.filter(d => {
                return d.fields.Penyakit === "WSSV"
            })
        }

        // console.log('statistik ', tracker);

        kec = points.features[0].properties.fields.Kecamatan;
        // kab = points.features[0].properties.fields.Kabupaten;
        prov = points.features[0].properties.fields.Provinsi;
    }

    const {colorMode} = useColorMode();

    return (
        <div >
            <SimpleGrid mt={{
                xl: 1
            }} pt={1}>
                {tracker.total_s && <div>
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
                        <Heading as="h3" size="xl" mb={0}>{(district === "Semua")
                                ? "Indonesia"
                                : `${kec}`}</Heading>
                        <Heading as="h4" size="md" mb={2}>{(district === "Semua")
                                ? ""
                                : `${prov}`}</Heading>
                        <Box
                            display={{
                            lg: "none"
                        }}>
                            <Divider/>
                        </Box>
                        <SimpleGrid columns={2} spacing={3}>
                            <Box>
                                <Text fontSize="md" color="gray.500" fontWeight={700}>Total Positif
                                </Text>
                                <Heading as="h3" size="xl" color="blue.400">
                                    <strong>{tracker.total_p.length}</strong>
                                </Heading>
                                <Text fontSize="sm" color="gray.500">
                                    {(tracker.total_p.length === 0)
                                        ? 0
                                        : ((tracker.total_p.length / tracker.total_s) * 100).toFixed(2)}% Positive
                                </Text>
                            </Box>
                            <Box>
                                <Text fontSize="md" color="gray.500" fontWeight={700}>Total Sampel
                                </Text>
                                <Heading as="h3" size="xl" color="blue.400">
                                    <strong>{tracker.total_s}</strong>
                                </Heading>
                                <Text fontSize="sm" color="gray.500">
                                    dari {tracker.total_s} kolam
                                </Text>
                            </Box>
                        </SimpleGrid>
                    </Box>

                    <Box h="40px" mr={0} ml={0} mb={2} bg={colorMode === 'light'? "gray.100":"gray.700"}>
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
                                    <Text fontSize="md" color="gray.500">AHPND <a
                                            href="https://app.jala.tech/diseases/acute-hepatopancreatic-necrosis-disease" target="_blank">
                                            <Icon focusable="true" name="question" size="14px" color="blue.400"/></a>
                                    </Text>
                                    <Heading as="h3" size="xl">
                                        <strong>{tracker.AHPND_p.length}</strong>
                                    </Heading>
                                    <Text fontSize="sm" color="gray.500">
                                        {tracker.AHPND_s.length} sampel
                                    </Text>
                                    <Text fontSize="sm" color="gray.500">
                                        {(tracker.AHPND_p.length === 0)
                                            ? 0
                                            : ((tracker.AHPND_p.length / tracker.AHPND_s.length) * 100).toFixed(2)}% Positive
                                    </Text>
                                </Stat>
                            </Box>
                            <Box>
                                <Stat>
                                    <Text fontSize="md" color="gray.500">EHP <a href="https://app.jala.tech/diseases/hepatopancreatic%20-microsporidiosis" target="_blank">
                                            <Icon focusable="true" name="question" size="16px" color="blue.400"/></a>
                                    </Text>
                                    <Heading as="h3" size="xl">
                                        <strong>{tracker.EHP_p.length}</strong>
                                    </Heading>
                                    <Text fontSize="sm" color="gray.500">
                                        {tracker.EHP_s.length} sampel
                                    </Text>
                                    <Text fontSize="sm" color="gray.500">
                                        {(tracker.EHP_p.length === 0)
                                            ? 0
                                            : ((tracker.EHP_p.length / tracker.EHP_s.length) * 100).toFixed(2)}% Positive
                                    </Text>
                                </Stat>
                            </Box>
                            <Box>
                                <Stat>
                                    <Text fontSize="md" color="gray.500">IMNV/Myo <a href="https://app.jala.tech/diseases/infectious-myonecrosis-virus" target="_blank">
                                            <Icon focusable="true" name="question" size="16px" color="blue.400"/></a>
                                    </Text>
                                    <Heading as="h3" size="xl">
                                        <strong>{tracker.IMNV_p.length}</strong>
                                    </Heading>
                                    <Text fontSize="sm" color="gray.500">
                                        {tracker.IMNV_s.length} sampel
                                    </Text>
                                    <Text fontSize="sm" color="gray.500">
                                        {(tracker.IMNV_p.length === 0)
                                            ? 0
                                            : ((tracker.IMNV_p.length / tracker.IMNV_s.length) * 100).toFixed(2)}% Positive
                                    </Text>
                                </Stat>
                            </Box>
                            <Box>
                                <Stat pr={1}>
                                    <Text fontSize="md" color="gray.500">WSSV/Bintik Putih <a href="https://app.jala.tech/diseases/white-spot-syndrome" target="_blank">
                                            <Icon focusable="true" name="question" size="16px" color="blue.400"/></a>
                                    </Text>
                                    <Heading as="h3" size="xl">
                                        <strong>{tracker.WSSV_p.length}</strong>
                                    </Heading>
                                    <Text fontSize="sm" color="gray.500">
                                        {tracker.WSSV_s.length} sampel
                                    </Text>
                                    <Text fontSize="sm" color="gray.500">
                                        {(tracker.WSSV_p.length === 0)
                                            ? 0
                                            : ((tracker.WSSV_p.length / tracker.WSSV_s.length) * 100).toFixed(2)}% Positive
                                    </Text>
                                </Stat>
                            </Box>
                        </SimpleGrid>
                        <Box bg="gray.100" h="40px" mr={0} ml={0} mb={2} bg={colorMode === 'light'? "gray.100":"gray.700"}>
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
                                <Select size="md" // value={disease}} // onChange={(e) => {} // setDisease(e.target.value)}}
                                >
                                    {/* <option value='Semua Sampel'>Semua Sampel</option> */}
                                    <option value='Semua Positif'>Semua Positif</option>
                                    <option value='AHPND'>AHPND</option>
                                    <option value='EHP'>EHP</option>
                                    <option value='IMNV'>IMNV/Myo</option>
                                    <option value='WSSV'>WSSV/Bintik Putih</option>
                                </Select>
                            </Box>
                            <Alert
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
                            </Alert>
                        </Box>

                    </Box>
                </div>}
                {!tracker.total_s && <Box mt={3}>
                    <Alert
                        status="error"
                        variant="subtle"
                        flexDirection="column"
                        justifyContent="center"
                        textAlign="center">
                        <AlertIcon/>
                        Tidak ada data penyakit {disease === "Semua Positif" ? " ": disease} di {district === "Semua" ? "semua daerah" : district} 😞
                    </Alert>
                </Box>
}
            </SimpleGrid>
        </div>
    );
}
