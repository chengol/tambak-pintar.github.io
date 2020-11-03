import React, {useState, useRef, useEffect} from 'react';
import useSWR from 'swr';
import ReactMapGL, {Marker, Layer, Source, Popup, FlyToInterpolator} from 'react-map-gl';
import {Header} from '../components';
import {SimpleGrid, Box, Skeleton, Button, Select,  Stat,
    StatLabel,
    StatNumber,
    StatHelpText,} from '@chakra-ui/core';
import '../styles/app.css';
import {clusterLayer, clusterCountLayer, unclusteredPointLayer} from '../layers/layers';

const fetcher = (...args) => fetch(...args).then(response => response.json());

export default function AppClusterData() {

    const BASEID = process.env.AIRTABLE_BASEID;
    const url_all = `https://api.airtable.com/v0/${BASEID}/allRecord?api_key=${process.env.AIRTABLE_API_KEY}`;
    const url_stats = `https://api.airtable.com/v0/${BASEID}/Kabupaten?api_key=${process.env.AIRTABLE_API_KEY}`;
    const { data : allRecord, error } = useSWR(url_all,fetcher);
    const { data : regencyStat, error : regencyError } = useSWR(url_stats,fetcher);
    
    const samples = allRecord && !error
        ? allRecord
            .records
            .slice(0, 100)
        : [];
    
    const regency = regencyStat && !error?
    regencyStat.records.slice(0,100) : [];

    console.log(regency);

    //console.log('samples', samples);

    const [viewport,
        setViewport] = useState({latitude: -5.26601, longitude: 110.25879, zoom: 6, width: '100vw', height: '100vh'});
    
    const [selectedDistrict,
        setSelectedDistrict] = useState(null);
    
    const mapRef = useRef();

    const _selectDisease = e =>{
        e.preventDefault();
        _updateDiseaseType(e.target.value)
    }

    

    let diseaseType = samples;

    const onClick = e => {
        const feature = e.features[0];
    const clusterId = feature.properties.id;

    const mapboxSource = mapRef.current.getSource();

    mapboxSource.getClusterExpansionZoom(clusterId, (err, zoom) => {
      if (err) {
        return;
      }
      this._onViewportChange({
        ...this.state.viewport,
        longitude: feature.geometry.coordinates[0],
        latitude: feature.geometry.coordinates[1],
        zoom,
        transitionDuration: 500
      });

    });
}

    const _updateDiseaseType = (disease) => {
        diseaseType = samples.filter(e => {
            if (disease === 'allSample') 
                return samples;
            if (disease === 'allActive') {
                return e.fields.Status > 0;
            } else {
                return e.fields.Status > 0 && e.fields.Penyakit === disease;
            }

        })
        console.log(`disease Update ${disease} `, diseaseType);
        setTitik(titik = {
            type: "FeatureCollection",
            nama: disease,
            features: diseaseType.map((point = {}) => {
                const lat = point.fields.Lat;
                const lng = point.fields.Long;
                return{
                    type: 'Feature',
              properties: {
                ...point,
                cluster: false
              },
              geometry: {
                type: 'Point',
                coordinates: [lng, lat]
              }
                }
            },
            )});

    }

    let [titik,
        setTitik] = useState({
        type: "FeatureCollection",
        features: samples.map((point = {}) => {
            const lat = point.fields.Lat;
            const lng = point.fields.Long;
            return {
                type: 'Feature',
                properties: {
                    ...point,
                    cluster: false
                },
                geometry: {
                    type: 'Point',
                    coordinates: [lng, lat]
                }
            }
        })
    });



    

    let points = {
        type: "FeatureCollection",
        features: diseaseType.map((point = {}) => {
            const lat = point.fields.Lat;
            const lng = point.fields.Long;
            return {
                type: 'Feature',
                properties: {
                    ...point
                },
                geometry: {
                    type: 'Point',
                    coordinates: [lng, lat]
                }
            }
        })
    };

    

    //console.log('c ', clusters);
    //console.log('points ', points);

    if (error) 
        return <div>Unable to get the data</div>
    if (!allRecord) {
        return <div><Skeleton height='100vh'/></div>
    }

       console.log(`titik`, titik);

       console.log('cluster', [clusterLayer]);

    return (
        <div>
            <Header/>
            <SimpleGrid columns={2}>
                <Box bg="white" height="100%">
                <Select size="md" onChange={_selectDisease}>
                    <option value='allSample'>Semua Sampel</option>
                    <option value='allActive'>Semua Positif</option>
                    <option value='AHPND'>AHPND</option>
                    <option value='EHP'>EHP</option>
                    <option value='IMNV'>IMNV</option>
                    <option value='WSSV'>WSSV</option>
                </Select>
                <Stat>
    <StatLabel>{titik.nama ? titik.nama : 'Pilih data'}</StatLabel>
  <StatNumber>{titik.features.length}</StatNumber>
  <StatHelpText>Feb 12 - Feb 28</StatHelpText>
</Stat>
                </Box>
                <Box bg="white" height="100%">
                    <ReactMapGL
                        {...viewport}
                        mapboxApiAccessToken={process.env.REACT_APP_MAPBOX_TOKEN}
                        onViewportChange={(viewport) => {
                        setViewport(viewport)
                    }}
                    interactiveLayerIds={[clusterLayer.id]}
                        ref={mapRef}
                        >
                            <Source
          type="geojson"
          data= {titik}
          cluster={true}
          clusterMaxZoom={14}
          clusterRadius={50}
          ref={mapRef}
        >
          <Layer {...clusterLayer} />
          <Layer {...clusterCountLayer} />
          <Layer {...unclusteredPointLayer} />
        </Source>

                        </ReactMapGL>
                </Box>
            </SimpleGrid>
        </div>
    )
}
