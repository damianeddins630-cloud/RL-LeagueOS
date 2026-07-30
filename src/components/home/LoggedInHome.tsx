import { LeagueApplicationForm } from "@/components/auth/LeagueApplicationForm";
import { LogoutButton } from "@/components/auth/LogoutButton";
import { RlTrackerForm } from "@/components/auth/RlTrackerForm";
import { Button } from "@/components/ui/Button";
import type { LeagueApplication, User } from "@prisma/client";

type LoggedInHomeProps = {
  user: User & { application: LeagueApplication | null };
  discordName: string;
  canViewLeague: boolean;
  isAdmin: boolean;
};

function statusMessage(status: string) {
  switch (status) {
    case "PENDING":
      return "Your application is pending review. You will be able to view the league once approved.";
    case "REJECTED":
      return "Your application was not accepted. Contact a league admin if you have questions.";
    case "APPROVED":
      return "You have been accepted. You can now view the league.";
    default:
      return null;
  }
}

export function LoggedInHome({ user, discordName, canViewLeague, isAdmin }: LoggedInHomeProps) {
  const application = user.application;

  return (
    <section className="flex flex-1 flex-col items-center px-6 py-16 sm:py-20">
      <div className="w-full max-w-lg space-y-8">
        <div className="text-center">
          <p className="text-xs font-semibold uppercase tracking-[0.2em] text-[#0088FF]">
            Welcome back
          </p>
          <h1 className="mt-2 text-3xl font-bold text-white sm:text-4xl">
            Apply for a <span className="text-[#0088FF]">League</span>
          </h1>
          <p className="mt-3 text-white/50">
            Submit your application for Rocket League Elite Series 2v2. Once accepted, you can
            access schedules, standings, and rosters.
          </p>
        </div>

        <div className="rounded-lg border border-[#0066FF]/20 bg-[#0a0a0a] p-6">
          <h2 className="mb-4 text-lg font-semibold text-white">Your RL Tracker</h2>
          <RlTrackerForm initialUrl={user.rlTrackerUrl} />
        </div>

        <div className="rounded-lg border border-[#0066FF]/20 bg-[#0a0a0a] p-6">
          <h2 className="mb-1 text-lg font-semibold text-white">League Application</h2>
          <p className="mb-4 text-sm text-white/40">Rocket League Elite Series 2v2</p>

          {application ? (
            <div className="space-y-3 text-sm text-white/70">
              <p>
                <span className="text-white/40">Status:</span>{" "}
                <span className="font-medium text-[#0088FF]">{application.status}</span>
              </p>
              {statusMessage(application.status) && (
                <p className="text-white/50">{statusMessage(application.status)}</p>
              )}
              <p>
                <span className="text-white/40">Username:</span> {application.username}
              </p>
              <p>
                <span className="text-white/40">Discord:</span> {application.discordName}
              </p>
              <p>
                <span className="text-white/40">Age:</span> {application.age}
              </p>
              <p>
                <span className="text-white/40">Why joining:</span> {application.whyJoining}
              </p>
            </div>
          ) : (
            <LeagueApplicationForm defaultDiscordName={discordName} />
          )}
        </div>

        <div className="flex flex-col gap-3 sm:flex-row sm:justify-center">
          {canViewLeague && (
            <Button variant="primary" href="/league" className="w-full sm:w-auto">
              {isAdmin ? "Enter League (Admin)" : "Enter League"}
            </Button>
          )}
          <LogoutButton className="w-full sm:w-auto" />
        </div>
      </div>
    </section>
  );
}
