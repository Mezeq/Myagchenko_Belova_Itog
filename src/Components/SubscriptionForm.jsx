import React, { useState } from 'react';

const SubscriptionForm = () => {
  const [formData, setFormData] = useState({
    basketType: 'vegetable',
    deliveryDate: '',
    frequency: 'weekly',
    excludeItems: [],
    preferences: '',
    name: '',
    phone: ''
  });

  const [errors, setErrors] = useState({});
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [submissionData, setSubmissionData] = useState(null);

  const handleChange = (e) => {
    const { name, value, type } = e.target;
    
    if (type === 'checkbox') {
      const isChecked = e.target.checked;
      setFormData(prev => ({
        ...prev,
        excludeItems: isChecked
          ? [...prev.excludeItems, value]
          : prev.excludeItems.filter(item => item !== value)
      }));
    } else {
      setFormData(prev => ({
        ...prev,
        [name]: value
      }));
    }
    
    if (errors[name]) {
      setErrors(prev => ({
        ...prev,
        [name]: ''
      }));
    }
  };

  const validateForm = () => {
    const newErrors = {};
    
    if (!formData.name.trim()) {
      newErrors.name = 'Имя обязательно';
    }
    
    if (!formData.phone.trim()) {
      newErrors.phone = 'Телефон обязателен';
    } else if (!/^[\d\s+\-()]+$/.test(formData.phone)) {
      newErrors.phone = 'Некорректный телефон';
    }
    
    if (!formData.deliveryDate) {
      newErrors.deliveryDate = 'Выберите дату доставки';
    }
    
    return newErrors;
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    
    const formErrors = validateForm();
    
    if (Object.keys(formErrors).length === 0) {
      // Сохраняем заказ в localStorage
      const orderData = {
        ...formData,
        id: Date.now(),
        date: new Date().toISOString(),
        status: 'pending'
      };
      
      const existingOrders = JSON.parse(localStorage.getItem('greenBasketOrders') || '[]');
      existingOrders.push(orderData);
      localStorage.setItem('greenBasketOrders', JSON.stringify(existingOrders));
      
      // Показываем сообщение об успехе
      setSubmissionData(orderData);
      setIsSubmitted(true);
      
      // Очищаем форму
      setFormData({
        basketType: 'vegetable',
        deliveryDate: '',
        frequency: 'weekly',
        excludeItems: [],
        preferences: '',
        name: '',
        phone: ''
      });
      
      // Через 5 секунд скрываем сообщение
      setTimeout(() => {
        setIsSubmitted(false);
      }, 5000);
    } else {
      setErrors(formErrors);
    }
  };

  const basketTypes = [
    { value: 'vegetable', label: 'Овощная корзина' },
    { value: 'fruit', label: 'Фруктовая корзина' },
    { value: 'full', label: 'Полная корзина' },
    { value: 'vegan', label: 'Вегетарианская корзина' }
  ];

  const frequencies = [
    { value: 'weekly', label: 'Раз в неделю' },
    { value: 'biweekly', label: 'Раз в две недели' },
    { value: 'monthly', label: 'Раз в месяц' }
  ];

  const excludeOptions = [
    { value: 'potato', label: 'Картофель' },
    { value: 'onion', label: 'Лук' },
    { value: 'cabbage', label: 'Капуста' },
    { value: 'carrot', label: 'Морковь' }
  ];

  return (
    <div className="subscription-form">
      <form onSubmit={handleSubmit} noValidate>
        <div className="form-group">
          <label>Тип корзины *</label>
          <div className="radio-group">
            {basketTypes.map(type => (
              <label key={type.value} className="radio-label">
                <input
                  type="radio"
                  name="basketType"
                  value={type.value}
                  checked={formData.basketType === type.value}
                  onChange={handleChange}
                  required
                />
                <span>{type.label}</span>
              </label>
            ))}
          </div>
        </div>
        
        <div className="form-row">
          <div className="form-group">
            <label htmlFor="deliveryDate">Дата первой доставки *</label>
            <input
              type="date"
              id="deliveryDate"
              name="deliveryDate"
              value={formData.deliveryDate}
              onChange={handleChange}
              required
              min={new Date().toISOString().split('T')[0]}
              className={errors.deliveryDate ? 'error' : ''}
            />
            {errors.deliveryDate && (
              <span className="error-message">{errors.deliveryDate}</span>
            )}
          </div>
          
          <div className="form-group">
            <label htmlFor="frequency">Периодичность *</label>
            <select
              id="frequency"
              name="frequency"
              value={formData.frequency}
              onChange={handleChange}
              required
            >
              {frequencies.map(freq => (
                <option key={freq.value} value={freq.value}>
                  {freq.label}
                </option>
              ))}
            </select>
          </div>
        </div>
        
        <div className="form-group">
          <label>Исключить продукты</label>
          <div className="checkbox-group">
            {excludeOptions.map(option => (
              <label key={option.value} className="checkbox-label">
                <input
                  type="checkbox"
                  name="excludeItems"
                  value={option.value}
                  checked={formData.excludeItems.includes(option.value)}
                  onChange={handleChange}
                />
                <span>{option.label}</span>
              </label>
            ))}
          </div>
        </div>
        
        <div className="form-group">
          <label htmlFor="preferences">Пожелания</label>
          <textarea
            id="preferences"
            name="preferences"
            value={formData.preferences}
            onChange={handleChange}
            rows="3"
            placeholder="Ваши особые пожелания к составу корзины..."
          />
        </div>
        
        <div className="form-row">
          <div className="form-group">
            <label htmlFor="name">Имя *</label>
            <input
              type="text"
              id="name"
              name="name"
              value={formData.name}
              onChange={handleChange}
              required
              className={errors.name ? 'error' : ''}
            />
            {errors.name && <span className="error-message">{errors.name}</span>}
          </div>
          
          <div className="form-group">
            <label htmlFor="phone">Телефон *</label>
            <input
              type="tel"
              id="phone"
              name="phone"
              value={formData.phone}
              onChange={handleChange}
              required
              pattern="[\d\s\-\+\(\)]+"
              className={errors.phone ? 'error' : ''}
              placeholder="+7 (999) 123-45-67"
            />
            {errors.phone && <span className="error-message">{errors.phone}</span>}
          </div>
        </div>
        
        <button type="submit" className="btn">Оформить подписку</button>
      </form>
      
      {isSubmitted && submissionData && (
        <div className="success-message fade-in">
          <h4>✅ Подписка оформлена!</h4>
          <p>Спасибо, <strong>{submissionData.name}</strong>!</p>
          <p>Ваша <strong>{basketTypes.find(b => b.value === submissionData.basketType)?.label}</strong></p>
          <p>будет доставлена <strong>{new Date(submissionData.deliveryDate).toLocaleDateString('ru-RU')}</strong></p>
          <p>Телефон для связи: <strong>{submissionData.phone}</strong></p>
        </div>
      )}
      
      <style jsx>{`
        .subscription-form {
          width: 100%;
        }
        
        .form-row {
          display: grid;
          grid-template-columns: 1fr 1fr;
          gap: 20px;
        }
        
        @media (max-width: 576px) {
          .form-row {
            grid-template-columns: 1fr;
          }
        }
        
        .form-group {
          margin-bottom: 20px;
        }
        
        label {
          display: block;
          margin-bottom: 8px;
          font-weight: 500;
          color: var(--text-color);
        }
        
        input, select, textarea {
          width: 100%;
          padding: 12px 15px;
          border: 1px solid #ddd;
          border-radius: 5px;
          font-family: inherit;
          font-size: 1rem;
          transition: var(--transition);
        }
        
        input:focus, select:focus, textarea:focus {
          outline: none;
          border-color: var(--primary-color);
          box-shadow: 0 0 0 3px rgba(46, 125, 50, 0.1);
        }
        
        input.error, select.error, textarea.error {
          border-color: #e74c3c;
          background-color: #fff8f8;
        }
        
        .error-message {
          display: block;
          color: #e74c3c;
          font-size: 0.875rem;
          margin-top: 5px;
        }
        
        .radio-group, .checkbox-group {
          display: grid;
          grid-template-columns: repeat(auto-fit, minmax(150px, 1fr));
          gap: 10px;
        }
        
        .radio-label, .checkbox-label {
          display: flex;
          align-items: center;
          gap: 8px;
          cursor: pointer;
          padding: 10px;
          border-radius: 5px;
          background-color: var(--white);
          transition: var(--transition);
        }
        
        .radio-label:hover, .checkbox-label:hover {
          background-color: #f0f9f0;
        }
        
        .radio-label input[type="radio"],
        .checkbox-label input[type="checkbox"] {
          width: auto;
        }
        
        button[type="submit"] {
          width: 100%;
          margin-top: 10px;
        }
        
        .success-message {
          margin-top: 25px;
          padding: 20px;
          background-color: #d4edda;
          border: 1px solid #c3e6cb;
          border-radius: 5px;
          color: #155724;
          text-align: center;
        }
        
        .success-message h4 {
          color: #155724;
          margin-bottom: 10px;
        }
        
        .success-message p {
          margin-bottom: 5px;
        }
      `}</style>
    </div>
  );
};

export default SubscriptionForm;