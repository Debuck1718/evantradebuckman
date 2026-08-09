import { RevokeTokenWorkflow } from "../../workflows/RevokeTokenWorkflow";

export class RevokeTokenController {
  constructor(
    private readonly workflow: RevokeTokenWorkflow,
  ) {}

  async handle(req: any, res: any): Promise<void> {
    await this.workflow.execute({
      clientId: req.body.client_id,
      clientSecret: req.body.client_secret,
      token: req.body.token,
    });

    res.status(200).send();
  }
}