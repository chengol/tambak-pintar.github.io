import React, {useRef, useState, useContext} from 'react';
import ReactMapGL, {
    NavigationControl,
    FlyToInterpolator,
    Marker,
    Popup
} from 'react-map-gl';
// import useSWR, {SWRConfig} from "swr";
// import {isAfter, isBefore, formatISO} from 'date-fns';
import {
    Box,
    Heading,
    Flex,
    Text,
    useColorMode,
    IconButton,
    Divider,
    Spacer
} from '@chakra-ui/react';
import {SunIcon, MoonIcon} from '@chakra-ui/icons';
// import useSupercluster from "use-supercluster";
import '../styles/app.css';
import {graphql, useStaticQuery} from 'gatsby';
import {DiseaseContext} from '../pages/app';
import Img from 'gatsby-image';
import "react-datepicker/dist/react-datepicker.css";
import "mapbox-gl/dist/mapbox-gl.css"
import _ from "lodash";
import chroma from "chroma-js";
import DiseasePicker from './DiseasePicker';
import Legends from './Legends'
import {format} from 'date-fns';

export default function PetaRegion({regions,  disease}) {
    const query = useStaticQuery(graphql `
  query mapboxRegion {
    site {
        siteMetadata {
          mapboxApi
          airtableApi
          jalaMapDua
          jalaMapSatu
        }
      }
  logo: file(relativePath: {eq: "assets/tp-logo-landscape.png"}) {
      id
      childImageSharp {
        fixed(width: 85, height: 35) {
          ...GatsbyImageSharpFixed
        }
      }
    }
    jala: file(relativePath: {eq: "assets/jala-white.png"}) {
        id
        childImageSharp {
          fixed(width: 75, height: 20) {
            ...GatsbyImageSharpFixed
          }
        }
      }
  }`);

    const [selectedPoint,
        setSelectedPoint] = useState(null);

    let districtLat = -7.650510;
    let districtLong = 109.375827;
    let mapZoom = 5;

    const [viewport,
        setViewport] = useState({
        latitude: -4.5,
        longitude: 110,
        zoom: 4.5,
        height: "100vh",
        bearing: 0,
        pitch: 0
    });

    const {
        setRegionId,
    } = useContext(DiseaseContext);

    const sourceRef = useRef();

    function _onViewportChange(viewport) {
        setViewport(viewport);
    }

    const diseases = disease;
    // console.log('penyakits', diseases);

    const _goToViewport = (kec) => {
        if (!kec) {
            console.log('tidak ada data pada daerah tersebut');
            districtLong = 110;
            districtLat = -4.5;
            mapZoom = 5;
        } else if (kec.id.length === 2) {
            districtLong = parseFloat(kec.longitude);
            districtLat = parseFloat(kec.latitude);
            mapZoom = 7;
        } else if (kec.id.length === 4) {
            districtLong = parseFloat(kec.longitude);
            districtLat = parseFloat(kec.latitude);
            mapZoom = 10;
        } else {
            districtLong = parseFloat(kec.longitude);
            districtLat = parseFloat(kec.latitude);
            mapZoom = 11;
        }
        _onViewportChange({
            longitude: districtLong,
            latitude: districtLat,
            zoom: mapZoom,
            transitionInterpolator: new FlyToInterpolator({speed: 3}),
            transitionDuration: 'auto'
        });
        // console.log(`goto = `, districtLat, districtLong);
    };

    function _getZoomPoint(point) {
        // console.log(point);
        _onViewportChange({
            ...viewport,
            latitude: parseFloat(point.region.latitude),
            longitude: parseFloat(point.region.longitude),
            zoom: 11,
            transitionInterpolator: new FlyToInterpolator({speed: 3}),
            transitionDuration: 'auto'
        });
        // setDistrict(cluster.properties.fields.Kecamatan);
        setRegionId(point.region_id);
    }


    function _getInterpolation(p) {
        const color = chroma
            .scale(['rgba(150,255,90,0.61)', 'rgba(255, 214, 0, 0.6)', 'rgba(255, 128, 11, 0.6)', 'rgba(255, 53, 96, 0.6)'])
            .domain([0, 25, 50]);
        let per = 0;
        if (p >= 50) {
            per = 50;
        } else {
            per = p;
        }
        return color(per);

    }

    //get map bounds
    // const bounds = sourceRef.current
    //     ? sourceRef
    //         .current
    //         .getMap()
    //         .getBounds()
    //         .toArray()
    //         .flat()
    //     : null;

    // console.log('klaster',clusters);
    // console.log('map', query.site.siteMetadata.jalaMapDua);

    const {colorMode, toggleColorMode} = useColorMode();

    return (
        <Box>
            <Box
                display={{
                xl: "none",
                lg: "none",
                md: "block",
                sm: "block",
                base: "block"
            }}>

                <Flex align="center" justify="center">
                    <Box p={2} m={0} w="100px">
                        <Img fixed={query.logo.childImageSharp.fixed}/>
                    </Box>

                </Flex>
            </Box>
            <Box
                id="map"
                height={{
                xl: "100vh",
                lg: "100vh",
                md: "70vh",
                sm: "70vh",
                base: "60vh"
            }}>
                <ReactMapGL
                    {...viewport}
                    maxZoom={20}
                    width="100%"
                    height="100%"
                    mapStyle={query.site.siteMetadata.jalaMapDua}
                    mapboxApiAccessToken={query.site.siteMetadata.mapboxApi}
                    onViewportChange={(viewport) => {
                    setViewport(viewport)
                }}
                    ref={sourceRef}>

                    {diseases.map(d => {
                        const latitude = d.region.latitude;
                        const longitude = d.region.longitude;
                        const positiveRate = ((d.total_positive / d.total) * 100).toFixed();
                        const positif = d.total_positive;
                        // console.log('positif rate', positiveRate)
                        return (
                            <Marker
                                key={d.region_id}
                                latitude={parseFloat(latitude)}
                                longitude={parseFloat(longitude)}>
                                <button
                                    className="icon-marker"
                                    style={{
                                    background: `${_getInterpolation(positiveRate)}`
                                }}
                                    onClick={() => {
                                    _getZoomPoint(d)
                                }}
                                    onMouseEnter={e => {
                                        // console.log('masuk', e);
                                    e.preventDefault();
                                    setSelectedPoint(d)
                                }}
                                
                                onMouseLeave={e => {
                                    // console.log('keluar');
                                    e.preventDefault();
                                    setSelectedPoint(null)
                                }}>
                                    {(positif === 0)
                                        ? 0.00
                                        : positiveRate}%
                                </button>
                            </Marker>
                        )
                    })}

                    {selectedPoint
                        ? (
                            <Popup
                                latitude={parseFloat(selectedPoint.region.latitude)}
                                longitude={parseFloat(selectedPoint.region.longitude)}
                                onClose={() => {setSelectedPoint(null)}}
                                closeButton={false}>
                                <Heading as="h3" size="md" color={colorMode === 'dark'
                ? 'gray.800'
                : 'black'}>
                                    <strong>{_.startCase(selectedPoint.region.district_name.toLowerCase())}</strong>
                                </Heading>
                                <Heading as="h3" fontSize="sm" color={colorMode === 'dark'
                ? 'gray.800'
                : 'black'}>
                                    {_.startCase(selectedPoint.region.regency_name.toLowerCase())+`, `}{_.startCase(selectedPoint.region.province_name.toLowerCase())}
                                </Heading>
                                
                                <Text fontSize="sm" color="gray.500" >Diperbarui {` `}{selectedPoint.last_logged_at
                                        ? format(new Date(selectedPoint.last_logged_at), 'dd MMM yyyy')
                                        : ''}</Text>
                                        <Divider mb={2} mt={2}/>
                                <Box>
                                    <Flex>
                                        <Text fontSize="sm" color={colorMode === 'dark'
                ? 'gray.800'
                : 'black'}>Kasus</Text>
                                        <Spacer />
                                    <Text fontSize="sm" fontWeight={700} color={colorMode === 'dark'
                ? 'gray.800'
                : 'black'}>{selectedPoint.total_positive}{` Positif`}</Text>
                                    </Flex>
                                    <Flex>
                                        <Text fontSize="sm" color={colorMode === 'dark'
                ? 'gray.800'
                : 'black'}>Presentase</Text>
                                        <Spacer />
                                    <Text fontSize="sm" fontWeight={700} color={colorMode === 'dark'
                ? 'gray.800'
                : 'black'}>{((selectedPoint.total_positive / selectedPoint.total) * 100).toFixed()}{`% Positif`}</Text>
                                    </Flex>
                                    <Flex>
                                        <Text fontSize="sm" color={colorMode === 'dark'
                ? 'gray.800'
                : 'black'}>Sampel</Text>
                                        <Spacer />
                                    <Text fontSize="sm" fontWeight={700 } color={colorMode === 'dark'
                ? 'gray.800'
                : 'black'}>{selectedPoint.total}{` Sampel`}</Text>
                                    </Flex>
                                </Box>
                            </Popup>
                        )
                        : null}

                    <div
                        style={{
                        position: 'absolute',
                        right: 0,
                        top: 100,
                        padding: '10px'
                    }}>
                        <NavigationControl/>
                    </div>

                    <Legends/>

                    <Box
                        m={2}
                        style={{
                        position: 'absolute',
                        left: 0,
                        top: 100
                    }}
                        display={{
                        xl: "none",
                        lg: "none",
                        md: "block",
                        sm: "block"
                    }}
                        className="basic-panel"
                        bg={colorMode === 'dark'
                        ? 'gray.800'
                        : 'white'}
                        p={1}>
                        <IconButton
                            aria-label="dark side"
                            variant="ghost"
                            icon={colorMode === 'light'
                            ? <MoonIcon/>
                            : <SunIcon/>}
                            onClick={toggleColorMode}
                            size="md"/>
                    </Box>

                    <Box
                        style={{
                        position: "absolute",
                        bottom: "0",
                        left: "100px"
                    }}
                        p={0}
                        mb={1}
                        ml={1}>
                        <a href="https://jala.tech" target="_blank" rel="noreferrer">
                            <Text color="white" fontSize="xs">powered by</Text>
                            <Img fixed={query.jala.childImageSharp.fixed}/>
                        </a>
                    </Box>

                    <DiseasePicker
                        onViewportChange={_goToViewport}
                        regions={regions}/>
                </ReactMapGL>

            </Box>
        </Box>

    )
}
