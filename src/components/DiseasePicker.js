import React, {useContext} from 'react'
import {
    SimpleGrid,
    Heading,
    useColorMode,
    Box,
    Input,
    Flex,
    Select
} from '@chakra-ui/react';

import {DiseaseContext} from '../pages/app'
import DatePicker from "react-datepicker";

export default function DiseasePicker({kecamatan, onViewportChange}) {
    const {
        disease,
        setDisease,
        district,
        setDistrict,
        startDate,
        setStartDate,
        endDate,
        setEndDate
    } = useContext(DiseaseContext);

    const {colorMode} = useColorMode();
    const CustomInput = React.forwardRef(({
        value,
        onClick
    }, ref) => {
        return (<Input sz="md" value={value} onClick={onClick} readOnly={true} ref={ref}/>)
    });

    // console.log('kecamatan',kecamatan);

    return (
        <Box style={{
            position: "relative",
            top: 0,
            left: 0
        }}>
            <Box
                display={{
                    base: "none",
                md: "none",
                sm: "none",
                lg: "block",
                xl: "block"
            }}>
                <Flex
                    className="control-panel"
                    bg={colorMode === 'dark'
                    ? 'gray.800'
                    : 'white'}>
                    <Box mb={2} w="200px" mr={4}>
                        <Heading as="h4" size="xs" fontWeight={500} mb={2}>Pilih Daerah</Heading>
                        <Select
                            size="md"
                            value={district}
                            onChange={(e) => {
                            setDistrict(e.target.value)
                            onViewportChange(kecamatan.find(kec => e.target.value === kec.Kecamatan))}}>
                            <option value='Semua'>Semua Daerah</option>
                            {kecamatan.map(d => <option value={d.Kecamatan} key={d.Kecamatan}>{d.Kecamatan}</option>)}
                        </Select>
                    </Box>
                    <Box mb={2} w="200px" mr={4}>
                        <Heading as="h4" size="xs" fontWeight={500} mb={2}>Pilih Penyakit</Heading>
                        <Select
                            size="md"
                            value={disease}
                            onChange={(e) => {
                            setDisease(e.target.value)
                        }}>
                            {/* <option value='Semua Sampel'>Semua Sampel</option> */}
                            <option value='Semua Positif'>Semua Positif</option>
                            <option value='AHPND'>AHPND</option>
                            <option value='EHP'>EHP</option>
                            <option value='IMNV'>IMNV/Myo</option>
                            <option value='WSSV'>WSSV/Bintik Putih</option>
                        </Select>
                    </Box>

                    <Box mb={2} w="150px" mr={2}>
                        <Heading as="h4" size="xs" fontWeight={500} mb={2}>Tanggal Awal</Heading>
                        <DatePicker
                            closeOnScroll={true}
                            dateFormat="dd/MM/yyyy"
                            selected={startDate}
                            onChange={date => setStartDate(date)}
                            selectsStart
                            startDate={startDate}
                            endDate={endDate}
                            customInput={< CustomInput />}/>
                    </Box>

                    <Box mb={2} w="150px">
                        <Heading as="h4" size="xs" fontWeight={500} mb={2}>Tanggal Akhir</Heading>
                        <DatePicker
                            closeOnScroll={true}
                            dateFormat="dd/MM/yyyy"
                            selected={endDate}
                            onChange={date => setEndDate(date)}
                            selectsEnd
                            startDate={startDate}
                            endDate={endDate}
                            minDate={startDate}
                            customInput={< CustomInput />}/>
                    </Box>
                </Flex>
            </Box>
            <Box display={{
                xl: "none",
                lg:"none",
                md: "block",
                sm: "block"
            }}>
                <SimpleGrid
                    columns={2}
                    spacing={2}
                    pr={{
                    xs: 4
                }}
                    pl={{
                    xs: 4
                }}
                    pt={{
                    xs: 0
                }}
                    pb={{
                    xs: 2
                }}
                    className="disease-filter-res"
                    bg={colorMode === 'dark'
                    ? 'gray.800'
                    : 'white'}>

                    <Box mb={2} w="100%">
                        <Heading as="h6" size="xs" mb={1}>Daerah</Heading>
                        <Select
                            p={1}
                            size="sm"
                            value={district}
                            onChange={(e) => {
                            setDistrict(e.target.value);
                            onViewportChange(kecamatan.find(kec => e.target.value === kec.Kecamatan))
                        }}>
                            <option value='Semua'>Semua Daerah</option>
                            {kecamatan.map(d => <option value={d.Kecamatan} key={d.Kecamatan}>{d.Kecamatan}</option>)}
                        </Select>
                    </Box>
                    <Box mb={2} w="100%">
                        <Heading as="h6" size="xs" mb={1}>Penyakit</Heading>
                        <Select
                            p={1}
                            size="sm"
                            value={disease}
                            onChange={(e) => {
                            setDisease(e.target.value)
                        }}>
                            {/* <option value='Semua Sampel'>Semua Sampel</option> */}
                            <option value='Semua Positif'>Semua Positif</option>
                            <option value='AHPND'>AHPND</option>
                            <option value='EHP'>EHP</option>
                            <option value='IMNV'>IMNV/Myo</option>
                            <option value='WSSV'>WSSV/Bintik Putih</option>
                        </Select>
                    </Box>
                </SimpleGrid>
            </Box>
        </Box>

    )
}
