import React, {useState, useRef } from 'react'
import { graphql, useStaticQuery } from 'gatsby'
import ReactMapGL, { Marker, Layer, Source, Popup } from 'react-map-gl'
import { Header } from '../components'
import { SimpleGrid, Box } from '@chakra-ui/core'
import useSupercluster from 'use-supercluster'
import '../styles/app.css'

export const data = graphql `
query appCluster {
  allSamples: allAirtable(filter: {table: {eq: "testData"}}) {
    nodes {
      data {
        AHPND_p
        AHPND_s
        EHP_p
        EHP_s
        IMNV_p
        IMNV_s
        Total_p
        Total_s
        WSSV_p
        WSSV_s
        district
        Lat
        Long
      }
      id
    }
  }
  allPositive: allAirtable(filter: {data: {Total_p: {gt: 0}}table: {eq: "testData"}}) {
    nodes {
      data {
        AHPND_p
        AHPND_s
        EHP_p
        EHP_s
        IMNV_p
        IMNV_s
        Total_p
        Total_s
        WSSV_p
        WSSV_s
        district
        Lat
        Long
      }
      id
    }
  }
  allRecord: allAirtable(filter: {data: {Status: {gt:0}}table: {eq: "allRecord"}}) {
    nodes {
      data {
        Provinsi
        Kabupaten
        Kecamatan
        Penyakit
        Status
        Lat
        Long
      }
      id
    }
  }
}
`

/*const geojson = {
        type: 'FeatureCollection',
        features: data.allAirtable.nodes.map((node)=>{
            const lat = node.data.Lat;
            const lng = node.data.Long;
            //console.log('lat and long $lat $lng', lat, lng);
            return{
                type: 'Feature',
              properties: {
                ...node,
              },
              geometry: {
                type: 'Point',
                coordinates: [lng, lat]
              }
            }
        })
      };

      console.log(geojson);*/

export default function AppPage({data, dataGoogle}) {
    const [viewport,
        setViewport] = useState({latitude: -5.26601, longitude: 110.25879, zoom: 5, width: '100vw', height: '100vh'});

    const [selectedDistrict,
        setSelectedDistrict] = useState(null);

    const mapRef = useRef();

    const res = data.allRecord;
    
 


    const points = res.nodes.map(node => ({
        "type": "Feature",
    "properties": {
      "cluster": false,
      "sampleId": node.id,
      "category": node.data.Penyakit
    },
    "geometry": { "type": "Point", "coordinates": [node.data.Long, node.data.Lat] }
    }));


    const bounds = mapRef.current ? mapRef.current.getMap().getBounds().toArray().flat() : null;

    const { clusters, supercluster } = useSupercluster({
        points,
        bounds,
        zoom: viewport.zoom,
        options: { radius: 75, maxZoom: 20 }
      });

    //console.log('c ', clusters);
    console.log('points ', points);

    res.nodes.map((node)=>{
        console.log('cluster ', node);
    })
    


    return (
        <div>
        <Header />
        <SimpleGrid columns={2}>
  <Box bg="white" height="100%">
  {
        data
            .allSamples
            .nodes
            .map((node) => {
                return (
                    <div key={node.id}>
                        <h2>{node.data.district}</h2>
                        <p>Total sampel {node.data.Total_s}</p>
                        <p>AHPND : {node.data.AHPND_p}</p>
                        <p>EHP : {node.data.EHP_p}</p>
                <p>IMNV : {node.data.IMNV_p}</p>
                <p>WSSV : {node.data.WSSV_p}</p>
                        <br></br>

                    </div>

                )
            })
    }
  </Box>
  <Box bg="white" height="100%">
  <ReactMapGL
                {...viewport}
                mapboxApiAccessToken={process.env.REACT_APP_MAPBOX_TOKEN}
                onViewportChange={(viewport) => {
                setViewport(viewport) 
            }} ref={mapRef}>
                {clusters
                    .map(cluster => {
                        const [longitude, latitude] = cluster.geometry.coordinates;
                        const {cluster:isCluster, point_count: pointCount} = cluster.properties;

                        if (isCluster){
                            return(
                                <Marker
                                key={cluster.id}
                                latitude={latitude}
                                longitude={longitude}>
                                <div
                                    className="cluster-marker"
                                    onClick={(e) => {
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
                                    onClick={(e) => {
                                    e.preventDefault();
                                    setSelectedDistrict(cluster)
                                }}>
                                    {/*<span className="icon-marker">{node.data.Total_p}
                                    </span>*/}
                                </div>
                            </Marker>

                        )

                    })}

                {selectedDistrict
                    ? (
                        <div>
                            <Popup
                                latitude={selectedDistrict.data.Lat}
                                longitude={selectedDistrict.data.Long}
                                onClose={() => {
                                setSelectedDistrict(null);
                            }}>
                                <div>
                                    <h1>{selectedDistrict.data.district}</h1>
                                    <p>Total sampel: {selectedDistrict.data.Total_s}</p>
                                    <p>AHPND: {selectedDistrict.data.AHPND_p}</p>
                                    <p>EHP: {selectedDistrict.data.EHP_p}</p>
                                    <p>IMNV: {selectedDistrict.data.IMNV_p}</p>
                                    <p>WSSV: {selectedDistrict.data.WSSV_p}</p>
                                </div>
                            </Popup>
                        </div>
                    )
                    : null}

                {selectedDistrict
                    ? (
                        <div className="control-panel">
                            <h1>{selectedDistrict.data.district}</h1>
                            <p>Total sampel: {selectedDistrict.data.Total_s}</p>
                            <p>AHPND: {selectedDistrict.data.AHPND_p}</p>
                            <p>EHP: {selectedDistrict.data.EHP_p}</p>
                            <p>IMNV: {selectedDistrict.data.IMNV_p}</p>
                            <p>WSSV: {selectedDistrict.data.WSSV_p}</p>
                        </div>
                    )
                    : null}

            </ReactMapGL>
  </Box>
</SimpleGrid>
      </div >)
}
