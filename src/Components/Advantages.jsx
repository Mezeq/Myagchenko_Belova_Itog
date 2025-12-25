import React from 'react';

const Advantages = () => {
  const advantages = [
    {
      icon: 'fas fa-handshake',
      title: 'Прямые поставки',
      description: 'Работаем напрямую с фермерами, без посредников'
    },
    {
      icon: 'fas fa-seedling',
      title: '100% экологично',
      description: 'Натуральные продукты без химии и ГМО'
    },
    {
      icon: 'fas fa-hands-helping',
      title: 'Поддержка локального бизнеса',
      description: 'Помогаем развиваться местным фермерам'
    },
    {
      icon: 'fas fa-user-cog',
      title: 'Персонализация',
      description: 'Настраивайте корзину под свои предпочтения'
    }
  ];

  return (
    <section id="advantages" className="advantages">
      <div className="container">
        <h2 className="section-title">Наши преимущества</h2>
        <div className="advantages-grid">
          {advantages.map((advantage, index) => (
            <div 
              key={index} 
              className="advantage-card fade-in"
              style={{ animationDelay: `${index * 0.1}s` }}
            >
              <div className="advantage-icon">
                <i className={advantage.icon}></i>
              </div>
              <h3>{advantage.title}</h3>
              <p>{advantage.description}</p>
            </div>
          ))}
        </div>
      </div>
      
      <style jsx>{`
        .advantages {
          background-color: var(--light-gray);
        }
        
        .advantages-grid {
          display: grid;
          grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
          gap: 30px;
        }
        
        .advantage-card {
          background-color: var(--white);
          padding: 40px 25px;
          border-radius: 10px;
          text-align: center;
          box-shadow: var(--shadow);
          transition: var(--transition);
          opacity: 0;
          animation-fill-mode: forwards;
        }
        
        .advantage-card:hover {
          transform: translateY(-10px);
          box-shadow: 0 15px 30px rgba(0, 0, 0, 0.15);
        }
        
        .advantage-icon {
          font-size: 3.5rem;
          color: var(--primary-color);
          margin-bottom: 20px;
          transition: var(--transition);
        }
        
        .advantage-card:hover .advantage-icon {
          color: var(--secondary-color);
          transform: rotate(15deg) scale(1.1);
        }
        
        .advantage-card h3 {
          margin-bottom: 15px;
          color: var(--primary-dark);
        }
        
        .advantage-card p {
          color: var(--text-color);
          opacity: 0.8;
          line-height: 1.6;
        }
        
        @media (max-width: 768px) {
          .advantages-grid {
            grid-template-columns: 1fr;
            max-width: 400px;
            margin: 0 auto;
          }
        }
      `}</style>
    </section>
  );
};

export default Advantages;