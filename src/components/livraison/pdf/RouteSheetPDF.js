import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import { Page, Text, View, Document, StyleSheet, PDFViewer } from '@react-pdf/renderer';
import { fetchbyReference } from '../../../api/livraisonService';  // Ensure this path is correct

const styles = StyleSheet.create({
    page: {
        padding: 20,
        fontFamily: 'Helvetica',
        fontSize: 12,
        lineHeight: 1.6,
        color: '#4a4a4a',
    },
    headerContainer: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginBottom: 20,
    },
    headerLeft: {
        width: '60%',
    },
    headerRight: {
        width: '40%',
        textAlign: 'right',
    },
    routeDate: {
        fontSize: 14,
        marginBottom: 4,
    },
    driverName: {
        fontSize: 12,
        marginTop: 10,
    },
    companyName: {
        fontSize: 14,
        fontWeight: 'bold',
        marginBottom: 4,
    },
    contactInfo: {
        fontSize: 12,
    },
    table: {
        display: 'table',
        width: '100%',
        borderStyle: 'solid',
        borderWidth: 1,
        borderColor: '#e0e0e0',
    },
    tableRow: {
        flexDirection: 'row',
    },
    tableColHeader: {
        width: '12%',
        borderStyle: 'solid',
        borderWidth: 1,
        borderColor: '#e0e0e0',
        textAlign: 'center',
        padding: 5,
        fontWeight: 'bold',
    },
    tableCol: {
        width: '12%',
        borderStyle: 'solid',
        borderWidth: 1,
        borderColor: '#e0e0e0',
        textAlign: 'center',
        padding: 5,
    },
    tableColWide: {
        width: '24%',
        borderStyle: 'solid',
        borderWidth: 1,
        borderColor: '#e0e0e0',
        textAlign: 'left',
        padding: 5,
    },
    signatureSection: {
        marginTop: 20,
        textAlign: 'left',
    },
    signatureLabel: {
        fontSize: 12,
        marginBottom: 5,
        fontWeight: 'bold',
    },
});

const RouteSheetDocument = ({ data }) => {
    const delivery = data ? data[0] : null;

    if (!delivery) {
        return <Text>No data available for this reference</Text>;
    }

    return (
        <Document>
            <Page size="A4" style={styles.page}>
                <View style={styles.headerContainer}>
                    <View style={styles.headerLeft}>
                        <Text style={styles.routeDate}>Feuille de route du {delivery.Date}</Text>
                        <Text style={styles.driverName}>Nom du chauffeur: {delivery.driver ? `${delivery.driver.first_name} ${delivery.driver.last_name}` : 'N/A'}</Text>
                    </View>
                    <View style={styles.headerRight}>
                        <Text style={styles.companyName}>AGB TRANSPORT</Text>
                        <Text style={styles.contactInfo}>Email: mhatem@agbtransport.fr</Text>
                        <Text style={styles.contactInfo}>Phone: +33 6 21 40 10 47</Text>
                        <Text style={styles.contactInfo}>Numéro TVA: FR95897844379</Text>
                    </View>
                </View>

                <View style={styles.table}>
                    <View style={styles.tableRow}>
                        <Text style={styles.tableColHeader}>Magasin</Text>
                        <Text style={styles.tableColHeader}>Client Référence</Text>
                        <Text style={styles.tableColHeader}>Observations</Text>
                        <Text style={styles.tableColHeader}>Chq</Text>
                        <Text style={styles.tableColHeader}>Esp</Text>
                        <Text style={styles.tableColHeader}>Aut</Text>
                        <Text style={styles.tableColHeader}>A Fact</Text>
                        <Text style={styles.tableColHeader}>Fact Sup</Text>
                        <Text style={styles.tableColHeader}>Cde Fact</Text>
                    </View>

                    {data.map((delivery, index) => (
                        <View style={styles.tableRow} key={index}>
                            <Text style={styles.tableColWide}>
                                {delivery.market ? delivery.market.first_name : 'N/A'}
                                {'\n'}Ref: {delivery.Référence}
                                {'\n'}Dist: {delivery.distance ? `${delivery.distance} Km` : 'N/A'}
                            </Text>
                            <Text style={styles.tableCol}>{delivery.client.first_name} {delivery.client.last_name}</Text>
                            <Text style={styles.tableCol}>{delivery.Observations}</Text>
                            <Text style={styles.tableCol}></Text> {/* Empty columns for checkmarks */}
                            <Text style={styles.tableCol}></Text>
                            <Text style={styles.tableCol}></Text>
                            <Text style={styles.tableCol}></Text>
                            <Text style={styles.tableCol}></Text>
                            <Text style={styles.tableCol}></Text>
                        </View>
                    ))}
                </View>
            </Page>
        </Document>
    );
};

const RouteSheetPDF = () => {
    const { reference } = useParams();
    const [data, setData] = useState(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchData = async () => {
            try {
                console.log('Fetching data for reference:', reference);
                const deliveryData = await fetchbyReference(reference);
                console.log('Fetched data:', deliveryData);
                setData(deliveryData);
            } catch (error) {
                console.error('Error fetching delivery data', error);
            } finally {
                setLoading(false);
            }
        };
        fetchData();
    }, [reference]);

    if (loading) {
        return <div>Loading...</div>;
    }

    if (!data || data.length === 0) {
        return <div>No delivery data found for the reference: {reference}</div>;
    }

    return (
        <div style={{ width: '100%', height: '100vh' }}>
            <PDFViewer style={{ width: '100%', height: '100%' }}>
                <RouteSheetDocument data={data} />
            </PDFViewer>
        </div>
    );
};

export default RouteSheetPDF;
