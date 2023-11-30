import { Agent } from '@aries-framework/core'

export class AfjAgent {
  /**
   * AFJ SSI Agent
   * @example SSI
   */
  agent: Agent;

  agentId: string

  endpoint: string

  inPort: number;

  connection_id: string
}