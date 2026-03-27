import { useEffect, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import api from '../api/axios';

export default function Home() {
    const [restaurants, setRestaurants] = useState([]);
    const [error, setError] = useState('');
    const navigate = useNavigate();
    const [isLoggedIn, setIsLoggedIn] = useState(false);

    // --- NUEVO: Estado para la barra de búsqueda ---
    const [searchTerm, setSearchTerm] = useState('');

    // Estados de modales
    const [modalOpen, setModalOpen] = useState(false);
    const [currentReview, setCurrentReview] = useState({ restaurantId: null, rating: 0 });
    const [commentText, setCommentText] = useState('');

    const [addModalOpen, setAddModalOpen] = useState(false);
    const [newRestaurant, setNewRestaurant] = useState({ name: '', address: '' });

    const [expandedId, setExpandedId] = useState(null);

    const fetchRestaurants = () => {
        api.get('/restaurants')
            .then(response => {
                setRestaurants(response.data.data || response.data);
            })
            .catch(err => {
                console.error(err);
                setError('No se pudieron cargar los restaurantes.');
            });
    };

    useEffect(() => {
        fetchRestaurants();
        if (localStorage.getItem('token')) {
            setIsLoggedIn(true);
        }
    }, []);

    const handleLogout = () => {
        localStorage.removeItem('token');
        setIsLoggedIn(false);
        alert('Sesión cerrada correctamente. ¡Vuelve pronto!');
    };

    const openReviewModal = (restaurantId, ratingValue) => {
        const token = localStorage.getItem('token');
        if (!token) {
            alert('¡Ups! Necesitas iniciar sesión para calificar.');
            navigate('/login');
            return;
        }
        
        setCurrentReview({ restaurantId, rating: ratingValue });
        setCommentText(''); 
        setModalOpen(true); 
    };

    const submitReview = async () => {
        if (!commentText.trim()) {
            alert('El comentario es obligatorio para publicar la reseña.');
            return;
        }

        try {
            await api.post('/reviews', {
                restaurant_id: currentReview.restaurantId,
                rating: currentReview.rating,
                comment: commentText
            });
            
            alert('¡Reseña publicada con éxito! 🚀');
            setModalOpen(false); 
            fetchRestaurants(); 
        } catch (err) {
            console.error(err);
            alert(err.response?.data?.message || 'Hubo un error al publicar la reseña.');
        }
    };

    const handleAddRestaurant = async () => {
        if (!newRestaurant.name.trim() || !newRestaurant.address.trim()) {
            alert('El nombre y la dirección son obligatorios.');
            return;
        }

        try {
            await api.post('/restaurants', {
                name: newRestaurant.name,
                address: newRestaurant.address,
                lat: 20.5931,
                lng: -100.3875 
            });
            
            alert('¡Restaurante agregado con éxito! 🍽️');
            setAddModalOpen(false); 
            setNewRestaurant({ name: '', address: '' }); 
            fetchRestaurants(); 
        } catch (err) {
            console.error(err);
            alert(err.response?.data?.message || 'Hubo un error al agregar el restaurante.');
        }
    };

    const toggleReviews = (id) => {
        if (expandedId === id) {
            setExpandedId(null); 
        } else {
            setExpandedId(id); 
        }
    };

    // --- NUEVO: Filtramos los restaurantes según lo que escribas ---
    // Si searchTerm está vacío, muestra todos. Si escribes "tacos", busca los que incluyan esa palabra.
    const filteredRestaurants = restaurants.filter(restaurant => 
        restaurant.name.toLowerCase().includes(searchTerm.toLowerCase())
    );

    return (
        <div className="container">
            <header className="header">
                <h1>🍽️ DineGo</h1>
                
                <div style={{ display: 'flex', gap: '10px' }}>
                    {isLoggedIn ? (
                        <>
                            <button 
                                className="btn-primary" 
                                onClick={() => setAddModalOpen(true)}
                                style={{ backgroundColor: '#2ecc71' }} 
                            >
                                + Nuevo Restaurante
                            </button>
                            <button 
                                className="btn-primary" 
                                onClick={handleLogout}
                                style={{ backgroundColor: '#7f8c8d' }} 
                            >
                                Cerrar Sesión
                            </button>
                        </>
                    ) : (
                        <Link to="/login">
                            <button className="btn-primary">Iniciar Sesión</button>
                        </Link>
                    )}
                </div>
            </header>

            {/* --- NUEVO: Barra de Búsqueda Visual --- */}
            <div style={{ marginBottom: '30px' }}>
                <input 
                    type="text" 
                    placeholder="🔍 Buscar restaurante por nombre..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    style={{ 
                        width: '100%', 
                        padding: '15px 20px', 
                        fontSize: '1.1rem', 
                        borderRadius: '12px', 
                        border: '1px solid #dfe6e9', 
                        boxShadow: '0 4px 6px rgba(0,0,0,0.05)',
                        boxSizing: 'border-box',
                        outline: 'none',
                        transition: 'border-color 0.3s'
                    }}
                    onFocus={(e) => e.target.style.borderColor = '#ff4757'}
                    onBlur={(e) => e.target.style.borderColor = '#dfe6e9'}
                />
            </div>

            {error && <p style={{ color: 'red', textAlign: 'center' }}>{error}</p>}

            {/* Si no hay resultados de búsqueda, mostramos un mensaje amigable */}
            {filteredRestaurants.length === 0 && !error && (
                <p style={{ textAlign: 'center', color: '#7f8c8d', fontSize: '1.2rem', marginTop: '40px' }}>
                    No encontramos ningún restaurante con ese nombre 😢
                </p>
            )}

            <div className="grid">
                {/* OJO: Aquí cambiamos "restaurants.map" por "filteredRestaurants.map" */}
                {filteredRestaurants.map(restaurant => (
                    <div className="card" key={restaurant.id}>
                        <h2>{restaurant.name}</h2>
                        <p>📍 {restaurant.address}</p>
                        
                        <div className="stars" style={{ display: 'flex', gap: '5px', marginBottom: '15px' }}>
                            {[1, 2, 3, 4, 5].map((star) => (
                                <span 
                                    key={star}
                                    className={`star-interactive ${star <= (restaurant.rating_promedio || 0) ? 'active' : ''}`}
                                    onClick={() => openReviewModal(restaurant.id, star)}
                                    title="Haz clic para calificar"
                                >
                                    ★
                                </span>
                            ))}
                        </div>

                        <button 
                            className="btn-secondary" 
                            style={{ width: '100%', fontSize: '0.9rem' }}
                            onClick={() => toggleReviews(restaurant.id)}
                        >
                            {expandedId === restaurant.id ? 'Ocultar Reseñas ↑' : 'Ver Reseñas ↓'}
                        </button>

                        {expandedId === restaurant.id && (
                            <div style={{ marginTop: '15px', padding: '15px', background: '#f8f9fa', borderRadius: '8px' }}>
                                {restaurant.reviews && restaurant.reviews.length > 0 ? (
                                    restaurant.reviews.map(review => (
                                        <div key={review.id} style={{ borderBottom: '1px solid #dfe6e9', paddingBottom: '10px', marginBottom: '10px' }}>
                                            <div style={{ fontSize: '0.8rem', color: '#fbc531', marginBottom: '5px' }}>
                                                {"★".repeat(review.rating)}{"☆".repeat(5 - review.rating)}
                                            </div>
                                            <p style={{ margin: 0, fontSize: '0.9rem', fontStyle: 'italic', color: '#34495e' }}>
                                                "{review.comment}"
                                            </p>
                                        </div>
                                    ))
                                ) : (
                                    <p style={{ margin: 0, fontSize: '0.9rem', color: '#7f8c8d', textAlign: 'center' }}>
                                        Aún no hay reseñas. ¡Sé el primero en comentar!
                                    </p>
                                )}
                            </div>
                        )}
                    </div>
                ))}
            </div>

            {/* MODALES CONSERVADOS INTACTOS */}
            {modalOpen && (
                <div className="modal-overlay">
                    <div className="modal-content">
                        <h3>Calificando con {currentReview.rating} Estrellas ⭐</h3>
                        <p>Cuéntanos tu experiencia en este lugar:</p>
                        <textarea 
                            rows="4" 
                            placeholder="La comida estuvo excelente..."
                            value={commentText}
                            onChange={(e) => setCommentText(e.target.value)}
                            style={{ width: '100%', padding: '10px', borderRadius: '8px', border: '1px solid #ccc', boxSizing: 'border-box' }}
                        ></textarea>
                        <div className="modal-actions">
                            <button className="btn-secondary" onClick={() => setModalOpen(false)}>Cancelar</button>
                            <button className="btn-primary" onClick={submitReview}>Publicar Reseña</button>
                        </div>
                    </div>
                </div>
            )}

            {addModalOpen && (
                <div className="modal-overlay">
                    <div className="modal-content">
                        <h3>Agregar Nuevo Restaurante 🍽️</h3>
                        <div style={{ marginBottom: '15px', marginTop: '15px' }}>
                            <label style={{ display: 'block', marginBottom: '5px', fontWeight: 'bold', color: '#7f8c8d' }}>Nombre del lugar</label>
                            <input 
                                type="text" 
                                placeholder="Ej. Tacos El Pata"
                                value={newRestaurant.name}
                                onChange={(e) => setNewRestaurant({...newRestaurant, name: e.target.value})}
                                style={{ width: '100%', padding: '10px', borderRadius: '8px', border: '1px solid #ccc', boxSizing: 'border-box' }}
                            />
                        </div>
                        <div style={{ marginBottom: '20px' }}>
                            <label style={{ display: 'block', marginBottom: '5px', fontWeight: 'bold', color: '#7f8c8d' }}>Dirección</label>
                            <input 
                                type="text" 
                                placeholder="Ej. Blvd. Bernardo Quintana"
                                value={newRestaurant.address}
                                onChange={(e) => setNewRestaurant({...newRestaurant, address: e.target.value})}
                                style={{ width: '100%', padding: '10px', borderRadius: '8px', border: '1px solid #ccc', boxSizing: 'border-box' }}
                            />
                        </div>
                        <div className="modal-actions">
                            <button className="btn-secondary" onClick={() => setAddModalOpen(false)}>Cancelar</button>
                            <button className="btn-primary" style={{ backgroundColor: '#2ecc71' }} onClick={handleAddRestaurant}>Guardar Restaurante</button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}