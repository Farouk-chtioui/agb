import React from "react";
import Table from "../Table/Table";
const ProuditsTable = ({ produits, handleDelete, handleModify }) => {
    const headers = ["Image", "Nom de produit", "Prix","Description","Action"];
    const renderRow = (produit) => (
        <>
       <td className="py-6 px-4 border-b border-gray-200">
  {produit.image ? (
    <img src={produit.image} alt={produit.name} style={{ width: '90px', height: '90px', objectFit: 'cover' }} />
  ) : "No image"}
</td>
        <td className="py-6 px-4 border-b border-gray-200">{produit.name}</td>
        <td className="py-6 px-4 border-b border-gray-200">{produit.price}</td>
        <td className="py-6 px-4 border-b border-gray-200">{produit.description}</td>
        </>
    );
    return (
        <Table
        headers={headers}
        data={produits}
        renderRow={renderRow}
        handleDelete={handleDelete}
        handleModify={handleModify}
        />
    );
    }
    export default ProuditsTable;