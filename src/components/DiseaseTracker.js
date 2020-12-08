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

export default function DiseaseTracker({points, samples}) {

    const {disease, district} = useContext(DiseaseContext);

    let kec = "";
    // let kab = "";
    let prov = "";

    // console.log('samples tracker', samples);

    // console.log(`point statistik`, points);

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
            EHP_s: samples
                .filter(d => {
                    return d.fields.Penyakit === "EHP"
                }),
            IMNV_p: points
                .features
                .filter(d => {
                    return d.properties.fields.Penyakit === "IMNV" && d.properties.fields.Status === 1
                }),
            IMNV_s: samples
                .filter(d => {
                    return d.fields.Penyakit === "IMNV"
                }),
            WSSV_p: points
                .features
                .filter(d => {
                    return d.properties.fields.Penyakit === "WSSV" && d.properties.fields.Status === 1
                }),
            WSSV_s: samples
                .filter(d => {
                    return d.fields.Penyakit === "WSSV"
                })
        }

        // console.log('statistik ', tracker);

        kec = points.features[0].properties.fields.Kecamatan;
        // kab = points.features[0].properties.fields.Kabupaten;
        prov = points.features[0].properties.fields.Provinsi;
    }


    // if (!points.features[0]) {
    //     // console.log('titik tracker 1', points);
    // } else {
    //     // console.log('titik tracker 2', points.features);
    //     tracker = {
    //         total_s: points.features.length,
    //         total_p: points
    //             .features
    //             .filter(d => {
    //                 return d.properties.fields.Status === 1
    //             }),
    //         AHPND_p: points
    //             .features
    //             .filter(d => {
    //                 return d.properties.fields.Penyakit === "AHPND" && d.properties.fields.Status === 1
    //             }),
    //         AHPND_s: points
    //             .features
    //             .filter(d => {
    //                 return d.properties.fields.Penyakit === "AHPND"
    //             }),
    //         EHP_p: points
    //             .features
    //             .filter(d => {
    //                 return d.properties.fields.Penyakit === "EHP" && d.properties.fields.Status === 1
    //             }),
    //         EHP_s: points
    //             .features
    //             .filter(d => {
    //                 return d.properties.fields.Penyakit === "EHP"
    //             }),
    //         IMNV_p: points
    //             .features
    //             .filter(d => {
    //                 return d.properties.fields.Penyakit === "IMNV" && d.properties.fields.Status === 1
    //             }),
    //         IMNV_s: points
    //             .features
    //             .filter(d => {
    //                 return d.properties.fields.Penyakit === "IMNV"
    //             }),
    //         WSSV_p: points
    //             .features
    //             .filter(d => {
    //                 return d.properties.fields.Penyakit === "WSSV" && d.properties.fields.Status === 1
    //             }),
    //         WSSV_s: points
    //             .features
    //             .filter(d => {
    //                 return d.properties.fields.Penyakit === "WSSV"
    //             })
    //     }

    //     // console.log('statistik ', tracker);

    //     kec = points.features[0].properties.fields.Kecamatan;
    //     kab = points.features[0].properties.fields.Kabupaten;
    //     prov = points.features[0].properties.fields.Provinsi;
    // }

    // console.log("tracker", tracker);

    return (
        <div >
            <SimpleGrid mt={{xl: 1}} pt={1} m={{sm:5, xs:5, md:3}} p={{xs: 0, base: 3}} className="tracker-panel">
                {tracker.total_s && <div>
                    <Heading as="h3" size="xl" mb={0}>{(district === "Semua")? "Indonesia" : `${kec}`}</Heading>
                    <Heading as="h4" size="md" mb={2}>{(district === "Semua") ? "" : `${prov}`}</Heading>
                    <Box display={{lg:"none"}}>
                        <Divider />
                    </Box>
                    <SimpleGrid columns={2} spacing={3} style={{overflow:"auto"}}>
                        <Box>
                            <Text fontSize="md" color="gray.500">Total Positif</Text>
                            <Heading as="h3" size="xl"><strong>{tracker.total_p.length}</strong></Heading>
                            <Text fontSize="sm" color="gray.500">
                                dari {tracker.total_s} sampel
                            </Text>
                            <Text fontSize="sm" color="gray.500">
                                {(tracker.total_p.length === 0) ? 0 : ((tracker.total_p.length / tracker.total_s) * 100).toFixed(2)}% Positive
                            </Text>
                        </Box>
                        <Box>
                            <Stat>
                                <Text fontSize="md" color="gray.500">AHPND</Text>
                                <Heading as="h3" size="xl">{tracker.AHPND_p.length}</Heading>
                                <Text fontSize="sm" color="gray.500">
                                    dari {tracker.AHPND_s.length} sampel
                                </Text>
                                <Text fontSize="sm" color="gray.500">
                                    {(tracker.AHPND_p.length === 0) ? 0 : ((tracker.AHPND_p.length / tracker.AHPND_s.length) * 100).toFixed(2)}% Positive
                                </Text>
                            </Stat>
                        </Box>
                        <Box>
                            <Stat>
                                <Text fontSize="md" color="gray.500">EHP</Text>
                                <Heading as="h3" size="xl">{tracker.EHP_p.length}</Heading>
                                <Text fontSize="sm" color="gray.500">
                                    dari {tracker.EHP_s.length} sampel
                                </Text>
                                <Text fontSize="sm" color="gray.500">
                                    {(tracker.EHP_p.length === 0) ? 0 : ((tracker.EHP_p.length / tracker.EHP_s.length) * 100).toFixed(2)}% Positive
                                </Text>
                            </Stat>
                        </Box>
                        <Box>
                            <Stat>
                                <Text fontSize="md" color="gray.500">IMNV/Myo</Text>
                                <Heading as="h3" size="xl">{tracker.IMNV_p.length}</Heading>
                                <Text fontSize="sm" color="gray.500">
                                    dari {tracker.IMNV_s.length} sampel
                                </Text>
                                <Text fontSize="sm" color="gray.500">
                                    {(tracker.IMNV_p.length === 0) ? 0 : ((tracker.IMNV_p.length / tracker.IMNV_s.length) * 100).toFixed(2)}% Positive
                                </Text>
                            </Stat>
                        </Box>
                        <Box>
                            <Stat>
                                <Text fontSize="md" color="gray.500">WSSV/Bintik Putih</Text>
                                <Heading as="h3" size="xl">{tracker.WSSV_p.length}</Heading>
                                <Text fontSize="sm" color="gray.500">
                                    dari {tracker.WSSV_s.length} sampel
                                </Text>
                                <Text fontSize="sm" color="gray.500">
                                    {(tracker.WSSV_p.length === 0) ? 0 : ((tracker.WSSV_p.length / tracker.WSSV_s.length) * 100).toFixed(2)}% Positive
                                </Text>
                            </Stat>
                        </Box>
                    </SimpleGrid>
                    <StatGroup>
                        <Stat></Stat>

                    </StatGroup>
                </div>}
                {!tracker.total_s && <Box mt={3}>
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
