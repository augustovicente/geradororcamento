const router = require('express').Router();
// recebendo objetos
const controller = require('../controllers/controller');
const fornecedor = require('../controllers/fornecedor');
const cliente = require('../controllers/cliente');
const materia_prima = require('../controllers/materia_prima');
const orcamento = require('../controllers/orcamento');
// --------------- index --------------------------------
router.get('/', controller.index);
// login
router.get('/login', controller.login);
router.post('/logar', controller.logar);
// --------------- fornecedores ----------------------------
router.get('/fornecedor', fornecedor.main);
router.get('/fornecedor/inserir', fornecedor.insere_page);
router.post('/fornecedor/inserir', fornecedor.insere);
router.post('/fornecedor/alterar/:id', fornecedor.altera);
router.get('/fornecedor/alterar/:id', fornecedor.altera_page);
router.get('/fornecedor/excluir/:id', fornecedor.exclui);
// --------------- clientes -----------------------------------
router.get('/cliente', cliente.main);
router.get('/cliente/inserir', cliente.insere_page);
router.post('/cliente/inserir', cliente.insere);
router.get('/cliente/alterar/:id', cliente.altera_page);
router.post('/cliente/alterar/:id', cliente.altera);
router.get('/cliente/excluir/:id', cliente.exclui);
// --------------- materia_prima-----------------------------------------
router.get('/materia_prima', materia_prima.main);
// geral
router.get('/materia_prima/geral', materia_prima.submain_geral);
router.get('/materia_prima/geral/inserir', materia_prima.insere_geral_page);
router.post('/materia_prima/geral/inserir', materia_prima.insere_geral);
router.get('/materia_prima/geral/alterar/:id', materia_prima.altera_geral_page);
router.post('/materia_prima/geral/alterar/:id', materia_prima.altera_geral);
router.get('/materia_prima/geral/excluir/:id', materia_prima.exclui_geral);
// especifica
router.get('/materia_prima/especifica', materia_prima.submain_especifica);
router.get('/materia_prima/especifica/inserir', materia_prima.insere_especifica_page);
router.post('/materia_prima/especifica/inserir', materia_prima.insere_especifica);
router.get('/materia_prima/especifica/alterar/:id', materia_prima.altera_especifica_page);
router.post('/materia_prima/especifica/alterar/:id', materia_prima.altera_especifica);
router.get('/materia_prima/especifica/excluir/:id', materia_prima.exclui_especifica);
// orcamentos
router.get('/orcamento', orcamento.main);
// pagina de status
router.get('/orcamento/status', orcamento.status);
router.post('/orcamento/status/altera', orcamento.altera_status);
// pagina de relação
router.get('/orcamento/relacao', orcamento.relacao);
router.post('/orcamento/relacao/filtro', orcamento.filtro_relacao);
// página de impressão
router.get('/orcamento/impressao', orcamento.impressao);
router.post('/orcamento/impressao/filtro', orcamento.filtro);
router.get('/orcamento/impressao/pdf/:id', orcamento.pdf);
// página de criar orçamento
router.get('/orcamento/novo', orcamento.novo);
router.post('/orcamento/novo/salvar/:produtos/:info', orcamento.salva);
// página de excluir orçamento
router.get('/orcamento/excluir/:id', orcamento.excluir);
module.exports = router;