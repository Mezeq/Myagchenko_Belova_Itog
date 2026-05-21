import React, { useState, useEffect } from 'react';
import { reviewsAPI } from '../api';

const Reviews = () => {
  const [currentReview, setCurrentReview] = useState(0);
  const [reviews, setReviews] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    reviewsAPI.getAll()
      .then(res => setReviews(res.data))
      .catch(() => {})
      .finally(() => setLoading(false));
  }, []);

  const nextReview = () => {
    setCurrentReview((prev) => (prev + 1) % reviews.length);
  };

  const prevReview = () => {
    setCurrentReview((prev) => (prev - 1 + reviews.length) % reviews.length);
  };

  if (loading) {
    return (
      <section id="reviews" className="reviews">
        <div className="container">
          <h2 className="section-title">Отзывы наших клиентов</h2>
          <p style={{ textAlign: 'center', color: '#888' }}>Загрузка...</p>
        </div>
      </section>
    );
  }

  if (reviews.length === 0) {
    return (
      <section id="reviews" className="reviews">
        <div className="container">
          <h2 className="section-title">Отзывы наших клиентов</h2>
          <p style={{ textAlign: 'center', color: '#888' }}>Отзывов пока нет</p>
        </div>
      </section>
    );
  }

  return (
    <section id="reviews" className="reviews">
      <div className="container">
        <h2 className="section-title">Отзывы наших клиентов</h2>

        <div className="reviews-slider">
          <button className="slider-btn prev" onClick={prevReview}>
            <i className="fas fa-chevron-left"></i>
          </button>

          <div className="review-container">
            {reviews.map((review, index) => (
              <div
                key={review.id}
                className={`review ${index === currentReview ? 'active' : ''}`}
              >
                <div className="review-header">
                  <img src={review.image} alt={review.name} className="review-avatar" />
                  <div>
                    <h3>{review.name}</h3>
                    <div className="review-rating">
                      {[...Array(5)].map((_, i) => (
                        <i
                          key={i}
                          className={`fas fa-star ${i < review.rating ? 'filled' : ''}`}
                        ></i>
                      ))}
                    </div>
                  </div>
                </div>
                <p className="review-text">"{review.text}"</p>
              </div>
            ))}
          </div>

          <button className="slider-btn next" onClick={nextReview}>
            <i className="fas fa-chevron-right"></i>
          </button>
        </div>

        <div className="review-dots">
          {reviews.map((_, index) => (
            <button
              key={index}
              className={`dot ${index === currentReview ? 'active' : ''}`}
              onClick={() => setCurrentReview(index)}
              aria-label={`Перейти к отзыву ${index + 1}`}
            />
          ))}
        </div>
      </div>

      <style jsx>{`
        .reviews { background-color: var(--light-gray); }
        .reviews-slider { display: flex; align-items: center; justify-content: center; gap: 30px; max-width: 800px; margin: 0 auto; }
        .review-container { flex: 1; overflow: hidden; position: relative; height: 300px; }
        .review { position: absolute; top: 0; left: 0; right: 0; background-color: var(--white); padding: 40px; border-radius: 10px; box-shadow: var(--shadow); opacity: 0; transform: translateX(100px); transition: all 0.5s ease; height: 100%; display: flex; flex-direction: column; justify-content: center; }
        .review.active { opacity: 1; transform: translateX(0); }
        .review-header { display: flex; align-items: center; gap: 20px; margin-bottom: 25px; }
        .review-avatar { width: 80px; height: 80px; border-radius: 50%; object-fit: cover; border: 3px solid var(--primary-color); }
        .review-header h3 { margin-bottom: 8px; color: var(--primary-dark); }
        .review-rating { color: var(--secondary-color); font-size: 1.1rem; }
        .review-rating .fa-star { margin-right: 3px; }
        .review-rating .fa-star:not(.filled) { color: #ddd; }
        .review-text { font-size: 1.1rem; line-height: 1.8; color: var(--text-color); font-style: italic; }
        .slider-btn { background-color: var(--primary-color); color: white; border: none; width: 50px; height: 50px; border-radius: 50%; cursor: pointer; font-size: 1.2rem; transition: var(--transition); display: flex; align-items: center; justify-content: center; }
        .slider-btn:hover { background-color: var(--primary-dark); transform: scale(1.1); }
        .review-dots { display: flex; justify-content: center; gap: 10px; margin-top: 30px; }
        .dot { width: 12px; height: 12px; border-radius: 50%; border: none; background-color: #ddd; cursor: pointer; transition: var(--transition); }
        .dot.active { background-color: var(--primary-color); transform: scale(1.2); }
        @media (max-width: 768px) { .reviews-slider { gap: 15px; } .slider-btn { width: 40px; height: 40px; font-size: 1rem; } .review { padding: 25px; } .review-avatar { width: 60px; height: 60px; } }
        @media (max-width: 576px) { .reviews-slider { flex-direction: column; gap: 20px; } .review-container { height: 350px; } .slider-btn { order: 3; } }
      `}</style>
    </section>
  );
};

export default Reviews;
