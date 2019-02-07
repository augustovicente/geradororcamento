-- phpMyAdmin SQL Dump
-- version 4.3.7
-- http://www.phpmyadmin.net
--
-- Host: mysql10-farm76.kinghost.net
-- Tempo de geração: 07/02/2019 às 10:30
-- Versão do servidor: 5.6.36-log
-- Versão do PHP: 5.3.28

SET SQL_MODE = "NO_AUTO_VALUE_ON_ZERO";
SET time_zone = "+00:00";


/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
/*!40101 SET @OLD_CHARACTER_SET_RESULTS=@@CHARACTER_SET_RESULTS */;
/*!40101 SET @OLD_COLLATION_CONNECTION=@@COLLATION_CONNECTION */;
/*!40101 SET NAMES utf8 */;

--
-- Banco de dados: `produnox`
--

-- --------------------------------------------------------

--
-- Estrutura para tabela `cliente`
--

CREATE TABLE `cliente` (
  `codigo` int(11) NOT NULL,
  `nome` varchar(100) NOT NULL,
  `cpfcnpj` varchar(45) NOT NULL,
  `telefone` varchar(45) DEFAULT NULL,
  `email` varchar(45) DEFAULT NULL,
  `wpp` varchar(45) DEFAULT NULL,
  `contato` varchar(45) DEFAULT NULL,
  `data_registro` datetime DEFAULT NULL,
  `endereco` varchar(100) DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=latin1;


-- --------------------------------------------------------

--
-- Estrutura para tabela `fornecedor`
--

CREATE TABLE `fornecedor` (
  `codigo` int(11) NOT NULL,
  `nome` varchar(100) NOT NULL,
  `cpfcnpj` varchar(45) NOT NULL,
  `telefone` varchar(45) DEFAULT NULL,
  `email` varchar(45) DEFAULT NULL,
  `wpp` varchar(45) DEFAULT NULL,
  `contato` varchar(45) DEFAULT NULL,
  `data_registro` datetime DEFAULT NULL,
  `endereco` varchar(100) DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=latin1;


-- --------------------------------------------------------

--
-- Estrutura para tabela `materia_prima`
--

CREATE TABLE `materia_prima` (
  `codigo` int(11) NOT NULL,
  `nome` varchar(45) NOT NULL,
  `fornecedor` int(11) NOT NULL,
  `unidade` varchar(45) NOT NULL,
  `quantidade` int(11) DEFAULT NULL,
  `marca` varchar(45) DEFAULT NULL,
  `valor_unitario` double NOT NULL,
  `descricao` varchar(150) DEFAULT NULL,
  `especifica` int(11) NOT NULL,
  `intervalo` double DEFAULT NULL,
  `demarcacao` varchar(45) DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=latin1;


-- --------------------------------------------------------

--
-- Estrutura para tabela `materia_prima_do_produto`
--

CREATE TABLE `materia_prima_do_produto` (
  `codigo` int(11) NOT NULL,
  `codigo_mp` int(11) NOT NULL,
  `codigo_pr` int(11) NOT NULL,
  `qtd` int(11) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=latin1;


-- --------------------------------------------------------

--
-- Estrutura para tabela `orcamento`
--

CREATE TABLE `orcamento` (
  `codigo` int(11) NOT NULL,
  `total_itens` int(11) NOT NULL,
  `valor_total` double NOT NULL,
  `data` datetime NOT NULL,
  `cliente` int(11) NOT NULL,
  `forma_pagamento` varchar(45) NOT NULL,
  `status` int(11) NOT NULL,
  `imagem1` varchar(100) DEFAULT NULL,
  `imagem2` varchar(100) DEFAULT NULL,
  `prazo` varchar(150) DEFAULT NULL,
  `observacao` varchar(5000) DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=latin1;


-- --------------------------------------------------------

--
-- Estrutura stand-in para view `pdf`
--
CREATE TABLE `pdf` (
`valor_total` double
,`id_orcamento` int(11)
,`total_itens` int(11)
,`forma_pagamento` varchar(45)
,`imagem1` varchar(100)
,`imagem2` varchar(100)
,`prazo` varchar(150)
,`observacao` varchar(5000)
,`nome` varchar(100)
,`telefone` varchar(45)
,`endereco` varchar(100)
,`email` varchar(45)
);

-- --------------------------------------------------------

--
-- Estrutura stand-in para view `pdf_materia_prima_produtos`
--
CREATE TABLE `pdf_materia_prima_produtos` (
`codigo` int(11)
,`nome` varchar(45)
,`qtd` int(11)
,`produto` int(11)
,`preco` double
,`unidade` varchar(45)
,`especifica` int(11)
,`demarcacao` varchar(45)
,`intervalo` double
);

-- --------------------------------------------------------

--
-- Estrutura para tabela `produto_orcamento`
--

CREATE TABLE `produto_orcamento` (
  `codigo` int(11) NOT NULL,
  `codigo_or` int(11) NOT NULL,
  `nome` varchar(45) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=latin1;


-- --------------------------------------------------------

--
-- Estrutura stand-in para view `resumo`
--
CREATE TABLE `resumo` (
`id_orcamento` int(11)
,`data` datetime
,`status` int(11)
,`total_itens` int(11)
,`valor_total` double
,`nome` varchar(100)
,`id_cliente` int(11)
);

-- --------------------------------------------------------

--
-- Estrutura para view `pdf`
--
DROP TABLE IF EXISTS `pdf`;

CREATE ALGORITHM=UNDEFINED DEFINER=`produnox`@`%` SQL SECURITY DEFINER VIEW `pdf` AS select `o`.`valor_total` AS `valor_total`,`o`.`codigo` AS `id_orcamento`,`o`.`total_itens` AS `total_itens`,`o`.`forma_pagamento` AS `forma_pagamento`,`o`.`imagem1` AS `imagem1`,`o`.`imagem2` AS `imagem2`,`o`.`prazo` AS `prazo`,`o`.`observacao` AS `observacao`,`c`.`nome` AS `nome`,`c`.`telefone` AS `telefone`,`c`.`endereco` AS `endereco`,`c`.`email` AS `email` from (`orcamento` `o` join `cliente` `c` on((`c`.`codigo` = `o`.`cliente`)));

-- --------------------------------------------------------

--
-- Estrutura para view `pdf_materia_prima_produtos`
--
DROP TABLE IF EXISTS `pdf_materia_prima_produtos`;

CREATE ALGORITHM=UNDEFINED DEFINER=`produnox`@`%` SQL SECURITY DEFINER VIEW `pdf_materia_prima_produtos` AS select `mp`.`codigo` AS `codigo`,`mp`.`nome` AS `nome`,`mpo`.`qtd` AS `qtd`,`mpo`.`codigo_pr` AS `produto`,`mp`.`valor_unitario` AS `preco`,`mp`.`unidade` AS `unidade`,`mp`.`especifica` AS `especifica`,`mp`.`demarcacao` AS `demarcacao`,`mp`.`intervalo` AS `intervalo` from (`materia_prima_do_produto` `mpo` join `materia_prima` `mp` on((`mpo`.`codigo_mp` = `mp`.`codigo`)));

-- --------------------------------------------------------

--
-- Estrutura para view `resumo`
--
DROP TABLE IF EXISTS `resumo`;

CREATE ALGORITHM=UNDEFINED DEFINER=`produnox`@`%` SQL SECURITY DEFINER VIEW `resumo` AS select `orcamento`.`codigo` AS `id_orcamento`,`orcamento`.`data` AS `data`,`orcamento`.`status` AS `status`,`orcamento`.`total_itens` AS `total_itens`,`orcamento`.`valor_total` AS `valor_total`,`cliente`.`nome` AS `nome`,`cliente`.`codigo` AS `id_cliente` from (`orcamento` join `cliente` on((`cliente`.`codigo` = `orcamento`.`cliente`)));

--
-- Índices de tabelas apagadas
--

--
-- Índices de tabela `cliente`
--
ALTER TABLE `cliente`
  ADD PRIMARY KEY (`codigo`);

--
-- Índices de tabela `fornecedor`
--
ALTER TABLE `fornecedor`
  ADD PRIMARY KEY (`codigo`);

--
-- Índices de tabela `materia_prima`
--
ALTER TABLE `materia_prima`
  ADD PRIMARY KEY (`codigo`);

--
-- Índices de tabela `materia_prima_do_produto`
--
ALTER TABLE `materia_prima_do_produto`
  ADD PRIMARY KEY (`codigo`);

--
-- Índices de tabela `orcamento`
--
ALTER TABLE `orcamento`
  ADD PRIMARY KEY (`codigo`);

--
-- Índices de tabela `produto_orcamento`
--
ALTER TABLE `produto_orcamento`
  ADD PRIMARY KEY (`codigo`);

--
-- AUTO_INCREMENT de tabelas apagadas
--

--
-- AUTO_INCREMENT de tabela `cliente`
--
ALTER TABLE `cliente`
  MODIFY `codigo` int(11) NOT NULL AUTO_INCREMENT;
--
-- AUTO_INCREMENT de tabela `fornecedor`
--
ALTER TABLE `fornecedor`
  MODIFY `codigo` int(11) NOT NULL AUTO_INCREMENT;
--
-- AUTO_INCREMENT de tabela `materia_prima`
--
ALTER TABLE `materia_prima`
  MODIFY `codigo` int(11) NOT NULL AUTO_INCREMENT;
--
-- AUTO_INCREMENT de tabela `materia_prima_do_produto`
--
ALTER TABLE `materia_prima_do_produto`
  MODIFY `codigo` int(11) NOT NULL AUTO_INCREMENT;
--
-- AUTO_INCREMENT de tabela `orcamento`
--
ALTER TABLE `orcamento`
  MODIFY `codigo` int(11) NOT NULL AUTO_INCREMENT;
--
-- AUTO_INCREMENT de tabela `produto_orcamento`
--
ALTER TABLE `produto_orcamento`
  MODIFY `codigo` int(11) NOT NULL AUTO_INCREMENT;
/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
