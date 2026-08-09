import { IntrospectTokenWorkflow } from "../../workflows/IntrospectTokenWorkflow";

export class IntrospectTokenController {
  constructor(
    private readonly workflow: IntrospectTokenWorkflow,
  ) {}

  async handle(req: any, res: any): Promise<void> {
    const result = await this.workflow.execute({
      clientId: req.body.client_id,
      clientSecret: req.body.client_secret,
      token: req.body.token,
    });

    res.status(200).json(result);
  }
}