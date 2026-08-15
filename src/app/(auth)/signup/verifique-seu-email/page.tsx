import { Card, CardBody } from "@/components/ui/card";

export default function VerifiqueSeuEmailPage() {
  return (
    <Card>
      <CardBody className="text-center">
        <h1 className="mb-2 font-heading text-xl font-semibold text-primary">
          Confirme seu e-mail
        </h1>
        <p className="text-sm text-muted">
          Enviamos um link de confirmação para o seu e-mail. Clique nele para
          ativar sua conta e depois volte para fazer login.
        </p>
      </CardBody>
    </Card>
  );
}
