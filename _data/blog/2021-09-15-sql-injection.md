---
template: BlogPost
path: /sql-injection
date: 2021-09-15T10:50:40.114Z
title: SQL Injection
thumbnail: /assets/diana-polekhina-uasyriep47a-unsplash.jpg
---
*Aprendizados e notas dos meus #100daysofhacking*

Como desenvolvedora, acho que a primeira vulnerabilidade de segurança que eu ouvi falar foi SQL injection. Mas nada muito complicado: "usa essa função aqui para tratar o input do usuário e evitar SQL injection".

Por muito tempo achei que SQL injection era um ataque ultrapassado e que ninguém mais caia porque as linguagens de programação tem recursos para evitar que aconteça e existiam práticas que todo mundo seguia para evita-lo (ledo engano hahaha).

Nunca parei para entender mais profundamente o que era SQL injection até essa semana 1 do meu #100DaysOfHacking. E estou muito surpresa como vai além do que eu imaginei que seria! 🤯

SQL injection é uma vulnerabilidade de segurança que permite que um atacante interfira nas consultas que uma aplicação faz ao seu banco de dados, permitindo que visualize dados que normalmente não seriam acessíveis. 

O impacto que um ataque de SQL injection pode provocar em uma aplicação ou um negócio varia, mas pode resultar em perca, corrupção ou divulgação de dados não autorizados, dificultar a prestação de contas ou até perca de acesso aos dados. Às vezes pode levar até a tomada total da aplicação. 

### Como funciona?

Uma query SQL é um comando usado para fazer consultas no banco de dados de uma aplicação. Em geral a forma como uma aplicação constrói uma consulta envolve o comando SQL escrito pela pessoa programadora junto com dados fornecidos pelo usuário. Por exemplo:

`SELECT title, text FROM news WHERE id=$id `

Estamos buscando o `título` e o `texto` da tabela `notícias` onde o id é igual ao id fornecido pelo usuário.

A forma como esse dado fornecido é tratado pode abrir a possibilidade para um ataque de SQL injection: o usuário pode inserir ou "injetar" uma instrução SQL parcial ou completa que faz com que a instrução SQL original execute outras ações.

### Como saber se uma aplicação está vulnerável a SQL injection?

O local na aplicação onde uma query SQL pode ser injetada pode variar, não é somente em campos de texto ou formulários onde os usuários inserem dados, quase qualquer fonte de dados pode ser um vetor de injeção: variáveis de ambiente, parâmetros, serviços web internos e externos etc.

O primeiro passo é identificar onde a aplicação interage com o banco de dados, listar campos de entrada de dados cujos valores podem ser usados em uma consulta SQL e depois testa-los separadamente tentando interferir na consulta e gerar um erro. 

O teste inicial pode ser adicionar uma aspas simples `'` ou um ponto e vírgula `;` ao campo ou parâmetro e observar a resposta do servidor, dependendo da resposta é possível identificar que o campo em teste está vulnerável a um ataque de SQL injection. Observe não só as respostas do servidor, mas também o código fonte, algumas vezes a resposta pode estar presente, mas não visível para o usuário.

### Exemplo

Imagine uma aplicação que lista produtos e os filtra por categoria. A url com o filtro é a seguinte:

`https://site-inseguro.com/produtos?categoria=sapatos`

Fazemos o teste de inserir uma aspas simples na consulta:

`https://site-inseguro.com/produtos?categoria=sapatos'`

A mensagem de erro após inserir a aspa simples é a seguinte: 

`An error occurred: PG::SyntaxError: ERROR: unterminated quoted string at or near "'sapatos'' limit 1" LINE 1: ...os where categoria ='sapatos'... ^ : select * from produtos where categoria = 'sapatos'' limit 1.`

Esse erro indica que:

1. Esse é um ponto da aplicação que interage com o banco de dados.
2. A aspas simples mudou algo de uma forma gerou alguma resposta inesperada.

O que aconteceu foi que a aspa foi inserida diretamente no comando SQL e encerrou a consulta antecipadamente, isso causou o erro de sintaxe que podemos ver na mensagem de erro. Esse comportamento indica que a aplicação está vulnerável a um ataque de SQL injection.

### Exploração

Após a vulnerabilidade ser identificada, um atacante pode utilizar de várias técnicas para explorar a aplicação.

