import React, {useRef, useState, useContext} from 'react';
import ReactMapGL, {Layer, Source, NavigationControl, FlyToInterpolator, Marker} from 'react-map-gl';
import {
    SimpleGrid,
    Box,
    Select,
    Heading,
    Flex,
    Text,
    Grid,
    useColorMode,
    Input,
    IconButton,
    ColorModeProvider
} from '@chakra-ui/react';
import {SunIcon, MoonIcon} from '@chakra-ui/icons';
import useSupercluster from "use-supercluster";
import '../styles/app.css';
import {graphql, useStaticQuery} from 'gatsby';
import {DiseaseContext} from '../pages/app';
import Img from 'gatsby-image';
import "react-datepicker/dist/react-datepicker.css";
import "mapbox-gl/dist/mapbox-gl.css"
import _ from "lodash";
import chroma from "chroma-js";
import DiseasePicker from './DiseasePicker';

export default function Peta({points, samples, regions}) {
    const query = useStaticQuery(graphql `
  query mapbox {
    site {
        siteMetadata {
          airtableApi
          airtableBase
          mapboxApi
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

    const {setDistrict, setRegionId} = useContext(DiseaseContext);

    const sourceRef = useRef();

    function _onViewportChange(viewport) {
        setViewport(viewport);
    }

    const _goToViewport = (kec) => {
        if (!kec) {
            console.log('tidak ada data pada daerah tersebut');
            districtLong = 110;
            districtLat = -4.5;
            mapZoom = 5;
        }else if(kec.id.length === 2){
            districtLong = parseFloat(kec.longitude);
            districtLat = parseFloat(kec.latitude);
            mapZoom = 7;
        }
        else if(kec.id.length === 4){
            districtLong = parseFloat(kec.longitude);
            districtLat = parseFloat(kec.latitude);
            mapZoom = 10;
        }
         else {
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

    function _getZoom(clusterId){
        // console.log('feature event', e);
            const leaves = supercluster.getLeaves(clusterId);
        console.log('leaves', leaves);
        // const expansionZoom = Math.min(supercluster.getClusterExpansionZoom(clusterId),12);
        _onViewportChange({
            ...viewport,
            latitude: leaves[0].geometry.coordinates[1],
            longitude: leaves[0].geometry.coordinates[0],
            zoom: 11,
            transitionInterpolator: new FlyToInterpolator({speed: 3}),
            transitionDuration: 'auto'
        });
        // setDistrict(leaves[0].properties.fields.Kecamatan);
        setRegionId(leaves[0].properties.fields.Region[0]);
        // const klaster = clusters;
        
    }

    function _getZoomNonCluster(cluster){
        _onViewportChange({
            ...viewport,
            latitude: cluster.geometry.coordinates[1],
            longitude: cluster.geometry.coordinates[0],
            zoom: 11,
            transitionInterpolator: new FlyToInterpolator({speed: 3}),
            transitionDuration: 'auto'
        });
        // setDistrict(cluster.properties.fields.Kecamatan);
        setRegionId(cluster.properties.fields.Region[0]);
    }

    function _getClusterLeaves(e) {
        // console.log('event', e.target.className)
        if (e.target.className === "overlays") {
            const feature = e.features[0];
            if (feature === undefined) {
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
                    console.log('feature', features);
                    // _renderPopup(feature.geometry.coordinates[1],feature.geometry.coordinates[0],
                    // );
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
        }
    }

    function _getHover(e) {
        console.log('event hover', e.target.className)
        if (e.target.className === "overlays") {
            const feature = e.features[0];
            if (feature === undefined) {
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
                    console.log('feature', features);
                    // _renderPopup(feature.geometry.coordinates[1],feature.geometry.coordinates[0],
                    // );
                });
            }
        }
    }

    function _getInterpolation(p){
        const color = chroma.scale(['78d271','ff9d0b','ff5b7e']).domain([0,5,10]);
        let per = 0;
        if(p >= 10){
            per = 10;
        }
        else{
            per = p;
        }
        return color(per);

    }

    //get map bounds
    const bounds = sourceRef.current ? sourceRef.current.getMap().getBounds().toArray().flat() : null;

    //get cluster
    const {clusters, supercluster} = useSupercluster({
        points,
        zoom: viewport.zoom,
        bounds,
        options: {radius: 20, maxZoom: 20}
    });

    // console.log('klaster',clusters);

    const {colorMode, toggleColorMode} = useColorMode();

    return (
        <Box>
            <Box display={{
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
                    mapboxApiAccessToken={query.site.siteMetadata.mapboxApi}
                    onViewportChange={(viewport) => {
                    setViewport(viewport)}}
                    ref={sourceRef}
                    >
                         

{clusters.map(cluster => {
                        const [longitude, latitude] = cluster.geometry.coordinates;
                        const { cluster: isCluster, point_count : pointCount} = cluster.properties;

                        if(isCluster) {
                            return(
                                <Marker key={cluster.id} latitude={latitude} longitude={longitude}>
                                    <button className="cluster-marker" style={{background: `${_getInterpolation(pointCount)}`}}
                                onClick={() =>{ _getZoom(cluster.id);}}
                                >
                                        {pointCount}
                                    </button>
                                </Marker>
                            );
                        }

                        return(
                            <Marker key={cluster.properties.id} 
                        latitude={latitude} 
                        longitude={longitude}
                        >
                            <button className="icon-marker" onClick={() =>{_getZoomNonCluster(cluster)}} style={{background: `${_getInterpolation(1)}`}}>
                            1
                            </button>
                        </Marker>
                        )
                    })}


                    <div
                        style={{
                        position: 'absolute',
                        right: 0,
                        top: 100,
                        padding: '10px'
                    }}>
                        <NavigationControl/>
                    </div>

                    <Box m={2} style={{position: 'absolute',
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
                <IconButton aria-label="dark side" variant="ghost" icon={colorMode === 'light'? <MoonIcon/>:<SunIcon/>} onClick={toggleColorMode} size="md"/>
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
                        kecamatan={_.uniqBy(samples.map(s => ({Kecamatan: s.fields.Kecamatan, Latitude: s.fields.Lat, Longitude: s.fields.Long})), 'Kecamatan')}
                        onViewportChange={_goToViewport} regions={regions}/>
                </ReactMapGL>

            </Box>
        </Box>

    )
}

// function DiseasePicker({kecamatan, onViewportChange}) {
    

// }