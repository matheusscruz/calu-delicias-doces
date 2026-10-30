/**
 * Formats a currency value to Brazilian Real (R$) with safe ASCII spacing
 * (Replaces non-breaking space \u00A0 and \u202F which cause  in WhatsApp links)
 */
export function formatCurrency(value) {
  const formatted = new Intl.NumberFormat('pt-BR', {
    style: 'currency',
    currency: 'BRL',
  }).format(value);

  // Normalize Unicode non-breaking spaces to standard space
  return formatted.replace(/[\u00A0\u202F]/g, ' ');
}

/**
 * Generates an order identifier like #CALU-4821
 */
export function generateOrderId() {
  const random = Math.floor(1000 + Math.random() * 9000);
  return `CALU-${random}`;
}

/**
 * Builds the WhatsApp order summary message and deep link
 * Uses safe, universally supported emojis and clean ASCII separators.
 */
export function buildWhatsAppUrl({ orderId, cart, customer, delivery, payment, storeConfig }) {
  const lines = [];

  lines.push(`🧁 *NOVO PEDIDO - CALU DELÍCIAS DOCES* 🧁`);
  lines.push(`*Pedido:* #${orderId}`);
  lines.push(`*Data:* ${new Date().toLocaleDateString('pt-BR')} às ${new Date().toLocaleTimeString('pt-BR', { hour: '2-digit', minute: '2-digit' })}`);
  lines.push('----------------------------------------');
  
  lines.push('👤 *DADOS DO CLIENTE*');
  lines.push(`- *Nome:* ${customer.name}`);
  lines.push(`- *Telefone:* ${customer.phone}`);
  
  if (delivery.type === 'retirada') {
    lines.push(`- *Recebimento:* 📍 *Retirada / Ponto de Entrega*`);
    lines.push(`  _${storeConfig.pickupLocation}_`);
  } else if (delivery.type === 'uber_flash') {
    lines.push(`- *Recebimento:* 🛵 *Envio via Uber Flash (Taxa paga pelo cliente)*`);
    lines.push(`  - Endereço: ${delivery.street}, nº ${delivery.number}${delivery.complement ? ` (${delivery.complement})` : ''}`);
    lines.push(`  - Bairro: ${delivery.neighborhood}`);
    if (delivery.reference) {
      lines.push(`  - Referência: ${delivery.reference}`);
    }
  }

  lines.push('----------------------------------------');
  lines.push('🍰 *ITENS DO PEDIDO:*');
  lines.push('');

  cart.forEach((item) => {
    const itemTotal = item.totalPrice * item.quantity;
    lines.push(`*${item.quantity}x ${item.name}* (${formatCurrency(itemTotal)})`);
    
    // Customizations breakdown with sweet artisan emojis
    if (item.selectedOptions && Object.keys(item.selectedOptions).length > 0) {
      Object.entries(item.selectedOptions).forEach(([title, choice]) => {
        let icon = '🍫';
        const lowerTitle = title.toLowerCase();
        if (lowerTitle.includes('massa')) icon = '🍰';
        else if (lowerTitle.includes('recheio')) icon = '🍯';
        else if (lowerTitle.includes('cobertura') || lowerTitle.includes('casquinha')) icon = '🍫';
        else if (lowerTitle.includes('adicion') || lowerTitle.includes('topping')) icon = '🍓';
        else if (lowerTitle.includes('embalagem') || lowerTitle.includes('presente')) icon = '🎀';

        if (Array.isArray(choice)) {
          if (choice.length > 0) {
            lines.push(`  ${icon} _${title}:_ ${choice.join(', ')}`);
          }
        } else if (choice) {
          lines.push(`  ${icon} _${title}:_ ${choice}`);
        }
      });
    }

    if (item.notes && item.notes.trim() !== '') {
      lines.push(`  ✨ _Obs do item:_ "${item.notes.trim()}"`);
    }

    lines.push('');
  });

  lines.push('----------------------------------------');
  lines.push('💳 *FORMA DE PAGAMENTO*');
  
  if (payment.method === 'pix') {
    lines.push(`- *Opção:* 🟢 *PIX*`);
    lines.push(`- Chave Pix: \`${storeConfig.pixKey}\` (${storeConfig.pixKeyType})`);
    lines.push(`- Favorecido: ${storeConfig.pixRecipient}`);
    lines.push(`- _(Vou enviar o comprovante em anexo nesta conversa)_`);
  } else if (payment.method === 'dinheiro') {
    lines.push(`- *Opção:* 💵 *Dinheiro*`);
    if (payment.needsChange) {
      const changeAmount = parseFloat(payment.changeFor || 0) - payment.total;
      lines.push(`- Troco para: *${formatCurrency(payment.changeFor)}*`);
      if (changeAmount > 0) {
        lines.push(`- Levar troco de: *${formatCurrency(changeAmount)}*`);
      }
    } else {
      lines.push(`- Troco: *Não precisa de troco (Valor exato)*`);
    }
  } else if (payment.method === 'cartao_credito') {
    lines.push(`- *Opção:* 💳 *Cartão de Crédito* (Pagar na maquininha)`);
  } else if (payment.method === 'cartao_debito') {
    lines.push(`- *Opção:* 💳 *Cartão de Débito* (Pagar na maquininha)`);
  }

  if (customer.generalNotes && customer.generalNotes.trim() !== '') {
    lines.push('');
    lines.push(`📝 *Observações Gerais:*`);
    lines.push(`"${customer.generalNotes.trim()}"`);
  }

  lines.push('----------------------------------------');
  lines.push(`💰 *VALOR TOTAL: ${formatCurrency(payment.total)}*`);
  if (delivery.type === 'uber_flash') {
    lines.push(`_(Taxa de entrega via Uber Flash é paga à parte pelo cliente)_`);
  }
  lines.push('----------------------------------------');
  lines.push('');
  lines.push('Aguardando confirmação do pedido! Muito obrigado(a)! 🧁✨');

  const fullText = lines.join('\n');
  const encodedText = encodeURIComponent(fullText);
  const cleanPhone = storeConfig.phone.replace(/\D/g, '');
  
  // URL direta da API (evita o redirect 302 do wa.me que comprovadamente corrompe emojis para \uFFFD)
  const apiUrl = `https://api.whatsapp.com/send/?phone=${cleanPhone}&text=${encodedText}`;
  
  // URI Scheme nativo para celular (abre direto o app oficial do WhatsApp com emojis 100% preservados)
  const appUrl = `whatsapp://send?phone=${cleanPhone}&text=${encodedText}`;

  return {
    fullText,
    url: apiUrl,
    appUrl,
  };
}

/**
 * Intelligent WhatsApp opener for mobile and desktop
 */
export function openWhatsApp({ url, appUrl }) {
  const isMobile = /Android|iPhone|iPad|iPod/i.test(navigator.userAgent);
  if (isMobile && appUrl) {
    // No celular, aciona o app nativo diretamente
    window.location.href = appUrl;
    // Fallback caso o deep link não abra em 1.5s
    setTimeout(() => {
      window.open(url, '_blank');
    }, 1500);
  } else {
    // No computador / desktop
    window.open(url, '_blank');
  }
}
