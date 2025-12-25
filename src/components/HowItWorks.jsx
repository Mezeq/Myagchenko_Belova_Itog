import React from 'react';

const HowItWorks = () => {
  const steps = [
    {
      icon: 'fas fa-shopping-basket',
      title: 'Выберите корзину',
      description: 'Подберите подходящий набор продуктов из нашего каталога'
    },
    {
      icon: 'fas fa-cogs',
      title: 'Настройте состав',
      description: 'Исключите нелюбимые продукты и добавьте предпочтения'
    },
    {
      icon: 'fas fa-truck',
      title: 'Получите доставку',
      description: 'Мы привезем свежие продукты в удобное для вас время'
    },
    {
      icon: 'fas fa-heart',
      title: 'Наслаждайтесь!',
      description: 'Готовьте вкусные и полезные блюда из фермерских продуктов'
    }
  ];

  return (
    <section id="how-it-works" className="how-it-works">
      <div className="container">
        <h2 className="section-title">Как это работает</h2>
        <div className="steps">
          {steps.map((step, index) => (
            <div 
              key={index} 
              className={`step ${index % 2 === 0 ? 'slide-in-left' : 'slide-in-right'}`}
              style={{ animationDelay: `${index * 0.2}s` }}
            >
              <div className="step-icon">
                <i className={step.icon}></i>
              </div>
              <div className="step-content">
                <div className="step-number">{index + 1}</div>
                <h3>{step.title}</h3>
                <p>{step.description}</p>
              </div>
            </div>
          ))}
        </div>
      </div>
      
      <style jsx>{`
        .how-it-works {
          background-color: var(--white);
        }
        
        .steps {
          display: grid;
          grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
          gap: 40px;
          max-width: 1000px;
          margin: 0 auto;
        }
        
        .step {
          text-align: center;
          padding: 30px 20px;
          border-radius: 10px;
          transition: var(--transition);
          opacity: 0;
          animation-fill-mode: forwards;
        }
        
        .step:hover {
          transform: translateY(-10px);
          box-shadow: var(--shadow);
        }
        
        .step-icon {
          font-size: 3rem;
          color: var(--primary-color);
          margin-bottom: 20px;
          transition: var(--transition);
        }
        
        .step:hover .step-icon {
          transform: scale(1.1);
          color: var(--secondary-color);
        }
        
        .step-number {
          display: inline-block;
          width: 40px;
          height: 40px;
          background-color: var(--primary-color);
          color: white;
          border-radius: 50%;
          line-height: 40px;
          font-weight: bold;
          margin-bottom: 15px;
          transition: var(--transition);
        }
        
        .step:hover .step-number {
          background-color: var(--secondary-color);
          transform: rotate(360deg);
        }
        
        .step h3 {
          margin-bottom: 10px;
          color: var(--primary-dark);
        }
        
        .step p {
          color: var(--text-color);
          opacity: 0.8;
        }
        
        @media (max-width: 768px) {
          .steps {
            grid-template-columns: 1fr;
            max-width: 400px;
          }
        }
      `}</style>
    </section>
  );
};

export default HowItWorks;