// Wishlist.js
import React, { useState, useEffect } from 'react';
import axios from 'axios';

function Wishlist() {
    const [wishlist, setWishlist] = useState([]);

    useEffect(() => {
        axios.get('/api/get-wishlist/')
            .then(response => setWishlist(response.data))
            .catch(error => console.error(error));
    }, []);

    return (
        <div>
            <h2>My Wishlist</h2>
            <ul>
                {wishlist.map(item => (
                    <li key={item.product_id}>{item.product_name}</li>
                ))}
            </ul>
        </div>
    );
}

export default Wishlist;
