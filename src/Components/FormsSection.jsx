import React from 'react';
import ContactForm from './ContactForm';
import SubscriptionForm from './SubscriptionForm';

const FormsSection = () => {
  return (
    <section id="order" className="forms-section">
      <div className="container">
        <h2 className="section-title">Оформить заказ</h2>
        <div className="forms-container">
          <div className="form-wrapper">
            <h3>Настройте свою корзину</h3>
            <SubscriptionForm />
          </div>
          <div className="form-wrapper">
            <h3>Обратная связь и регистрация</h3>
            <ContactForm />
          </div>
        </div>
      </div>
      
      <style jsx>{`
        .forms-section {
          background-color: var(--white);
        }
        
        .forms-container {
          display: grid;
          grid-template-columns: repeat(auto-fit, minmax(350px, 1fr));
          gap: 50px;
          max-width: 1000px;
          margin: 0 auto;
        }
        
        .form-wrapper {
          background-color: var(--light-gray);
          padding: 40px;
          border-radius: 10px;
          box-shadow: var(--shadow);
          transition: var(--transition);
        }
        
        .form-wrapper:hover {
          transform: translateY(-5px);
          box-shadow: 0 10px 25px rgba(0, 0, 0, 0.1);
        }
        
        .form-wrapper h3 {
          text-align: center;
          margin-bottom: 25px;
          color: var(--primary-dark);
        }
        
        @media (max-width: 768px) {
          .forms-container {
            grid-template-columns: 1fr;
            max-width: 500px;
          }
          
          .form-wrapper {
            padding: 30px 25px;
          }
        }
      `}</style>
    </section>
  );
};

export default FormsSection;