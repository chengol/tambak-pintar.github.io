import React, {useState, createContext, useContext} from 'react';
import useSWR, {SWRConfig} from "swr";
// import {Header} from '../components';
import {
    Box,
    useToast,
    Flex,
    Spinner,
    ChakraProvider
    // Heading
} from '@chakra-ui/react';
import '../styles/app.css';
import {formatISO} from 'date-fns';
import Sidepanel from '../components/Sidepanel';
import {graphql, useStaticQuery} from 'gatsby';
import PetaRegion from '../components/PetaRegion';
import LatestData from '../components/LatestData';
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
    const [regionId, setRegionId] = useState('');
    const [diseaseId, setDiseaseId] = useState('');
    const toast = useToast();

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
            setEndDate,
            regionId,
            setRegionId,
            diseaseId,
            setDiseaseId
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

    const {toast, regionId, startDate, endDate, diseaseId} = useContext(DiseaseContext);

    //raw data
    const response = useSWR(`https://app.jala.tech/api/laboratories/1/cycle_diseases?region_id=${regionId}&per_page=1000&with=cycle.pond.farm.region,disease&cycle_id=1,6,8,11&logged_at__gte=${formatISO(startDate, { representation: 'date' })}00:00:00&logged_at__lte=${formatISO(endDate, { representation: 'date' })}23:59:59&disease_id=${diseaseId}`,
      (url) => fetcher(url, {
        headers: {
          'Authorization': `Bearer ${airtableApi.airtable.siteMetadata.jalaAccessToken}`,
          'Accept': 'application/json',
        }
      }))

      //data statistik
      const totalCycleResponse = useSWR(`https://app.jala.tech/api/laboratories/1/cycle_diseases_total?region_id=${regionId}&per_page=1000&logged_at__gte=${formatISO(startDate, { representation: 'date' })}00:00:00&logged_at__lte=${formatISO(endDate, { representation: 'date' })}23:59:59&disease_id=${diseaseId}`,
      (url) => fetcher(url, {
        headers: {
          'Authorization': `Bearer ${airtableApi.airtable.siteMetadata.jalaAccessToken}`,
          'Accept': 'application/json',
        }
      }))

      //data persebaran
      const persebaranResponse = useSWR(`https://app.jala.tech/api/laboratories/1/cycle_diseases_total?per_page=1000&logged_at__gte=${formatISO(startDate, { representation: 'date' })}00:00:00&logged_at__lte=${formatISO(endDate, { representation: 'date' })}23:59:59`,
      (url) => fetcher(url, {
        headers: {
          'Authorization': `Bearer ${airtableApi.airtable.siteMetadata.jalaAccessToken}`,
          'Accept': 'application/json',
        }
      }))


      const listRegionResponse = useSWR("https://app.jala.tech/api/regions?has=farms.ponds.cycles.jala_cycle_diseases&per_page=1000&scope=district",
      (url) => fetcher(url, {
        headers: {
          'Authorization': `Bearer ${airtableApi.airtable.siteMetadata.jalaAccessToken}`,
          'Accept': 'application/json',
        }
      }))

    //   const listRegenciesResponse = useSWR("https://app.jala.tech/api/regencies?has=farms.ponds.cycles.jala_cycle_diseases&per_page=1000",
    //   (url) => fetcher(url, {
    //     headers: {
    //       'Authorization': `Bearer ${airtableApi.airtable.siteMetadata.jalaAccessToken}`,
    //       'Accept': 'application/json',
    //     }
    //   }))

      const regionDiseaseResponse = useSWR(`https://app.jala.tech/api/laboratories/1/cycle_diseases_total_per_region?logged_at__gte=${formatISO(startDate, { representation: 'date' })}00:00:00&logged_at__lte=${formatISO(endDate, { representation: 'date' })}23:59:59&disease_id=${diseaseId}&with=region&per_page=1000&scope_only=district`,
      (url) => fetcher(url, {
        headers: {
          'Authorization': `Bearer ${airtableApi.airtable.siteMetadata.jalaAccessToken}`,
          'Accept': 'application/json',
        }
      }))

      const totalCycleMonthResponse = useSWR(`https://app.jala.tech/api/laboratories/1/cycle_diseases_total_per_month?region_id=${regionId}&logged_at__gte=${formatISO(startDate, { representation: 'date' })}00:00:00&logged_at__lte=${formatISO(endDate, { representation: 'date' })}23:59:59&disease_id=${diseaseId}`,
      (url) => fetcher(url, {
        headers: {
          'Authorization': `Bearer ${airtableApi.airtable.siteMetadata.jalaAccessToken}`,
          'Accept': 'application/json',
        }
      }))

    //   console.log('total cycle data',totalCycleResponse.data);
    //   console.log('all diseases', response.data);

    //   console.log('region', regionId);
    //   console.log('region terpilih', regionResponse.data);
    //   console.log('all region has disease', listRegionResponse.data);
    //   console.log('all disease in each region', regionDiseaseResponse.data);
    //   console.log('all regencies has disease', listRegenciesResponse.data);
    //   console.log('diesase id', diseaseId);

    // console.log('total disease per bulan', totalCycleMonthResponse.data);
    

    const data = {
      records: response.data ? response.data.data.map((datum) => ({
        id: datum.id,
        fields: {
          DoC: datum.age,
          Kabupaten: _.startCase(datum.cycle.pond.farm.region.regency_name.toLowerCase()),
          Region: [datum.cycle.pond.farm.region.id.substring(0,7)],
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

    if (response.error || totalCycleResponse.error || listRegionResponse.error || totalCycleMonthResponse.error )
        return <div>{toast({title: "An error occurred.", description: "Unable to get the data.", status: "error", duration: 9000, isClosable: true})}</div>
    if (!data || !totalCycleMonthResponse || !totalCycleResponse || !regionDiseaseResponse || !listRegionResponse) {
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

    // console.log('region', regionId);

    return (
        <div>
            <FilterData data={data} diseaseData={regionDiseaseResponse.data ? regionDiseaseResponse.data.data : []} 
            chartData={totalCycleMonthResponse.data ? totalCycleMonthResponse.data.data : []} 
            regionData={listRegionResponse.data ? listRegionResponse.data.data : []} 
            statisticData={totalCycleResponse.data ? totalCycleResponse.data.data[0] : []} 
            regionDetailData={listRegionResponse.data && listRegionResponse.data.data.length && regionId ? listRegionResponse.data.data.find((r)=>r.id===regionId) : []}
            persebaranData={persebaranResponse.data ? persebaranResponse.data.data[0] : []} />
        </div>
    )
}

function FilterData(data) {
    // const {disease, startDate, endDate} = useContext(DiseaseContext);

    // const samples = data.data.records;

    // const diseaseData = samples.filter(d => {
    //     if (disease === "Semua Sampel") {
    //         return data && isAfter(endDate, new Date(d.fields.Tanggal)) && isBefore(startDate, new Date(d.fields.Tanggal));
    //     }
    //     if (disease === "Semua Positif"){
    //         return d.fields.Status !== 0 && isAfter(endDate, new Date(d.fields.Tanggal)) && isBefore(startDate, new Date(d.fields.Tanggal));
    //     }
    //         return d.fields.Status !== 0 && d.fields.Penyakit === disease && isAfter(endDate, new Date(d.fields.Tanggal)) && isBefore(startDate, new Date(d.fields.Tanggal));
    // });

    // const samplesData = samples.filter(d => {
    //     if (disease === "Semua Sampel") {
    //         return data && isAfter(endDate, new Date(d.fields.Tanggal)) && isBefore(startDate, new Date(d.fields.Tanggal));
    //     }
    //     if (disease === "Semua Positif"){
    //         return isAfter(endDate, new Date(d.fields.Tanggal)) && isBefore(startDate, new Date(d.fields.Tanggal));
    //     }
    //         return  d.fields.Penyakit === disease && isAfter(endDate, new Date(d.fields.Tanggal)) && isBefore(startDate, new Date(d.fields.Tanggal));
    // });

    // console.log('statistic data', data.statisticData);
    // console.log('sampel', samples);
    // console.log('sampleData', samplesData);
    // console.log('disease', disease, 'lokasi', district, 'diseaseData', diseaseData);

    // const points = {
    //     type: "FeatureCollection",
    //     features: diseaseData.map((point = {}) => {
    //         const lat = point.fields.Lat;
    //         const lng = point.fields.Long;
    //         return {
    //             type: 'Feature',
    //             properties: {
    //                 cluster: false,
    //                 ...point
    //             },
    //             geometry: {
    //                 type: 'Point',
    //                 coordinates: [lng, lat]
    //             }
    //         }
    //     })
    // };

    // const pointsPeta = diseaseData.map((point = {}) => {
    //         const lat = point.fields.Lat;
    //         const lng = point.fields.Long;
    //         return {
    //             type: 'Feature',
    //             properties: {
    //                 cluster: false,
    //                 ...point
    //             },
    //             geometry: {
    //                 type: 'Point',
    //                 coordinates: [lng, lat]
    //             }
    //         }
    //     });

    

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
                xl: "block" }} id="sidepanel" chart={data.chartData} statistics={data.statisticData} disease={data.diseaseData} region={data.regionDetailData} persebaran={data.persebaranData} />
                <LatestData latestData={data.statisticData}/>
                </Box>
                <Box flex="1">
                    {/* <PetaPin points={pointsPeta} samples={samples} regions={data.regionData}/> */}
                    <PetaRegion regions={data.regionData} disease={data.diseaseData} />
                </Box>
            </Flex>
            <Box id="headbottom"
            display={{ sm: "block", md: "block", lg: "none", xl: "none" }}
            >
                <Bottompanel chart={data.chartData} statistics={data.statisticData} disease={data.diseaseData} region={data.regionDetailData} display={{ sm: "block", md: "block", lg: "block", xl: "none" }}/></Box>

        </div>
    )
}

