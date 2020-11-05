import React, {
  useState,
  useRef,
  createContext,
  useContext,
} from 'react';
import useSWR, {SWRConfig} from "swr";
import ReactMapGL, {Layer, Source, NavigationControl} from 'react-map-gl';
import {Header} from '../components';
import {
  SimpleGrid,
  Box,
  Skeleton,
  useToast,
  Button,
  Select,
  Heading,
  Flex,
  Stat,
StatLabel,
StatNumber,
StatHelpText,
StatGroup,
Spinner,
Divider
} from '@chakra-ui/core';
import '../styles/app.css';
import {clusterLayer, clusterCountLayer, unclusteredPointLayer} from '../layers/layers';
import DatePicker from "react-datepicker";
import {isAfter} from 'date-fns';
import Sidepanel from '../components/Sidepanel';
import {graphql, useStaticQuery} from 'gatsby';
 

import style from "react-datepicker/dist/react-datepicker.css";



export default function AppDynamicData() {
  return (
      <div>
          {/* <Header/> */}

          <DiseaseProvider>
              <AppContent/>
          </DiseaseProvider>
      </div>
  )
}

function AppContent() {
  return (
      <div>
          <SWRConfig
              value={{
              fetcher,
              revalidateOnFocus: false
          }}>
<DiseaseData/>     
          </SWRConfig>

      </div>
  )
}

export const DiseaseContext = createContext();

export function DiseaseProvider({children}) {
  const [startDate,
      setStartDate] = useState(new Date());
  const [disease,
      setDisease] = useState("Semua Sampel");
  const [district,
      setDistrict] = useState("Semua");
  const toast = useToast();

  const [selectedDistrict,
      setSelectedDistrict] = useState(null);

  return (
      <DiseaseContext.Provider
          value={{
          disease,
          setDisease,
          district,
          setDistrict,
          startDate,
          setStartDate,
          toast
      }}>
          {children}
      </DiseaseContext.Provider>
  )
}

const fetcher = (...args) => fetch(...args).then(response => response.json());



function DiseaseData() {
  const airtableApi = useStaticQuery(graphql`
  query airtableApi {
    airtable: site {
      siteMetadata {
        airtableApi
        airtableBase
        mapboxApi
      }
    }
  }`);
  console.log('airtable api', airtableApi);
  console.log('airtable base', airtableApi.airtable.siteMetadata.airtableBase);

  const url = `https://api.airtable.com/v0/${airtableApi.airtable.siteMetadata.airtableBase}/allRecord?api_key=${airtableApi.airtable.siteMetadata.airtableApi}`;
  const {toast} = useContext(DiseaseContext);

  const {data, error} = useSWR(url);
  if (error) 
      return <div>{toast({title: "An error occurred.", description: "Unable to get the data.", status: "error", duration: 9000, isClosable: true})}</div>
  if (!data) {
      return <div><Flex align="center" justify="center"><Spinner
      thickness="4px"
      speed="0.65s"
      emptyColor="gray.200"
      color="blue.500"
      size="xl"
    /></Flex></div>
  }

  return (
      <div>
          <FilterData data={data}/>
      </div>
  )
}

