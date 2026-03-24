import { useEffect, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import api from '../api/axios';

export default function Home() {
    const [restaurants, setRestaurants] = useState([]);
    const [error, setError] = useState('');
    const navigate = useNavigate();
    const [isLoggedIn, setIsLoggedIn] = useState(false);

    // Modal de creación de reseña
    const [modalOpen, setModalOpen] = useState(false);
    const [currentReview, setCurrentReview] = useState({ restaurantId: null, rating: 0 });
    const [commentText, setCommentText] = useState('');

    // Nuevo estado para controlar qué restaurante tiene las reseñas desplegadas
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

    // Función para mostrar/ocultar los comentarios de un restaurante
    const toggleReviews = (id) => {
        if (expandedId === id) {
            setExpandedId(null); // Si ya estaba abierto, lo cierra
        } else {
            setExpandedId(id); // Si estaba cerrado, lo abre
        }
    };

    return (
        <div className="container">
            <header className="header">
                <h1>🍽️ DineGo</h1>
                
                {isLoggedIn ? (
                    <button 
                        className="btn-primary" 
                        onClick={handleLogout}
                        style={{ backgroundColor: '#7f8c8d' }} 
                    >
                        Cerrar Sesión
                    </button>
                ) : (
                    <Link to="/login">
                        <button className="btn-primary">Iniciar Sesión</button>
                    </Link>
                )}
            </header>

            {error && <p style={{ color: 'red', textAlign: 'center' }}>{error}</p>}

            <div className="grid">
                {restaurants.map(restaurant => (
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

                        {/* Botón para desplegar las reseñas */}
                        <button 
                            className="btn-secondary" 
                            style={{ width: '100%', fontSize: '0.9rem' }}
                            onClick={() => toggleReviews(restaurant.id)}
                        >
                            {expandedId === restaurant.id ? 'Ocultar Reseñas ↑' : 'Ver Reseñas ↓'}
                        </button>

                        {/* Caja de comentarios que aparece al darle clic */}
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
                                        Aún no hay reseñas. ¡Inicia sesión y sé el primero en comentar!
                                    </p>
                                )}
                            </div>
                        )}
                    </div>
                ))}
            </div>

            {modalOpen && (
                <div className="modal-overlay">
                    <div className="modal-content">
                        <h3>Calificando con {currentReview.rating} Estrellas ⭐</h3>
                        <p>Cuéntanos tu experiencia en este lugar:</p>
                        
                        <textarea 
                            rows="4" 
                            placeholder="La comida estuvo excelente, el servicio muy rápido..."
                            value={commentText}
                            onChange={(e) => setCommentText(e.target.value)}
                        ></textarea>
                        
                        <div className="modal-actions">
                            <button className="btn-secondary" onClick={() => setModalOpen(false)}>
                                Cancelar
                            </button>
                            <button className="btn-primary" onClick={submitReview}>
                                Publicar Reseña
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}