/**
 * @page HomePage
 * @summary Home page displaying welcome message and system overview
 * @domain core
 * @type landing-page
 * @category public
 */
export const HomePage = () => {
  return (
    <div className="text-center">
      <h2 className="text-3xl font-bold text-gray-900 mb-4">Bem-vindo ao StockBox</h2>
      <p className="text-lg text-gray-600 mb-8">Sistema de Controle de Estoque</p>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 max-w-4xl mx-auto">
        <div className="bg-white p-6 rounded-lg shadow">
          <h3 className="text-xl font-semibold text-gray-900 mb-2">Gestão de Produtos</h3>
          <p className="text-gray-600">Cadastre e gerencie seus produtos com facilidade</p>
        </div>
        <div className="bg-white p-6 rounded-lg shadow">
          <h3 className="text-xl font-semibold text-gray-900 mb-2">Controle de Movimentações</h3>
          <p className="text-gray-600">Registre entradas e saídas automaticamente</p>
        </div>
        <div className="bg-white p-6 rounded-lg shadow">
          <h3 className="text-xl font-semibold text-gray-900 mb-2">Alertas Inteligentes</h3>
          <p className="text-gray-600">Receba notificações de estoque baixo</p>
        </div>
      </div>
    </div>
  );
};

export default HomePage;
