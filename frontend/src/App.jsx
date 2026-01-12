import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider } from './context/AuthContext';
import { useAuth } from './hooks/useAuth';
import Login from './pages/Login';
import Home from './pages/Home';
import ListaCategorias from './pages/categorias/ListaCategorias';
import FormCategoria from './pages/categorias/FormCategoria';
import ListaProdutos from './pages/produtos/ListaProdutos';
import FormProduto from './pages/produtos/FormProduto';
import ListaClientes from './pages/clientes/ListaClientes';
import FormCliente from './pages/clientes/FormCliente';
import ListaVendas from './pages/vendas/ListaVendas';
import FormVenda from './pages/vendas/FormVenda';
import DetalhesVenda from './pages/vendas/DetalhesVenda';
import EditarVenda from './pages/vendas/EditarVenda';
import ListaFormasPagamento from './pages/formaspagamento/ListaFormasPagamento';
import FormFormaPagamento from './pages/formaspagamento/FormFormaPagamento';
import RelatorioVendas from './pages/relatorios/RelatorioVendas';
import RelatorioEstoque from './pages/relatorios/RelatorioEstoque';
import ListaContasPagar from './pages/contaspagar/ListaContasPagar';
import FormContaPagar from './pages/contaspagar/FormContaPagar';
import DetalhesContaPagar from './pages/contaspagar/DetalhesContaPagar';
import CalendarioContasPagar from './pages/contaspagar/CalendarioContasPagar';
import LayoutMain from './components/LayoutMain';


// Componente para proteger rotas
function PrivateRoute({ children }) {
  const { user, loading } = useAuth();

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-xl">Carregando...</div>
      </div>
    );
  }

  return user ? <LayoutMain>{children}</LayoutMain> : <Navigate to="/login" />;
}

// Componente para rotas públicas
function PublicRoute({ children }) {
  const { user, loading } = useAuth();

  if (loading) { return <div>Carregando...</div>; }

  return user ? <Navigate to="/dashboard" /> : children;
}

function App() {
  return (
    <Router>
      <AuthProvider>
        <Routes>
          <Route path="/login" element={<PublicRoute><Login /></PublicRoute>} />

          <Route path="/dashboard" element={<PrivateRoute><Home /></PrivateRoute>} />

          {/* Rotas de Categorias */}
          <Route path="/categorias" element={<PrivateRoute><ListaCategorias /></PrivateRoute>} />
          <Route path="/categorias/nova" element={<PrivateRoute><FormCategoria /></PrivateRoute>} />
          <Route path="/categorias/:id/editar" element={<PrivateRoute><FormCategoria /></PrivateRoute>} />

          {/* Produtos */}
          <Route path="/produtos" element={<PrivateRoute><ListaProdutos /></PrivateRoute>} />
          <Route path="/produtos/novo" element={<PrivateRoute><FormProduto /></PrivateRoute>} />
          <Route path="/produtos/:id/editar" element={<PrivateRoute><FormProduto /></PrivateRoute>} />

          {/* Clientes */}
          <Route path="/clientes" element={<PrivateRoute><ListaClientes /></PrivateRoute>} />
          <Route path="/clientes/novo" element={<PrivateRoute><FormCliente /></PrivateRoute>} />
          <Route path="/clientes/:id/editar" element={<PrivateRoute><FormCliente /></PrivateRoute>} />

          {/* Vendas */}
          <Route path="/vendas" element={<PrivateRoute><ListaVendas /></PrivateRoute>} />
          <Route path="/vendas/nova" element={<PrivateRoute><FormVenda /></PrivateRoute>} />
          <Route path="/vendas/:id" element={<PrivateRoute><DetalhesVenda /></PrivateRoute>} />
          <Route path="/vendas/:id/editar" element={<PrivateRoute><EditarVenda /></PrivateRoute>} />

          {/* Formas de Pagamento */}
          <Route path="/formaspagamento" element={<PrivateRoute><ListaFormasPagamento /></PrivateRoute>} />
          <Route path="/formaspagamento/nova" element={<PrivateRoute><FormFormaPagamento /></PrivateRoute>} />
          <Route path="/formaspagamento/:id/editar" element={<PrivateRoute><FormFormaPagamento /></PrivateRoute>} />

          {/* Relatórios */}
          <Route path="/relatorios/vendas" element={<PrivateRoute><RelatorioVendas /></PrivateRoute>} />
          <Route path="/relatorios/estoque" element={<PrivateRoute><RelatorioEstoque /></PrivateRoute>} />

          {/* Contas a Pagar */}
          <Route path="/contas-pagar" element={<PrivateRoute><ListaContasPagar /></PrivateRoute>} />
          <Route path="/contas-pagar/nova" element={<PrivateRoute><FormContaPagar /></PrivateRoute>} />
          <Route path="/contas-pagar/:id" element={<PrivateRoute><DetalhesContaPagar /></PrivateRoute>} />
          <Route path="/contas-pagar/:id/editar" element={<PrivateRoute><FormContaPagar /></PrivateRoute>} />
          <Route path="/contas-pagar/calendario" element={<PrivateRoute><CalendarioContasPagar /></PrivateRoute>} />

          <Route path="/" element={<Navigate to="/dashboard" />} />
        </Routes>
      </AuthProvider>
    </Router>
  );
}

export default App;
