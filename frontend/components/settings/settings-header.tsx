import { Separator } from "@/components/ui/separator";

export function SettingsHeader() {
  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-3xl font-bold tracking-tight">Configurações</h2>
        <p className="text-muted-foreground">
          Gerencie as configurações da sua conta e preferências.
        </p>
      </div>
      <Separator />
    </div>
  );
}
