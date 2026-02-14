/**
 * Serviço para gerenciar boletos e notificações de cobrança
 * Integra com API backend para geração de boletos e envio de notificações
 */

import { Boleto, NotificacaoCobranca, Devedor } from "./types";

export class BoletoService {
  private baseUrl = "http://127.0.0.1:3000/api";

  /**
   * Gera um novo boleto para um devedor
   */
  async gerarBoleto(devedor: Devedor): Promise<Boleto> {
    try {
      const response = await fetch(`${this.baseUrl}/boletos/gerar`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          devedorId: devedor.id,
          valor: devedor.valorPendente,
          vencimento: devedor.dataVencimento,
          associadoId: devedor.associadoId,
        }),
      });

      if (!response.ok) {
        throw new Error("Falha ao gerar boleto");
      }

      const data = await response.json();
      return {
        id: data.id,
        devedorId: devedor.id,
        numero: data.numero,
        valor: devedor.valorPendente,
        dataVencimento: new Date(devedor.dataVencimento),
        dataCriacao: new Date(),
        status: "gerado",
        tentativasEnvio: 0,
      };
    } catch (error) {
      console.error("Erro ao gerar boleto:", error);
      throw error;
    }
  }

  /**
   * Envia notificação de cobrança por email
   */
  async enviarNotificacaoEmail(
    boletoId: string,
    email: string,
    nomeAssociado: string,
    valor: number
  ): Promise<NotificacaoCobranca> {
    try {
      const response = await fetch(`${this.baseUrl}/notificacoes/email`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          boletoId,
          email,
          nomeAssociado,
          valor,
          tipo: "email",
        }),
      });

      if (!response.ok) {
        throw new Error("Falha ao enviar email");
      }

      const data = await response.json();
      return {
        id: data.id,
        boletoId,
        tipo: "email",
        dataPedido: new Date(),
        dataEnvio: new Date(),
        status: "enviado",
      };
    } catch (error) {
      console.error("Erro ao enviar email:", error);
      throw error;
    }
  }

  /**
   * Envia notificação de cobrança por SMS
   */
  async enviarNotificacaoSMS(
    boletoId: string,
    telefone: string,
    nomeAssociado: string,
    valor: number
  ): Promise<NotificacaoCobranca> {
    try {
      const response = await fetch(`${this.baseUrl}/notificacoes/sms`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          boletoId,
          telefone,
          nomeAssociado,
          valor,
          tipo: "sms",
        }),
      });

      if (!response.ok) {
        throw new Error("Falha ao enviar SMS");
      }

      const data = await response.json();
      return {
        id: data.id,
        boletoId,
        tipo: "sms",
        dataPedido: new Date(),
        dataEnvio: new Date(),
        status: "enviado",
      };
    } catch (error) {
      console.error("Erro ao enviar SMS:", error);
      throw error;
    }
  }

  /**
   * Agenda envio automático de boletos para devedores
   * Deve ser chamado periodicamente (por exemplo, diariamente)
   */
  async agendarEnvioAutomatico(devedores: Devedor[], emails: Map<string, string>): Promise<void> {
    try {
      for (const devedor of devedores) {
        // Gerar boleto
        const boleto = await this.gerarBoleto(devedor);

        // Enviar email se disponível
        const email = emails.get(devedor.associadoId);
        if (email) {
          await this.enviarNotificacaoEmail(
            boleto.id,
            email,
            devedor.associadoId,
            devedor.valorPendente
          );
        }
      }
    } catch (error) {
      console.error("Erro ao agendar envio automático:", error);
    }
  }

  /**
   * Simula geração de boleto (para ambiente de desenvolvimento)
   */
  gerarBoletoSimulado(devedor: Devedor): Boleto {
    const numero = this.gerarNumeroBoleto();
    return {
      id: `boleto_${Date.now()}`,
      devedorId: devedor.id,
      numero,
      valor: devedor.valorPendente,
      dataVencimento: devedor.dataVencimento,
      dataCriacao: new Date(),
      status: "gerado",
      tentativasEnvio: 0,
    };
  }

  /**
   * Gera número de boleto simulado (formato padrão brasileiro)
   */
  private gerarNumeroBoleto(): string {
    const banco = "12345";
    const sequencia = Math.random().toString().substring(2, 10);
    const dv = Math.floor(Math.random() * 10);
    return `${banco}.${sequencia} ${sequencia} ${sequencia} ${dv} ${Date.now().toString().substring(0, 14)}`;
  }
}

export const boletoService = new BoletoService();
