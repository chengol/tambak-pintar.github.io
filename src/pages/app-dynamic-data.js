import React, {useState, useRef, useEffect} from 'react';
import {graphql, useStaticQuery} from 'gatsby';
import useSwr from "swr";
import ReactMapGL, {Marker, Layer, Source, Popup, FlyToInterpolator} from 'react-map-gl';
import {Header} from '../components';
import {SimpleGrid, Box} from '@chakra-ui/core';
import useSupercluster from 'use-supercluster';
import '../styles/app.css';

const fetcher = (...args) => fetch(...args).then(response => response.json());

export default function AppDynamicData() {

    const state = {
        loading: true,
        error: false,
        fecthedData: []
    }

    const url = `https://api.airtable.com/v0/appr1brQDGlqRbIOB/allRecord?api_key=${process.env.AIRTABLE_API_KEY}`;
    const {data, error} = useSwr(url, fetcher);
    console.log('data', data);
    const samples = data && !error
        ? data
            .records
            .slice(0, 100)
        : [];
    console.log('all disease', samples);

    const [viewport,
        setViewport] = useState({latitude: -5.26601, longitude: 110.25879, zoom: 6, width: '100vw', height: '100vh'});

    const [selectedDistrict,
        setSelectedDistrict] = useState(null);

    const mapRef = useRef();

    const activeDisease = samples.filter(e => {
        return e.fields.Status > 0;
    })

    console.log('active disease', activeDisease);

    const points = samples.map(node => ({

        "type": "Feature",
        "properties": {
            "cluster": false,
            "sampleId": node.id,
            "category": node.fields.Penyakit
        },
        "geometry": {
            "type": "Point",
            "coordinates": [node.fields.Long, node.fields.Lat]
        }
    }));

    const bounds = mapRef.current
        ? mapRef
            .current
            .getMap()
            .getBounds()
            .toArray()
            .flat()
        : null;

    const {clusters, supercluster} = useSupercluster({
        points,
        bounds,
        zoom: viewport.zoom,
        options: {
            radius: 50,
            maxZoom: 20
        }
    });

    console.log('c ', clusters);
    console.log('points ', points);

    // disease.map((node)=>{     console.log('cluster ', node); })

    return (
        <div>
            <Header/>
            <SimpleGrid columns={2}>
                <Box bg="white" height="100%"></Box>
                <Box bg="white" height="100%">
                    <ReactMapGL
                        {...viewport}
                        mapboxApiAccessToken={process.env.REACT_APP_MAPBOX_TOKEN}
                        onViewportChange={(viewport) => {
                        setViewport(viewport)
                    }}
                        ref={mapRef}>
                        {clusters.map(cluster => {
                            const [longitude,
                                latitude] = cluster.geometry.coordinates;
                            const {cluster: isCluster, point_count: pointCount} = cluster.properties;

                            if (isCluster) {
                                return (
                                    <Marker key={cluster.id} latitude={latitude} longitude={longitude}>
                                        <div
                                            className="cluster-marker"
                                            style={{
                                            width: `${ 10 + (pointCount / points.length) * 100}px`,
                                            height: `${ 10 + (pointCount / points.length) * 100}px`
                                        }}
                                            onClick={(e) => {
                                            const expansionZoom = Math.min(supercluster.getClusterExpansionZoom(cluster.id), 10);
                                            setViewport({
                                                ...viewport,
                                                latitude,
                                                longitude,
                                                zoom: expansionZoom,
                                                transitionInterpolator : new FlyToInterpolator({ speed: 2}),
                                                transtionDuration: 'auto'
                                            });
                                            e.preventDefault();
                                            setSelectedDistrict(cluster)
                                        }}>{pointCount}</div>
                                    </Marker>
                                )
                            }
                            return (
                                <Marker
                                    key={cluster.properties.sampleId}
                                    latitude={latitude}
                                    longitude={longitude}>
                                    <div
                                        className="cluster-marker"
                                        style={{
                                        width: `${ 10 * (pointCount / points.length) * 10}px`,
                                        height: `${ 10 * (pointCount / points.length) * 10}px`
                                    }}
                                        onClick={(e) => {
                                        e.preventDefault();
                                        setSelectedDistrict(cluster)
                                    }}></div>
                                </Marker>
                            )
                        })}
                    </ReactMapGL>
                </Box>
            </SimpleGrid>
        </div>
    )
}
