document.addEventListener("DOMContentLoaded", () => {
    const bookBtn = document.getElementById("bookBtn");
    const message = document.getElementById("message");
    const timeInput = document.getElementById("time");
    const serviceSelect = document.getElementById("service");
    const dateInput = document.getElementById("date");
    const viewBookingsBtn = document.getElementById("viewBookingsBtn");
    const clientBookings = document.getElementById("clientBookings");

    // Exibir opções de manutenção quando "Manutenção" é selecionado
    serviceSelect.addEventListener("change", () => {
        const manutencaoOptions = document.getElementById("manutencaoOptions");
        manutencaoOptions.style.display = serviceSelect.value === "Manutenção" ? "block" : "none";
    });

    // Função para salvar agendamento
    if (bookBtn) {
        bookBtn.addEventListener("click", () => {
            const date = dateInput.value;
            const time = timeInput.value;
            const service = serviceSelect.value;
            const clientName = document.getElementById("clientName").value;
            const manutencaoOption = service === "Manutenção" ? document.getElementById("manutencaoOption").value : null;

            if (!date || !clientName || !time || !service) {
                message.textContent = "Por favor, preencha todos os campos.";
                message.style.color = "red";
                return;
            }

            const bookingDateTime = new Date(`${date}T${time}`);
            const formattedDate = bookingDateTime.toLocaleDateString('pt-BR');
            const formattedTime = bookingDateTime.toLocaleTimeString('pt-BR', { hour: '2-digit', minute: '2-digit' });

            let bookings = JSON.parse(localStorage.getItem("bookings")) || {};

            if (!bookings[formattedDate]) {
                bookings[formattedDate] = [];
            }

            const conflict = bookings[formattedDate].some(entry => entry.time === formattedTime && entry.service === service);
            if (conflict) {
                message.textContent = "Horário já reservado para este serviço. Escolha outro horário.";
                message.style.color = "red";
            } else {
                bookings[formattedDate].push({ time: formattedTime, service, clientName, manutencao: manutencaoOption });
                localStorage.setItem("bookings", JSON.stringify(bookings));
                message.textContent = `Agendamento confirmado para ${formattedDate} às ${formattedTime}!`;
                message.style.color = "green";
            }
        });
    }

    // Exibir os agendamentos para o cliente
    if (viewBookingsBtn) {
        viewBookingsBtn.addEventListener("click", () => {
            const bookings = JSON.parse(localStorage.getItem("bookings")) || {};
            let output = "<h2>Seus Agendamentos</h2>";
            for (const date in bookings) {
                output += `<h3>${date}</h3><ul>`;
                bookings[date].forEach((booking) => {
                    output += `<li>${booking.time} - ${booking.service} ${booking.manutencao ? `(${booking.manutencao})` : ''} (Cliente: ${booking.clientName})</li>`;
                });
                output += "</ul>";
            }
            clientBookings.innerHTML = output;
        });
    }

    // Lógica do painel do administrador
    const loginBtn = document.getElementById("loginBtn");
    const username = document.getElementById("username");
    const password = document.getElementById("password");
    const loginMessage = document.getElementById("loginMessage");
    const adminCalendar = document.getElementById("adminCalendar");
    const bookingsContainer = document.getElementById("bookingsContainer");

    if (loginBtn) {
        loginBtn.addEventListener("click", () => {
            if (username.value === "Juliana" && password.value === "Lari2107") {
                document.getElementById("loginSection").style.display = "none";
                adminCalendar.style.display = "block";
                displayBookings(); // Mostra os agendamentos após o login
            } else {
                loginMessage.textContent = "Usuário ou senha incorretos.";
                loginMessage.style.color = "red";
            }
        });
    }

    const displayBookings = () => {
        const bookings = JSON.parse(localStorage.getItem("bookings")) || {};
        let output = "<ul>";
        for (const date in bookings) {
            output += `<h3>${date}</h3><ul>`;
            bookings[date].forEach((booking, index) => {
                output += `<li>
                    ${booking.time} - ${booking.service} ${booking.manutencao ? `(${booking.manutencao})` : ''} (Cliente: ${booking.clientName})
                    <button class="delete-btn" onclick="deleteBooking('${date}', ${index})">Excluir</button>
                </li>`;
            });
            output += "</ul>";
        }
        bookingsContainer.innerHTML = output;
    };

    window.deleteBooking = (date, index) => {
        const bookings = JSON.parse(localStorage.getItem("bookings")) || {};
        if (bookings[date]) {
            bookings[date].splice(index, 1);
            if (bookings[date].length === 0) {
                delete bookings[date];
            }
            localStorage.setItem("bookings", JSON.stringify(bookings));
            displayBookings();
        }
    };

    document.getElementById("logoutBtn").addEventListener("click", () => {
        adminCalendar.style.display = "none";
        document.getElementById("loginSection").style.display = "block";
    });
});
