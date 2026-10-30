export const initialStoreConfig = {
  name: "Calu Delícias Doces",
  tagline: "Doces artesanais & feitos com amor",
  instagram: "caludeliciasdoces",
  instagramUrl: "https://www.instagram.com/caludeliciasdoces",
  phone: "5521999100225",
  displayPhone: "(21) 99910-0225",
  pixKey: "21999100225",
  pixKeyType: "Celular",
  pixRecipient: "Calu Delícias Doces",
  isOpen: true,
  statusMessage: "Aceitando encomendas e pedidos!",
  closedMessage: "No momento estamos fora do horário de pedidos. Consulte nosso cardápio!",
  pickupLocation: "Tijuca - Rio de Janeiro / RJ (Endereço exato enviado na confirmação)",
  deliveryNotice: "Entregas via Uber Flash / entrega a combinar no fechamento do WhatsApp.",
  prepTime: "Pronta entrega conforme disponibilidade ou sob encomenda",
};

export const initialCategories = [
  { id: "todos", name: "Todos os Doces", icon: "✨" },
  { id: "bolos-de-pote", name: "Bolos de Pote", icon: "🧁" },
  { id: "paes-de-mel", name: "Pães de Mel", icon: "🍯" },
  { id: "sazonais", name: "Especiais da Semana", icon: "⭐" },
  { id: "combos", name: "Kits & Presentes", icon: "🎁" },
];

