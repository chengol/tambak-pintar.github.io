import React, {useState, createContext, useContext} from 'react';
import useSWR, {SWRConfig} from "swr";
import {Header} from '../components';
import {
    Box,
    useToast,
    Flex,
    Spinner,
    Heading
} from '@chakra-ui/core';
import '../styles/app.css';
import {isAfter} from 'date-fns';
import Sidepanel from '../components/Sidepanel';
import {graphql, useStaticQuery} from 'gatsby';
import Peta from '../components/Peta';
import Peta2 from '../components/Peta2';
import Bottompanel from '../components/Bottompanel';

export default function AppDynamicData() {
    return (
        <div>

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
    const airtableApi = useStaticQuery(graphql `
  query airtableApi {
    airtable: site {
      siteMetadata {
        airtableApi
        airtableBase
        mapboxApi
      }
    }
  }`);
    // console.log('airtable api', airtableApi); console.log('airtable base',
    // airtableApi.airtable.siteMetadata.airtableBase);

    const url = `https://api.airtable.com/v0/${airtableApi.airtable.siteMetadata.airtableBase}/allRecord?api_key=${airtableApi.airtable.siteMetadata.airtableApi}`;
    const {toast} = useContext(DiseaseContext);

    const {data, error} = useSWR(url);
    if (error) 
        return <div>{toast({title: "An error occurred.", description: "Unable to get the data.", status: "error", duration: 9000, isClosable: true})}</div>
    if (!data) {
        return (
            <Flex  style={{top:"50%",left:"50%",width: "100%",
  height: "100%", position:"fixed" }}>
                <Spinner 
                thickness="4px"
                speed="0.65s"
                emptyColor="gray.200"
                color="blue.500"
                size="xl"/></Flex>
        )
            
    }

    return (
        <div>
            <FilterData data={data}/>
        </div>
    )
}

function FilterData(data) {
    const {disease, district, startDate} = useContext(DiseaseContext);
    // console.log('distrik', district);

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

    // console.log('points', points);

    return (
        <div>
            <Flex wrap="wrap">
                <Box
                    w="360px"
                    display={{
                    xs: "none",
                    sm: "none",
                    md: "none",
                    lg: "block"
                }}><Sidepanel points={points}/></Box>
                <Box flex="1">
                    <Peta points={points} samples={samples}/>
                </Box>
            </Flex>
            <Box id="headbottom"
                display={{
                xs: "block",
                sm: "block",
                md: "block",
                lg: "none"
            }}><Bottompanel points={points}/></Box>

        </div>
    )
}
