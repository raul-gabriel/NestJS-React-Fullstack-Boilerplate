const NotFound = () => {
    return (
        <div className="flex items-center justify-center min-h-screen bg-gray-100">
            <div className="text-center p-8 bg-white rounded-lg shadow-2xl w-full max-w-lg">
                <h1 className="text-8xl font-extrabold text-primary-600">404</h1>
                <p className="text-xl text-gray-500 mt-4">Ups! La página que buscas no existe.</p>
                <p className="mt-6 text-sm text-gray-400">
                    Pero no te preocupes, puedes volver a la <a href="/" className="text-primary-600 hover:underline">página principal</a>.
                </p>
                <div className="mt-6">
                    <svg
                        xmlns="http://www.w3.org/2000/svg"
                        className="w-16 h-16 mx-auto text-primary-600 animate-bounce"
                        viewBox="0 0 24 24"
                        fill="none"
                        stroke="currentColor"
                        strokeWidth="2"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                    >
                        <path d="M12 2v20M5 12l7 7 7-7" />
                    </svg>
                </div>
            </div>
        </div>
    );
};

export default NotFound;