export const initialProducts = [
  {
    id: "bolo-de-pote-tradicional",
    name: "Bolo de Pote Tradicional (250ml)",
    category: "bolos-de-pote",
    description: "Massa fofinha e molhadinha com camadas generosas de recheio artesanal cremoso.",
    price: 14.00,
    image: "https://images.unsplash.com/photo-1578985545062-69928b1d9587?q=80&w=800&auto=format&fit=crop",
    badge: "Mais Pedido",
    isAvailable: true,
    customizations: [
      {
        id: "massa",
        title: "Escolha a Massa",
        required: true,
        type: "radio", // single select
        options: [
          { name: "Massa Branca (Baunilha fofinha)", priceModifier: 0 },
          { name: "Massa de Chocolate (Cacau 50%)", priceModifier: 0 }
        ]
      },
      {
        id: "recheio",
        title: "Escolha o Recheio Principal",
        required: true,
        type: "radio",
        options: [
          { name: "Ninho Cremoso com Nutella", priceModifier: 0 },
          { name: "Brigadeiro Gourmet Tradicional", priceModifier: 0 },
          { name: "Doce de Leite Artesanal Suave", priceModifier: 0 },
          { name: "Sensação (Brigadeiro c/ Geleia de Morango)", priceModifier: 0 },
          { name: "Maracujá Trufado", priceModifier: 0 }
        ]
      },
      {
        id: "adicionais",
        title: "Deseja algum adicional? (Opcional)",
        required: false,
        type: "checkbox", // multi select
        options: [
          { name: "Raspas de Chocolate Belga", priceModifier: 2.50 },
          { name: "Morangos Frescos Picados", priceModifier: 3.50 },
          { name: "Camada Extra de Nutella", priceModifier: 3.00 }
        ]
      }
    ]
  },
  {
    id: "bolo-de-pote-especial-cenoura",
    name: "Bolo de Pote Cenoura com Chocolate",
    category: "bolos-de-pote",
    description: "O clássico irresistível: bolo de cenoura ultra fofinho coberto com muito brigadeiro cremoso de panela.",
    price: 15.00,
    image: "https://images.unsplash.com/photo-1606313564200-e75d5e30476c?q=80&w=800&auto=format&fit=crop",
    badge: "Queridinho",
    isAvailable: true,
    customizations: [
      {
        id: "cobertura",
        title: "Opção de Brigadeiro",
        required: true,
        type: "radio",
        options: [
          { name: "Brigadeiro ao Leite Tradicional", priceModifier: 0 },
          { name: "Brigadeiro Meio Amargo (Cacau Intenso)", priceModifier: 0 },
          { name: "Duo: Brigadeiro ao Leite + Ninho", priceModifier: 1.50 }
        ]
      },
      {
        id: "adicionais",
        title: "Topping Opcional",
        required: false,
        type: "checkbox",
        options: [
          { name: "Granulado Crocante Belga", priceModifier: 2.00 },
          { name: "Gotas de Chocolate Nobre", priceModifier: 2.50 }
        ]
      }
    ]
  },
  {
    id: "pao-de-mel-artesanal",
    name: "Pão de Mel Artesanal Recheado",
    category: "paes-de-mel",
    description: "Massa aromática com especiarias e mel puro, recheio generoso e casquinha de chocolate nobre.",
    price: 8.00,
    image: "https://images.unsplash.com/photo-1509440159596-0249088772ff?q=80&w=800&auto=format&fit=crop",
    badge: "Artesanal",
    isAvailable: true,
    customizations: [
      {
        id: "recheio",
        title: "Escolha o Recheio",
        required: true,
        type: "radio",
        options: [
          { name: "Doce de Leite Cremoso (Tradicional)", priceModifier: 0 },
          { name: "Brigadeiro Gourmet", priceModifier: 0 },
          { name: "Beijinho de Coco", priceModifier: 0 },
          { name: "Ninho com Nutella", priceModifier: 1.00 }
        ]
      },
      {
        id: "casquinha",
        title: "Casquinha de Chocolate",
        required: true,
        type: "radio",
        options: [
          { name: "Chocolate ao Leite Nobre", priceModifier: 0 },
          { name: "Chocolate Meio Amargo Nobre", priceModifier: 0 },
          { name: "Chocolate Branco Cremoso", priceModifier: 0 }
        ]
      }
    ]
  },
  {
    id: "caixa-trio-pao-de-mel",
    name: "Caixa Presente com 3 Pães de Mel",
    category: "combos",
    description: "Linda caixinha para presentear ou saborear com 3 unidades em sabores especiais.",
    price: 24.00,
    image: "https://images.unsplash.com/photo-1541781774459-bb2af2f05b55?q=80&w=800&auto=format&fit=crop",
    badge: "Ideal para Presente",
    isAvailable: true,
    customizations: [
      {
        id: "combinacao",
        title: "Selecione a Combinação da Caixa",
        required: true,
        type: "radio",
        options: [
          { name: "Mista: 1 Doce de Leite, 1 Brigadeiro, 1 Beijinho", priceModifier: 0 },
          { name: "Todos de Doce de Leite Cremoso", priceModifier: 0 },
          { name: "Todos de Brigadeiro Gourmet", priceModifier: 0 },
          { name: "Especial com Ninho & Nutella", priceModifier: 2.00 }
        ]
      },
      {
        id: "embalagem",
        title: "Fita de Presente",
        required: true,
        type: "radio",
        options: [
          { name: "Laço Rosa Delicado", priceModifier: 0 },
          { name: "Laço Dourado Festivo", priceModifier: 0 },
          { name: "Laço Marrom Chocolate", priceModifier: 0 }
        ]
      }
    ]
  },
  {
    id: "copo-da-felicidade",
    name: "Copo da Felicidade Calu (300ml)",
    category: "sazonais",
    description: "Camadas fartas de brigadeiro cremoso, pedaços de brownie artesanal, creme especial e morangos frescos.",
    price: 19.50,
    image: "https://images.unsplash.com/photo-1563729784474-d77dbb933a9e?q=80&w=800&auto=format&fit=crop",
    badge: "Edição Limitada",
    isAvailable: true,
    customizations: [
      {
        id: "base",
        title: "Base de Bolo",
        required: true,
        type: "radio",
        options: [
          { name: "Pedaços de Brownie Fudgy", priceModifier: 0 },
          { name: "Massa Branca de Baunilha", priceModifier: 0 },
          { name: "Massa de Chocolate Cacau 50%", priceModifier: 0 }
        ]
      },
      {
        id: "cremes",
        title: "Cremes Principais",
        required: true,
        type: "radio",
        options: [
          { name: "Ninho Trufado com Brigadeiro", priceModifier: 0 },
          { name: "Doce de Leite com Quatro Leites", priceModifier: 0 },
          { name: "Nutella Pura com Brigadeiro de Ninho", priceModifier: 2.50 }
        ]
      },
      {
        id: "fruta",
        title: "Finalização",
        required: true,
        type: "radio",
        options: [
          { name: "Com Morangos Frescos no Topo", priceModifier: 0 },
          { name: "Com Bombom Ouro Branco picado", priceModifier: 0 },
          { name: "Com KitKat em pedaços", priceModifier: 0 }
        ]
      }
    ]
  },
  {
    id: "kit-degustacao-bolos",
    name: "Duo Degustação: 2 Bolos de Pote",
    category: "combos",
    description: "Leve dois sabores à sua escolha com valor promocional!",
    price: 26.00,
    image: "https://images.unsplash.com/photo-1587314168485-3236d6710814?q=80&w=800&auto=format&fit=crop",
    badge: "Combo Especial",
    isAvailable: true,
    customizations: [
      {
        id: "pote1",
        title: "Sabor do 1º Bolo de Pote",
        required: true,
        type: "radio",
        options: [
          { name: "Massa Branca + Ninho c/ Nutella", priceModifier: 0 },
          { name: "Massa Chocolate + Brigadeiro Gourmet", priceModifier: 0 },
          { name: "Massa Branca + Doce de Leite", priceModifier: 0 },
          { name: "Massa Chocolate + Sensação Morango", priceModifier: 0 }
        ]
      },
      {
        id: "pote2",
        title: "Sabor do 2º Bolo de Pote",
        required: true,
        type: "radio",
        options: [
          { name: "Massa Chocolate + Brigadeiro Gourmet", priceModifier: 0 },
          { name: "Massa Branca + Ninho c/ Nutella", priceModifier: 0 },
          { name: "Massa Branca + Doce de Leite", priceModifier: 0 },
          { name: "Massa Chocolate + Sensação Morango", priceModifier: 0 }
        ]
      }
    ]
  }
];
