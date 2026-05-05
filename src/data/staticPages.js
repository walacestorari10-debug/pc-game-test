export const staticPages = [
  {
    path: '/como-funciona',
    title: 'Como funciona',
    eyebrow: 'Metodologia do teste',
    description:
      'Entenda como o PC Game Test transforma hardware, jogo, resolução e qualidade gráfica em uma estimativa prática de desempenho.',
    updatedAt: 'Atualizado em 5 de maio de 2026',
    summary:
      'O PC Game Test não mede o seu computador em tempo real. Ele calcula uma estimativa local combinando dados de referência, pontuação dos componentes e exigência do jogo escolhido.',
    quickFacts: [
      {
        label: 'Entrada',
        value: 'CPU, GPU, RAM, armazenamento, jogo, resolução e qualidade.',
      },
      {
        label: 'Saída',
        value: 'FPS estimado, score, status, gargalo e qualidade sugerida.',
      },
      {
        label: 'Processamento',
        value: 'Tudo acontece no navegador, sem login e sem envio do setup.',
      },
    ],
    sections: [
      {
        heading: '1. Você informa o setup',
        paragraphs: [
          'O teste começa com a seleção dos principais componentes do computador: processador, placa de vídeo, memória RAM e armazenamento. Depois, o usuário escolhe o jogo, a resolução e a qualidade gráfica desejada.',
          'Essas informações formam o cenário de análise. Trocar qualquer item pode mudar o resultado, porque cada componente influencia o desempenho de um jeito diferente.',
        ],
        bullets: [
          'A GPU tem peso maior em jogos visualmente pesados.',
          'A CPU influencia estabilidade, quedas de FPS e jogos competitivos.',
          'RAM e armazenamento ajudam a identificar gargalos de fluidez e carregamento.',
        ],
      },
      {
        heading: '2. O motor calcula a exigência do jogo',
        paragraphs: [
          'Cada jogo cadastrado possui um nível de exigência, FPS base em 1080p, meta recomendada e requisitos de referência. O cálculo compara o setup selecionado com esse perfil do jogo.',
          'Resoluções maiores e qualidade gráfica mais alta aumentam a exigência. Presets mais leves reduzem a carga e podem melhorar a estimativa de FPS.',
        ],
      },
      {
        heading: '3. O resultado mostra uma estimativa útil',
        paragraphs: [
          'O resultado apresenta uma faixa de FPS provável, um score geral, um status de desempenho e uma sugestão de qualidade ideal. A intenção é ajudar o usuário a decidir se o PC está adequado para aquele jogo.',
          'A faixa de FPS é mais honesta do que um número único, porque o desempenho real varia conforme drivers, temperatura, versão do jogo, processos em segundo plano e configurações do sistema.',
        ],
      },
      {
        heading: '4. O gargalo ajuda a priorizar upgrades',
        paragraphs: [
          'Quando o sistema identifica diferença relevante entre os componentes, ele aponta o possível gargalo principal. Isso ajuda o usuário a entender onde um upgrade tende a gerar mais impacto.',
          'As recomendações são orientativas. Antes de comprar qualquer peça, o usuário deve confirmar compatibilidade, preço, disponibilidade e necessidade real para o próprio uso.',
        ],
      },
    ],
    notice:
      'O PC Game Test entrega uma estimativa técnica para tomada de decisão. Ele não substitui benchmarks oficiais, testes práticos ou validação de compatibilidade antes de uma compra.',
  },
  {
    path: '/perguntas-frequentes',
    title: 'Perguntas frequentes',
    eyebrow: 'Dúvidas comuns',
    description:
      'Respostas diretas sobre resultados, histórico local, comparação de PCs, links de compra e variações de desempenho.',
    updatedAt: 'Atualizado em 5 de maio de 2026',
    summary:
      'Reunimos as principais dúvidas para deixar claro o que o PC Game Test faz hoje, o que ele não promete e como interpretar os resultados.',
    faq: [
      {
        question: 'O resultado é exato?',
        answer:
          'Não. O resultado é uma estimativa baseada em dados de referência, pontuação dos componentes e exigência do jogo. O FPS real pode variar conforme drivers, temperatura, versão do jogo, sistema operacional e configurações internas.',
      },
      {
        question: 'Meu histórico fica salvo onde?',
        answer:
          'O histórico fica salvo no localStorage do navegador. Isso significa que ele permanece no próprio dispositivo usado no teste e não é sincronizado com uma conta ou servidor.',
      },
      {
        question: 'Preciso criar login para usar o site?',
        answer:
          'Não. O PC Game Test funciona sem login. O setup e o histórico são usados localmente para melhorar a navegação entre as páginas e podem ser apagados pelo próprio usuário.',
      },
      {
        question: 'Posso comparar dois PCs?',
        answer:
          'Sim. A página de comparação permite montar dois setups e ver diferenças de FPS, score e desempenho estimado no mesmo jogo, resolução e qualidade gráfica.',
      },
      {
        question: 'Os links de compra já funcionam?',
        answer:
          'No momento, os botões marcados como em breve não direcionam para lojas. Quando houver links externos ou afiliados ativos, eles serão identificados de forma clara para o usuário.',
      },
      {
        question: 'Por que meu jogo pode ter FPS diferente do estimado?',
        answer:
          'Porque jogos mudam com atualizações, drivers podem alterar desempenho, temperatura pode reduzir clock, e programas abertos em segundo plano podem consumir recursos. A estimativa serve como referência, não como garantia.',
      },
      {
        question: 'O ranking é global?',
        answer:
          'Não. O ranking atual é local e usa os resultados salvos no navegador do usuário. Ele não compara seu PC com usuários de outros dispositivos.',
      },
    ],
    notice:
      'Se uma dúvida envolver compra de hardware, confirme sempre compatibilidade com placa-mãe, fonte, gabinete e disponibilidade real do produto.',
  },
  {
    path: '/contato',
    title: 'Contato',
    eyebrow: 'Canal institucional',
    description:
      'Veja como falar com o PC Game Test para sugestões, correções, parcerias e assuntos relacionados ao projeto.',
    updatedAt: 'Atualizado em 5 de maio de 2026',
    summary:
      'O contato do PC Game Test é simples e direto: sugestões e correções podem ser enviadas pelo feedback das páginas, sem login e sem coleta de e-mail.',
    quickFacts: [
      {
        label: 'Sugestões rápidas',
        value: 'Use o feedback da página para indicar jogos, ajustes de texto e melhorias.',
      },
      {
        label: 'Sem login',
        value: 'O envio de feedback não exige conta, senha, nome ou e-mail.',
      },
      {
        label: 'Privacidade',
        value: 'Não envie senhas, documentos, dados bancários ou informações sensíveis.',
      },
    ],
    showFeedback: true,
    sections: [
      {
        heading: 'Como enviar sugestões',
        paragraphs: [
          'Para sugestões rápidas, use o campo de feedback disponível nesta página e em áreas como resultados, jogos e artigos. A mensagem ajuda a identificar melhorias de conteúdo, usabilidade e precisão das informações.',
          'O feedback não gera protocolo de atendimento individual, porque o site não solicita e-mail ou dados de identificação. A proposta é manter um canal leve para evoluir o produto com base no uso real.',
        ],
      },
      {
        heading: 'Assuntos recomendados',
        paragraphs: [
          'As mensagens mais úteis são aquelas relacionadas ao funcionamento do site, correções de conteúdo, inclusão de jogos, clareza dos resultados e sugestões para novas páginas.',
        ],
        bullets: [
          'Correções em requisitos, nomes de jogos ou textos publicados.',
          'Sugestões para melhorar clareza dos resultados e páginas de jogos.',
          'Propostas de afiliados, anúncios e parcerias compatíveis com o projeto.',
          'Questões sobre privacidade, termos de uso e conteúdo institucional.',
        ],
      },
    ],
    notice:
      'Para sua segurança, não envie informações pessoais sensíveis pelos campos de feedback. Use mensagens curtas e relacionadas ao funcionamento do site.',
  },
  {
    path: '/termos-de-uso',
    title: 'Termos de uso',
    eyebrow: 'Regras de utilização',
    description:
      'Leia as condições gerais de uso do PC Game Test e entenda os limites das estimativas, recomendações e links externos.',
    updatedAt: 'Atualizado em 5 de maio de 2026',
    summary:
      'Ao usar o PC Game Test, o usuário entende que os resultados são estimativas informativas e que decisões de compra devem ser verificadas com fontes, lojas e fabricantes.',
    sections: [
      {
        heading: '1. Finalidade do site',
        paragraphs: [
          'O PC Game Test é uma ferramenta informativa para estimar desempenho de computadores em jogos, comparar setups, organizar histórico local e orientar possíveis upgrades.',
          'O site não realiza diagnóstico técnico presencial, benchmark executado na máquina do usuário ou validação completa de compatibilidade entre peças.',
        ],
      },
      {
        heading: '2. Estimativas de FPS e gargalos',
        paragraphs: [
          'FPS, score, status de desempenho, gargalos e qualidade ideal são estimativas calculadas a partir de dados de referência e regras internas do projeto.',
          'Essas informações não garantem desempenho exato. Resultados reais podem variar conforme drivers, temperatura, sistema operacional, atualizações dos jogos, configurações gráficas específicas e estado geral do computador.',
        ],
      },
      {
        heading: '3. Recomendações e upgrades',
        paragraphs: [
          'As recomendações de upgrade são sugestões orientativas. O usuário deve verificar compatibilidade com placa-mãe, fonte, gabinete, memória, BIOS, disponibilidade e preço antes de comprar qualquer item.',
          'O PC Game Test não se responsabiliza por compras realizadas sem validação técnica adequada ou por incompatibilidades externas ao funcionamento do site.',
        ],
      },
      {
        heading: '4. Preços, promoções e links externos',
        paragraphs: [
          'Preços, promoções e disponibilidade podem mudar sem aviso. Quando links externos ou afiliados forem adicionados, eles poderão direcionar o usuário para lojas, plataformas ou parceiros fora do PC Game Test.',
          'O usuário deve conferir as condições diretamente no site externo antes de concluir qualquer compra, assinatura ou cadastro.',
        ],
      },
      {
        heading: '5. Uso adequado',
        paragraphs: [
          'O usuário deve utilizar o site de forma legítima, sem tentar explorar falhas, interferir no funcionamento das páginas ou manipular dados locais com finalidade abusiva.',
          'O PC Game Test pode alterar conteúdos, rotas, cálculos, textos e páginas institucionais para melhorar clareza, segurança e qualidade do serviço.',
        ],
      },
    ],
    notice:
      'Use o PC Game Test como referência informativa. Antes de comprar peças, confirme compatibilidade, preço, garantia e requisitos diretamente com fabricantes e lojas.',
  },
  {
    path: '/politica-de-privacidade',
    title: 'Política de privacidade',
    eyebrow: 'Dados e transparência',
    description:
      'Entenda como o PC Game Test usa dados locais, histórico de testes, feedback opcional e informações armazenadas no navegador.',
    updatedAt: 'Atualizado em 5 de maio de 2026',
    summary:
      'O PC Game Test não exige login. O setup e o histórico ficam salvos localmente no navegador; apenas feedbacks enviados voluntariamente são registrados para melhorar o site.',
    quickFacts: [
      {
        label: 'Sem login',
        value: 'O site não exige conta, senha ou perfil de usuário.',
      },
      {
        label: 'Dados locais',
        value: 'Setup e histórico são salvos no localStorage do navegador.',
      },
      {
        label: 'Feedback opcional',
        value: 'Avaliações e sugestões enviadas pelo usuário podem ser salvas para melhoria do site.',
      },
    ],
    sections: [
      {
        heading: '1. Quais dados são usados no teste',
        paragraphs: [
          'Para gerar o resultado, o site usa as informações que o próprio usuário seleciona: processador, placa de vídeo, memória RAM, armazenamento, jogo, resolução e qualidade gráfica.',
          'Essas informações são necessárias para calcular FPS estimado, status de desempenho, gargalo e recomendações. Elas ficam no navegador e não identificam diretamente uma pessoa.',
        ],
      },
      {
        heading: '2. Armazenamento local no navegador',
        paragraphs: [
          'O PC Game Test usa localStorage para salvar o último setup analisado e o histórico de testes. Isso permite que páginas como resultado, histórico, ranking local e páginas de jogos reutilizem a análise sem pedir tudo novamente.',
          'Esses dados ficam no navegador do usuário. Eles não são enviados para um banco de dados próprio, não criam conta e não ficam disponíveis em outros dispositivos.',
        ],
        bullets: [
          'O usuário pode apagar o histórico pelo botão disponível na página de histórico.',
          'Também é possível remover os dados limpando armazenamento, cache ou dados do navegador.',
          'Se o usuário trocar de navegador ou dispositivo, o histórico local não acompanha automaticamente.',
        ],
      },
      {
        heading: '3. Feedback opcional',
        paragraphs: [
          'Ao enviar feedback, o usuário pode informar se a página foi útil e escrever uma sugestão opcional. Esses dados são usados para entender problemas, priorizar melhorias e acompanhar a qualidade das páginas.',
          'O feedback pode registrar a página acessada, o tipo de avaliação, a mensagem opcional, a nota e a data de envio. Não é necessário criar conta, informar nome ou inserir e-mail.',
        ],
        bullets: [
          'Não envie senhas, documentos, dados bancários ou informações pessoais sensíveis.',
          'Mensagens de feedback não devem ser usadas para solicitar atendimento urgente.',
          'O envio é voluntário e serve para melhoria do PC Game Test.',
        ],
      },
      {
        heading: '4. Cookies, anúncios e afiliados',
        paragraphs: [
          'Botões marcados como em breve não direcionam para lojas. Quando houver links externos, afiliados, anúncios ou promoções ativas, o usuário poderá ser redirecionado para sites de terceiros.',
          'Serviços externos podem usar cookies, identificadores, scripts e políticas próprias. Ao acessar um site externo, o usuário deve conferir os termos e a política de privacidade desse serviço.',
        ],
      },
      {
        heading: '5. Contato e mensagens',
        paragraphs: [
          'A página de contato usa o mesmo sistema leve de feedback do site. Ela não solicita nome, e-mail ou telefone, por isso não oferece resposta individual ao usuário.',
          'Mensagens enviadas pelo feedback são analisadas com foco em melhoria do conteúdo, correção de informações e evolução da experiência do PC Game Test.',
        ],
      },
      {
        heading: '6. Segurança e limitações',
        paragraphs: [
          'Como os dados ficam no navegador, a segurança também depende do dispositivo do usuário. Pessoas com acesso ao mesmo navegador podem visualizar ou apagar histórico e setup salvos localmente.',
          'O PC Game Test evita solicitar dados pessoais desnecessários para cumprir a função atual do produto e recomenda que o usuário não inclua informações sensíveis em mensagens de feedback.',
        ],
      },
    ],
    notice:
      'O uso do site não exige login. Para preservar sua privacidade, envie feedbacks curtos e evite qualquer informação pessoal sensível.',
  },
]
