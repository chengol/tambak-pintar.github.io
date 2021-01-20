import React, {useState, createContext, useContext} from 'react';
import useSWR, {SWRConfig} from "swr";
// import {Header} from '../components';
import {
    Box,
    useToast,
    Flex,
    Spinner,
    Text,
    useColorMode,
    Button,
    ChakraProvider
    // Heading
} from '@chakra-ui/react';
import '../styles/app.css';
import {isAfter, isBefore, lightFormat} from 'date-fns';
import Sidepanel from '../components/Sidepanel';
import {graphql, useStaticQuery} from 'gatsby';
import Peta from '../components/Peta';
import PetaPin from '../components/PetaPin';
// import Peta2 from '../components/Peta2';
import Bottompanel from '../components/Bottompanel';
import {Helmet} from 'react-helmet';
import _ from 'lodash';

export default function AppDynamicData() {
    return (
        <div>
            <ChakraProvider>
            <DiseaseProvider>
                <AppContent/>
            </DiseaseProvider>
            </ChakraProvider>
        </div>
    )
}

function AppContent() {
    return (
        <div>
            <Helmet>
          <meta charSet="utf-8" />
          <title>Peta Persebaran Penyakit Udang | Tambak Pintar | Jala</title>
          <link rel="canonical" href="https://jala.tech" />
        </Helmet>
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
        setStartDate] = useState(new Date("2020/01/01"));
    const [endDate,
    setEndDate] = useState(new Date());
    const [disease,
        setDisease] = useState("Semua Positif");
    const [district,
        setDistrict] = useState("Semua");
    const toast = useToast();

    // const [selectedDistrict,
    //     setSelectedDistrict] = useState(null);

    return (
        <DiseaseContext.Provider
            value={{
            disease,
            setDisease,
            district,
            setDistrict,
            startDate,
            setStartDate,
            toast,
            endDate,
            setEndDate
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
        jalaAccessToken
      }
    }
  }`);
    // console.log('airtable api', airtableApi); console.log('airtable base',
    // airtableApi.airtable.siteMetadata.airtableBase);

    const url = `https://api.airtable.com/v0/${airtableApi.airtable.siteMetadata.airtableBase}/allRecord?api_key=${airtableApi.airtable.siteMetadata.airtableApi}&sort%5B0%5D%5Bfield%5D=Tanggal&sort%5B0%5D%5Bdirection%5D=asc`;
    const {toast} = useContext(DiseaseContext);

    // const {data, error} = useSWR(url);
    const response = useSWR("https://app.jala.tech/api/laboratories/1/cycle_diseases?per_page=1000&with=cycle.pond.farm.region,disease&cycle_id=1,6,8,11",
      (url) => fetcher(url, {
        headers: {
          'Authorization': `Bearer ${airtableApi.airtable.siteMetadata.jalaAccessToken}`,
          'Accept': 'application/json',
        }
      }))
    

    const data = {
      records: response.data ? response.data.data.map((datum) => ({
        id: datum.id,
        fields: {
          DoC: datum.age,
          Kabupaten: _.startCase(datum.cycle.pond.farm.region.regency_name.toLowerCase()),
          'Kabupaten 2': [datum.cycle.pond.farm.region.id],
          Kecamatan: _.startCase(datum.cycle.pond.farm.region.regency_name.toLowerCase()) + (datum.cycle.pond.farm.region.district_name ? `, ${_.startCase(datum.cycle.pond.farm.region.district_name.toLowerCase())}` : ''),
          Lat: parseFloat(datum.cycle.pond.farm.region.latitude),
          Long: parseFloat(datum.cycle.pond.farm.region.longitude),
          Penyakit: ((name) => {
            if (name === 'IMNV / Myo') return 'IMNV';
            if (name === 'WSS / WSD') return 'WSSV';
            if (name === 'EHP/HPM') return 'EHP';
            return name;
          })(datum.disease.short_name || datum.disease.full_name),
          Provinsi: _.startCase(datum.cycle.pond.farm.region.province_name.toLowerCase()),
          RecordID: datum.logged_at,
          Status: datum.positive === true ? 1 : 0,
          Tambak: datum.cycle.pond.farm.name,
          Tanggal: datum.logged_at.substr(0, 10)
        },
        createdTime: datum.created_at
      })) : []
    }
    if (response.error)
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
    const {disease, district, startDate, endDate} = useContext(DiseaseContext);
    // console.log('distrik', district);

    const samples = data.data.records;

    const diseaseData = samples.filter(d => {
        if (disease === "Semua Sampel" && district === "Semua") {
            return data && isAfter(endDate, new Date(d.fields.Tanggal)) && isBefore(startDate, new Date(d.fields.Tanggal));
        }
        if (disease === "Semua Sampel" && d.fields.Kecamatan === district) {
            return data && d.fields.Kecamatan === district && isAfter(endDate, new Date(d.fields.Tanggal)) && isBefore(startDate, new Date(d.fields.Tanggal));
        }
        if (disease === "Semua Positif" && district === "Semua") 
            return d.fields.Status !== 0 && isAfter(endDate, new Date(d.fields.Tanggal)) && isBefore(startDate, new Date(d.fields.Tanggal));
        if (disease === "Semua Positif" && d.fields.Kecamatan === district) 
            return d.fields.Status !== 0 && d.fields.Kecamatan === district && isAfter(endDate, new Date(d.fields.Tanggal)) && isBefore(startDate, new Date(d.fields.Tanggal));
        if (district === "Semua") 
            return d.fields.Status !== 0 && d.fields.Penyakit === disease && isAfter(endDate, new Date(d.fields.Tanggal)) && isBefore(startDate, new Date(d.fields.Tanggal));
        else {
            return d.fields.Status !== 0 && d.fields.Penyakit === disease && d.fields.Kecamatan === district && isAfter(endDate, new Date(d.fields.Tanggal)) && isBefore(startDate, new Date(d.fields.Tanggal));
        }
    });

    const samplesData = samples.filter(d => {
        if (disease === "Semua Sampel" && district === "Semua") {
            return data && isAfter(endDate, new Date(d.fields.Tanggal)) && isBefore(startDate, new Date(d.fields.Tanggal));
        }
        if (disease === "Semua Sampel" && d.fields.Kecamatan === district) {
            return data && d.fields.Kecamatan === district && isAfter(endDate, new Date(d.fields.Tanggal)) && isBefore(startDate, new Date(d.fields.Tanggal));
        }
        if (disease === "Semua Positif" && district === "Semua") 
            return isAfter(endDate, new Date(d.fields.Tanggal)) && isBefore(startDate, new Date(d.fields.Tanggal));
        if (disease === "Semua Positif" && d.fields.Kecamatan === district) 
            return  d.fields.Kecamatan === district && isAfter(endDate, new Date(d.fields.Tanggal)) && isBefore(startDate, new Date(d.fields.Tanggal));
        if (district === "Semua") 
            return  d.fields.Penyakit === disease && isAfter(endDate, new Date(d.fields.Tanggal)) && isBefore(startDate, new Date(d.fields.Tanggal));
        else {
            return d.fields.Penyakit === disease && d.fields.Kecamatan === district && isAfter(endDate, new Date(d.fields.Tanggal)) && isBefore(startDate, new Date(d.fields.Tanggal));
        }
    });

    console.log('sampel', samples);
    console.log('sampleData', samplesData);
    console.log('disease', disease, 'lokasi', district, 'diseaseData', diseaseData);

    const points = {
        type: "FeatureCollection",
        features: diseaseData.map((point = {}) => {
            const lat = point.fields.Lat;
            const lng = point.fields.Long;
            return {
                type: 'Feature',
                properties: {
                    cluster: false,
                    ...point
                },
                geometry: {
                    type: 'Point',
                    coordinates: [lng, lat]
                }
            }
        })
    };

    const pointsPeta = diseaseData.map((point = {}) => {
            const lat = point.fields.Lat;
            const lng = point.fields.Long;
            return {
                type: 'Feature',
                properties: {
                    cluster: false,
                    ...point
                },
                geometry: {
                    type: 'Point',
                    coordinates: [lng, lat]
                }
            }
        });

    // console.log('points', points);

    return (
        <div>
            <Flex wrap="wrap" id="wrap-sidepanel">
                <Box id="box-sidepanel"
                    w="360px"
                display={{
                    base: "none",
                sm: "none",
                md: "none",
                lg: "block" ,
                xl: "block" }}
                >
                <Sidepanel display={{
                base: "none",
                sm: "none",
                md: "none",
                lg: "block" ,
                xl: "block" }} id="sidepanel" points={points} samples={samplesData} />
                <LatestData samples={samples}/>
                </Box>
                <Box flex="1">
                    {/* <Peta points={points} samples={samples}/> */}
                    <PetaPin points={pointsPeta} samples={samples}/>
                </Box>
            </Flex>
            <Box id="headbottom"
            display={{ sm: "block", md: "block", lg: "none", xl: "none" }}
            >
                <Bottompanel points={points} samples={samplesData} display={{ sm: "block", md: "block", lg: "block", xl: "none" }}/></Box>

        </div>
    )
}

function LatestData({samples}){
    const latestData = samples[0];
    console.log('latest samples', latestData);
    const {colorMode} = useColorMode();
    return(
      <div>
        <Box className="latest-data" bg={colorMode === 'dark'
                    ? 'gray.800'
                    : 'white'}>
    <Text fontSize="sm" fontWeight={700} m={2} fontWeight={500}>Data diperbarui terakhir {latestData ? lightFormat(new Date(latestData.fields.Tanggal), 'dd-MM-yyyy') : ''}</Text>
        </Box>
      </div>
    )
  }

