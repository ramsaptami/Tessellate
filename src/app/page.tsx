import Link from "next/link";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";

export default function Home() {
  return (
    <div className="container mx-auto px-4 py-8">
      <div className="max-w-4xl mx-auto">
        <div className="text-center mb-12">
          <h1 className="text-4xl font-bold mb-4">Welcome to Tessellate</h1>
          <p className="text-xl text-muted-foreground mb-8">
            Your unified platform for creative and project management workflows
          </p>
        </div>

        <div className="grid md:grid-cols-3 gap-6">
          <Link href="/lookbook" className="block">
            <Card className="h-full hover:shadow-lg transition-shadow">
              <CardHeader>
                <CardTitle>Lookbook Creator</CardTitle>
                <CardDescription>
                  AI-powered fashion lookbook creation and style discovery
                </CardDescription>
              </CardHeader>
              <CardContent>
                <p className="text-sm text-muted-foreground">
                  Create stunning fashion lookbooks with intelligent style matching and curation tools.
                </p>
              </CardContent>
            </Card>
          </Link>

          <Link href="/dashboard" className="block">
            <Card className="h-full hover:shadow-lg transition-shadow">
              <CardHeader>
                <CardTitle>Project Dashboard</CardTitle>
                <CardDescription>
                  Comprehensive project management and analytics
                </CardDescription>
              </CardHeader>
              <CardContent>
                <p className="text-sm text-muted-foreground">
                  Track projects, analyze performance metrics, and manage workflows across platforms.
                </p>
              </CardContent>
            </Card>
          </Link>

          <Link href="/moodboard" className="block">
            <Card className="h-full hover:shadow-lg transition-shadow">
              <CardHeader>
                <CardTitle>Moodboard Studio</CardTitle>
                <CardDescription>
                  Visual inspiration and design collaboration
                </CardDescription>
              </CardHeader>
              <CardContent>
                <p className="text-sm text-muted-foreground">
                  Create beautiful moodboards and collaborate on design projects with your team.
                </p>
              </CardContent>
            </Card>
          </Link>
        </div>
      </div>
    </div>
  );
}