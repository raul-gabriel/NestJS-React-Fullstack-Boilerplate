import React from 'react';

const Preloader: React.FC = () => {
  const phrases = [
    "Un momento, estamos trabajando en ello...",
    "Cargando... porque las cosas buenas toman tiempo.",
    "Preparando todo para ti, gracias por tu paciencia.",
    "Solo un segundo más, ¡estamos casi listos!",
    "Organizando la información... prometemos no tardar.",
    "Todo listo en breve... mientras tanto, respira.",
    "Gracias por esperar, estamos ajustando los detalles.",
    "¡Casi terminamos! Sabemos que la espera vale la pena.",
    "No tomará mucho tiempo, solo estamos afinando.",
    "Ajustando las piezas, no tardaremos nada.",
  ];

  const randomPhrase = phrases[Math.floor(Math.random() * phrases.length)];

  return (
   <div className="fixed inset-0 z-50 flex flex-col items-center justify-center bg-white/80 backdrop-blur-sm">

  {/* Spinner */}
  <div className="relative w-16 h-16 mb-4">
    <div className="absolute inset-0 rounded-full border-4 border-gray-200"></div>
    <div className="absolute inset-0 rounded-full border-4 border-t-teal-500 border-transparent animate-spin"></div>
  </div>

  {/* Loading message */}
  <p className="text-gray-700 text-lg md:text-xl font-medium text-center">
    {randomPhrase}
  </p>

</div>
  );
};

export default Preloader;
