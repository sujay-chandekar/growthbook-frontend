"use client";

import { useEffect, useState, ReactNode } from "react";
import { useRouter } from "next/navigation";

import { loadFeatures } from "../../lib/growthbook";
import { evaluateAllFeatures } from "../../lib/featureEvaluator";

import ComponentA from "../components/ComponentA";
import ComponentB from "../components/ComponentB";
import ComponentC from "../components/ComponentC";
import ComponentD from "../components/ComponentD";
import ComponentE from "../components/ComponentE";

interface User {
  username: string;
  role: string;
}

interface FeatureFlags {
  featureA: boolean;
  featureB: boolean;
  featureC: boolean;
  featureD: boolean;
  featureE: boolean;
}

export default function Dashboard() {
  const router = useRouter();
  const [user, setUser] = useState<User | null>(null);
  const [flags, setFlags] = useState<FeatureFlags>({
    featureA: false,
    featureB: false,
    featureC: false,
    featureD: false,
    featureE: false
  });
  const [loading, setLoading] = useState<boolean>(true);

  useEffect(() => {
    const initializeGrowthBook = async (): Promise<void> => {
      try {
        const userStr = localStorage.getItem("user");
        
        if (!userStr) {
          router.push("/login");
          return;
        }

        const userData: User = JSON.parse(userStr);
        setUser(userData);
        console.log("User data:", userData);

        // Load features from backend proxy
        console.log("Loading GrowthBook features...");
        const featuresData = await loadFeatures();
        
        console.log("Features response:", featuresData);

        // Manually evaluate features based on user attributes
        const attributes = {
          username: userData.username,
          role: userData.role
        };

        console.log("Evaluating features with attributes:", attributes);

        const evaluatedFlags = evaluateAllFeatures(
          featuresData.features || {},
          attributes
        );

        console.log("Evaluated feature flags:", evaluatedFlags);

        setFlags({
          featureA: evaluatedFlags.featureA || false,
          featureB: evaluatedFlags.featureB || false,
          featureC: evaluatedFlags.featureC || false,
          featureD: evaluatedFlags.featureD || false,
          featureE: evaluatedFlags.featureE || false
        });

      } catch (err) {
        console.error("Error loading GrowthBook:", err);
        console.log("Loading with empty flags due to error");
        setFlags({
          featureA: false,
          featureB: false,
          featureC: false,
          featureD: false,
          featureE: false
        });
      } finally {
        setLoading(false);
      }
    };

    initializeGrowthBook();
  }, [router]);

  const handleLogout = (): void => {
    localStorage.removeItem("user");
    router.push("/login");
  };

  if (loading) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-gray-100">
        <div className="text-center">
          <h1 className="text-3xl font-bold mb-4">Loading...</h1>
          <p className="text-gray-600">Initializing GrowthBook features</p>
        </div>
      </div>
    );
  }

  const allFeaturesDisabled = Object.values(flags).every((v) => !v);

  return (
    <div className="min-h-screen bg-gray-100">
      {/* Header */}
      <header className="bg-white shadow">
        <div className="max-w-7xl mx-auto px-4 py-6 flex justify-between items-center">
          <div>
            <h1 className="text-3xl font-bold text-gray-900">Dashboard</h1>
            <p className="text-gray-600 mt-1">
              Welcome, <span className="font-semibold">{user?.username}</span> ({user?.role})
            </p>
          </div>
          <button
            onClick={handleLogout}
            className="px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors"
          >
            Logout
          </button>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-4 py-8">
        {/* GrowthBook Connection Warning */}
        {allFeaturesDisabled && (
          <div className="bg-yellow-100 border-l-4 border-yellow-500 text-yellow-700 p-4 mb-8 rounded">
            <p className="font-semibold">⚠️ GrowthBook Server Unavailable</p>
            <p className="text-sm mt-1">
              Unable to connect to GrowthBook server at localhost:3100. 
              All features are currently disabled. 
              <a 
                href="http://localhost:3100" 
                className="underline ml-1" 
                target="_blank" 
                rel="noopener noreferrer"
              >
                Check GrowthBook Server
              </a>
            </p>
          </div>
        )}

        {/* Features Status */}
        <div className="bg-white rounded-lg shadow p-6 mb-8">
          <h2 className="text-2xl font-bold mb-4 text-gray-900">Feature Flags Status</h2>
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-4">
            <FeatureCard name="Feature A" enabled={flags.featureA} />
            <FeatureCard name="Feature B" enabled={flags.featureB} />
            <FeatureCard name="Feature C" enabled={flags.featureC} />
            <FeatureCard name="Feature D" enabled={flags.featureD} />
            <FeatureCard name="Feature E" enabled={flags.featureE} />
          </div>
        </div>

        {/* Components */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {flags.featureA && <ComponentCard><ComponentA /></ComponentCard>}
          {flags.featureB && <ComponentCard><ComponentB /></ComponentCard>}
          {flags.featureC && <ComponentCard><ComponentC /></ComponentCard>}
          {flags.featureD && <ComponentCard><ComponentD /></ComponentCard>}
          {flags.featureE && <ComponentCard><ComponentE /></ComponentCard>}
        </div>

        {allFeaturesDisabled && (
          <div className="bg-blue-100 border border-blue-400 text-blue-800 px-4 py-3 rounded-lg text-center mt-8">
            <p>No features are enabled for your role, or GrowthBook is not available.</p>
          </div>
        )}
      </main>
    </div>
  );
}

interface FeatureCardProps {
  name: string;
  enabled: boolean;
}

function FeatureCard({ name, enabled }: FeatureCardProps): ReactNode {
  return (
    <div 
      className={`p-4 rounded-lg text-center font-semibold ${
        enabled 
          ? 'bg-green-100 text-green-800' 
          : 'bg-gray-100 text-gray-800'
      }`}
    >
      {name}
      <p className="text-sm mt-2">{enabled ? '✓ Enabled' : '✗ Disabled'}</p>
    </div>
  );
}

interface ComponentCardProps {
  children: ReactNode;
}

function ComponentCard({ children }: ComponentCardProps): ReactNode {
  return (
    <div className="bg-white rounded-lg shadow p-6 text-black">
      {children}
    </div>
  );
}
