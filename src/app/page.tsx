import Link from "next/link";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { ArrowRight, Lock, Sparkles, Palette, BarChart3 } from "lucide-react";

export default function Home() {
  return (
    <div className="container mx-auto px-4 py-8">
      <div className="max-w-6xl mx-auto">
        <div className="text-center mb-12">
          <h1 className="text-4xl font-bold mb-4">Welcome to Tessellate</h1>
          <p className="text-xl text-muted-foreground mb-8">
            Creative workflow tools and project management solutions
          </p>
        </div>

        {/* Creative Workflow Section */}
        <div className="mb-16">
          <div className="text-center mb-8">
            <h2 className="text-2xl font-bold text-gray-900 mb-2">
              <span className="bg-gradient-to-r from-purple-600 to-pink-600 bg-clip-text text-transparent">
                Creative Workflow
              </span>
            </h2>
            <p className="text-muted-foreground">
              Integrated moodboard and lookbook creation - from inspiration to final style curation
            </p>
          </div>
          
          <div className="relative">
            <div className="grid md:grid-cols-2 gap-6 items-center">
              {/* Step 1: Moodboard */}
              <Link href="/moodboard" className="block group">
                <Card className="h-full hover:shadow-lg transition-all duration-300 group-hover:scale-105">
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                      <Palette className="h-5 w-5 text-purple-600" />
                      Step 1: Moodboard Studio
                    </CardTitle>
                    <CardDescription>
                      Visual inspiration and design collaboration
                    </CardDescription>
                  </CardHeader>
                  <CardContent>
                    <p className="text-sm text-muted-foreground mb-4">
                      Create beautiful moodboards to capture your creative vision and establish the aesthetic direction for your project.
                    </p>
                    <div className="flex items-center gap-2 text-purple-600 font-medium text-sm">
                      Start with inspiration <ArrowRight className="h-4 w-4" />
                    </div>
                  </CardContent>
                </Card>
              </Link>

              {/* Arrow */}
              <div className="hidden md:flex justify-center items-center absolute left-1/2 top-1/2 transform -translate-x-1/2 -translate-y-1/2 z-10">
                <div className="bg-white rounded-full p-3 shadow-lg border">
                  <ArrowRight className="h-6 w-6 text-gray-600" />
                </div>
              </div>

              {/* Step 2: Lookbook */}
              <Link href="/lookbook" className="block group">
                <Card className="h-full hover:shadow-lg transition-all duration-300 group-hover:scale-105">
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                      <Sparkles className="h-5 w-5 text-pink-600" />
                      Step 2: Lookbook Creator
                    </CardTitle>
                    <CardDescription>
                      AI-powered fashion lookbook creation and style discovery
                    </CardDescription>
                  </CardHeader>
                  <CardContent>
                    <p className="text-sm text-muted-foreground mb-4">
                      Transform your moodboard inspiration into curated lookbooks with AI-powered style matching and product discovery.
                    </p>
                    <div className="flex items-center gap-2 text-pink-600 font-medium text-sm">
                      Create lookbooks <ArrowRight className="h-4 w-4" />
                    </div>
                  </CardContent>
                </Card>
              </Link>
            </div>
            
            {/* Integration note */}
            <div className="text-center mt-6 p-4 bg-gradient-to-r from-purple-50 to-pink-50 rounded-lg">
              <p className="text-sm text-gray-600">
                <span className="font-medium">Seamless Integration:</span> Your moodboards automatically inform your lookbook creation process
              </p>
            </div>
          </div>
        </div>

        {/* Divider */}
        <hr className="my-16 border-gray-200" />

        {/* Project Management Section */}
        <div className="mb-8">
          <div className="text-center mb-8">
            <h2 className="text-2xl font-bold text-gray-900 mb-2">
              <span className="bg-gradient-to-r from-blue-600 to-indigo-600 bg-clip-text text-transparent">
                Project Management
              </span>
            </h2>
            <p className="text-muted-foreground">
              Access-controlled productivity and analytics dashboard
            </p>
          </div>
          
          <div className="max-w-lg mx-auto">
            <Link href="/dashboard" className="block group">
              <Card className="h-full hover:shadow-lg transition-all duration-300 border-blue-200 group-hover:border-blue-300">
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <BarChart3 className="h-5 w-5 text-blue-600" />
                    Project Dashboard
                    <Lock className="h-4 w-4 text-amber-500 ml-auto" />
                  </CardTitle>
                  <CardDescription>
                    Comprehensive project management and analytics
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <p className="text-sm text-muted-foreground mb-4">
                    Track projects, analyze performance metrics, and manage workflows across platforms.
                  </p>
                  <div className="bg-amber-50 border border-amber-200 rounded-lg p-3">
                    <p className="text-xs text-amber-700 font-medium flex items-center gap-1">
                      <Lock className="h-3 w-3" />
                      Access control required
                    </p>
                  </div>
                </CardContent>
              </Card>
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}