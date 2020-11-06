import React, {useRef, useState, useContext} from 'react';
import ReactMapGL, {Layer, Source, NavigationControl} from 'react-map-gl';
import {
    SimpleGrid,
    Box,
    Select,
    Heading,
    Flex,
} from '@chakra-ui/core';
import {clusterLayer, clusterCountLayer, unclusteredPointLayer, unclusterCountLayer} from '../layers/layers';
import '../styles/app.css';
import {graphql, useStaticQuery} from 'gatsby';
import DatePicker from "react-datepicker";
import {DiseaseContext} from '../pages/app';
import Img from 'gatsby-image';

export default function Peta({points, samples}) {
    const [viewport,
        setViewport] = useState({
        latitude: -5.26601,
        longitude: 110.25879,
        zoom: 6,
        height: "100vh",
        bearing: 0,
        pitch: 0
    });

    const query = useStaticQuery(graphql `
  query peta2 {
    site {
        siteMetadata {
          airtableApi
          airtableBase
          mapboxApi
        }
      }
  logo: file(relativePath: {eq: "assets/tambakpintar.png"}) {
      id
      childImageSharp {
        fixed(width: 70, height: 70) {
          ...GatsbyImageSharpFixed
        }
      }
    }
  }`);

    const sourceRef = useRef();
    function _onViewportChange(viewport) {
        setViewport(viewport);
    }

    console.log(`point peta`, points);

    let clusterFeatures = {};

    function _getClusterLeaves(e) {
        console.log('event', e.target.className)
        if (e.target.className === "overlays") {
            const feature = e.features[0];
            if (feature === undefined) {
                console.log('feature ', feature);
                console.log('e ', e);
                // const fields = feature.properties.fields;
                console.log("not a cluster ");
            } else {
                const clusterId = feature.properties.cluster_id;
                const mapboxSource = sourceRef
                    .current
                    .getSource();
                mapboxSource.getClusterLeaves(clusterId, 100, 0, (error, features) => {
                    if (error) {
                        console.log('error', error);
                        return;
                    }
                    clusterFeatures = features;
                    console.log('feature', clusterFeatures);
                });
                mapboxSource.getClusterExpansionZoom(clusterId, (error, zoom) => {
                    if (error) {
                        return;
                    }
                    console.log('zoom expand ', zoom);
                    _onViewportChange({
                        ...viewport,
                        longitude: feature.geometry.coordinates[0],
                        latitude: feature.geometry.coordinates[1],
                        zoom,
                        transitionDuration: 500
                    })
                });

            }
        } else {
            console.log('bukan cluster ', e.target.className);
        }
    }

    function _getZoomExpansion(e) {
        console.log('event', e)
        if (e.features !== undefined) {
            const feature = e.features[0];
            if (feature === undefined) {
                console.log('feature ', feature);
                // const fields = feature.properties.fields;
                console.log("not a cluster 2");
            } else {
                const clusterId = feature.properties.cluster_id;
                const mapboxSource = sourceRef
                    .current
                    .getSource();
                mapboxSource.getClusterExpansionZoom(clusterId, (error, zoom) => {
                    if (error) {
                        return;
                    }
                    _onViewportChange({
                        ...viewport,
                        longitude: feature.geometry.coordinates[0],
                        latitude: feature.geometry.coordinates[1],
                        zoom,
                        transitionDuration: 500
                    })
                });
            }
        } else {
            console.log("not a cluster 1");
        }
    }
    return (
        <Box>
            <Box display={{lg:"none"}}>
            <Flex columns={2}>
            <Box p={2} m={2} pb={0} w="60px">
          <Img fixed={query.logo.childImageSharp.fixed} />
        </Box>
        <Box m={2} p={2} pb={2} flex="1">
        <Heading as="h3" size="md" mb={0}>Peta Distribusi</Heading>
                    <Heading as="h4" size="md" mb={2}>Penyakit Udang</Heading>
        </Box>
            </Flex>
            </Box>
            <Box
                id="map"
                height={{
                lg: "100vh",
                md: "75vh",
                sm: "70vh",
                xs: "70vh"
            }}>
                <ReactMapGL {...viewport} width="100%" height="100%" mapboxApiAccessToken={query.site.siteMetadata.mapboxApi} onViewportChange={(viewport) => {
                    setViewport(viewport)
                }} interactiveLayerIds={[clusterLayer.id]} // onClick={_getClusterLeaves}}} 
        onClick={_getClusterLeaves} // onDblClick={_getZoomExpansion}}}
        >
                    <DiseasePicker
                        kecamatan={[...new Set(samples.map(d => d.fields.Kecamatan).sort())]}/>
                    <Source
                        type="geojson"
                        data={points}
                        cluster={true}
                        clusterMaxZoom={15}
                        clusterRadius={50}
                        ref={sourceRef}>

                        <Layer {...clusterLayer}/>
                        <Layer {...clusterCountLayer}/>
                        <Layer {...unclusteredPointLayer}/>
                        <Layer {...unclusterCountLayer}/>
                    </Source>

                    <div
                        style={{
                        position: 'absolute',
                        right: 0,
                        top: 100,
                        padding: '10px'
                    }}>
                        <NavigationControl/>
                    </div>
                </ReactMapGL>

            </Box>
        </Box>

        ) } function DiseasePicker({kecamatan}) {const {
            disease,
            setDisease,
            district,
            setDistrict,
            startDate,
            setStartDate
        } = useContext(DiseaseContext);

        const mystyle = {
            color: "white",
            backgroundColor: "DodgerBlue",
            padding: "10px",
            fontFamily: "Arial"
        };

        return (
            <Box>
                <Box display={{sm:"none", xs:"none", lg:"block"}}>
                <SimpleGrid p={5} className="control-panel">
                    <Box mb={2}>
                        <Heading as="h4" size="sm" mb={2}>Pilih Penyakit</Heading>
                        <Select
                            size="md"
                            value={disease}
                            onChange={(e) => {
                            setDisease(e.target.value)
                        }}>
                            <option value='Semua Sampel'>Semua Sampel</option>
                            <option value='Semua Positif'>Semua Positif</option>
                            <option value='AHPND'>AHPND</option>
                            <option value='EHP'>EHP</option>
                            <option value='IMNV'>IMNV</option>
                            <option value='WSSV'>WSSV</option>
                        </Select>
                    </Box>
                    <Box mb={2}>
                        <Heading as="h4" size="sm" mb={2}>Pilih Daerah</Heading>
                        <Select
                            size="md"
                            value={district}
                            onChange={(e) => {
                            setDistrict(e.target.value)
                        }}>
                            <option value='Semua'>Semua</option>
                            {kecamatan.map(d => <option value={d} key={d}>{d}</option>)}
                        </Select>
                    </Box>
                    <Box mb={2}>
                        <Heading as="h4" size="sm" mb={2}>Pilih Tanggal</Heading>
                        <DatePicker
                            closeOnScroll={true}
                            selected={startDate}
                            onChange={date => setStartDate(date)}
                            style={mystyle}/>
                    </Box>
                </SimpleGrid>
            </Box>
            <Box display={{ lg:"none"}}>
            <SimpleGrid columns={2} spacing={2} className="disease-filter-res">
            <Box mb={2} w="100%">
                        <Heading as="h6" size="xs" mb={2}>Penyakit</Heading>
                        <Select
                        p={1}
                        // variant="unstyled"
                            size="md"
                            value={disease}
                            onChange={(e) => {
                            setDisease(e.target.value)
                        }}>
                            <option value='Semua Sampel'>Semua Sampel</option>
                            <option value='Semua Positif'>Semua Positif</option>
                            <option value='AHPND'>AHPND</option>
                            <option value='EHP'>EHP</option>
                            <option value='IMNV'>IMNV</option>
                            <option value='WSSV'>WSSV</option>
                        </Select>
                    </Box>
                    <Box mb={2} w="100%">
                        <Heading as="h6" size="xs" mb={2}>Daerah</Heading>
                        <Select
                        p={1}
                        // variant="unstyled"
                            size="md"
                            value={district}
                            onChange={(e) => {
                            setDistrict(e.target.value)
                        }}>
                            <option value='Semua'>Semua</option>
                            {kecamatan.map(d => <option value={d} key={d}>{d}</option>)}
                        </Select>
                    </Box>
            </SimpleGrid>
            </Box>
            </Box>
            

        )
}