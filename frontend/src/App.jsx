import { useEffect, useState } from 'react';
import { markupService } from './services/api';

function App() {
  const [markups, setMarkups] = useState([]);
  const [error, setError] = useState(null);

useEffect(() => {
  markupService.getAll()
    .then((response) => {
      // Cambio clave: acceder a .results
      console.log("Datos en results:", response.data.results);
      setMarkups(response.data.results); 
    })
    .catch((err) => {
      console.error("Error al conectar:", err);
      setError("No se pudo conectar con el servidor.");
    });
}, []);

  return (
    <div className="min-h-screen bg-gray-100 p-8">
      <div className="max-w-6xl mx-auto">
        <header className="flex justify-between items-center mb-8">
          <h1 className="text-3xl font-bold text-gray-800">Control de Markups</h1>
          <button className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition">
            + Nuevo Markup
          </button>
        </header>

        {error && (
          <div className="bg-red-100 border-l-4 border-red-500 text-red-700 p-4 mb-6">
            {error}
          </div>
        )}

        <div className="bg-white shadow-md rounded-xl overflow-hidden">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">N° Parte</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Revisión</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Responsable</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Estado</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200">
              {markups.length > 0 ? (
                markups.map((m) => (
                  <tr key={m.id} className="hover:bg-gray-50">
                    <td className="px-6 py-4 font-medium text-gray-900">{m.numero_parte}</td>
                    <td className="px-6 py-4 text-gray-600">{m.nueva_revision}</td>
                    <td className="px-6 py-4 text-gray-600">{m.responsable_detalle?.nombre || 'N/A'}</td>
                    <td className="px-6 py-4">
                      <span className="px-3 py-1 text-sm rounded-full bg-green-100 text-green-800">
                        {m.estado_detalle?.nombre}
                      </span>
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan="4" className="px-6 py-10 text-center text-gray-500">
                    No hay Markups registrados. Usa el panel de Django para crear el primero.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}

export default App;