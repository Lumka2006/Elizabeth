import React, { useEffect, useState } from 'react';

const Product = () => {
    // State variables to store product list, form data, quantity changes, messages, and transactions
    const [products, setProducts] = useState([]);
    const [editingProduct, setEditingProduct] = useState(null);
    const [formData, setFormData] = useState({ name: '', description: '', category: '', price: '', quantity: '' });
    const [quantityChange, setQuantityChange] = useState(0);  // State for quantity change (add/deduct)
    const [message, setMessage] = useState('');

    useEffect(() => {
        loadProducts();  // Load products when component mounts
    }, []);

    // Fetches products from the server
    const loadProducts = async () => {
        try {
            const response = await fetch('http://localhost:5000/api/products');
            const data = await response.json();
            setProducts(data);
        } catch (error) {
            console.error('Error fetching products:', error);
        }
    };

    // Saves new or updated product to the server
    const saveProduct = async (e) => {
        e.preventDefault();
        const { name, price, quantity } = formData;

        // Validate non-negative price and quantity
        if (price < 0 || quantity < 0) {
            setMessage('Price and quantity must be non-negative.');
            return;
        }

        try {
            const response = await fetch('http://localhost:5000/api/products', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(formData),
            });
            await response.text();
            setMessage('Product saved successfully!');
            resetForm();
            loadProducts();
        } catch (error) {
            console.error('Error saving product:', error);
            setMessage('Error saving product.');
        }
    };

    // Deletes a product by ID
    const deleteProduct = async (id) => {
        try {
            await fetch(`http://localhost:5000/api/products/${id}`, { method: 'DELETE' });
            setMessage('Product deleted successfully!');
            loadProducts();
        } catch (error) {
            console.error('Error deleting product:', error);
            setMessage('Error deleting product.');
        }
    };

   
    // Sets form data for editing a product and loads its transactions
    const editProduct = (product) => {
        setFormData(product);
        setEditingProduct(product);
    };

    // Updates form data on input change
    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setFormData({ ...formData, [name]: value });
    };

    // Updates quantity change state
    const handleQuantityChange = (e) => {
        setQuantityChange(e.target.value);
    };

    // Adds quantity to a product
    const addQuantity = async (id) => {
        if (quantityChange <= 0) {
            setMessage('Quantity to add must be greater than 0.');
            return;
        }

        try {
            const response = await fetch(`http://localhost:5000/api/products/${id}/quantity`, {
                method: 'PUT',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ quantityChange: Number(quantityChange), type: 'add' }),
            });
            const data = await response.json();
            setMessage(data.message);

            // Update local product list to reflect new quantity
            setProducts(prevProducts =>
                prevProducts.map(product =>
                    product.id === id
                        ? { ...product, quantity: product.quantity + Number(quantityChange) }
                        : product
                )
            );

            setQuantityChange(0);  // Clear quantity input field
        } catch (error) {
            console.error('Error adding quantity:', error);
            setMessage('Error adding quantity.');
        }
    };

    // Deducts quantity from a product
    const deductQuantity = async (id) => {
        if (quantityChange <= 0) {
            setMessage('Quantity to deduct must be greater than 0.');
            return;
        }

        try {
            const response = await fetch(`http://localhost:5000/api/products/${id}/quantity`, {
                method: 'PUT',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ quantityChange: Number(quantityChange), type: 'deduct' }),
            });
            const data = await response.json();
            setMessage(data.message);

            // Update local product list to reflect new quantity
            setProducts(prevProducts =>
                prevProducts.map(product =>
                    product.id === id
                        ? { ...product, quantity: product.quantity - Number(quantityChange) }
                        : product
                )
            );

            setQuantityChange(0);  // Clear quantity input field
        } catch (error) {
            console.error('Error deducting quantity:', error);
            setMessage('Error deducting quantity.');
        }
    };

    // Resets form to default state
    const resetForm = () => {
        setFormData({ name: '', description: '', category: '', price: '', quantity: '' });
        setEditingProduct(null);
    };

    return (
        <div>
            <h1>Product Management</h1>
            {message && <p>{message}</p>}

            {/* Form to add or edit a product */}
            <form onSubmit={saveProduct}>
                <input
                    type="text"
                    name="name"
                    value={formData.name}
                    onChange={handleInputChange}
                    placeholder="Product Name"
                    required
                />
                <input
                    type="text"
                    name="description"
                    value={formData.description}
                    onChange={handleInputChange}
                    placeholder="Description"
                    required
                />
                <input
                    type="text"
                    name="category"
                    value={formData.category}
                    onChange={handleInputChange}
                    placeholder="Category"
                    required
                />
                <input
                    type="number"
                    name="price"
                    value={formData.price}
                    onChange={handleInputChange}
                    placeholder="Price"
                    required
                />
                <input
                    type="number"
                    name="quantity"
                    value={formData.quantity}
                    onChange={handleInputChange}
                    placeholder="Quantity"
                    required
                />
                <button type="submit">{editingProduct ? 'Update' : 'Add'} Product</button>
            </form>

            {/* Section for adding or deducting quantity for a selected product */}
            {editingProduct && (
                <div>
                    <h2>Update Product Quantity</h2>
                    <input
                        type="number"
                        value={quantityChange}
                        onChange={handleQuantityChange}
                        placeholder="Enter Quantity"
                        required
                    />
                    <button onClick={() => addQuantity(editingProduct.id)}>Add Quantity</button>
                    <button onClick={() => deductQuantity(editingProduct.id)}>Deduct Quantity</button>
                </div>
            )}

            {/* Table displaying the list of products */}
            <h2>Products List</h2>
            {products.length === 0 ? (
                <p>No products available.</p>
            ) : (
                <table>
                    <thead>
                        <tr>
                            <th>Product Name</th>
                            <th>Description</th>
                            <th>Category</th>
                            <th>Price</th>
                            <th>Quantity</th>
                            <th>Actions</th>
                        </tr>
                    </thead>
                    <tbody>
                        {products.map((product) => (
                            <tr key={product.id}>
                                <td>{product.name}</td>
                                <td>{product.description}</td>
                                <td>{product.category}</td>
                                <td>${product.price}</td>
                                <td>{product.quantity}</td>
                                <td>
                                    <button onClick={() => editProduct(product)}>Edit</button>
                                    <button onClick={() => deleteProduct(product.id)}>Delete</button>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            )}

          
        </div>
    );
};

export default Product;

