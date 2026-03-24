import { useEffect, useState } from "react";
import { Link } from "wouter";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
  Legend,
} from "recharts";
import { supabase, SurveyResponse } from "@/lib/supabaseClient";
import Footer from "@/components/Footer";

const ACCENT = "#8A3BDB";
const CHART_COLORS = ["#8A3BDB", "#6366F1", "#2563EB", "#0891B2", "#059669", "#D97706"];

function countOccurrences(items: string[]): Record<string, number> {
  return items.reduce<Record<string, number>>((acc, item) => {
    acc[item] = (acc[item] || 0) + 1;
    return acc;
  }, {});
}

export default function Results() {
  const [responses, setResponses] = useState<SurveyResponse[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    async function fetchData() {
      setLoading(true);
      setError(null);
      const { data, error: fetchError } = await supabase
        .from("mental_health_survey_results")
        .select("*");
      if (fetchError) {
        setError("Could not load results. Please try again later.");
      } else {
        setResponses(data as SurveyResponse[]);
      }
      setLoading(false);
    }
    fetchData();
  }, []);

  if (loading) {
    return (
      <div className="min-h-screen flex flex-col bg-white">
        <main className="flex-1 flex items-center justify-center">
          <p className="text-gray-500">Loading results...</p>
        </main>
        <Footer />
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen flex flex-col bg-white">
        <main className="flex-1 flex items-center justify-center px-4">
          <div role="alert" className="text-center">
            <p className="text-red-600 font-medium mb-4">{error}</p>
            <button
              onClick={() => window.location.reload()}
              className="px-6 py-2 bg-[#8A3BDB] text-white rounded-lg hover:bg-[#7a2ec9] focus:outline-none focus:ring-2 focus:ring-[#8A3BDB] focus:ring-offset-2"
            >
              Retry
            </button>
          </div>
        </main>
        <Footer />
      </div>
    );
  }

  const total = responses.length;

  const stressFreqOrder = ["never", "rarely", "sometimes", "often", "always"];
  const stressFreqCounts = countOccurrences(responses.map((r) => r.stress_frequency));
  const stressFreqData = stressFreqOrder.map((label) => ({
    label: label.charAt(0).toUpperCase() + label.slice(1),
    count: stressFreqCounts[label] || 0,
  }));

  const ratingLabels: Record<string, string> = {
    "1": "1 - Very poor",
    "2": "2 - Poor",
    "3": "3 - Average",
    "4": "4 - Good",
    "5": "5 - Excellent",
  };
  const ratingCounts = countOccurrences(responses.map((r) => String(r.mental_health_rating)));
  const ratingData = ["1", "2", "3", "4", "5"].map((r) => ({
    label: ratingLabels[r],
    count: ratingCounts[r] || 0,
  }));

  const allStressSources = responses.flatMap((r) =>
    r.stress_sources.map((s) =>
      s === "Other" && r.stress_sources_other ? `Other: ${r.stress_sources_other}` : s
    )
  );
  const stressSourceCounts = countOccurrences(allStressSources);
  const stressSourceData = Object.entries(stressSourceCounts)
    .sort((a, b) => b[1] - a[1])
    .map(([label, count]) => ({ label, count }));

  const allCopingMethods = responses.flatMap((r) =>
    r.coping_methods.map((m) =>
      m === "Other" && r.coping_other ? `Other: ${r.coping_other}` : m
    )
  );
  const copingCounts = countOccurrences(allCopingMethods);
  const copingData = Object.entries(copingCounts)
    .sort((a, b) => b[1] - a[1])
    .map(([label, count]) => ({ label, count }));

  const schoolSupportCounts = countOccurrences(responses.map((r) => r.school_support));
  const schoolSupportData = ["Yes", "No", "Not sure"].map((label) => ({
    name: label,
    value: schoolSupportCounts[label] || 0,
  }));

  return (
    <div className="min-h-screen flex flex-col bg-white">
      <header className="border-b border-gray-200 px-4 py-4 flex items-center justify-between">
        <h1 className="text-lg font-semibold text-gray-900">Survey Results</h1>
        <Link
          href="/"
          className="text-sm font-medium text-[#6b21b8] underline hover:text-[#8A3BDB] focus:outline-none focus:ring-2 focus:ring-[#8A3BDB] focus:ring-offset-2 rounded"
        >
          Home
        </Link>
      </header>

      <main className="flex-1 px-4 py-8">
        <div className="max-w-3xl mx-auto space-y-12">

          {/* Total responses */}
          <section aria-labelledby="total-heading">
            <h2 id="total-heading" className="text-xl font-semibold text-gray-900 mb-4">
              Overview
            </h2>
            <div className="text-center bg-purple-50 border border-purple-200 rounded-xl py-8">
              <p className="text-7xl font-bold" style={{ color: ACCENT }}>{total}</p>
              <p className="text-gray-600 mt-2 text-lg">Total Responses</p>
            </div>
          </section>

          {total === 0 && (
            <p className="text-center text-gray-500">
              No survey responses yet. Be the first!{" "}
              <Link href="/survey" className="text-[#6b21b8] underline hover:text-[#8A3BDB]">
                Take the survey
              </Link>
            </p>
          )}

          {total > 0 && (
            <>
              {/* Stress frequency */}
              <section aria-labelledby="stress-freq-heading">
                <h2 id="stress-freq-heading" className="text-xl font-semibold text-gray-900 mb-2">
                  Stress Frequency
                </h2>
                <p className="text-sm text-gray-500 mb-4">How often respondents feel stressed during a typical week.</p>
                <ResponsiveContainer width="100%" height={260}>
                  <BarChart data={stressFreqData} margin={{ top: 5, right: 20, left: 0, bottom: 5 }}>
                    <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#e5e7eb" />
                    <XAxis dataKey="label" tick={{ fill: "#374151", fontSize: 13 }} />
                    <YAxis allowDecimals={false} tick={{ fill: "#6b7280", fontSize: 12 }} width={32} />
                    <Tooltip
                      contentStyle={{ borderRadius: 8, border: "1px solid #e5e7eb" }}
                      formatter={(v: number) => [v, "Responses"]}
                    />
                    <Bar dataKey="count" fill={ACCENT} radius={[4, 4, 0, 0]} name="Responses" />
                  </BarChart>
                </ResponsiveContainer>
              </section>

              {/* Mental health ratings */}
              <section aria-labelledby="rating-heading">
                <h2 id="rating-heading" className="text-xl font-semibold text-gray-900 mb-2">
                  Mental Health Ratings
                </h2>
                <p className="text-sm text-gray-500 mb-4">Self-reported mental health on a 1–5 scale.</p>
                <ResponsiveContainer width="100%" height={260}>
                  <BarChart data={ratingData} margin={{ top: 5, right: 20, left: 0, bottom: 5 }}>
                    <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#e5e7eb" />
                    <XAxis dataKey="label" tick={{ fill: "#374151", fontSize: 12 }} />
                    <YAxis allowDecimals={false} tick={{ fill: "#6b7280", fontSize: 12 }} width={32} />
                    <Tooltip
                      contentStyle={{ borderRadius: 8, border: "1px solid #e5e7eb" }}
                      formatter={(v: number) => [v, "Responses"]}
                    />
                    <Bar dataKey="count" fill={ACCENT} radius={[4, 4, 0, 0]} name="Responses" />
                  </BarChart>
                </ResponsiveContainer>
              </section>

              {/* Stress sources */}
              <section aria-labelledby="stress-sources-heading">
                <h2 id="stress-sources-heading" className="text-xl font-semibold text-gray-900 mb-2">
                  Top Stress Sources
                </h2>
                <p className="text-sm text-gray-500 mb-4">Aggregated from all responses — multiple selections allowed.</p>
                <ResponsiveContainer width="100%" height={Math.max(260, stressSourceData.length * 42)}>
                  <BarChart
                    layout="vertical"
                    data={stressSourceData}
                    margin={{ top: 5, right: 30, left: 10, bottom: 5 }}
                  >
                    <CartesianGrid strokeDasharray="3 3" horizontal={false} stroke="#e5e7eb" />
                    <XAxis type="number" allowDecimals={false} tick={{ fill: "#6b7280", fontSize: 12 }} />
                    <YAxis type="category" dataKey="label" width={160} tick={{ fill: "#374151", fontSize: 12 }} />
                    <Tooltip
                      contentStyle={{ borderRadius: 8, border: "1px solid #e5e7eb" }}
                      formatter={(v: number) => [v, "Respondents"]}
                    />
                    <Bar dataKey="count" fill={ACCENT} radius={[0, 4, 4, 0]} name="Respondents" />
                  </BarChart>
                </ResponsiveContainer>
              </section>

              {/* Coping methods */}
              <section aria-labelledby="coping-heading">
                <h2 id="coping-heading" className="text-xl font-semibold text-gray-900 mb-2">
                  Coping Methods
                </h2>
                <p className="text-sm text-gray-500 mb-4">Aggregated from all responses — multiple selections allowed.</p>
                <ResponsiveContainer width="100%" height={Math.max(260, copingData.length * 42)}>
                  <BarChart
                    layout="vertical"
                    data={copingData}
                    margin={{ top: 5, right: 30, left: 10, bottom: 5 }}
                  >
                    <CartesianGrid strokeDasharray="3 3" horizontal={false} stroke="#e5e7eb" />
                    <XAxis type="number" allowDecimals={false} tick={{ fill: "#6b7280", fontSize: 12 }} />
                    <YAxis type="category" dataKey="label" width={160} tick={{ fill: "#374151", fontSize: 12 }} />
                    <Tooltip
                      contentStyle={{ borderRadius: 8, border: "1px solid #e5e7eb" }}
                      formatter={(v: number) => [v, "Respondents"]}
                    />
                    <Bar dataKey="count" fill={ACCENT} radius={[0, 4, 4, 0]} name="Respondents" />
                  </BarChart>
                </ResponsiveContainer>
              </section>

              {/* School support */}
              <section aria-labelledby="support-heading">
                <h2 id="support-heading" className="text-xl font-semibold text-gray-900 mb-2">
                  Perception of School Mental Health Support
                </h2>
                <p className="text-sm text-gray-500 mb-4">
                  Do respondents feel their college provides enough mental health resources?
                </p>
                <ResponsiveContainer width="100%" height={300}>
                  <PieChart>
                    <Pie
                      data={schoolSupportData}
                      cx="50%"
                      cy="50%"
                      outerRadius={110}
                      dataKey="value"
                      label={({ name, percent }) =>
                        percent > 0 ? `${name}: ${(percent * 100).toFixed(0)}%` : ""
                      }
                    >
                      {schoolSupportData.map((_, index) => (
                        <Cell key={index} fill={CHART_COLORS[index % CHART_COLORS.length]} />
                      ))}
                    </Pie>
                    <Tooltip
                      contentStyle={{ borderRadius: 8, border: "1px solid #e5e7eb" }}
                      formatter={(v: number) => [v, "Respondents"]}
                    />
                    <Legend />
                  </PieChart>
                </ResponsiveContainer>
              </section>
            </>
          )}

          <div className="pt-4">
            <Link
              href="/"
              className="inline-block px-6 py-3 border-2 border-[#8A3BDB] text-[#6b21b8] font-semibold rounded-lg hover:bg-purple-50 focus:outline-none focus:ring-2 focus:ring-[#8A3BDB] focus:ring-offset-2 transition-colors"
            >
              ← Home
            </Link>
          </div>
        </div>
      </main>
      <Footer />
    </div>
  );
}
