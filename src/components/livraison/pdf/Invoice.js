import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import { Page, Text, View, Document, StyleSheet, PDFViewer, Image } from '@react-pdf/renderer';
import { fetchbyCommande } from '../../../api/livraisonService'; // Adjust the import path according to your project structure

// Define your styles
const styles = StyleSheet.create({
  page: {
    padding: 30,
    fontFamily: 'Helvetica',
    fontSize: 12,
    lineHeight: 1.5,
    color: '#4a4a4a'
  },
  logo: {
    position: 'absolute',
    top: 30,
    right: 30,
    width: 100,
    height: 30
  },
  header: {
    fontSize: 18,
    marginBottom: 20,
    fontWeight: 'bold',
    textAlign: 'center'
  },
  subHeader: {
    fontSize: 14,
    marginBottom: 10,
    fontWeight: 'bold',
    color: '#333'
  },
  text: {
    marginBottom: 5,
  },
  section: {
    marginBottom: 20,
  },
  table: {
    display: 'table',
    width: 'auto',
    marginVertical: 20,
    borderStyle: 'solid',
    borderWidth: 1,
    borderColor: '#e0e0e0'
  },
  tableRow: {
    flexDirection: 'row',
    backgroundColor: '#f8f8f8'
  },
  tableColHeader: {
    width: '20%',
    borderStyle: 'solid',
    borderWidth: 1,
    borderColor: '#e0e0e0',
    backgroundColor: '#dcdcdc',
    textAlign: 'center',
    fontWeight: 'bold',
    padding: 5
  },
  tableCol: {
    width: '20%',
    borderStyle: 'solid',
    borderWidth: 1,
    borderColor: '#e0e0e0',
    textAlign: 'center',
    padding: 5
  },
  tableCell: {
    margin: 5,
  },
  observation: {
    marginTop: 10,
    fontStyle: 'italic'
  },
  signature: {
    marginTop: 30,
    fontSize: 12,
  }
});

// Document component
const InvoiceDocument = ({ data }) => (
  <Document>
    <Page size="A4" style={styles.page}>
      <Image src="/path/to/logo.png" style={styles.logo} />
      <Text style={styles.header}>Confirmation de la commande N°{data.NumeroCommande}</Text>
      <View style={styles.section}>
        <Text style={styles.subHeader}>Commande pour:</Text>
        <Text style={styles.text}>{data.client?.first_name}</Text>
        <Text style={styles.text}>{data.client.address1 +" "+ data.client.address2}</Text>
        <Text style={styles.text}>Téléphone: {data.client?.phone}</Text>
        <Text style={styles.subHeader}>LIVRAISON POUR {data.Date}</Text>
      </View>

      <View style={styles.table}>
        <View style={styles.tableRow}>
          <Text style={styles.tableColHeader}>Article</Text>
          <Text style={styles.tableColHeader}>Qté</Text>
          <Text style={styles.tableColHeader}>Dépose</Text>
          <Text style={styles.tableColHeader}>Montage</Text>
          <Text style={styles.tableColHeader}>Install</Text>
        </View>
        {data.products?.map((item, index) => (
          <View key={index} style={styles.tableRow}>
            <Text style={styles.tableCol}>{item?.name}</Text>
            <Text style={styles.tableCol}>{item?.quantity}</Text>
            <Text style={styles.tableCol}>{item?.dropoff ? 'Oui' : 'Non'}</Text>
            <Text style={styles.tableCol}>{item?.assembly ? 'Oui' : 'Non'}</Text>
            <Text style={styles.tableCol}>{item?.install ? 'Oui' : 'Non'}</Text>
          </View>
        ))}
      </View>

      <Text style={styles.observation}>Observations : {data.Observations}</Text>
      <Text style={styles.text}>Forfait de la livraison : {data.deliveryFee}€</Text>
      <Text style={styles.text}>Solde Magasin: {data.products.reduce((total, product) => total + product.price, 0)}€</Text>
      <Text style={styles.signature}>
        Par sa signature, le client reconnait avoir reçu, contrôlé et constaté
        le bon état de la marchandise livrée et/ou installée ce jour
      </Text>
      <Text style={styles.signature}>Signature du client: ....................................</Text>
    </Page>
  </Document>
);

// PDFViewer component
const InvoicePDF = () => {
  const { NumeroCommande } = useParams(); // Use this for fetching invoice data if needed
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const livraisonData = await fetchbyCommande(NumeroCommande);
        setData(livraisonData);
      } catch (error) {
        console.error('Error fetching livraison data', error);
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, [NumeroCommande]);

  if (loading) {
    return <div>Loading...</div>;
  }

  console.log(data);

  return (
    <div style={{ width: '100%', height: '90vh' }}> {/* Customize the size of the preview here */}
      <PDFViewer style={{ width: '100%', height: '100%' }}> {/* Make the PDFViewer fill the container */}
        <InvoiceDocument data={data} />
      </PDFViewer>
    </div>
  );
};

export default InvoicePDF;
