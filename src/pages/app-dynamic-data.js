import React, {
    useState,
    useRef,
    useEffect,
    createContext,
    useContext,
    createRef
} from 'react';
import useSWR, {SWRConfig} from "swr";
import ReactMapGL, {Marker, Layer, Source, Popup, FlyToInterpolator} from 'react-map-gl';
import {Header} from '../components';
import {
    SimpleGrid,
    Box,
    Skeleton,
    useToast,
    Button,
    Select,
    Heading,
    Flex
} from '@chakra-ui/core';
import '../styles/app.css';
import {clusterLayer, clusterCountLayer, unclusteredPointLayer} from '../layers/layers';
import DatePicker from "react-datepicker";
import {formatISO, isAfter} from 'date-fns';

import "react-datepicker/dist/react-datepicker.css";

//


export default function AppDynamicData() {
    
    return (
        <div>
            <Header/>
            
            <DiseaseProvider>
                <AppContent/>
            </DiseaseProvider>
        </div>
    )
}

function AppContent() {
    return (
        <div>
            <SWRConfig value={{
                fetcher
            }}>
                <SimpleGrid columns={2}>
                    <Box bg="white" height="100%">
                        <DiseaseData/>
                    </Box>
                    <Box bg="white" height="100%"></Box>
                </SimpleGrid>
            </SWRConfig>

        </div>
    )
}

const DiseaseContext = createContext();

function DiseaseProvider({children}) {
    const [startDate, setStartDate] = useState(new Date());
    const [disease,
        setDisease] = useState("Semua Sampel");
    const [district, setDistrict] = useState("Semua");
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
const url = `https://api.airtable.com/v0/appr1brQDGlqRbIOB/allRecord?api_key=${process.env.AIRTABLE_API_KEY}`;



function DiseaseData() {
    const {toast} = useContext(DiseaseContext);

    const {data, error} = useSWR(url);
    if (error) 
        return <div>{toast({title: "An error occurred.", description: "Unable to get the data.", status: "error", duration: 9000, isClosable: true})}</div>
    if (!data) {
        return <div><Skeleton height='100vh'/></div>
    }
    
    return (
        <div>
            <DiseasePicker kecamatan={[...new Set(data.records.map(d => d.fields.Kecamatan).sort())]} />
            <FilterData data={data} />
        </div>
    )
}

function DistrictPicker({kecamatan}){
    console.log('data kecamatan',kecamatan);
    return (
        <div>
            
        </div>
    )
}

function FilterData(data) {
    const {disease, district, startDate} = useContext(DiseaseContext);
    
    const tanggal = formatISO(startDate, { representation: 'date' });

    const samples = data.data.records;
    // console.log(`samples `, isValid(new Date(samples[0].fields.Tanggal)));
    const tanggalA = new Date(samples[0].fields.Tanggal);

    const diseaseData = samples.filter(d => {
        if (disease === "Semua Sampel" && district === "Semua"){
          return data && isAfter(startDate, new Date(d.fields.Tanggal));
        }
        if (disease === "Semua Sampel" && d.fields.Kecamatan === district){
            return data && d.fields.Kecamatan === district && isAfter(startDate, new Date(d.fields.Tanggal));
        }
        if (disease === "Semua Positif" && district === "Semua" ) 
            return d.fields.Status > 0 && isAfter(startDate, new Date(d.fields.Tanggal));
        if (disease === "Semua Positif" && d.fields.Kecamatan === district ) 
            return d.fields.Status > 0 && d.fields.Kecamatan === district && isAfter(startDate, new Date(d.fields.Tanggal));
        if (disease === disease && district === "Semua" ) 
            return d.fields.Status > 0 && d.fields.Penyakit === disease && isAfter(startDate, new Date(d.fields.Tanggal));
        else {
            return d.fields.Status > 0 && d.fields.Penyakit === disease && d.fields.Kecamatan === district && isAfter(startDate, new Date(d.fields.Tanggal));
        }
    })

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
                <DisplayMap points={points}/> 
            </div>
        )
}

function DisplayMap({points}) {
    const [viewport,
        setViewport] = useState({latitude: -5.26601, longitude: 110.25879, zoom: 6, width: '100vw', height: '100vh'});
        const sourceRef = createRef();
        const {toast} = useContext(DiseaseContext);
        

    return (<div><ReactMapGL
        {...viewport}
        mapboxApiAccessToken={process.env.REACT_APP_MAPBOX_TOKEN}
        onViewportChange={(viewport) => {
        setViewport(viewport)
    }}
        interactiveLayerIds={[clusterLayer.id, unclusteredPointLayer.id]}
        onClick={(e) => {
        console.log('event', e)
        const feature = e.features[0];
        if (!feature.properties.cluster_id) {
            const fields = feature.properties.fields;
            console.log("not a cluster ", fields);
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
    }}>
        <Source
            type="geojson"
            data={points}
            cluster={true}
            clusterMaxZoom={20}
            clusterRadius={50}
            ref={sourceRef}>
            <Layer {...clusterLayer}/>
            <Layer {...clusterCountLayer}/>
            <Layer {...unclusteredPointLayer}/>
        </Source>

    </ReactMapGL>
    {
    !points.features[0] && (
        <div>
        {toast({title: "Data tidak ditemukan.", description: "Tidak ada data untuk pilihan tanggal tersebut.", status: "warning", duration: 9000, isClosable: true})}
    </div>
    )
}
    </div>
        
    )
}

function DiseasePicker({kecamatan}) {
    const {disease, setDisease, district, setDistrict, startDate, setStartDate} = useContext(DiseaseContext);
    
    return (
        <SimpleGrid columns={3}>
            <Box>
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
            <Box>
            <Select
                    size="md"
                    value={district}
                    onChange={(e) => {
                    setDistrict(e.target.value)
                }}>
                    <option value='Semua'>Semua</option>
                    {kecamatan.map(d => <option value={d} key={d}>{d}</option> )}
                </Select>
            </Box>
            <Box>
            <DatePicker
            closeOnScroll={true}
      selected={startDate}
      onChange={date => setStartDate(date)}
    />
            </Box>
        </SimpleGrid>

    )

}
