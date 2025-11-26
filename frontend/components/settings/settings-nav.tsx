import { Button } from "@/components/ui/button";

export function SettingsNav() {
  return (
    <nav className="flex flex-col space-y-1 text-sm text-muted-foreground">
      <Button
        variant="secondary"
        className="justify-start font-semibold text-primary"
      >
        Geral
      </Button>
      <Button
        variant="ghost"
        className="justify-start cursor-not-allowed opacity-50"
      >
        Segurança
      </Button>
      <Button
        variant="ghost"
        className="justify-start cursor-not-allowed opacity-50"
      >
        Aparência
      </Button>
    </nav>
  );
}
