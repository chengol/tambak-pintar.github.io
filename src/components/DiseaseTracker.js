import React, {useContext} from 'react'
import {
    SimpleGrid,
    Heading,
    Stat,
    StatGroup,
    Box,
    Alert,
    AlertIcon,
    Text,
    Divider
} from '@chakra-ui/core';

import {DiseaseContext} from '../pages/app'

export default function DiseaseTracker({points}) {

    const {disease, district} = useContext(DiseaseContext);

    let kec = "";
    let kab = "";
    let prov = "";

    // console.log(`point statistik`, points);

    let tracker = {};

    if (!points.features[0]) {
        // console.log('titik tracker 1', points);
    } else {
        // console.log('titik tracker 2', points.features);
        tracker = {
            total_s: points.features.length,
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
            AHPND_s: points
                .features
                .filter(d => {
                    return d.properties.fields.Penyakit === "AHPND"
                }),
            EHP_p: points
                .features
                .filter(d => {
                    return d.properties.fields.Penyakit === "EHP" && d.properties.fields.Status === 1
                }),
            EHP_s: points
                .features
                .filter(d => {
                    return d.properties.fields.Penyakit === "EHP"
                }),
            IMNV_p: points
                .features
                .filter(d => {
                    return d.properties.fields.Penyakit === "IMNV" && d.properties.fields.Status === 1
                }),
            IMNV_s: points
                .features
                .filter(d => {
                    return d.properties.fields.Penyakit === "IMNV"
                }),
            WSSV_p: points
                .features
                .filter(d => {
                    return d.properties.fields.Penyakit === "WSSV" && d.properties.fields.Status === 1
                }),
            WSSV_s: points
                .features
                .filter(d => {
                    return d.properties.fields.Penyakit === "WSSV"
                })
        }

        // console.log('statistik ', tracker);

        kec = points.features[0].properties.fields.Kecamatan;
        kab = points.features[0].properties.fields.Kabupaten;
        prov = points.features[0].properties.fields.Provinsi;
    }

    // console.log("district", district);

    return (
        <div >
            <SimpleGrid mt={{xl: 1, sm:5, md: 1, xs: 5}} pt={1} p={{xs: 0, base: 5}} className="tracker-panel">
                {points.features[0] && <div>
                    <Heading as="h3" size="xl" mb={0}>{(district === "Semua")? "Indonesia" : `${kec}`}</Heading>
                    <Heading as="h4" size="md" mb={2}>{(district === "Semua") ? "" : `${kab}, ${prov}`}</Heading>
                    <Box display={{lg:"none"}}>
                        <Divider />
                    </Box>
                    <SimpleGrid columns={2} spacing={3} style={{overflow:"auto"}}>
                        <Box>
                            <Text fontSize="md" color="grey.500">Total</Text>
                            <Heading as="h3" size="xl" color="black"><strong>{tracker.total_p.length}</strong></Heading>
                            <Text fontSize="sm" color="grey.500">
                                dari {tracker.total_s} sampel
                            </Text>
                            <Text fontSize="sm" color="grey.500">
                                {(tracker.total_p.length === 0) ? 0 : ((tracker.total_p.length / tracker.total_s) * 100).toFixed(2)}% Positive
                            </Text>
                        </Box>
                        <Box>
                            <Stat>
                                <Text fontSize="md" color="grey.500">AHPND</Text>
                                <Heading as="h3" size="xl" color="black">{tracker.AHPND_p.length}</Heading>
                                <Text fontSize="sm" color="grey.500">
                                    dari {tracker.AHPND_s.length} sampel
                                </Text>
                                <Text fontSize="sm" color="grey.500">
                                    {(tracker.AHPND_p.length === 0) ? 0 : ((tracker.AHPND_p.length / tracker.AHPND_s.length) * 100).toFixed(2)}% Positive
                                </Text>
                            </Stat>
                        </Box>
                        <Box>
                            <Stat>
                                <Text fontSize="md" color="grey.500">EHP</Text>
                                <Heading as="h3" size="xl" color="black">{tracker.EHP_p.length}</Heading>
                                <Text fontSize="sm" color="grey.500">
                                    dari {tracker.EHP_s.length} sampel
                                </Text>
                                <Text fontSize="sm" color="grey.500">
                                    {(tracker.EHP_p.length === 0) ? 0 : ((tracker.EHP_p.length / tracker.EHP_s.length) * 100).toFixed(2)}% Positive
                                </Text>
                            </Stat>
                        </Box>
                        <Box>
                            <Stat>
                                <Text fontSize="md" color="grey.500">IMNV</Text>
                                <Heading as="h3" size="xl" color="black">{tracker.IMNV_p.length}</Heading>
                                <Text fontSize="sm" color="grey.500">
                                    dari {tracker.IMNV_s.length} sampel
                                </Text>
                                <Text fontSize="sm" color="grey.500">
                                    {(tracker.IMNV_p.length === 0) ? 0 : ((tracker.IMNV_p.length / tracker.IMNV_s.length) * 100).toFixed(2)}% Positive
                                </Text>
                            </Stat>
                        </Box>
                        <Box>
                            <Stat>
                                <Text fontSize="md" color="grey.500">WSSV</Text>
                                <Heading as="h3" size="xl" color="black">{tracker.WSSV_p.length}</Heading>
                                <Text fontSize="sm" color="grey.500">
                                    dari {tracker.WSSV_s.length} sampel
                                </Text>
                                <Text fontSize="sm" color="grey.500">
                                    {(tracker.WSSV_p.length === 0) ? 0 : ((tracker.WSSV_p.length / tracker.WSSV_s.length) * 100).toFixed(2)}% Positive
                                </Text>
                            </Stat>
                        </Box>
                    </SimpleGrid>
                    <StatGroup>
                        <Stat></Stat>

                    </StatGroup>
                </div>}
                {!points.features[0] && <Box mt={3}>
                    <Alert status="error"
                    variant="subtle"
                    flexDirection="column"
                    justifyContent="center"
                    textAlign="center">
                <AlertIcon />
                Tidak ada data penyakit {disease} di daerah {district} 😞
              </Alert>
                </Box>                
                }
            </SimpleGrid>
        </div>
    );
}
