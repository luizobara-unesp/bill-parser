"use client";

import { PageGuard } from "@/components/page-guard";
import { SettingsHeader } from "@/components/settings/settings-header";
import { SettingsNav } from "@/components/settings/settings-nav";
import { ProfileForm } from "@/components/settings/profile-form";

export default function SettingsPage() {
  return (
    <PageGuard>
      <div className="w-full mx-auto p-6 space-y-8">
        <SettingsHeader />

        <div className="grid gap-8 md:grid-cols-[250px_1fr]">
          <SettingsNav />

          <div className="space-y-6">
            <ProfileForm />
          </div>
        </div>
      </div>
    </PageGuard>
  );
}
