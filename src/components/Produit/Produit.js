import React,{useState,useEffect,useCallback} from "react";
import { fetchProducts, deleteProduct, addProduct, searchProducts, modifyProduct } from "../../api/Auth";
import Dashboard from "../dashboard/Dashboard";
import Search from "../searchbar/Search";
import ProductForm from "./ProduitForm";
import ProductTable from "./ProduitTable";
import Pagination from "../Pagination/Pagination";
const Produits = () => {
  const [products, setProducts] = useState([]);
  const [filteredProducts, setFilteredProducts] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [showForm, setShowForm] = useState(false);
  const [newProduct, setNewProduct] = useState({
    image: '',
    name: '',
    price: '',
    description: ''
  });
  

  const [isEditMode, setIsEditMode] = useState(false);
  const [currentProduct, setCurrentProduct] = useState(null);
  const [isSearchActive, setIsSearchActive] = useState(false);
  useEffect(() => {
    fetchProductsData();
  }, [currentPage]);
  const fetchProductsData = async () => {
    try {
      const data = await fetchProducts(currentPage);
      setProducts(data);
      setFilteredProducts(data);
    } catch (error) {
      console.error('Error fetching products', error);
    }
  };
  const handleDelete = async (id) => {
    try {
      await deleteProduct(id);
      fetchProductsData();
    } catch (error) {
      console.error('Error deleting product', error);
    }
  };
  const handleModify = (product) => {
    setCurrentProduct(product);
    setNewProduct(product);
    setIsEditMode(true);
    setShowForm(true);
  };
  const handleEditProduct = async (e) => {
    e.preventDefault();
    try {
      await modifyProduct(newProduct);
      fetchProductsData();
      setShowForm(false);
    } catch (error) {
      console.error('Error modifying product', error);
    }
  };
  const handleAddProduct = async (e) => {
    e.preventDefault();
    try {
      await addProduct(newProduct);
      fetchProductsData();
      setShowForm(false);
    } catch (error) {
      console.error('Error adding product', error);
    }
  };
  const handleSearch=async (searchTerm)=>{
    if(searchTerm===''){
      setIsSearchActive(false);
      fetchProductsData();
  }else{
    try{
      const respone = await searchProducts(searchTerm);
      setFilteredProducts(respone);
      setIsSearchActive(true);
    }catch(error){
      console.error('Error searching products',error);
    }
  }
};
  const handlePageChange = useCallback((page) => {
    setCurrentPage(page);
  }, []);
  const handleChange = (e) => {
    const { name, value } = e.target;
    setNewProduct(prevState => ({
        ...prevState,
        [name]: value,
    }));
};
  return (
    <div className="flex">
      <Dashboard title="Produit"/>
      <div className="flex-1 container mx-auto p-9 relative mt-20 ">
        <Search setData={handleSearch} title={"Tout les chauffeurs"} />
        <button
             className="custom-color2 text-white px-4 py-2 rounded mb-4 absolute top-0 right-0 mt-4 mr-4 shadow hover:bg-blue-600 transition"
             onClick={() => {
                setShowForm(true);
                setIsEditMode(false);
                setNewProduct({
                  image: '',
                  name: '',
                  price: '',
                  description: ''
                });
              }}>Ajouter</button>
              {showForm && (
                <ProductForm 
                newProduit={newProduct} 
                handleAddProduit={handleAddProduct}
                handleEditProduit={handleEditProduct}
                handleChange={handleChange}
                setShowForm={setShowForm}
                isEditMode={isEditMode}
                />
              )}
              <ProductTable produits={filteredProducts} handleDelete={handleDelete} handleModify={handleModify} />
              <Pagination currentPage={currentPage} setCurrentPage={handlePageChange} />
      </div>
    </div>
  );
}
export default Produits;