import React, {useRef, useState, useContext} from 'react';
import ReactMapGL, {Layer, Source, NavigationControl} from 'react-map-gl';
import {
    SimpleGrid,
    Box,
    Select,
    Heading,
  } from '@chakra-ui/core';
  import {clusterLayer, clusterCountLayer, unclusteredPointLayer} from '../layers/layers';
  import '../styles/app.css';
  import {graphql, useStaticQuery} from 'gatsby';
  import DatePicker from "react-datepicker";
  import {DiseaseContext} from '../pages/app'


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

    const mapboxApi = useStaticQuery(graphql`
  query mapboxApi {
    site {
        siteMetadata {
          airtableApi
          airtableBase
          mapboxApi
        }
      }
  }`);

//   console.log('mapboxapi',mapboxApi.site.siteMetadata.mapboxApi);
  
    // const {toast} = useContext(DiseaseContext);
    const sourceRef = useRef();
    function _onViewportChange(viewport) {
        setViewport(viewport);
    }
  
    console.log(`point peta`, points);
  
    
  
    function _getClusterLeaves(e) {
        console.log('event', e.target.className)
        if (e.target.className === "overlays") {
            const feature = e.features[0];
            if (feature === undefined) {
                console.log('feature ', feature);
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
                });
            }
        } else {
            console.log('bukan cluster ', e.target.className);
        }
    }
  
    
  
    function _getZoomExpansion(e) {
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
        <div id="map" >
          <ReactMapGL {...viewport} width="100%" height="100%" mapboxApiAccessToken={mapboxApi.site.siteMetadata.mapboxApi} onViewportChange={(viewport) => {
              setViewport(viewport)
          }} interactiveLayerIds={[clusterLayer.id]} 
          // onClick={_getClusterLeaves}} 
           onClick={_getZoomExpansion} 
          // onDblClick={_getZoomExpansion}}
          >
              <DiseasePicker
                  kecamatan={[...new Set(samples.map(d => d.fields.Kecamatan).sort())]}/>
              <Source
                  type="geojson"
                  data={points}
                  cluster={true}
                  clusterMaxZoom={14}
                  clusterRadius={50}
                  ref={sourceRef}>

                  <Layer {...clusterLayer}/>
                  <Layer {...clusterCountLayer}/>
                  <Layer {...unclusteredPointLayer}/>
              </Source>

              <div style={{position: 'absolute', right: 0, top:72, padding:'10px'}}>
          <NavigationControl />
        </div>
          </ReactMapGL>
          {/* {!points.features[0] && (
              <div>
                  {toast({title: "Data tidak ditemukan.", description: "Tidak ada data untuk pilihan tanggal tersebut.", status: "warning", duration: 1000, isClosable: true})}
              </div>
          )
} */}
          
      </div>
    )
}

function DiseasePicker({kecamatan}) {
    const {
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
        <div className="control-panel">
            <SimpleGrid p={5}>
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
                        style={mystyle} />
                </Box>
            </SimpleGrid>
        </div>
  
    )
  
  }
  