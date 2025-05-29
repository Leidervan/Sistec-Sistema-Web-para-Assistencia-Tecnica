// Sistema de Assistência Técnica - JavaScript com Vue.js
const { createApp } = Vue;

createApp({
  data() {
    return {
      // Estado da interface
      isSidebarCollapsed: false,
      currentPage: 'dashboard',
      currentTime: '',
      
      // Alertas
      showAlert: false,
      alertType: 'success',
      alertMessage: '',
      alertIcon: 'fa-check-circle',
      
      // Estados de formulários
      showCadastroCliente: false,
      showCadastroPeca: false,
      showCadastroFornecedor: false,
      editingIndex: null,
      
      // Filtros de busca
      filtroCliente: '',
      filtroPeca: '',
      filtroFornecedor: '',
      
      // Dados dos formulários
      formCliente: {
        nome: '',
        sobrenome: '',
        cpf: '',
        rg: '',
        sexo: '',
        telefone: '',
        celular: '',
        data_nascimento: '',
        idade: '',
        rua: '',
        bairro: '',
        numero_residencia: '',
        cidade: '',
        estado: '',
        pais: ''
      },
      
      formPeca: {
        peca: '',
        fabricante: '',
        local_fabricacao: '',
        peso: '',
        quantidade: '',
        preco: ''
      },
      
      // Arrays de dados
      clientes: [],
      pecas: [],
      fornecedores: [],
      equipamentos: [],
      orcamentos: [],
      reparos: [],
      estoque: []
    };
  },
  
  computed: {
    pageTitle() {
      const titles = {
        dashboard: 'Dashboard',
        clientes: 'Clientes',
        equipamentos: 'Equipamentos',
        pecas: 'Peças',
        fornecedores: 'Fornecedores',
        orcamento: 'Orçamentos',
        lancamento: 'Reparos',
        estoque: 'Estoque',
        relatorios: 'Relatórios',
        config: 'Configurações'
      };
      return titles[this.currentPage] || 'Sistema';
    },
    
    clientesFiltrados() {
      if (!this.filtroCliente) return this.clientes;
      return this.clientes.filter(cliente => 
        cliente.nome.toLowerCase().includes(this.filtroCliente.toLowerCase()) ||
        cliente.sobrenome.toLowerCase().includes(this.filtroCliente.toLowerCase()) ||
        cliente.cpf.includes(this.filtroCliente)
      );
    },
    
    pecasFiltradas() {
      if (!this.filtroPeca) return this.pecas;
      return this.pecas.filter(peca => 
        peca.peca.toLowerCase().includes(this.filtroPeca.toLowerCase()) ||
        peca.fabricante.toLowerCase().includes(this.filtroPeca.toLowerCase())
      );
    },
    
    estoqueTotal() {
      return this.pecas.reduce((total, peca) => total + parseInt(peca.quantidade), 0);
    },
    
    recentReparos() {
      return this.reparos.slice(-5).map(reparo => ({
        ...reparo,
        statusClass: this.getStatusClass(reparo.status)
      }));
    }
  },
  
  methods: {
    // Navegação
    toggleSidebar() {
      this.isSidebarCollapsed = !this.isSidebarCollapsed;
    },
    
    changePage(page) {
      this.currentPage = page;
      this.resetForms();
    },
    
    // Alertas
    showAlertMessage(type, message) {
      this.alertType = type;
      this.alertMessage = message;
      this.alertIcon = type === 'success' ? 'fa-check-circle' : 
                      type === 'danger' ? 'fa-exclamation-circle' : 'fa-info-circle';
      this.showAlert = true;
      
      setTimeout(() => {
        this.showAlert = false;
      }, 3000);
    },
    
    // Funções de formatação
    formatarCPF(cpf) {
      if (!cpf) return '';
      return cpf.replace(/(\d{3})(\d{3})(\d{3})(\d{2})/, '$1.$2.$3-$4');
    },
    
    formatDate(dateString) {
      if (!dateString) return '';
      const date = new Date(dateString);
      return date.toLocaleDateString('pt-BR');
    },
    
    calcularIdade() {
      if (this.formCliente.data_nascimento) {
        const hoje = new Date();
        const nascimento = new Date(this.formCliente.data_nascimento);
        let idade = hoje.getFullYear() - nascimento.getFullYear();
        const mes = hoje.getMonth() - nascimento.getMonth();
        if (mes < 0 || (mes === 0 && hoje.getDate() < nascimento.getDate())) {
          idade--;
        }
        this.formCliente.idade = idade;
      }
    },
    
    getStatusClass(status) {
      switch(status?.toLowerCase()) {
        case 'concluído': return 'success';
        case 'em andamento': return 'warning';
        case 'cancelado': return 'danger';
        default: return 'warning';
      }
    },
    
    // Gestão de clientes
    salvarCliente() {
      if (this.editingIndex === null) {
        this.clientes.push({...this.formCliente});
        this.showAlertMessage('success', 'Cliente cadastrado com sucesso!');
      } else {
        this.clientes[this.editingIndex] = {...this.formCliente};
        this.showAlertMessage('success', 'Cliente atualizado com sucesso!');
      }
      this.resetFormCliente();
    },
    
    editarCliente(index) {
      this.editingIndex = index;
      this.formCliente = {...this.clientes[index]};
      this.showCadastroCliente = true;
    },
    
    resetFormCliente() {
      this.formCliente = {
        nome: '',
        sobrenome: '',
        cpf: '',
        rg: '',
        sexo: '',
        telefone: '',
        celular: '',
        data_nascimento: '',
        idade: '',
        rua: '',
        bairro: '',
        numero_residencia: '',
        cidade: '',
        estado: '',
        pais: ''
      };
      this.showCadastroCliente = false;
      this.editingIndex = null;
    },
    
    // Gestão de peças
    salvarPeca() {
      const peca = {
        ...this.formPeca,
        preco: parseFloat(this.formPeca.preco),
        quantidade: parseInt(this.formPeca.quantidade),
        peso: parseFloat(this.formPeca.peso)
      };
      
      if (this.editingIndex === null) {
        this.pecas.push(peca);
        this.showAlertMessage('success', 'Peça cadastrada com sucesso!');
      } else {
        this.pecas[this.editingIndex] = peca;
        this.showAlertMessage('success', 'Peça atualizada com sucesso!');
      }
      this.resetFormPeca();
    },
    
    editarPeca(index) {
      this.editingIndex = index;
      this.formPeca = {...this.pecas[index]};
      this.showCadastroPeca = true;
    },
    
    resetFormPeca() {
      this.formPeca = {
        peca: '',
        fabricante: '',
        local_fabricacao: '',
        peso: '',
        quantidade: '',
        preco: ''
      };
      this.showCadastroPeca = false;
      this.editingIndex = null;
    },
    
    // Exclusões
    confirmarExclusao(tipo, index) {
      if (confirm(`Tem certeza que deseja excluir este ${tipo}?`)) {
        if (tipo === 'cliente') {
          this.clientes.splice(index, 1);
          this.showAlertMessage('success', 'Cliente excluído com sucesso!');
        } else if (tipo === 'peca') {
          this.pecas.splice(index, 1);
          this.showAlertMessage('success', 'Peça excluída com sucesso!');
        }
      }
    },
    
    // Reset geral de formulários
    resetForms() {
      this.showCadastroCliente = false;
      this.showCadastroPeca = false;
      this.showCadastroFornecedor = false;
      this.editingIndex = null;
      this.resetFormCliente();
      this.resetFormPeca();
    },
    
    // Atualização do relógio
    updateClock() {
      const now = new Date();
      this.currentTime = now.toLocaleString('pt-BR');
    }
  },
  
  mounted() {
    // Inicializar relógio
    this.updateClock();
    setInterval(this.updateClock, 1000);
    
    // Dados de exemplo para demonstração
    this.clientes = [
      {
        nome: 'João',
        sobrenome: 'Silva',
        cpf: '12345678901',
        rg: '1234567',
        sexo: 'Masculino',
        telefone: '1133334444',
        celular: '11999887766',
        data_nascimento: '1990-05-15',
        idade: 33,
        rua: 'Rua das Flores',
        bairro: 'Centro',
        numero_residencia: '123',
        cidade: 'São Paulo',
        estado: 'SP',
        pais: 'Brasil'
      }
    ];
    
    this.pecas = [
      {
        peca: 'Tela LCD 15.6"',
        fabricante: 'Samsung',
        local_fabricacao: 'Coreia do Sul',
        peso: 0.5,
        quantidade: 10,
        preco: 250.00
      },
      {
        peca: 'Memória RAM 8GB DDR4',
        fabricante: 'Kingston',
        local_fabricacao: 'Taiwan',
        peso: 0.02,
        quantidade: 15,
        preco: 180.00
      }
    ];
    
    this.reparos = [
      {
        cliente: 'João Silva',
        equipamento: 'Notebook Dell',
        data_reparo: '2024-01-15',
        status: 'Concluído'
      },
      {
        cliente: 'Maria Santos',
        equipamento: 'Desktop HP',
        data_reparo: '2024-01-14',
        status: 'Em andamento'
      }
    ];
    
    this.orcamentos = [
      { id: 1, cliente: 'João Silva', valor: 350.00, status: 'Aprovado' },
      { id: 2, cliente: 'Maria Santos', valor: 180.00, status: 'Pendente' }
    ];
  }
}).mount('#app');