Apesar da linguagem SQL ter um padrão, cada gerenciador de banco de dados(DBMS) tem suas diferentes formas de interagir com os dados. Comandos, funções, comentários etc, podem variar de um para o outro, então é importante identificar o tipo de banco de dados da aplicação. Não vou me aprofundar nesse assunto, mas você pode usar esse artigo do PortSwigger como referência para aprender mais sobre isso: [Examining the database in SQL injection attacks](https://portswigger.net/web-security/sql-injection/examining-the-database)

### Técnicas de SQL visível

Usada em casos onde resultado de uma query SQL é retornado dentro da resposta da aplicação.

#### UNION

Técnica onde o operador UNION (usado no SQL para executar uma ou mais consultas SELECT adicionais e anexar o resultado à consulta original) é usado para inserir uma query forjada pelo atacante para obter valores de outras colunas e tabelas.

É importante observar que para esse ataque funcionar a query injetada precisa ter a mesma quantidade de parâmetros/colunas que a original, para evitar um erro de sintaxe.

Então o primeiro passo é identificar a quantidade de colunas estão sendo retornadas pela query original.

Existem algumas formas de fazer isso, uma delas é injetar uma série de comandos ORDER BY e incrementar o índice da coluna até ocorrer um erro. Nesse comando a coluna pode ser especificada pelo seu índice, então não precisamos saber o nome das colunas:

`https://site-inseguro.com/produtos?categoria=sapatos'ORDER BY 3`

Nesse exemplo se incrementarmos o índice mais uma vez( para 4) podemos ver um erro na resposta. Isso significa que a query original retorna 3 colunas.

Após descobrir a quantidade de colunas, o segundo passo é identificar o tipo de dados das colunas. Geralmente os dados interessantes de explorar estarão no formato de string, então precisamos descobrir quais colunas retornam esse tipo de dados. Para fazer isso podemos testar cada coluna para ver se ela pode receber uma string, utilizando um `UNION SELECT` colocando a string em diferentes colunas até confirmar quais aceitam esse tipo de dados:

`https://site-inseguro.com/produtos?categoria=sapatos'UNION SELECT 'a',NULL,NULL--`

`https://site-inseguro.com/produtos?categoria=sapatos'UNION SELECT NULL,'a',NULL--`

*No exemplo uma string é colocada entre nulls, sendo alternada uma coluna a cada vez, os--são comentários no SQL, significa que o restante query será ignorado.*

Uma vez identificado qual/quais colunas retornam string, podemos injetar a nova query:

`https://site-inseguro.com/produtos?categoria=sapatos'UNION SELECT username, password, NULL from users --`

*Exemplo onde existe uma tabela users e através da injeção SQL conseguimos acesso aos usernames e passwords*

Haverão situações onde apenas uma coluna é retornada em uma aplicação ou apenas uma coluna com o tipo de dados desejado (no caso string), nesse caso pode-se extrair a informação de uma coluna por vez ou concatenar os resultados de duas colunas em uma só.

### Técnicas de SQL não visível

São formas de explorar uma vulnerabilidade SQL mesmo sem que o resultado da query seja visível para o atacante, conhecidas por Blind SQL injection (injeção cega de SQL) ou injeção SQL inferencial . Eu achei esses ataques os mais interessantes e surpreendentes nos meus estudos sobre essa vulnerabilidade, me fizeram refletir muito sobre o fato de que hacking também é sobre criatividade. E por isso vou escrever um próximo artigo somente sobre elas.

Referências

* PortSwigger: [](https://portswigger.net/web-security/sql-injection)<https://portswigger.net/web-security/sql-injection>\
  → Os labs do PortSwigger são ótimos para aprender sobre SQL injection na prática.
* OWASP testing guide: [](https://owasp.org/www-project-web-security-testing-guide/latest/4-Web_Application_Security_Testing/07-Input_Validation_Testing/05-Testing_for_SQL_Injection)<https://owasp.org/www-project-web-security-testing-guide/latest/4-Web_Application_Security_Testing/07-Input_Validation_Testing/05-Testing_for_SQL_Injection>
* OWASP top 10 (2017): [](https://owasp.org/www-project-top-ten/2017/A1_2017-Injection)<https://owasp.org/www-project-top-ten/2017/A1_2017-Injection>



*Imagem de capa: Photo by [Diana Polekhina](https://unsplash.com/@diana_pole?utm_source=unsplash&utm_medium=referral&utm_content=creditCopyText) on [Unsplash](https://unsplash.com/photos/EPCFsDrGbSw?utm_source=unsplash&utm_medium=referral&utm_content=creditCopyText)*