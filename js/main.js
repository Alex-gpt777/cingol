document.addEventListener('DOMContentLoaded', () => {
    // Configuration
    const BOT_TOKEN = '8577333102:AAEnBNZCD1ygVZIrvQMmVUHE25q7IUQdSAg';
    const CHAT_ID = '-5231785842';

    // Mobile menu toggle
    const burger = document.querySelector('.burger');
    const nav = document.querySelector('.header__nav');

    if (burger) {
        burger.addEventListener('click', () => {
            burger.classList.toggle('active');
        });
    }

    // Modal logic
    const modal = document.getElementById('modal-callback');
    const btnCallback = document.getElementById('btn-callback');
    const btnClose = document.querySelector('.modal__close');

    const openModal = () => modal.classList.add('active');
    const closeModal = () => modal.classList.remove('active');

    if (btnCallback) btnCallback.addEventListener('click', openModal);
    if (btnClose) btnClose.addEventListener('click', closeModal);

    window.addEventListener('click', (e) => {
        if (e.target === modal) closeModal();
    });

    // Telegram sending logic
    const sendToTelegram = async (message) => {
        const url = `https://api.telegram.org/bot${BOT_TOKEN}/sendMessage`;
        const response = await fetch(url, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                chat_id: CHAT_ID,
                text: message,
                parse_mode: 'HTML'
            })
        });
        return response.ok;
    };

    // Form submission processing
    const forms = document.querySelectorAll('form');
    const notification = document.getElementById('notification');

    const showNotification = () => {
        notification.classList.add('active');
        setTimeout(() => {
            notification.classList.remove('active');
        }, 5000);
    };

    forms.forEach(form => {
        form.addEventListener('submit', async (e) => {
            e.preventDefault();

            const btn = form.querySelector('button');
            const originalText = btn.textContent;
            const formType = form.id === 'form-callback' ? 'Заказ звонка' : 'Заявка на прайс (Акция 3+1)';

            // Collect data
            const formData = new FormData(form);
            const name = form.querySelector('input[placeholder*="имя"]')?.value || 'Не указано';
            const phone = form.querySelector('input[placeholder*="Телефон"]')?.value || 'Не указано';
            const email = form.querySelector('input[placeholder*="Email"]')?.value || 'Не указано';

            // Prepare message
            const message = `
<b>🔔 НОВАЯ ЗАЯВКА С САЙТА</b>
<b>Тип:</b> ${formType}
<b>Имя:</b> ${name}
<b>Телефон:</b> ${phone}
${form.id === 'form-promo' ? `<b>Email:</b> ${email}` : ''}
            `;

            btn.disabled = true;
            btn.textContent = 'Отправка...';

            try {
                const success = await sendToTelegram(message);
                if (success) {
                    if (modal.classList.contains('active')) closeModal();
                    form.reset();
                    showNotification();
                } else {
                    alert('Ошибка при отправке. Попробуйте позже.');
                }
            } catch (error) {
                console.error('Error:', error);
                alert('Произошла ошибка. Проверьте подключение к интернету.');
            } finally {
                btn.disabled = false;
                btn.textContent = originalText;
            }
        });
    });

    // Smooth scroll
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function (e) {
            e.preventDefault();
            const targetId = this.getAttribute('href');
            if (targetId === '#') return;

            const targetElement = document.querySelector(targetId);
            if (targetElement) {
                window.scrollTo({
                    top: targetElement.offsetTop - 80,
                    behavior: 'smooth'
                });
            }
        });
    });

    // Particle effect
    const createParticle = () => {
        const particlesContainer = document.querySelector('.dust-particles');
        if (!particlesContainer) return;

        const particle = document.createElement('div');
        particle.style.position = 'absolute';
        particle.style.width = '2px';
        particle.style.height = '2px';
        particle.style.backgroundColor = 'rgba(255, 255, 255, 0.5)';
        particle.style.borderRadius = '50%';
        particle.style.left = Math.random() * 100 + '%';
        particle.style.top = Math.random() * 100 + '%';
        particle.style.opacity = Math.random();

        particlesContainer.appendChild(particle);

        const animation = particle.animate([
            { transform: 'translate(0, 0)', opacity: 0 },
            { transform: `translate(${Math.random() * 100 - 50}px, ${Math.random() * -100}px)`, opacity: 0.8 },
            { transform: `translate(${Math.random() * 200 - 100}px, ${Math.random() * -200}px)`, opacity: 0 }
        ], {
            duration: 3000 + Math.random() * 3000,
            easing: 'ease-out'
        });

        animation.onfinish = () => particle.remove();
    };

    setInterval(createParticle, 200);
});
