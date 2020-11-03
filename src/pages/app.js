import React, {useState} from 'react'
import { graphql, useStaticQuery } from 'gatsby'
import ReactMapGL, {Marker, Layer, Source, Popup} from 'react-map-gl'
import {Header} from '../components'
import '../styles/app.css'
import '../styles/tailwind.css'

export const data = graphql`
query MyQuery {
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
  allRecord: allAirtable(filter: {table: {eq: "allRecord"}}) {
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



/*const virusLayer = {
    id: 'heatmap',
    type: 'heatmap',
    source: 'geojson',
  paint: {
    // increase weight as diameter breast height increases
    'heatmap-weight': {
      property: 'dbh',
      type: 'exponential',
      stops: [
        [1, 0],
        [62, 1]
      ]
    },
    // increase intensity as zoom level increases
    'heatmap-intensity': {
      stops: [
        [11, 1],
        [15, 3]
      ]
    },
    // assign color values be applied to points depending on their density
    'heatmap-color': [
      'interpolate',
      ['linear'],
      ['heatmap-density'],
      0, 'rgba(236,222,239,0)',
      0.2, 'rgb(208,209,230)',
      0.4, 'rgb(166,189,219)',
      0.6, 'rgb(103,169,207)',
      0.8, 'rgb(28,144,153)'
    ],
    // increase radius as zoom increases
    'heatmap-radius': {
      stops: [
        [11, 15],
        [15, 20]
      ]
    },
    // decrease opacity to transition into the circle layer
    'heatmap-opacity': {
      default: 1,
      stops: [
        [14, 1],
        [15, 0]
      ]
    },
  }

}*/

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
    const [viewport, setViewport] = useState({
        latitude: -5.26601,
        longitude: 110.25879,
        zoom: 5,
        width: '100vw',
        height: '100vh'
    });

    const [selectedDistrict, setSelectedDistrict] = useState(null);

    return (
        <div>
          <Header />
            <ReactMapGL {...viewport} 
            mapboxApiAccessToken={process.env.REACT_APP_MAPBOX_TOKEN}
            onViewportChange={(viewport)=> {setViewport(viewport)}}
            onHover={(e)=>{console.log('hover', e)}}>
              {data.allPositive.nodes.map((node) => {
                    return(
                      
                      <Marker key={node.data.district} latitude={node.data.Lat}
                      longitude={node.data.Long}>
                          <div className="marker-btn" onClick={(e)=> {
                            e.preventDefault();
                            setSelectedDistrict(node)
                          }
                          }>
                            <span className="icon-marker">{node.data.Total_p}
                            </span>
                            </div>
                      </Marker>
                      
                    )
                    
                })}

                {selectedDistrict ? (
                  <div>
                    <Popup latitude={selectedDistrict.data.Lat} longitude={selectedDistrict.data.Long}
                  onClose={()=>{
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
                  ) : null}

{selectedDistrict ? (
                  <div className="control-panel">
                  <h1>{selectedDistrict.data.district}</h1>
                        <p>Total sampel: {selectedDistrict.data.Total_s}</p>
                        <p>AHPND: {selectedDistrict.data.AHPND_p}</p>
                        <p>EHP: {selectedDistrict.data.EHP_p}</p>
                        <p>IMNV: {selectedDistrict.data.IMNV_p}</p>
                        <p>WSSV: {selectedDistrict.data.WSSV_p}</p>
                        </div>
                  ) : null}
                
            </ReactMapGL>
            <ol>
                {data.allSamples.nodes.map((node) => {
                    return(
                        <div key={node.id}>
                            <p>{node.id}</p>
                        <h2>{node.data.district}</h2>
                        <p>AHPND positif{node.data.AHPND_p}</p>
                        <p>AHPND sampel{node.data.AHPND_s}</p>
                        <p>Lokasi</p>
                        <p>{node.data.Lat}</p>
                        <p>{node.data.Long}</p>
                        <br></br>

                        </div>
                        
                        
            
                    )
                })}
            </ol>
      </div>     
    )
}