function FilterData(data) {
  const {disease, district, startDate} = useContext(DiseaseContext);
  console.log('distrik', district);

  const samples = data.data.records;

  const diseaseData = samples.filter(d => {
      if (disease === "Semua Sampel" && district === "Semua") {
          return data && isAfter(startDate, new Date(d.fields.Tanggal));
      }
      if (disease === "Semua Sampel" && d.fields.Kecamatan === district) {
          return data && d.fields.Kecamatan === district && isAfter(startDate, new Date(d.fields.Tanggal));
      }
      if (disease === "Semua Positif" && district === "Semua") 
          return d.fields.Status > 0 && isAfter(startDate, new Date(d.fields.Tanggal));
      if (disease === "Semua Positif" && d.fields.Kecamatan === district) 
          return d.fields.Status > 0 && d.fields.Kecamatan === district && isAfter(startDate, new Date(d.fields.Tanggal));
      if (disease === disease && district === "Semua") 
          return d.fields.Status > 0 && d.fields.Penyakit === disease && isAfter(startDate, new Date(d.fields.Tanggal));
      else {
          return d.fields.Status > 0 && d.fields.Penyakit === disease && d.fields.Kecamatan === district && isAfter(startDate, new Date(d.fields.Tanggal));
      }
  });

  const points = {
    type: "FeatureCollection",
    features: diseaseData.map((point = {}) => {
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

console.log('points', points);

  return (
      <div>
        <Flex bg="white">
<Box bg="white" w="360px"><Sidepanel points={points} /></Box>
              <Box bg="white" flex="1" height="100%">
              <DisplayMap points={points} samples={samples} />
                  </Box>
</Flex>
          
      </div>
  )
}

function DisplayMap({points, samples}) {
  const [viewport,
      setViewport] = useState({
      latitude: -5.26601,
      longitude: 110.25879,
      zoom: 6,
      height: "100vh",
      bearing: 0,
      pitch: 0
  });

  const {toast} = useContext(DiseaseContext);
  const sourceRef = useRef();

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

  function _onViewportChange(viewport) {
      setViewport(viewport);
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

  console.log('titik peta', points);

  return (
      <div id="map" >
          <ReactMapGL {...viewport} width="100%" height="100%" mapboxApiAccessToken={process.env.REACT_APP_MAPBOX_TOKEN} onViewportChange={(viewport) => {
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

// function DiseaseTracker({points}) {
//   const {disease, district} = useContext(DiseaseContext);

//   let kec = "";
//   let kab ="";
//   let prov = "";

//   let tracker = {};

//   if (!points.features[0]) {
//       console.log('titik tracker 1', points);
//   } else {
//       console.log('titik tracker 2', points.features);
//       tracker = {
//           total_s: points.features.length,
//           total_p: points
//               .features
//               .filter(d => {
//                   return d.properties.fields.Status === 1
//               }),
//           AHPND_p: points
//               .features
//               .filter(d => {
//                   return d.properties.fields.Penyakit === "AHPND" && d.properties.fields.Status === 1
//               }),
//           AHPND_s: points
//               .features
//               .filter(d => {
//                   return d.properties.fields.Penyakit === "AHPND"
//               }),
//           EHP_p: points
//               .features
//               .filter(d => {
//                   return d.properties.fields.Penyakit === "EHP" && d.properties.fields.Status === 1
//               }),
//           EHP_s: points
//               .features
//               .filter(d => {
//                   return d.properties.fields.Penyakit === "EHP"
//               }),
//           IMNV_p: points
//               .features
//               .filter(d => {
//                   return d.properties.fields.Penyakit === "IMNV" && d.properties.fields.Status === 1
//               }),
//           IMNV_s: points
//               .features
//               .filter(d => {
//                   return d.properties.fields.Penyakit === "IMNV"
//               }),
//           WSSV_p: points
//               .features
//               .filter(d => {
//                   return d.properties.fields.Penyakit === "WSSV" && d.properties.fields.Status === 1
//               }),
//           WSSV_s: points
//               .features
//               .filter(d => {
//                   return d.properties.fields.Penyakit === "WSSV"
//               })
//       }
  
//       console.log('statistik ', tracker);
  
//       kec = points.features[0].properties.fields.Kecamatan;
//       kab = points.features[0].properties.fields.Kabupaten;
//       prov = points.features[0].properties.fields.Provinsi;
//   }

//   let location = "";

//   if(district === "Semua"){
//       location = "Indonesia";
//   }
//   else{
//       location = `${prov}, ${kab}, ${kec}`;
//   }

  

//   return (
//       <div>
//           <SimpleGrid className="tracker-panel">
//               <Heading as="h1" size="md">Disease Tracker</Heading>
              
//               {points.features[0] && <div>
//                   <Heading as="h5" size="sm" mb={2}>{location}</Heading>
//               <StatGroup>
//                   <Stat>
//                       <StatLabel>Total</StatLabel>
//                       <StatNumber>{tracker.total_p.length}</StatNumber>
//                       <StatHelpText>
//                           dari {tracker.total_s} sampel
//                       </StatHelpText>
//                       <StatHelpText>
//                           {((tracker.total_p.length / tracker.total_s)*100).toFixed(2)}% Positive rate
//                       </StatHelpText>
//                   </Stat>
//                   <Stat>
//                       <StatLabel>AHPND</StatLabel>
//                       <StatNumber>{tracker.AHPND_p.length}</StatNumber>
//                       <StatHelpText>
//                           dari {tracker.AHPND_s.length} sampel
//                       </StatHelpText>
//                       <StatHelpText>
//                           {((tracker.total_p.length / tracker.total_s)*100).toFixed(2)}% Positive rate
//                       </StatHelpText>
//                   </Stat>
//                   <Stat>
//                       <StatLabel>EHP</StatLabel>
//                       <StatNumber>{tracker.EHP_p.length}</StatNumber>
//                       <StatHelpText>
//                           dari {tracker.EHP_s.length} sampel
//                       </StatHelpText>
//                       <StatHelpText>
//                           {((tracker.EHP_p.length / tracker.EHP_s.length)*100).toFixed(2)}% Positive rate
//                       </StatHelpText>
//                   </Stat>
//                   <Stat>
//                       <StatLabel>IMNV</StatLabel>
//                       <StatNumber>{tracker.IMNV_p.length}</StatNumber>
//                       <StatHelpText>
//                           dari {tracker.IMNV_s.length} sampel
//                       </StatHelpText>
//                       <StatHelpText>
//                           {((tracker.IMNV_p.length / tracker.IMNV_s.length)*100).toFixed(2)}% Positive rate
//                       </StatHelpText>
//                   </Stat>
//                   <Stat>
//                       <StatLabel>WSSV</StatLabel>
//                       <StatNumber>{tracker.WSSV_p.length}</StatNumber>
//                       <StatHelpText>
//                           dari {tracker.WSSV_s.length} sampel
//                       </StatHelpText>
//                       <StatHelpText>
//                           {((tracker.WSSV_p.length / tracker.WSSV_s.length)*100).toFixed(2)}% Positive rate
//                       </StatHelpText>
//                   </Stat>
//               </StatGroup></div>}
//               {!points.features[0] && <Heading as="h5" size="sm" mb={2}>Tidak ada data penyakit {disease} di daerah {district} 😞</Heading>}
//           </SimpleGrid>
//       </div>
//   );

// }


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
