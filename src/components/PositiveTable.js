import React, {useMemo} from 'react'
import {
    Box,
    Table,
    Thead,
    Tbody,
    Tr,
    Th,
    Td
} from '@chakra-ui/react';

import styled from 'styled-components'

import _ from 'lodash';
import {useTable, useResizeColumns, useBlockLayout} from 'react-table'

export default function PositiveTable(diseaseData) {
    // const chartData = data.chart;
    const diseasesData = diseaseData.disease;


    // console.log('diseases data', diseasesData);
    // console.log('persebaran data', persebaranData);

    const data2 = useMemo(() => diseasesData.map(d => {
        return {
            col1: `${d.region.district_name
                ? _.startCase(d.region.district_name.toLowerCase())
                : ''}${d.region.regency_name
                    ? ` ` + _.startCase(d.region.regency_name.toLowerCase())
                    : ''}${d.region.province_name
                        ? `, ` + _.startCase(d.region.province_name.toLowerCase())
                        : ''}`,
            col2: d.total_positive,
            col3: d.total_disease_id_1_positive,
            col4: d.total_disease_id_6_positive,
            col5: d.total_disease_id_8_positive,
            col6: d.total_disease_id_11_positive
        }
    }), [])

    const data = useMemo(() => diseasesData.map(d => {
        return {
            col1: `${d.region.district_name
                ? _.startCase(d.region.district_name.toLowerCase())
                : ''}${d.region.regency_name
                    ? ` ` + _.startCase(d.region.regency_name.toLowerCase())
                    : ''}${d.region.province_name
                        ? `, ` + _.startCase(d.region.province_name.toLowerCase())
                        : ''}`,
            col2: d.total_positive,
            col3: d.total_positive === 0
                ? 0 + `%`
                : ((d.total_positive / d.total) * 100).toFixed() + `%`
        }
    }), [])

    const Styles = styled.div `

  .table {
    border-spacing: 0;
    

    .tr {
      :last-child {
        td {
          border-bottom: 0;
        }
      }
    }

    .th{
    margin: 0;
      padding: 0.5rem;
      border-bottom: 2px solid #E9E9E9;
      font-weight: 700;
      vertical-align: middle;

      position: relative;

      :last-child {
        border-right: 0;
      }
    }


    .td {
      margin: 0;
      padding: 0.5rem;

      position: relative;
      vertical-align: middle;

      :last-child {
        border-right: 0;
      }
    }
  }
`

    console.log('table data', data);

    const columns2 = useMemo(() => [
        {
            Header: 'Lokasi',
            accessor: 'col1', // accessor is the "key" in the data
        }, {
            Header: 'Total Positif',
            accessor: 'col2'
        }, {
            Header: 'AHPND',
            accessor: 'col3'
        }, {
            Header: 'EHP',
            accessor: 'col4'
        }, {
            Header: 'Myo',
            accessor: 'col5'
        }, {
            Header: 'Berak Putih',
            accessor: 'col6'
        }
    ], [])

    const columns = useMemo(() => [
        {
            Header: 'Lokasi',
            accessor: 'col1',
            width: 140
        }, {
            Header: 'Total Positif',
            accessor: 'col2',
            width: 80
        }, {
            Header: 'Positive Rate',
            accessor: 'col3',
            width: 80
        }
    ], [])

    const defaultColumn = useMemo(() => ({minWidth: 50, width: 150, maxWidth: 400}), [])

    const tableInstance = useTable({
        columns,
        data,
        defaultColumn
    }, useResizeColumns, useBlockLayout);

    const {getTableProps, getTableBodyProps, headerGroups, rows, prepareRow} = tableInstance

    // console.log('chart data', chartData); console.log('disease data',
    // diseasesData);

    return (
        <div>
            <Box mt="2" mb="2">
                <Table size="sm">
                    <Thead>
                        <Tr className="tr">
                            <Th className="th">Lokasi</Th>
                            <Th className="th" isNumeric>Total Positif</Th>
                            <Th className="th" isNumeric>AHPND</Th>
                            <Th className="th" isNumeric>EHP</Th>
                            <Th className="th" isNumeric>Myo</Th>
                            <Th className="th" isNumeric>Berak Putih</Th>
                        </Tr>
                    </Thead>
                    <Tbody>
                        {diseasesData.map(d => {
                            return (
                                <Tr key={d.region_id}>
                                    <Td>{d.region.district_name
                                            ? <strong>{_.startCase(d.region.district_name.toLowerCase())}</strong>
                                            : ''}{d.region.regency_name
                                            ? ` ` + _.startCase(d.region.regency_name.toLowerCase())
                                            : ''}{d.region.province_name
                                            ? `, ` + _.startCase(d.region.province_name.toLowerCase())
                                            : ''}</Td>
                                    <Td isNumeric>{d.total_positive}</Td>
                                    <Td isNumeric>{d.total_disease_id_1_positive}</Td>
                                    <Td isNumeric>{d.total_disease_id_6_positive}</Td>
                                    <Td isNumeric>{d.total_disease_id_8_positive}</Td>
                                    <Td isNumeric>{d.total_disease_id_11_positive}</Td>
                                </Tr>
                            )
                        })}
                    </Tbody>
                </Table>
            </Box>
            {/* <Box>
                <Styles>
                    <div {...getTableProps()} className="table">
                        <div>
                            {headerGroups.map(header => {
                                return (
                                    <div {...header.getHeaderGroupProps()} className="tr">
                                        {header
                                            .headers
                                            .map(column => (
                                                <div {...column.getHeaderProps()} className="th">
                                                    {column.render(`Header`)}
                                                    <div
                                                        {...column.getResizerProps()}
                                                        className={`resizer ${column.isResizing
                                                        ? 'isResizing'
                                                        : ''}`}/>
                                                </div>
                                            ))}
                                    </div>
                                )
                            })}
                        </div>
                        <div {...getTableBodyProps()}>
                            {rows.map((row, i) => {
                                prepareRow(row);
                                return (
                                    <div {...row.getRowProps()} className="tr">
                                        {row
                                            .cells
                                            .map(cell => {
                                                return (
                                                    <div {...cell.getCellProps()} className="td">
                                                        {cell.render('Cell')}
                                                    </div>
                                                )
                                            })}
                                    </div>
                                )
                            })}
                        </div>
                    </div>

                </Styles>
            </Box> */}
        </div>

    )
}
