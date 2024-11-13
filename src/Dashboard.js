import React, { useEffect, useState } from 'react';
import { PieChart, Pie, Cell, Tooltip } from 'recharts';
import productImage1 from './images/download1.jpeg';
import productImage2 from './images/download2.jpeg';
import productImage3 from './images/download3.jpeg';
import productImage4 from './images/download4.jpeg';

const defaultImages = [productImage1, productImage2, productImage3, productImage4 ]; // Default image imports

const Dashboard = ({ setShowDashboard }) => {
    const [totalProducts, setTotalProducts] = useState(0);
    const [lowStockAlerts, setLowStockAlerts] = useState(0);
    const [lowStockProducts, setLowStockProducts] = useState([]);
    const [products, setProducts] = useState([]);
    const [currentImageIndex, setCurrentImageIndex] = useState(0);
    const [images, setImages] = useState([]); // Dynamically generated image array

    useEffect(() => {
        updateDashboard();
    }, []);

    useEffect(() => {
        // Rotate images every 3 seconds
        const interval = setInterval(() => {
            setCurrentImageIndex((prevIndex) => (prevIndex + 1) % images.length);
        }, 3000);
        return () => clearInterval(interval);
    }, [images]); // Trigger rotation on images update

    const updateDashboard = async () => {
        try {
            const response = await fetch('http://localhost:5000/api/products');
            const productsData = await response.json();
            const totalProductsCount = productsData.length;
            let lowStockCount = 0;
            let lowStockProductsList = [];

            productsData.forEach((product) => {
                if (product.quantity < 20) {
                    lowStockCount++;
                    lowStockProductsList.push(product.name);
                }
            });

            setTotalProducts(totalProductsCount);
            setLowStockAlerts(lowStockCount);
            setLowStockProducts(lowStockProductsList);
            setProducts(productsData);

            // Adjust images array to match the number of products
            const generatedImages = Array.from({ length: totalProductsCount }, (_, index) =>
                defaultImages[index % defaultImages.length]
            );
            setImages(generatedImages);
        } catch (error) {
            console.error('Error fetching products:', error);
        }
    };

    const pieData = products.map((product) => ({
        name: product.name,
        value: product.quantity,
    }));

    const COLORS = ['#0088FE', '#00C49F', '#FFBB28', '#FF8042', '#FF5643', '#FFBB28'];

    return (
        <div>
            <header>
                <h1>Wings Cafe Inventory System Dashboard</h1>
            </header>

            <section id="dashboard">
                <h2>Dashboard Overview</h2>
                <div id="dashboard-overview">
                <div className="dashboard-item" style={{ paddingTop: '5px' }}>
    <h3>Total Products and Low Stock Alerts</h3>
    <table style={{ width: '100%', textAlign: 'left', borderCollapse: 'collapse' }}>
        <thead>
            <tr>
                <th style={{ padding: '10px', border: '1px solid #ddd' }}>Category</th>
                <th style={{ padding: '10px', border: '1px solid #ddd' }}>Count</th>
            </tr>
        </thead>
        <tbody>
            <tr>
                <td style={{ padding: '10px', border: '1px solid #ddd' }}>Total Products</td>
                <td style={{ padding: '10px', border: '1px solid #ddd' }}>{totalProducts}</td>
            </tr>
            <tr>
                <td style={{ padding: '10px', border: '1px solid #ddd' }}>Low Stock Alerts</td>
                <td style={{ padding: '10px', border: '1px solid #ddd' }}>{lowStockAlerts}</td>
            </tr>
        </tbody>
    </table>

    {/* Low stock products list */}
    {lowStockProducts.length > 0 && (
        <div style={{ marginTop: '10px' }}>
            <h4>Products Low in Stock:</h4>
            <ul>
                {lowStockProducts.map((productName, index) => (
                    <li key={index}>{productName}</li>
                ))}
            </ul>
        </div>
    )}
</div>

                    <div className="dashboard-item"
                    style={{
                        display: 'flex',
                        flexDirection: 'column',
                        alignItems: 'center',
                        justifyContent: 'center',
                        width: '100%',
                        maxWidth: '450px',
                        margin: '5px',  // Reduced margin
                        padding: '5px', // Reduced padding
                        backgroundColor: '#f9f9f9',
                        borderRadius: '8px',
                        boxShadow: '0 4px 8px rgba(0, 0, 0, 0.1)',
                        textAlign: 'center',
                        height: 'auto'
                    
                    }}>
                        <h3 style={{ fontSize: '1.5em', color: '#333', marginBottom: '10px' }}>Product Levels</h3>
                        <PieChart width={400} height={400}style={{ marginTop: '20px' }}>
                            <Pie
                                data={pieData}
                                cx={200}
                                cy={200}
                                labelLine={false}
                                label={(entry) => entry.name}
                                outerRadius={80}
                                fill="#8884d8"
                            >
                                {pieData.map((entry, index) => (
                                    <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                                ))}
                            </Pie>
                            <Tooltip />
                        </PieChart>
                    </div>
                    <div className="dashboard-item">
                        <h3>Rotating Product Images</h3>
                        {images.length > 0 && (
                            <img
                                src={images[currentImageIndex]}
                                alt={`Product ${currentImageIndex + 1}`}
                                style={{ width: '200px', height: 'auto' }}
                            />
                        )}
                    </div>
                </div>
            </section>
        </div>
    );
};

export default Dashboard;
