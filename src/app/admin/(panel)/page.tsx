import { getCurrentUser } from "@/app/lib/auth/authorize";

export default async function AdminDashboardPage() {
  const { user, profile } = await getCurrentUser();

  return (
    <main className="min-h-full">
      <section className="px-6 py-8 lg:px-8">
        <div className="mx-auto max-w-7xl">
          <div className="rounded-3xl border border-slate-200 bg-white p-8 shadow-sm">
            <p className="text-sm font-semibold text-blue-600">
              SYSTEM ONLINE
            </p>

            <h1 className="mt-3 text-3xl font-semibold tracking-tight text-slate-900">
              Welcome to the NCM Admin Panel.
            </h1>

            <p className="mt-3 max-w-2xl leading-7 text-slate-600">
              Your authentication and role-based access foundation is
              working correctly.
            </p>

            <div className="mt-6 flex flex-wrap gap-3 text-sm">
              <span className="rounded-full bg-slate-100 px-4 py-2 text-slate-700">
                {user.email}
              </span>

              <span className="rounded-full bg-blue-50 px-4 py-2 font-medium capitalize text-blue-700">
                {profile.role.replace("_", " ")}
              </span>
            </div>
          </div>

          <div className="mt-8 grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
            <DashboardCard
              title="Website Content"
              description="Manage public website content."
            />

            <DashboardCard
              title="Portfolio"
              description="Manage projects and case studies."
            />

            <DashboardCard
              title="Services"
              description="Manage services and offerings."
            />

            <DashboardCard
              title="Testimonials"
              description="Manage client testimonials."
            />

            <DashboardCard
              title="Leads"
              description="Manage incoming enquiries."
            />

            <DashboardCard
              title="Team"
              description="Manage admin team members."
            />

            <DashboardCard
              title="Permissions"
              description="Manage roles and permissions."
            />

            <DashboardCard
              title="Settings"
              description="Manage platform settings."
            />
          </div>
        </div>
      </section>
    </main>
  );
}

function DashboardCard({
  title,
  description,
}: {
  title: string;
  description: string;
}) {
  return (
    <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
      <h2 className="text-lg font-semibold text-slate-900">
        {title}
      </h2>

      <p className="mt-2 text-sm leading-6 text-slate-600">
        {description}
      </p>

      <span className="mt-5 inline-flex rounded-full bg-slate-100 px-3 py-1 text-xs font-medium text-slate-500">
        Coming Soon
      </span>
    </div>
  );
}