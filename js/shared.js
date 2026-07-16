// shared.js - Lógica Compartilhada e Utilitários de Simulação

// Localidades pré-definidas para simulação em São Paulo
const PRESET_LOCATIONS = {
    "av_paulista": { name: "Avenida Paulista, 1000", lat: -23.5615, lng: -46.6560 },
    "pq_ibirapuera": { name: "Parque do Ibirapuera", lat: -23.5874, lng: -46.6576 },
    "aeroporto_congonhas": { name: "Aeroporto de Congonhas (CGH)", lat: -23.6273, lng: -46.6563 },
    "vila_olimpia": { name: "Vila Olímpia (Tech Hub)", lat: -23.5954, lng: -46.6853 },
    "maracana": { name: "Estação Consolação", lat: -23.5587, lng: -46.6601 },
    "centro_praca_se": { name: "Praça da Sé, Centro", lat: -23.5505, lng: -46.6333 }
};

// Configurações de Tarifas por Categoria
const CATEGORIES = {
    "UberX": { name: "UberX", pricePerKm: 2.20, baseFare: 5.00, etaMultiplier: 1.0, icon: "🚗" },
    "UberVIP": { name: "Uber VIP", pricePerKm: 2.70, baseFare: 6.50, etaMultiplier: 0.8, icon: "⭐" },
    "UberBlack": { name: "Uber Black", pricePerKm: 4.50, baseFare: 10.00, etaMultiplier: 0.7, icon: "🕶️" },
    "UberFlash": { name: "Uber Flash", pricePerKm: 2.00, baseFare: 4.50, etaMultiplier: 1.1, icon: "📦" }
};

// Ícones Customizados para o Leaflet Map
function getPassengerMarkerIcon() {
    return L.divIcon({
        className: 'custom-marker passenger-marker',
        html: `<div style="background-color: #2f80ed; width: 14px; height: 14px; border-radius: 50%; border: 3px solid #fff; box-shadow: 0 0 10px rgba(0,0,0,0.5);"></div>`,
        iconSize: [20, 20],
        iconAnchor: [10, 10]
    });
}

function getDriverMarkerIcon(status = 'available') {
    const color = status === 'busy' ? '#f59e0b' : '#10b981';
    return L.divIcon({
        className: 'custom-marker driver-marker',
        html: `<div style="background-color: #000; color: ${color}; width: 34px; height: 34px; border-radius: 50%; border: 2px solid ${color}; display: flex; align-items: center; justify-content: center; font-size: 16px; box-shadow: 0 2px 8px rgba(0,0,0,0.4); transform: rotate(0deg); transition: transform 0.2s;">🚗</div>`,
        iconSize: [36, 36],
        iconAnchor: [18, 18]
    });
}

function getDestinationMarkerIcon() {
    return L.divIcon({
        className: 'custom-marker dest-marker',
        html: `<div style="background-color: #ef4444; width: 16px; height: 16px; border-radius: 4px; border: 3px solid #fff; box-shadow: 0 0 10px rgba(0,0,0,0.5);"></div>`,
        iconSize: [20, 20],
        iconAnchor: [10, 10]
    });
}

// Calcula a distância geodésica em Km entre duas coordenadas (Fórmula de Haversine)
function calculateDistance(lat1, lon1, lat2, lon2) {
    const R = 6371; // Raio da Terra em Km
    const dLat = (lat2 - lat1) * Math.PI / 180;
    const dLon = (lon2 - lon1) * Math.PI / 180;
    const a = 
        Math.sin(dLat/2) * Math.sin(dLat/2) +
        Math.cos(lat1 * Math.PI / 180) * Math.cos(lat2 * Math.PI / 180) * 
        Math.sin(dLon/2) * Math.sin(dLon/2);
    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1-a));
    const d = R * c;
    return d;
}

// Estima o preço da corrida com base na distância e categoria
function estimateFare(distanceKm, category) {
    const rate = CATEGORIES[category];
    if (!rate) return 0;
    return rate.baseFare + (distanceKm * rate.pricePerKm);
}

// Gera uma rota contínua (lista de coordenadas lat/lng) ligando a origem ao destino
// Para simular as curvas reais de ruas, adicionamos pontos intermediários simulados
function generateRouteCoordinates(startLat, startLng, endLat, endLng, steps = 80) {
    const coords = [];
    
    // Vamos adicionar uma curva parabólica suave para simular ruas em vez de uma linha reta perfeita
    const midLat = (startLat + endLat) / 2;
    const midLng = (startLng + endLng) / 2;
    
    // Adiciona uma deflexão para desviar o caminho levemente
    const offsetLat = (endLng - startLng) * 0.15;
    const offsetLng = (startLat - endLat) * 0.15;
    
    const controlLat = midLat + offsetLat;
    const controlLng = midLng + offsetLng;

    // Interpolação quadrática de Bezier
    for (let i = 0; i <= steps; i++) {
        const t = i / steps;
        
        // Bezier formula: B(t) = (1-t)^2 * P0 + 2*(1-t)*t * P1 + t^2 * P2
        const lat = Math.pow(1 - t, 2) * startLat + 2 * (1 - t) * t * controlLat + Math.pow(t, 2) * endLat;
        const lng = Math.pow(1 - t, 2) * startLng + 2 * (1 - t) * t * controlLng + Math.pow(t, 2) * endLng;
        
        // Adiciona um micro-ruído nas ruas
        const noiseLat = (Math.random() - 0.5) * 0.0001;
        const noiseLng = (Math.random() - 0.5) * 0.0001;
        
        coords.push([lat + noiseLat, lng + noiseLng]);
    }
    
    return coords;
}
